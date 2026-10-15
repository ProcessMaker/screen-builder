const STORAGE_KEY = "vibe-panel-sizes";

export const PANEL_LIMITS = {
  sidebar: { min: 180, max: 480, default: 260 },
  preview: { min: 280, max: 900, default: 420 },
  tests: { min: 120, max: 420, default: 220 },
  ai: { min: 140, max: 480, default: 240 },
};

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function loadPanelSizes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultPanelSizes();
    const parsed = JSON.parse(raw);
    return {
      sidebarWidth: clamp(
        parsed.sidebarWidth ?? PANEL_LIMITS.sidebar.default,
        PANEL_LIMITS.sidebar.min,
        PANEL_LIMITS.sidebar.max
      ),
      previewWidth: clamp(
        parsed.previewWidth ?? PANEL_LIMITS.preview.default,
        PANEL_LIMITS.preview.min,
        PANEL_LIMITS.preview.max
      ),
      testsHeight: clamp(
        parsed.testsHeight ?? PANEL_LIMITS.tests.default,
        PANEL_LIMITS.tests.min,
        PANEL_LIMITS.tests.max
      ),
      aiHeight: clamp(
        parsed.aiHeight ?? PANEL_LIMITS.ai.default,
        PANEL_LIMITS.ai.min,
        PANEL_LIMITS.ai.max
      ),
    };
  } catch {
    return getDefaultPanelSizes();
  }
}

export function savePanelSizes(sizes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
}

export function getDefaultPanelSizes() {
  return {
    sidebarWidth: PANEL_LIMITS.sidebar.default,
    previewWidth: PANEL_LIMITS.preview.default,
    testsHeight: PANEL_LIMITS.tests.default,
    aiHeight: PANEL_LIMITS.ai.default,
  };
}
