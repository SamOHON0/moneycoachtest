// api/chat.js — Vercel serverless function (Node)
//
// Powers Tilly's chat with Claude Haiku. The API key lives ONLY here,
// server-side, read from the ANTHROPIC_API_KEY environment variable.
// It is never shipped to the browser.
//
// GOLDEN RULE: the deterministic engine (in the browser) computes every
// number and sends it in `facts`. The model only phrases those numbers,
// so it can never invent or miscalculate a figure.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY automatically

const MODEL = "claude-haiku-4-5-20251001";

const VOICE = `You are Tilly, an Irish money coach inside a chat app.
Voice: warm, casual, a little cheeky, never preachy, never shaming. Talk like a money-smart friend.
Keep replies short, 1 to 3 sentences. Plain text only: no markdown, no bullet lists, no headings. All money is in euro.
HARD RULE: only state numbers that appear in the FACTS block below. Never calculate, estimate, or invent a figure. If a number you need is not in FACTS, say you will check it rather than guessing.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { messages = [], facts = "" } = req.body || {};

    // Basic guards
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages required" });
      return;
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,                       // caps cost per reply
      system: `${VOICE}\n\nFACTS:\n${facts}`,
      messages: messages.slice(-8),          // short context window, cheap
    });

    const text = (response.content.find((c) => c.type === "text")?.text || "").trim();
    res.status(200).json({ text });
  } catch (err) {
    // Never leak internals to the client
    console.error("tilly /api/chat error:", err?.status, err?.message);
    res.status(500).json({ error: "ai_unavailable" });
  }
}
