// Example: Redact data before sending externally
// This is a usage pattern, not an official SDK
import { createSafeOpenAI } from "./safe-openai.js";

const openai = createSafeOpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [{ role: "user", content: "Email me at john@email.com" }]
});

console.log(response);
