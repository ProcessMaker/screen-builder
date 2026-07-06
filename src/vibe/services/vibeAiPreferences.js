const STORAGE_KEY = "vibe-ai-preferences";

export const AI_APPLY_ASK = "ask";
export const AI_APPLY_AUTO = "auto";

export function loadAiPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { applyMode: AI_APPLY_ASK };
    const parsed = JSON.parse(raw);
    return {
      applyMode: parsed.applyMode === AI_APPLY_AUTO ? AI_APPLY_AUTO : AI_APPLY_ASK,
    };
  } catch {
    return { applyMode: AI_APPLY_ASK };
  }
}

export function saveAiPreferences(preferences) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      applyMode:
        preferences.applyMode === AI_APPLY_AUTO ? AI_APPLY_AUTO : AI_APPLY_ASK,
    })
  );
}
