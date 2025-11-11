// server/app/pe.js
/**
 * Compute P/E from Yahoo quote data.
 * Accepts either:
 *  - a quote object with regularMarketPrice and epsTrailingTwelveMonths
 *  - explicit numbers { price, eps }
 * Returns null if inputs are missing or invalid.
 */
function computePE(input) {
  if (!input || typeof input !== "object") return null;

  let price =
    input.price ?? input.regularMarketPrice ?? input.regularMarketPreviousClose;
  let eps = input.eps ?? input.epsTrailingTwelveMonths;

  if (typeof price !== "number" || typeof eps !== "number" || eps === 0)
    return null;
  return Number((price / eps).toFixed(4));
}

module.exports = { computePE };
