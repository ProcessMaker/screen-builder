export const PROJECT_ROOT_FOLDERS = {
  screens: "screen",
  components: "component",
  tests: "test",
};

export function getCreatableDirectoryKind(dirPath) {
  if (!dirPath) return null;
  const normalized = dirPath.replace(/^\.\//, "").replace(/\\/g, "/").trim();
  if (normalized in PROJECT_ROOT_FOLDERS) {
    return PROJECT_ROOT_FOLDERS[normalized];
  }
  const root = normalized.split("/")[0];
  return PROJECT_ROOT_FOLDERS[root] || null;
}

export function isCreatableDirectory(dirPath) {
  return !!getCreatableDirectoryKind(dirPath);
}

export function isProtectedDirectory(dirPath) {
  return Object.keys(PROJECT_ROOT_FOLDERS).includes(dirPath);
}

export function toPascalCase(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

export function toKebabCase(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function toScreenClassName(pascalName) {
  return toKebabCase(pascalName) || "screen";
}

export function buildBlankScreenContent(name) {
  const componentName = toPascalCase(name) || "NewScreen";
  const className = toScreenClassName(componentName);
  const dataCy = className;

  return `<template>
  <div class="${className}" data-cy="${dataCy}">
  </div>
</template>

<script>
export default {
  name: "${componentName}",
  data() {
    return {};
  },
};
</script>

<style scoped>
.${className} {
  max-width: 480px;
  margin: 0 auto;
  padding: 28px 24px;
  font-family: Inter, system-ui, sans-serif;
}
</style>
`;
}

export function buildBlankComponentContent(name) {
  const componentName = toPascalCase(name) || "NewComponent";
  const className = toScreenClassName(componentName);

  return `<template>
  <div class="${className}">
  </div>
</template>

<script>
export default {
  name: "${componentName}",
  props: {},
};
</script>

<style scoped>
.${className} {
  font-family: Inter, system-ui, sans-serif;
}
</style>
`;
}

export function buildBlankTestContent(name) {
  const label = String(name || "new-scenarios").trim() || "new-scenarios";
  const target = toKebabCase(label.replace(/\.ya?ml$/i, "").replace(/-scenarios$/i, "")) || "screen";

  return `scenarios:
  - name: "Screen loads"
    description: "Verifies the screen renders on initial load"
    when: []
    then:
      - assert: visible
        target: ${target}
`;
}

export function buildNewFilePath(parentPath, kind, rawName) {
  const parent = parentPath.replace(/\/$/, "");
  const trimmed = String(rawName || "").trim();
  if (!trimmed) return null;

  if (kind === "screen") {
    const base = trimmed.replace(/\.vue$/i, "");
    const pascal = toPascalCase(base);
    if (!pascal) return null;
    return `${parent}/${pascal}.vue`;
  }

  if (kind === "component") {
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

  return null;
}

export function buildNewFolderPath(parentPath, rawName) {
  const parent = parentPath.replace(/\/$/, "");
  const folder = String(rawName || "")
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!folder) return null;
  return `${parent}/${folder}`;
}

export function getCreateContentForPath(filePath, kind) {
  const fileName = filePath.split("/").pop().replace(/\.(vue|ya?ml)$/i, "");
  if (kind === "screen") return buildBlankScreenContent(fileName);
  if (kind === "component") return buildBlankComponentContent(fileName);
  if (kind === "test") return buildBlankTestContent(fileName);
  return "";
}

export function ensureVueFileContent(filePath, content = "") {
  if (content?.trim()) return content;

  if (filePath.startsWith("screens/") && filePath.toLowerCase().endsWith(".vue")) {
    return getCreateContentForPath(filePath, "screen");
  }

  if (filePath.startsWith("components/") && filePath.toLowerCase().endsWith(".vue")) {
    return getCreateContentForPath(filePath, "component");
  }

  return content || "";
}

export function getCreateActionLabel(kind) {
  if (kind === "screen") return "New screen";
  if (kind === "component") return "New component";
  if (kind === "test") return "New test file";
  return "New file";
}

export function getCreatePrompt(kind) {
  if (kind === "screen") return "Screen name (PascalCase, e.g. MyScreen):";
  if (kind === "component") return "Component name (PascalCase, e.g. MyCard):";
  if (kind === "test") return "Test file name (e.g. pos or pos-scenarios):";
  return "Name:";
}
