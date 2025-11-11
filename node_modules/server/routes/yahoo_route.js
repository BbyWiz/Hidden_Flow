const express = require("express");
const router = express.Router();
const yahoo = require("../models/yahoo_model");
const { computePE } = require("../app/pe");
const { computeSMA } = require("../app/sma");
const { computeRSI } = require("../app/rsi");

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

module.exports = router;
