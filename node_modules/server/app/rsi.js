// server/app/rsi.js
/**
 * Relative Strength Index using simple averages (Wilder variant can be added later).
 * Accepts: array of bars with { close } or an array of close numbers.
 * period default 7
 */
function computeRSI(priceData, rsiPeriod = 7) {
    const maybeCloses = Array.isArray(priceData)
        ? priceData.map(item => (typeof item === "number" ? item : item && item.close))
        : [];

    const closePrices = maybeCloses.filter(value => typeof value === "number");
    if (closePrices.length < rsiPeriod + 1) return null;

    let totalGains = 0;
    let totalLosses = 0;

    // Sum gains and losses over the last rsiPeriod changes
    for (let i = closePrices.length - rsiPeriod; i < closePrices.length; i++) {
        const priceChange = closePrices[i] - closePrices[i - 1];
        if (priceChange > 0) totalGains += priceChange;
        else totalLosses += -priceChange;
    }

    const averageGain = totalGains / rsiPeriod;
    const averageLoss = totalLosses / rsiPeriod;

    if (averageLoss === 0) return 100;

    const relativeStrength = averageGain / averageLoss;
    const rsiValue = 100 - 100 / (1 + relativeStrength);
    return Number(rsiValue.toFixed(2));
}

module.exports = { computeRSI };
