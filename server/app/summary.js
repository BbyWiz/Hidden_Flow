const OpenAI = require("openai");

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
let client = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[openai] OPENAI_API_KEY not set, skipping summary");
    return null;
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

/**
 * Summarize a single screen payload (the JSON you return from /yahoo/screen).
 * Returns a short human readable summary string, or null if summarization
 * is disabled or fails.
 */

async function summarizeScreenPayload(payload) {
  const client = getClient();
  if (!client) {
    console.warn("[openai] OPENAI_API_KEY not set, skipping summary");
    return null;
  }

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "You are explaining a stock screening result to a human trader. " +
                "Write 2 to 4 short sentences that summarize whether the stock " +
                "looks strong, weak, or mixed based on the indicators and rule flags. " +
                "You can give financial advice on possible support or resistance levels on a daily chart. " +
                "These support and resistance levels should be off price action, for example, a battle between" +
                " a large green candlestick and a large red candlestick before the reversal..NOT SMA-related S/R levels." +
                "Below, create a separate paragraph below explaining that then 'Note: ' followed by your S/R explanation." +
                "Here is the JSON payload you should summarize:\n\n" +
                JSON.stringify(payload),
            },
          ],
        },
      ],
    });

    if (response.output_text && typeof response.output_text === "string") {
      return response.output_text.trim();
    }

    const first =
      response.output &&
      response.output[0] &&
      response.output[0].content &&
      response.output[0].content[0] &&
      response.output[0].content[0].text;

    return typeof first === "string" ? first.trim() : null;
  } catch (err) {
    console.error("[openai] summarization failed:", err);
    return null;
  }
}

module.exports = { summarizeScreenPayload };
