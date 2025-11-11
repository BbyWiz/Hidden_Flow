[text](https://www.alphavantage.co/documentation/)

# Alpha Vantage API Reference (Free Endpoints Overview)

This document summarizes the parameters and free functions relevant to this project’s integration with the **Alpha Vantage** API.

---

## API Parameters

| Parameter      | Required | Description                                                                                                                                    |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **function**   | Yes      | The time series or data type you want to retrieve. Example: `function=TIME_SERIES_DAILY`.                                                      |
| **symbol**     | Yes      | The equity or asset symbol (ticker). Example: `symbol=IBM`.                                                                                    |
| **outputsize** | No       | Determines how much data is returned. <br>• `compact` → latest 100 data points (default). <br>• `full` → complete historical data (20+ years). |
| **datatype**   | No       | Response format. <br>• `json` → structured JSON data (default). <br>• `csv` → plain CSV format.                                                |
| **apikey**     | Yes      | Your Alpha Vantage API key. Register for a free key at [alphavantage.co](https://www.alphavantage.co).                                         |

---

## Free Functions

These endpoints are available in the **free tier** of Alpha Vantage and can be used without a premium subscription.

### Core (Required for This Project)

- `TIME_SERIES_DAILY`
- `OVERVIEW`

These two endpoints provide price and basic fundamental data—enough to implement screening logic such as:

- Price > EMA(50)
- RSI < 70
- P/E < 25

---

### Optional Helpers

- `LISTING_STATUS` — verify active/valid tickers
- `GLOBAL_QUOTE` — fetch the latest trading data for a single symbol
- `SYMBOL_SEARCH` — search by company name or partial ticker

---

### Extra Fundamentals (for expansion)

- `INCOME_STATEMENT`
- `BALANCE_SHEET`
- `CASH_FLOW`
- `EARNINGS`

These endpoints expose deeper financials if you decide to extend your screener to multi-factor or valuation models.

---

### Other Free Data to Explore

- `CURRENCY_EXCHANGE_RATE`
- `FX_DAILY`
- `CRYPTO_DAILY`
- `ECONOMIC_INDICATOR` (GDP, CPI, unemployment rate, etc.)
- `COMMODITY` (WTI, Brent, gold, copper, wheat, etc.)

These broaden your data scope into macroeconomic, forex, crypto, and commodity domains.

---

## Notes

- `TIME_SERIES_DAILY_ADJUSTED` and other “adjusted” or intraday series are **premium-only**.
- Free keys are rate-limited (roughly 25 requests per day).
- To stay within limits, consider caching data or using `outputsize=compact` for efficiency.

---

### Example Request

```bash
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=compact&datatype=json&apikey=YOUR_API_KEY
```
