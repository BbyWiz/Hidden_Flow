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

## Optional / Advanced Endpoints

| Function           | Description                                                                   | Example                                                              |
| ------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **insights**       | Returns key insights such as ESG scores, sentiment, and technical indicators. | `await yahooFinance.insights('AAPL');`                               |
| **options**        | Fetches option chain data (calls, puts, strikes, expirations).                | `await yahooFinance.options('TSLA');`                                |
| **chart**          | Provides raw chart data with historical pricing and indicators.               | `await yahooFinance.chart('NVDA', { interval: '1d', range: '1y' });` |
| **quoteCombine**   | Combines `quote` and `quoteSummary` data for a single request.                | `await yahooFinance.quoteCombine('NFLX');`                           |
| **marketSummary**  | Returns a snapshot of market indexes (Dow, Nasdaq, etc.).                     | `await yahooFinance.marketSummary();`                                |
| **marketTrending** | Returns trending tickers globally.                                            | `await yahooFinance.marketTrending();`                               |

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

## Example Use Cases

### Fetch Latest Quote

```js
const quote = await yahooFinance.quote('AAPL');
console.log(quote.regularMarketPrice);
```

### Historical Prices for a Time Range

```js
const data = await yahooFinance.historical('MSFT', {
  period1: '2024-01-01',
  period2: '2025-01-01',
  interval: '1d'
});
console.log(data.slice(-5));
```

### Company Fundamentals

```js
const fundamentals = await yahooFinance.quoteSummary('GOOG', {
  modules: ['financialData', 'summaryDetail', 'price']
});
console.log(fundamentals);
```

### Search by Company Name

```js
const results = await yahooFinance.search('Nvidia');
console.log(results.quotes);
```

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
