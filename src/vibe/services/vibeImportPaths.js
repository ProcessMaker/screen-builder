function splitPath(filePath) {
  return String(filePath || "")
    .replace(/^\.\//, "")
    .split("/")
    .filter(Boolean);
}

export function resolveComponentImportPath(ownerPath, componentPath) {
  const ownerParts = splitPath(ownerPath);
  const ownerDir = ownerParts.slice(0, -1);
  const targetParts = splitPath(componentPath);

  if (!ownerDir.length || !targetParts.length) {
    return `./${targetParts[targetParts.length - 1] || "Component.vue"}`;
  }

  let common = 0;
  const targetDir = targetParts.slice(0, -1);
  while (
    common < ownerDir.length &&
    common < targetDir.length &&
    ownerDir[common] === targetDir[common]
  ) {
    common += 1;
  }

  const up = ownerDir.length - common;
  const down = targetParts.slice(common);
  const relative = [...Array(up).fill(".."), ...down];

  if (!relative.length) {
    return `./${targetParts[targetParts.length - 1]}`;
  }

  if (relative.length === 1 && !relative[0].startsWith("..")) {
    return `./${relative[0]}`;
  }

  return relative.join("/");
}

export function resolveImportPath(fromFile, importPath) {
  if (!importPath.startsWith(".")) return null;

  const segments = splitPath(fromFile).slice(0, -1);
  importPath.split("/").forEach((part) => {
    if (part === "." || part === "") return;
    if (part === "..") segments.pop();
    else segments.push(part);
  });

  return segments.join("/");
}
