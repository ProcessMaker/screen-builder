export function screenPathToLabel(screenPath) {
  const base = screenPath.split("/").pop() || screenPath;
  return base.replace(/\.vue$/i, "");
}

const VIBE_SCREEN_PATH_RE = /screen-path=["']([^"']+)["']/gi;

function collectFromItems(items, paths) {
  if (!Array.isArray(items)) return;

  items.forEach((item) => {
    if (!item || typeof item !== "object") return;

    if (Array.isArray(item)) {
      collectFromItems(item, paths);
      return;
    }

    const contentVue = item.config?.contentVue;
    if (item.component === "VueComponentRenderTemplate" && contentVue) {
      const matches = contentVue.matchAll(VIBE_SCREEN_PATH_RE);
      for (const match of matches) {
        if (match[1]) paths.add(match[1]);
      }
    }

    if (Array.isArray(item.items)) {
      if (item.component === "FormMultiColumn") {
        item.items.forEach((column) => collectFromItems(column, paths));
      } else {
        collectFromItems(item.items, paths);
      }
    }

    if (Array.isArray(item.config?.items)) {
      collectFromItems(item.config.items, paths);
    }
  });
}

export function extractUsedVibeScreenPaths(config) {
  const paths = new Set();
  if (!Array.isArray(config)) return [];

  config.forEach((page) => collectFromItems(page?.items, paths));
  return [...paths];
}

export function buildVibeScreenControlFields(screenPath) {
  const label = screenPathToLabel(screenPath);

  return {
    label,
    componentName: "VibeProjectScreen",
    contentVue: `<VibeProjectScreen screen-path="${screenPath}" />`,
    handlerVue: "return {}",
    interactive: true,
    ignoreMustache: true,
  };
}
