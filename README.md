````markdown

# Yahoo Finance API Reference (via `yahoo-finance2` npm module)
(https://www.npmjs.com/package/yahoo-finance2)

This document summarizes the commonly used endpoints and parameters available through the **Yahoo Finance** unofficial API wrapper **`yahoo-finance2`**, which provides reliable market, fundamental, and historical data without the need for an API key.
````
Import and initialize:
```js
import yahooFinance from 'yahoo-finance2';
```
## Core Endpoints

| Function                    | Description                                                                      | Example                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **quote**                   | Fetches real-time quote data for one or more tickers (price, volume, P/E, etc.). | `await yahooFinance.quote('AAPL');`                                                         |
| **historical**              | Returns daily, weekly, or monthly historical prices and volumes for a symbol.    | `await yahooFinance.historical('MSFT', { period1: '2024-01-01', period2: '2025-01-01' });`  |
| **search**                  | Searches for tickers by company name or keyword.                                 | `await yahooFinance.search('Tesla');`                                                       |
| **quoteSummary**            | Provides detailed fundamentals and financial statements.                         | `await yahooFinance.quoteSummary('GOOG', { modules: ['financialData', 'summaryDetail'] });` |
| **trendingSymbols**         | Returns the most popular or trending tickers by region.                          | `await yahooFinance.trendingSymbols('US');`                                                 |
| **recommendationsBySymbol** | Retrieves analyst recommendations for a given ticker.                            | `await yahooFinance.recommendationsBySymbol('AMZN');`                                       |

---


## Parameters for Common Calls

| Parameter             | Required | Description                                                                                                    |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| **symbol**            | Yes      | The stock ticker symbol, e.g. `AAPL`, `MSFT`, `TSLA`.                                                          |
| **period1 / period2** | No       | Start and end dates for historical data (ISO date or timestamp).                                               |
| **interval**          | No       | Timeframe for price aggregation (`1d`, `1wk`, `1mo`, `1h`). Default: `1d`.                                     |
| **modules**           | No       | In `quoteSummary`, specify which data modules to retrieve (e.g. `financialData`, `summaryDetail`, `earnings`). |
| **region**            | No       | Region for market/trending queries (e.g. `US`, `GB`, `IN`).                                                    |

---

---

### Example Output

```json
{
  "symbol": "AAPL",
  "regularMarketPrice": 228.34,
  "regularMarketDayHigh": 230.00,
  "regularMarketDayLow": 226.45,
  "trailingPE": 29.8,
  "marketCap": 3.52e12
}
```

---

### Reference

* **Official npm page:** [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)
* **GitHub repository:** [github.com/gadicc/node-yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2)

```
```

***SPLIT OFF INTO FRONTEND***
