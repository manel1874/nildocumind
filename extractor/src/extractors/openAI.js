import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

export const openAIExtractor = async ({ markdown, zodSchema, prompt, model }) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  const base_url = `${process.env.OPENAI_BASE_URL}/v1`;
  const openai = new OpenAI({ baseURL: base_url, apiKey: process.env.OPENAI_API_KEY });
  const openAiModel = model;

  const completion = await openai.beta.chat.completions.parse({
    model: openAiModel,
    messages: [
      { role: "system", content: [{ "type": "text", "text": prompt }] },
      { role: "user", content: [{ "type": "text", "text": markdown }] },
    ],
    response_format: zodResponseFormat(zodSchema, "event"),
  });

  const event = completion.choices[0].message.parsed;
  return event;
}
