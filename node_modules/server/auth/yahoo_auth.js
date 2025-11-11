const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();

function rand() {
  return crypto.randomBytes(16).toString("hex");
}

// Step 1: redirect to Yahoo consent
router.get("/signin", (req, res) => {
  const { YAHOO_CLIENT_ID, YAHOO_REDIRECT_URI } = process.env;
  if (!YAHOO_CLIENT_ID || !YAHOO_REDIRECT_URI) {
    return res.status(500).json({ error: "Missing YAHOO_CLIENT_ID or YAHOO_REDIRECT_URI" });
  }
  const state = rand();
  const nonce = rand();
  // store for basic CSRF protection
  req.session && (req.session.y_state = state, req.session.y_nonce = nonce);

  const params = new URLSearchParams({
    client_id: YAHOO_CLIENT_ID,
    response_type: "code",
    redirect_uri: YAHOO_REDIRECT_URI,
    scope: "openid profile email",
    state,
    nonce,
    language: "en-US",
  });


  res.redirect(`https://api.login.yahoo.com/oauth2/request_auth?${params.toString()}`);
});

// Step 2: Yahoo redirects back with ?code=...
router.get("/dashboard", async (req, res) => {
  const { code, state, error } = req.query;
  if (error) return res.status(400).json({ error });
  if (!code) return res.status(400).json({ error: "Missing code. Start at /signin." });

  // Optional state check if session is enabled:
  if (req.session && req.session.y_state && state !== req.session.y_state) {
    return res.status(400).json({ error: "State mismatch" });
  }

  const { YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET, YAHOO_REDIRECT_URI } = process.env;

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: YAHOO_REDIRECT_URI,
      code: String(code),
    });

    const tokenResp = await axios.post(
      "https://api.login.yahoo.com/oauth2/get_token",
      body.toString(),
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        auth: { username: YAHOO_CLIENT_ID, password: YAHOO_CLIENT_SECRET },
      }
    );

    const tokens = tokenResp.data;

    const me = await axios.get("https://api.login.yahoo.com/openid/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    res.json({ message: "Yahoo OAuth success", tokens, profile: me.data });
  } catch (e) {
    res.status(e.response?.status || 500).json({
      error: "token_exchange_failed",
      detail: e.response?.data || e.message,
    });
  }
});

router.get("/me", async (req, res) => {
  const t = req.session.yahoo;
  if (!t?.access_token) return res.status(401).json({ error: "not signed in" });

  try {
    const me = await axios.get("https://api.login.yahoo.com/openid/v1/userinfo", {
      headers: { Authorization: `Bearer ${t.access_token}` },
    });
    res.json(me.data);
  } catch (e) {
    res.status(502).json({ error: "userinfo_failed", detail: e.response?.data || e.message });
  }
});

async function ensureYahooAccessToken(req) {
   // refresh 1 min before expiry
  const keepAheadMs = 60 * 1000;
  const t = req.session.yahoo;
  if (!t?.access_token) return null;

  const ageMs = Date.now() - (t.obtained_at || 0);
  const ttlMs = (t.expires_in || 0) * 1000;
  if (ttlMs && ageMs < ttlMs - keepAheadMs) return t.access_token;

  // refresh
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: t.refresh_token,
    redirect_uri: process.env.YAHOO_REDIRECT_URI,
  });
  const r = await axios.post(
    "https://api.login.yahoo.com/oauth2/get_token",
    body.toString(),
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      auth: { username: process.env.YAHOO_CLIENT_ID, password: process.env.YAHOO_CLIENT_SECRET },
    }
  );
  req.session.yahoo = {
    ...t,
    ...r.data,
    obtained_at: Date.now(),
  };
  return req.session.yahoo.access_token;
}
router.get("/yahoo/emailscope-check", async (req, res) => {
  const token = await ensureYahooAccessToken(req);
  if (!token) return res.status(401).json({ error: "not signed in" });
  // call userinfo or other endpoints here with the fresh token
  res.json({ ok: true });
});

module.exports = router;
