#!/usr/bin/env node
/**
 * Optional Cursor SDK sidecar for Vibe IDE AI panel.
 *
 * Requires: npm install @cursor/sdk
 * Env: CURSOR_API_KEY, optional VIBE_CURSOR_AGENT_PORT=4877
 *
 * Usage: npm run vibe:cursor-agent
 * Then set VIBE_AI_PROVIDER=cursor in .env
 */
import http from "http";
import {
  buildSystemPrompt,
  parseAgentResponse,
  normalizeAgentResult,
} from "../src/vibe/services/vibeAiPrompt.js";

const PORT = Number(process.env.VIBE_CURSOR_AGENT_PORT || 4877);
const MODEL = process.env.VIBE_AI_MODEL || "composer-2.5";

async function loadCursorSdk() {
  try {
    return await import("@cursor/sdk");
  } catch {
    throw new Error(
      "Install @cursor/sdk: npm install @cursor/sdk --save-dev"
    );
  }
}

async function runCursorAgent(messages, context) {
  const { Agent } = await loadCursorSdk();
  const apiKey = process.env.CURSOR_API_KEY;

  if (!apiKey) {
    throw new Error("CURSOR_API_KEY is required");
  }

  const system = buildSystemPrompt(context);
  const userTurns = messages.filter((m) => m.role === "user");
  const lastUser = userTurns[userTurns.length - 1]?.content || "";
  const prompt = `${system}\n\nUser request:\n${lastUser}`;

  const result = await Agent.prompt(prompt, {
    apiKey,
    model: { id: MODEL },
    local: { cwd: process.cwd() },
  });

  return result.result || result.output || String(result);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, provider: "cursor" }));
    return;
  }

  if (req.url === "/chat" && req.method === "POST") {
    try {
      const body = JSON.parse(await readBody(req));
      const raw = await runCursorAgent(body.messages || [], body.context || {});
      const parsed = normalizeAgentResult(parseAgentResponse(raw));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ content: JSON.stringify(parsed) }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Vibe Cursor agent sidecar listening on http://127.0.0.1:${PORT}`);
  console.log(`Set VIBE_AI_PROVIDER=cursor and VIBE_CURSOR_AGENT_URL=http://127.0.0.1:${PORT}`);
});
