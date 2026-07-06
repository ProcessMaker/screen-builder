import { toKebabCase, toPascalCase } from "./vibeProjectCreate";

export const MANAGED_ROOTS = ["screens", "components", "tests"];

export function normalizeProjectPath(path) {
  return String(path || "")
    .replace(/^\.\//, "")
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
}

export function getManagedRoot(path) {
  const normalized = normalizeProjectPath(path);
  const root = normalized.split("/")[0];
  return MANAGED_ROOTS.includes(root) ? root : null;
}

export function isManagedFilePath(path) {
  const normalized = normalizeProjectPath(path);
  if (!getManagedRoot(normalized)) return false;
  return /\.(vue|ya?ml)$/i.test(normalized);
}

export function canManageNode(node) {
  if (!node?.path) return false;
  if (node.type === "directory") {
    return !MANAGED_ROOTS.includes(node.path);
  }
  return isManagedFilePath(node.path);
}

export function inferKindFromPath(filePath) {
  const normalized = normalizeProjectPath(filePath);
  if (normalized.startsWith("screens/") && normalized.endsWith(".vue")) return "screen";
  if (normalized.startsWith("components/") && normalized.endsWith(".vue")) return "component";
  if (normalized.startsWith("tests/") && /\.ya?ml$/i.test(normalized)) return "test";
  return null;
}

export function buildRenamedPath(currentPath, rawName) {
  const normalized = normalizeProjectPath(currentPath);
  const parent = normalized.split("/").slice(0, -1).join("/");
  const trimmed = String(rawName || "").trim();
  if (!trimmed || !parent) return null;

  const kind = inferKindFromPath(normalized);
  if (kind === "screen" || kind === "component") {
    const base = trimmed.replace(/\.vue$/i, "");
    const pascal = toPascalCase(base);
    if (!pascal) return null;
    return `${parent}/${pascal}.vue`;
  }

  if (kind === "test") {
    let base = trimmed.replace(/\.ya?ml$/i, "");
    base = toKebabCase(base);
    if (!base) return null;
    if (!base.endsWith("-scenarios")) {
      base = `${base}-scenarios`;
    }
    return `${parent}/${base}.yaml`;
  }

  const safeName = trimmed
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!safeName) return null;
  return `${parent}/${safeName}`;
}

export function buildDuplicatePath(path, suffix = "Copy") {
  const normalized = normalizeProjectPath(path);
  const parts = normalized.split("/");
  const fileName = parts.pop();
  const dot = fileName.lastIndexOf(".");
  const base = dot === -1 ? fileName : fileName.slice(0, dot);
  const ext = dot === -1 ? "" : fileName.slice(dot);
  return `${parts.join("/")}/${base}${suffix}${ext}`;
}

export function buildUniqueDuplicatePath(path, existingPaths = []) {
  const existing = new Set(existingPaths.map(normalizeProjectPath));
  let candidate = buildDuplicatePath(path);
  let index = 2;

  while (existing.has(candidate)) {
    candidate = buildDuplicatePath(path, `Copy${index}`);
    index += 1;
  }

  return candidate;
}

export function buildMovePath(sourcePath, targetDir) {
  const source = normalizeProjectPath(sourcePath);
  const dir = normalizeProjectPath(targetDir);
  if (!source || !dir) return null;

  const fileName = source.split("/").pop();
  if (!fileName) return null;
  if (source === dir || source.startsWith(`${dir}/`)) return null;

  return `${dir}/${fileName}`;
}

export function flattenTreePaths(tree, list = []) {
  tree.forEach((node) => {
    list.push(node.path);
    if (node.children?.length) {
      flattenTreePaths(node.children, list);
    }
  });
  return list;
}

export function updateVueComponentName(content, filePath) {
  if (!content || !/\.vue$/i.test(filePath)) return content;

  const baseName = filePath.split("/").pop().replace(/\.vue$/i, "");
  const componentName = toPascalCase(baseName);
  if (!componentName) return content;

  if (/name\s*:\s*["'][^"']+["']/.test(content)) {
    return content.replace(/name\s*:\s*["'][^"']+["']/, `name: "${componentName}"`);
  }

  return content.replace(
    /export\s+default\s*\{/,
    `export default {\n  name: "${componentName}",`
  );
}

export function isDirectoryDropTarget(node, sourcePath) {
  if (!node || node.type !== "directory") return false;

  const source = normalizeProjectPath(sourcePath);
  const target = normalizeProjectPath(node.path);
  const sourceRoot = getManagedRoot(source);
  const targetRoot = MANAGED_ROOTS.includes(target) ? target : getManagedRoot(target);

  if (!sourceRoot || !targetRoot || sourceRoot !== targetRoot) return false;
  if (source === target) return false;
  if (target.startsWith(`${source}/`)) return false;

  return true;
}
