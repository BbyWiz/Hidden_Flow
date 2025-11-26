const express = require("express");
const router = express.Router();
const yahoo = require("../models/yahoo_model");
const { computePE } = require("../app/pe");
const { computeSMA } = require("../app/sma");
const { computeRSI } = require("../app/rsi");
const { summarizeScreenPayload } = require("../app/summary");

// GET /api/yahoo/quote-summary?symbol=TSLA&modules=price,defaultKeyStatistics
router.get("/yahoo/quote-summary", async (req, res) => {
  try {
    const symbol = String(req.query.symbol || "")
      .trim()
      .toUpperCase();
    if (!symbol) return res.status(400).json({ error: "symbol is required" });
    const modules = String(req.query.modules || "price")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    const data = await yahoo.quoteSummary(symbol, modules);
    res.json(data);
  } catch (e) {
    res.status(502).json({
      error: "Upstream request failed",
      detail: String(e.message || e),
    });
  }
});

// GET /api/yahoo/quote?symbol=AAPL
router.get("/yahoo/quote", async (req, res) => {
  try {
    const symbol = String(req.query.symbol || "")
      .trim()
      .toUpperCase();
    if (!symbol) return res.status(400).json({ error: "symbol is required" });
    const q = await yahoo.quote(symbol);
    res.json(q);
  } catch (e) {
    res.status(502).json({
      error: "Upstream request failed",
      detail: String(e.message || e),
    });
  }
});

// GET /api/yahoo/history?symbol=AAPL&period1=2024-01-01&period2=2025-01-01&interval=1d
router.get("/yahoo/history", async (req, res) => {
  try {
    const symbol = String(req.query.symbol || "")
      .trim()
      .toUpperCase();
    if (!symbol) return res.status(400).json({ error: "symbol is required" });
    const { period1, period2, interval } = req.query;
    const rows = await yahoo.historical(symbol, { period1, period2, interval });
    res.json({ symbol, count: rows.length, rows });
  } catch (e) {
    res.status(502).json({
      error: "Upstream request failed",
      detail: String(e.message || e),
    });
  }
});

// GET /api/yahoo/search?query=Apple
router.get("/yahoo/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) return res.status(400).json({ error: "query is required" });
    const results = await yahoo.search(query);
    res.json(results);
  } catch (e) {
    res.status(502).json({
      error: "Upstream request failed",
      detail: String(e.message || e),
    });
  }
});

router.post("/yahoo/screen", async (req, res) => {
  try {
    const body = req.body || {};

    const symbol = String(body.symbol || "")
      .trim()
      .toUpperCase();
    if (!symbol) {
      return res.status(400).json({ error: "symbol is required" });
    }

    const smaWindow =
      typeof body.smaWindow === "number" && body.smaWindow > 0
        ? body.smaWindow
        : 7;

    const rsiPeriod =
      typeof body.rsiPeriod === "number" && body.rsiPeriod > 0
        ? body.rsiPeriod
        : 7;

    const historyOpts = body.history || {};
    const { period1, period2, interval } = historyOpts;

    // Fetch history and quote in parallel
    const [rows, quote] = await Promise.all([
      yahoo.historical(symbol, { period1, period2, interval }),
      yahoo.quote(symbol),
    ]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(502).json({
        error: "No historical data returned from Yahoo",
      });
    }

    const latestBar = rows[rows.length - 1];

    // Indicator calculations
    const smaValue = computeSMA(rows, smaWindow);
    const rsiValue = computeRSI(rows, rsiPeriod);
    const peValue = computePE(quote);

    const latestClose =
      typeof latestBar?.close === "number" ? latestBar.close : null;

    const aboveSMA =
      latestClose != null && typeof smaValue === "number"
        ? latestClose > smaValue
        : null;

    const belowSMA =
      latestClose != null && typeof smaValue === "number"
        ? latestClose < smaValue
        : null;

    const oversold = typeof rsiValue === "number" ? rsiValue < 30 : null;
    const overbought = typeof rsiValue === "number" ? rsiValue > 70 : null;

    const cheapPE = typeof peValue === "number" ? peValue < 20 : null;
    const expensivePE = typeof peValue === "number" ? peValue > 40 : null;

    const payload = {
      symbol,

      history: {
        count: rows.length,
        firstDate: rows[0]?.date,
        lastDate: latestBar?.date,
      },

      latestBar: {
        date: latestBar?.date,
        open: latestBar?.open,
        high: latestBar?.high,
        low: latestBar?.low,
        close: latestBar?.close,
        volume: latestBar?.volume,
      },

      quote: {
        regularMarketPrice: quote?.regularMarketPrice,
        currency: quote?.currency,
        trailingPE: quote?.trailingPE ?? null,
        forwardPE: quote?.forwardPE ?? null,
      },

      indicators: {
        smaWindow,
        sma: smaValue,
        rsiPeriod,
        rsi: rsiValue,
        pe: peValue,
      },

      rules: {
        aboveSMA,
        belowSMA,
        oversold,
        overbought,
        cheapPE,
        expensivePE,
      },
    };

    const summary = await summarizeScreenPayload(payload);

    return res.json({
      ...payload,
      summary,
    });
  } catch (e) {
    console.error("screen endpoint error", e);
    return res.status(502).json({
      error: "Upstream request failed",
      detail: String(e.message || e),
    });
  }
});

module.exports = router;
