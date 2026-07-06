import { fetchFile } from "./vibeProjectApi";
import { compileVueFile } from "./vibeCompiler";

const runtimeCache = new Map();
const dynamicCache = new Map();
const pathContentHashes = new Map();

function normalizeScreenPath(screenPath) {
  return String(screenPath).replace(/^\.\//, "");
}

function hashContent(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export function hashVibeScreenContent(content) {
  return hashContent(content ?? "");
}

export function cacheVibeScreenComponent(screenPath, sourceContent, component) {
  if (!screenPath || !component) return;

  const normalizedPath = normalizeScreenPath(screenPath);
  const contentHash = hashContent(sourceContent ?? "");
  const cacheKey = `${normalizedPath}\0${contentHash}`;

  const previousHash = pathContentHashes.get(normalizedPath);
  if (previousHash && previousHash !== contentHash) {
    dynamicCache.delete(`${normalizedPath}\0${previousHash}`);
  }

  dynamicCache.set(cacheKey, component);
  pathContentHashes.set(normalizedPath, contentHash);
  runtimeCache.set(normalizedPath, component);
}

export function isVibeScreenCachedForContent(screenPath, sourceContent) {
  const normalizedPath = normalizeScreenPath(screenPath);
  const contentHash = hashContent(sourceContent ?? "");
  return (
    pathContentHashes.get(normalizedPath) === contentHash &&
    dynamicCache.has(`${normalizedPath}\0${contentHash}`)
  );
}

export function shouldUseDynamicVibeCompile() {
  if (typeof window === "undefined") return false;
  if (window.__vibeProjectDynamicCompile === false) return false;
  if (window.__vibeProjectDynamicCompile === true) return true;

  const path = window.location?.pathname || "";
  return path.includes("screen-builder") || path.includes("/designer/");
}

export function getCachedVibeScreenComponent(screenPath) {
  return runtimeCache.get(normalizeScreenPath(screenPath)) || null;
}

function removeInjectedStyles(screenPath) {
  if (typeof document === "undefined") return;
  const scopeId = `classic-${normalizeScreenPath(screenPath)}`;
  document
    .querySelectorAll(`style[data-vibe-preview="${scopeId}"]`)
    .forEach((el) => el.remove());
}

export function invalidateVibeScreenRuntimeCache(screenPath = null) {
  if (screenPath) {
    const path = normalizeScreenPath(screenPath);
    runtimeCache.delete(path);
    removeInjectedStyles(path);

    const hash = pathContentHashes.get(path);
    if (hash) {
      dynamicCache.delete(`${path}\0${hash}`);
      pathContentHashes.delete(path);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vibe-screen-cache-invalidated", { detail: { screenPath: path } })
      );
    }
    return;
  }

  runtimeCache.clear();
  dynamicCache.clear();
  pathContentHashes.clear();

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("style[data-vibe-preview^='classic-']")
      .forEach((el) => el.remove());
  }
}

async function loadFromBundle(screenPath) {
  const normalizedPath = normalizeScreenPath(screenPath);
  const loader = typeof window !== "undefined" ? window.__vibeProjectLoader : null;

  if (!loader?.loadVueFile) {
    return {
      component: null,
      error:
        "Vibe screen bundle is not loaded. Rebuild ProcessMaker assets (npm run dev) to include vibe-project-entry.js.",
    };
  }

  try {
    const component = await loader.loadVueFile(normalizedPath);
    if (!component) {
      return {
        component: null,
        error: `Vibe screen not found in bundle: ${normalizedPath}`,
      };
    }
    return { component, error: null };
  } catch (err) {
    return {
      component: null,
      error: err.message || String(err),
    };
  }
}

async function loadDynamically(screenPath) {
  const normalizedPath = normalizeScreenPath(screenPath);

  try {
    const { content } = await fetchFile(normalizedPath);
    const contentHash = hashContent(content);
    const cacheKey = `${normalizedPath}\0${contentHash}`;

    if (dynamicCache.has(cacheKey)) {
      const component = dynamicCache.get(cacheKey);
      runtimeCache.set(normalizedPath, component);
      pathContentHashes.set(normalizedPath, contentHash);
      return { component, error: null };
    }

    const { component, error } = await compileVueFile(normalizedPath, content);
    if (error || !component) {
      return { component: null, error: error || "Failed to compile Vibe screen" };
    }

    const previousHash = pathContentHashes.get(normalizedPath);
    if (previousHash && previousHash !== contentHash) {
      dynamicCache.delete(`${normalizedPath}\0${previousHash}`);
    }

    dynamicCache.set(cacheKey, component);
    pathContentHashes.set(normalizedPath, contentHash);
    runtimeCache.set(normalizedPath, component);
    return { component, error: null };
  } catch (err) {
    return { component: null, error: err.message || String(err) };
  }
}

export async function resolveVibeScreenComponent(screenPath) {
  const normalizedPath = normalizeScreenPath(screenPath);
  if (!normalizedPath) {
    return { component: null, error: "No screen path configured" };
  }

  if (shouldUseDynamicVibeCompile()) {
    const dynamicResult = await loadDynamically(normalizedPath);
    if (dynamicResult.component) {
      return dynamicResult;
    }
    // Fall back to bundle if dynamic compile fails (e.g. API unavailable).
  }

  if (runtimeCache.has(normalizedPath)) {
    return { component: runtimeCache.get(normalizedPath), error: null };
  }

  const result = await loadFromBundle(normalizedPath);
  if (result.component) {
    runtimeCache.set(normalizedPath, result.component);
  }
  return result;
}
