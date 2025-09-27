import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateInsights = async (req, res) => {
  const { headers, rows } = req.body;

  if (!headers || !rows) {
    return res.status(400).json({ error: "Headers and rows required" });
  }

  const sampleData = rows.slice(0, 10);

  const prompt = `
    You are a data analyst. Analyze the following tabular data with columns: ${headers.join(
      ", "
    )}.
    Here are some sample rows:
    ${JSON.stringify(sampleData)}

    Provide a brief summary highlighting key trends, anomalies, or insights.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Your prompt here" },
      ],
    });

    const insight = completion.choices[0].message.content;
    res.json({ insight });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
};
