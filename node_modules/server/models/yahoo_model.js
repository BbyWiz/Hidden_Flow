const YahooFinance = require("yahoo-finance2").default;
const yf = new YahooFinance();

// quoteSummary: request specific modules (e.g., "price")
async function quoteSummary(symbol, modules = ["price"]) {
  if (!symbol) throw new Error("symbol is required");
  return yf.quoteSummary(String(symbol).trim().toUpperCase(), { modules });
}

// quote: quick price / PE fields
async function quote(symbol) {
  if (!symbol) throw new Error("symbol is required");
  return yf.quote(String(symbol).trim().toUpperCase(), {
    fields: ["symbol", "regularMarketPrice", "currency", "trailingPE", "forwardPE"],
  });
}

// historical: daily OHLC
async function historical(symbol, { period1, period2, interval = "1d" } = {}) {
  if (!symbol) throw new Error("symbol is required");
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return yf.historical(String(symbol).trim().toUpperCase(), {
    period1: period1 || oneYearAgo.toISOString().slice(0, 10),
    period2: period2 || now.toISOString().slice(0, 10),
    //these are '1d' | '1wk' | '1mo'
    interval, 
    events: "history",
  });
}

// search: company/symbol search
async function search(query) {
  if (!query) throw new Error("query is required");
  return yf.search(String(query).trim());
}

module.exports = { quoteSummary, quote, historical, search };
