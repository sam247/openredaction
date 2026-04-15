// Example: Redact data before sending externally
// This is a usage pattern, not an official SDK
import OpenAI from "openai";
import { OpenRedaction } from "openredaction";
const redactor = new OpenRedaction();

async function redactText(input) {
  return (await redactor.detect(input)).redacted;
}

export function createSafeOpenAI(config) {
  const client = new OpenAI(config);
  return {
    chat: {
      completions: {
        create: async (options) =>
          client.chat.completions.create({
            ...options,
            messages: await Promise.all(
              options.messages.map(async (m) => ({
                ...m,
                content: typeof m.content === "string" ? await redactText(m.content) : m.content
              }))
            )
          })
      }
    }
  };
}
