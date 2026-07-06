const API_BASE = "/api/vibe-project";
const pendingFileContent = new Map();

function normalizeApiPath(path) {
  return String(path || "").replace(/^\.\//, "");
}

export function cacheFileContent(path, content) {
  if (!path) return;
  pendingFileContent.set(normalizeApiPath(path), content);
}

export function getCachedFileContent(path) {
  const normalizedPath = normalizeApiPath(path);
  return pendingFileContent.has(normalizedPath)
    ? pendingFileContent.get(normalizedPath)
    : null;
}

export function invalidateFileContentCache(path = null) {
  if (path) {
    pendingFileContent.delete(normalizeApiPath(path));
    return;
  }
  pendingFileContent.clear();
}

function getCsrfToken() {
  if (typeof window === "undefined") return null;

  const fromAxios =
    window.ProcessMaker?.apiClient?.defaults?.headers?.common?.["X-CSRF-TOKEN"];
  if (fromAxios) return fromAxios;

  const meta = document.head?.querySelector('meta[name="csrf-token"]');
  return meta?.content || null;
}

function buildRequestHeaders(extraHeaders = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers["X-CSRF-TOKEN"] = csrfToken;
    headers["X-Requested-With"] = "XMLHttpRequest";
  }

  return headers;
}

function parseResponseBody(text) {
  const trimmed = text.trim();
  if (!trimmed) return {};

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }

  throw new Error("NOT_JSON");
}

function buildHttpError(response, text, requestUrl = "") {
  if (response.status === 419) {
    return new Error("Session expired (CSRF). Refresh the page and try again.");
  }
  if (response.status === 401 || response.status === 403) {
    return new Error(`Not authorized (${response.status}). Please log in again.`);
  }
  if (response.status === 404) {
    if (requestUrl.includes("/ai/")) {
      return new Error(
        "AI endpoint not found (404). Run ~/Sites/nds.sh to sync screen-builder into ProcessMaker."
      );
    }
    return new Error(
      `Vibe project file or API not found (404)${requestUrl ? `: ${requestUrl}` : ""}. ` +
        "If you just created a file, save again and retry. Otherwise run ~/Sites/nds.sh to sync screen-builder into ProcessMaker."
    );
  }
  if (response.status === 502 || response.status === 504) {
    return new Error(
      "AI request timed out (502). PHP/nginx closed the connection before OpenAI responded. " +
        "Restart Herd after adding fastcgi_read_timeout, or retry with a shorter prompt."
    );
  }

  const snippet = text.replace(/\s+/g, " ").slice(0, 140);
  return new Error(
    `Server returned HTML instead of JSON (${response.status}): ${snippet}`
  );
}

export async function vibeProjectRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: buildRequestHeaders(options.headers),
  });

  const text = await response.text();
  let data;

  try {
    data = parseResponseBody(text);
  } catch {
    throw buildHttpError(response, text, url);
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed (${response.status})`);
  }

  return data;
}

export function fetchTree() {
  return vibeProjectRequest(`${API_BASE}/tree`);
}

export function fetchFile(path) {
  const normalizedPath = normalizeApiPath(path);

  return vibeProjectRequest(`${API_BASE}/file?path=${encodeURIComponent(normalizedPath)}`).then(
    (data) => {
      cacheFileContent(normalizedPath, data.content ?? "");
      return data;
    }
  );
}

export function saveFile(path, content) {
  const normalizedPath = normalizeApiPath(path);

  return vibeProjectRequest(`${API_BASE}/file`, {
    method: "PUT",
    body: JSON.stringify({ path: normalizedPath, content }),
  }).then((data) => {
    cacheFileContent(normalizedPath, content);
    return data;
  });
}

export function createDirectory(path) {
  return vibeProjectRequest(`${API_BASE}/mkdir`, {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export function deletePath(path) {
  return vibeProjectRequest(`${API_BASE}/file?path=${encodeURIComponent(path)}`, {
    method: "DELETE",
  }).then((data) => {
    invalidateFileContentCache(path);
    return data;
  });
}

export function movePath(from, to) {
  const source = normalizeApiPath(from);
  const destination = normalizeApiPath(to);

  return vibeProjectRequest(`${API_BASE}/move`, {
    method: "POST",
    body: JSON.stringify({ from: source, to: destination }),
  }).then((data) => {
    invalidateFileContentCache(source);
    invalidateFileContentCache(destination);
    return data;
  });
}

export function duplicatePath(path, to = null) {
  const source = normalizeApiPath(path);

  return vibeProjectRequest(`${API_BASE}/duplicate`, {
    method: "POST",
    body: JSON.stringify({ path: source, to: to ? normalizeApiPath(to) : null }),
  }).then((data) => {
    if (data?.path) {
      invalidateFileContentCache(data.path);
    }
    return data;
  });
}

export function exportProject() {
  return vibeProjectRequest(`${API_BASE}/export`);
}

export function importProject(files) {
  return vibeProjectRequest(`${API_BASE}/import`, {
    method: "POST",
    body: JSON.stringify({ files }),
  });
}

export function getLanguageForPath(filePath) {
  if (filePath.endsWith(".vue")) return "html";
  if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) return "plaintext";
  if (filePath.endsWith(".json")) return "json";
  if (filePath.endsWith(".css") || filePath.endsWith(".scss")) return "css";
  return "javascript";
}

export function getFileIcon(filePath, type) {
  if (type === "directory") return "folder";
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".vue")) return "vue";
  if (lower.endsWith(".yaml") || lower.endsWith(".yml")) return "yaml";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".css") || lower.endsWith(".scss")) return "css";
  if (/\.(js|mjs|cjs|jsx)$/.test(lower)) return "js";
  return "file";
}
