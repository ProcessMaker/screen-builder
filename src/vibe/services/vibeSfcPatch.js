/* istanbul ignore file */
import { collectComponentImports } from "./vibeScreenModel";
import { resolveComponentImportPath } from "./vibeImportPaths";

function pascalToKebab(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function extractPreservedBlocks(content) {
  if (!content) {
    return { template: null, script: null, styles: null };
  }

  const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);

  return {
    template: templateMatch ? templateMatch[1] : null,
    script: scriptMatch ? scriptMatch[1].trim() : null,
    styles: styleMatch ? styleMatch[1].trim() : null,
  };
}

export function assembleSfc(template, script, styles) {
  return `<template>
${template}
</template>

<script>
${script}
</script>

<style scoped>
${styles}
</style>
`;
}

function findNthOpeningTag(content, tagName, occurrenceIndex = 0) {
  const re = new RegExp(`<${tagName}(\\s[^>/]*?)?(\\/>|>)`, "gi");
  let match;
  let count = 0;

  while ((match = re.exec(content)) !== null) {
    if (count === occurrenceIndex) {
      return {
        start: match.index,
        end: match.index + match[0].length,
        tag: match[0],
      };
    }
    count += 1;
  }

  return null;
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function renderStaticProps(props) {
  return Object.entries(props || {})
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}="${escapeAttr(value)}"`;
      }
      if (typeof value === "boolean") {
        return value ? key : `:${key}="false"`;
      }
      if (typeof value === "number") {
        return `:${key}="${value}"`;
      }
      return `:${key}='${JSON.stringify(value)}'`;
    })
    .join(" ");
}

function patchOpeningTagAttributes(openTag, props) {
  const tagMatch = openTag.match(/^<([\w-]+)/);
  if (!tagMatch) return openTag;

  const tagName = tagMatch[1];
  const isSelfClosing = /\/>\s*$/.test(openTag);
  let inner = openTag.slice(tagName.length + 1).replace(/\/?>\s*$/, "").trim();

  Object.keys(props || {}).forEach((key) => {
    inner = inner.replace(new RegExp(`(^|\\s)${key}="[^"]*"`, "g"), " ");
    inner = inner.replace(new RegExp(`(^|\\s):${key}="[^"]*"`, "g"), " ");
  });

  inner = inner.replace(/\s+/g, " ").trim();
  const newProps = renderStaticProps(props);
  const parts = [inner, newProps].filter(Boolean).join(" ");
  const attrSegment = parts ? ` ${parts}` : "";
  const closing = isSelfClosing ? " /" : "";

  return `<${tagName}${attrSegment}${closing}>`;
}

export function patchComponentUsageProps(content, componentName, occurrenceIndex, props) {
  if (!content || !componentName) return content;

  const tagName = pascalToKebab(componentName);
  const match = findNthOpeningTag(content, tagName, occurrenceIndex);
  if (!match) return content;

  const patchedTag = patchOpeningTagAttributes(match.tag, props);
  return content.slice(0, match.start) + patchedTag + content.slice(match.end);
}

export function patchContainerTagAttrs(content, tagName, occurrenceIndex, attrs) {
  if (!content || !tagName) return content;

  const match = findNthOpeningTag(content, tagName, occurrenceIndex);
  if (!match) return content;

  const attrProps = Object.fromEntries(
    Object.entries(attrs || {}).map(([key, value]) => [key, String(value)])
  );
  const patchedTag = patchOpeningTagAttributes(match.tag, attrProps);
  return content.slice(0, match.start) + patchedTag + content.slice(match.end);
}

function mergeComponentsRegistration(script, requiredNames) {
  const required = [...requiredNames];
  if (!required.length) return script;

  const match = script.match(/components\s*:\s*\{/);
  const existing = new Set();

  if (match && match.index !== undefined) {
    const braceStart = script.indexOf("{", match.index);
    let depth = 0;
    for (let i = braceStart; i < script.length; i += 1) {
      const ch = script[i];
      if (ch === "{") depth += 1;
      if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          const inner = script.slice(braceStart + 1, i);
          inner.split(",").forEach((part) => {
            const name = part.trim().split(/\s+/)[0];
            if (name && /^[A-Za-z_$]/.test(name)) {
              existing.add(name);
            }
          });

          const merged = [...new Set([...existing, ...required])];
          const block = `components: { ${merged.join(", ")} }`;
          return script.slice(0, match.index) + block + script.slice(i + 1);
        }
      }
    }
  }

  const merged = [...new Set([...existing, ...required])];
  const block = `components: { ${merged.join(", ")} }`;
  return script.replace(/export\s+default\s*\{/, `export default {\n  ${block},`);
}

function mergeScriptImports(preservedScript, model) {
  if (!preservedScript) return preservedScript;

  const needed = collectComponentImports(model.root);
  if (!needed.size) return preservedScript;

  const ownerPath = model.screenPath || "screens/MainScreen.vue";
  const lines = preservedScript.split("\n");
  const existingImports = new Set();
  preservedScript.replace(
    /import\s+(\w+)\s+from\s+['"][^'"]+['"]\s*;?/g,
    (_, name) => {
      existingImports.add(name);
    }
  );

  const newImportLines = [];
  needed.forEach((path, name) => {
    if (!existingImports.has(name)) {
      newImportLines.push(
        `import ${name} from "${resolveComponentImportPath(ownerPath, path)}";`
      );
    }
  });

  let result = preservedScript;

  if (newImportLines.length) {
    const exportIdx = lines.findIndex((line) => /export\s+default/.test(line));
    if (exportIdx === -1) {
      result = `${newImportLines.join("\n")}\n\n${preservedScript}`;
    } else {
      result = [...lines.slice(0, exportIdx), ...newImportLines, "", ...lines.slice(exportIdx)].join(
        "\n"
      );
    }
  }

  return mergeComponentsRegistration(result, [...needed.keys()]);
}

export function generateVueSfcPreserved(model, renderTemplate) {
  const templateBody = renderTemplate(model);
  const scriptBody =
    mergeScriptImports(model.preservedScript, model) ||
    model.preservedScript ||
    "export default { name: \"Component\" };";
  const styleBody =
    model.preservedStyles ||
    `.${model.root.attrs?.class || "screen"} {
  font-family: Inter, system-ui, sans-serif;
}`;

  return assembleSfc(templateBody, scriptBody, styleBody);
}

export function syncImportedVueComponentsInSource(content) {
  if (!content) return content;

  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return content;

  const script = scriptMatch[1].trim();
  const importNames = [];
  script.replace(
    /import\s+(\w+)\s+from\s+['"][^'"]+\.vue['"]\s*;?/g,
    (_, name) => {
      importNames.push(name);
    }
  );

  if (!importNames.length) return content;

  const updatedScript = mergeComponentsRegistration(script, importNames);
  if (updatedScript === script) return content;

  return content.replace(scriptMatch[0], `<script>\n${updatedScript}\n</script>`);
}
