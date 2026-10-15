import Vue from "vue";
import { compileToFunctions } from "vue-template-compiler";
import { fetchFile, getCachedFileContent } from "./vibeProjectApi";
import { resolveImportPath } from "./vibeImportPaths";

const BLOCK_RE = (tag, global = false) =>
  new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, global ? "gi" : "i");

function matchAllBlocks(source, tag) {
  const re = BLOCK_RE(tag, true);
  const matches = [];
  let match = re.exec(source);
  while (match) {
    matches.push(match);
    match = re.exec(source);
  }
  return matches;
}

function parseSfc(source) {
  const templateMatch = source.match(BLOCK_RE("template"));
  const scriptMatch = source.match(BLOCK_RE("script"));
  const styleMatches = matchAllBlocks(source, "style");

  return {
    template: templateMatch ? templateMatch[1].trim() : "",
    script: scriptMatch ? scriptMatch[1].trim() : "",
    styles: styleMatches.map((match) => match[1].trim()).filter(Boolean),
  };
}

function parseImports(script) {
  const imports = [];
  const importRe = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g;
  let match = importRe.exec(script);
  while (match) {
    imports.push({ name: match[1], path: match[2] });
    match = importRe.exec(script);
  }
  return imports;
}

function compileScript(script, injectedVars) {
  if (!script || !script.trim()) {
    return {};
  }

  const importNames = [];
  let body = script.replace(
    /import\s+(\w+)\s+from\s+['"][^'"]+['"]\s*;?\s*/g,
    (_, name) => {
      importNames.push(name);
      return "";
    }
  );

  if (!/export\s+default/.test(body)) {
    throw new Error("Script block must use export default");
  }

  body = body.replace(/export\s+default\s+/, "var __sfc_exports__ = ");

  const injectLines = importNames
    .map((name) => `const ${name} = __injected__["${name}"];`)
    .join("\n");

  const fn = new Function(
    "__injected__",
    `${injectLines}${injectLines ? "\n" : ""}${body.trim()}\nreturn __sfc_exports__;`
  );

  try {
    const result = fn(injectedVars);
    if (!result || typeof result !== "object") {
      throw new Error("export default must return a component options object");
    }
    return result;
  } catch (err) {
    throw new Error(`Script compile error: ${err.message}`);
  }
}

function compileTemplate(template) {
  if (!template) {
    return { render: undefined, staticRenderFns: undefined };
  }
  try {
    return compileToFunctions(template);
  } catch (err) {
    throw new Error(`Template compile error: ${err.message}`);
  }
}

async function compileVueFile(
  filePath,
  cache = new Map(),
  allStyles = [],
  sourceContent = null
) {
  if (cache.has(filePath)) {
    return cache.get(filePath);
  }

  let content;
  try {
    if (sourceContent !== null && sourceContent !== undefined) {
      content = sourceContent;
    } else {
      const cached = getCachedFileContent(filePath);
      content = cached !== null ? cached : (await fetchFile(filePath)).content;
    }
  } catch (err) {
    throw new Error(`Failed to load "${filePath}": ${err.message}`);
  }

  const { template, script, styles } = parseSfc(content);
  const imports = parseImports(script);
  const injectedVars = {};

  for (const imp of imports) {
    const resolved = resolveImportPath(filePath, imp.path);
    if (resolved?.toLowerCase().endsWith(".vue")) {
      injectedVars[imp.name] = await compileVueFile(resolved, cache, allStyles);
    }
  }

  const options = compileScript(script, injectedVars) || {};
  const { render, staticRenderFns } = compileTemplate(template);

  const vueImportNames = imports.filter((imp) => {
    const resolved = resolveImportPath(filePath, imp.path);
    return resolved?.toLowerCase().endsWith(".vue") && injectedVars[imp.name];
  });

  if (vueImportNames.length) {
    options.components = { ...(options.components || {}) };
    vueImportNames.forEach((imp) => {
      options.components[imp.name] = injectedVars[imp.name];
    });
  }

  if (render) {
    options.render = render;
    options.staticRenderFns = staticRenderFns;
  }

  if (styles.length) {
    allStyles.push(...styles);
  }

  cache.set(filePath, options);
  return options;
}

export async function resolveEntryVuePath() {
  const { content } = await fetchFile("index.js");
  const reExport = content.match(
    /export\s+\{\s*default\s*\}\s+from\s+['"]([^'"]+)['"]/
  );
  if (reExport) {
    return resolveImportPath("index.js", reExport[1]);
  }

  const defaultExport = content.match(
    /export\s+default\s+from\s+['"]([^'"]+)['"]/
  );
  if (defaultExport) {
    return resolveImportPath("index.js", defaultExport[1]);
  }

  throw new Error("Could not resolve entry component from vibe-project/index.js");
}

export async function compileVueSfcFromProject(filePath, sourceContent = null) {
  const allStyles = [];
  const options = await compileVueFile(filePath, new Map(), allStyles, sourceContent);
  const component = Vue.extend(options);
  component.options.__previewStyles = allStyles;
  return component;
}

export async function compileEntryFromProject() {
  const entryPath = await resolveEntryVuePath();
  return compileVueSfcFromProject(entryPath);
}

export function injectPreviewStyles(componentCtor, scopeId) {
  if (!componentCtor.options.__previewStyles?.length) return () => {};

  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-vibe-preview", scopeId);
  styleEl.textContent = componentCtor.options.__previewStyles.join("\n");
  document.head.appendChild(styleEl);

  return () => {
    styleEl.remove();
  };
}
