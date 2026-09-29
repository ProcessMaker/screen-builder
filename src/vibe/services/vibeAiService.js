import { normalizeAiEditPath } from "./vibeAiPrompt";
import { vibeProjectRequest } from "./vibeProjectApi";

const API_BASE = "/api/vibe-project";

export function fetchAiConfig() {
  return vibeProjectRequest(`${API_BASE}/ai/config`);
}

export function sendAiChat(payload) {
  return vibeProjectRequest(`${API_BASE}/ai/chat`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function applyAiEdits(edits, saveFileFn) {
  const applied = [];
  for (const edit of edits) {
    const path = normalizeAiEditPath(edit.path);
    if (!path) {
      throw new Error(`Invalid AI edit path: ${edit.path}`);
    }
    await saveFileFn(path, edit.content);
    applied.push(path);
  }
  return applied;
}
