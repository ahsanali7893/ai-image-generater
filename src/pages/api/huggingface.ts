import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { model, inputs } = req.body;

  if (!model || !inputs) {
    return res.status(400).json({ error: "Missing model or inputs" });
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/openai-community/gpt2`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to fetch from Hugging Face API",
      details: error.message,
    });
  }
}
