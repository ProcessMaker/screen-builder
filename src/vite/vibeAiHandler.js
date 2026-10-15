import {
  buildSystemPrompt,
  parseAgentResponse,
  normalizeAgentResult,
} from "../vibe/services/vibeAiPrompt.js";

async function callOpenAiCompatible({ apiKey, baseUrl, model, messages }) {
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error?.message || data.error || `AI request failed (${response.status})`
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from AI provider");
  }
  return content;
}

async function callCursorSidecar({ sidecarUrl, messages, context }) {
  const url = `${sidecarUrl.replace(/\/$/, "")}/chat`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Cursor agent failed (${response.status})`);
  }
  return data.content || data.message || "";
}

export function getAiEnvConfig(env = process.env) {
  const provider = env.VIBE_AI_PROVIDER || "openai";
  return {
    provider,
    apiKey: env.VIBE_AI_API_KEY || "",
    baseUrl: env.VIBE_AI_BASE_URL || "https://api.openai.com/v1",
    model: env.VIBE_AI_MODEL || "gpt-4o-mini",
    cursorSidecarUrl: env.VIBE_CURSOR_AGENT_URL || "http://127.0.0.1:4877",
    configured:
      provider === "cursor"
        ? Boolean(env.VIBE_CURSOR_AGENT_URL || true)
        : Boolean(env.VIBE_AI_API_KEY),
  };
}

export function getAiPublicConfig(env = process.env) {
  const config = getAiEnvConfig(env);
  return {
    provider: config.provider,
    model: config.model,
    configured: config.provider === "cursor" ? true : Boolean(config.apiKey),
    cursorSidecarUrl:
      config.provider === "cursor" ? config.cursorSidecarUrl : undefined,
  };
}

export async function runVibeAiChat(body, env = process.env) {
  const config = getAiEnvConfig(env);
  const { messages = [], context = {} } = body;

  if (!messages.length) {
    throw new Error("messages are required");
  }

  const systemPrompt = buildSystemPrompt(context);
  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text || m.content || "",
    })),
  ];

  let rawContent;

  if (config.provider === "cursor") {
    try {
      rawContent = await callCursorSidecar({
        sidecarUrl: config.cursorSidecarUrl,
        messages: chatMessages,
        context,
      });
    } catch (err) {
      throw new Error(
        `${err.message}. Start the Cursor sidecar: npm run vibe:cursor-agent`
      );
    }
  } else {
    if (!config.apiKey) {
      throw new Error(
        "AI not configured. Set VIBE_AI_API_KEY or use VIBE_AI_PROVIDER=cursor with npm run vibe:cursor-agent."
      );
    }
    rawContent = await callOpenAiCompatible({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      model: config.model,
      messages: chatMessages,
    });
  }

  const parsed = normalizeAgentResult(parseAgentResponse(rawContent));
  return {
    ...parsed,
    provider: config.provider,
  };
}
