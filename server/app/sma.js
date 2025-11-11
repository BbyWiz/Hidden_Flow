// server/app/sma.js
/**
 * Simple Moving Average over N closes.
 * input: array of bars with { close } or an array of numbers
 * period default 7
 */
function computeSMA(inputSeries, windowSize = 7) {
    const closingPrices = Array.isArray(inputSeries)
        ? inputSeries
                .map((item) => (typeof item === "number" ? item : item && item.close))
                .filter((value) => typeof value === "number")
        : [];

    if (closingPrices.length < windowSize) return null;

    const periodSum = closingPrices
        .slice(-windowSize)
        .reduce((accumulator, price) => accumulator + price, 0);

    return Number((periodSum / windowSize).toFixed(4));
}

module.exports = { computeSMA };
