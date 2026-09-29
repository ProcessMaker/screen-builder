import { collectComponentImports } from "./vibeScreenModel";
import {
  assembleSfc,
  generateVueSfcPreserved,
} from "./vibeSfcPatch";
import { resolveComponentImportPath } from "./vibeImportPaths";

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function renderProps(props) {
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

function renderNode(node, depth = 2) {
  const indent = "  ".repeat(depth);

  if (node.type === "component") {
    const tag = node.componentName
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
    const propsStr = renderProps(node.props);
    const open = propsStr ? `<${tag} ${propsStr}` : `<${tag}`;

    if (!node.children?.length) {
      return `${indent}${open} />`;
    }

    const childLines = node.children.map((c) => renderNode(c, depth + 1)).join("\n");
    return `${indent}${open}>\n${childLines}\n${indent}</${tag}>`;
  }

  const attrs = Object.entries(node.attrs || {})
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(" ");
  const tag = node.tag || "div";
  const open = attrs ? `<${tag} ${attrs}` : `<${tag}`;

  if (!node.children?.length) {
    return `${indent}${open}></${tag}>`;
  }

  const childLines = node.children.map((c) => renderNode(c, depth + 1)).join("\n");
  return `${indent}${open}>\n${childLines}\n${indent}</${tag}>`;
}

function formatPropDefault(value, type) {
  if (type === "Boolean") {
    return value ? "true" : "false";
  }
  if (type === "Number") {
    return String(value);
  }
  if (typeof value === "string") {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return JSON.stringify(value);
}

export function renderPropsBlock(schema, values = {}) {
  if (!schema?.length) return "";

  return schema
    .map((def) => {
      const value =
        values[def.name] !== undefined ? values[def.name] : def.default;
      const type = def.type || "String";
      if (value !== undefined) {
        return `    ${def.name}: { type: ${type}, default: ${formatPropDefault(value, type)} }`;
      }
      return `    ${def.name}: { type: ${type} }`;
    })
    .join(",\n");
}

function replaceObjectBlock(source, key, newBlock) {
  const match = source.match(new RegExp(`\\b${key}\\s*:`));
  if (!match || match.index === undefined) return null;

  const keyIdx = match.index;
  const braceStart = source.indexOf("{", keyIdx);
  if (braceStart === -1) return null;

  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(0, keyIdx) + newBlock + source.slice(i + 1);
      }
    }
  }

  return null;
}

export function patchComponentPropsInSource(content, componentProps, schema) {
  if (!content || !schema?.length) return content;

  const propsBlock = renderPropsBlock(schema, componentProps);
  if (!propsBlock) return content;

  const newPropsSection = `props: {\n${propsBlock}\n  }`;
  const replaced = replaceObjectBlock(content, "props", newPropsSection);
  if (replaced) return replaced;

  const anchor = content.match(/\n(\s*)(computed|methods|data)\s*:/);
  if (anchor && anchor.index !== undefined) {
    const idx = anchor.index;
    return `${content.slice(0, idx)},\n  ${newPropsSection}${content.slice(idx)}`;
  }

  const exportClose = content.lastIndexOf("};");
  if (exportClose !== -1) {
    return `${content.slice(0, exportClose)},\n  ${newPropsSection}\n${content.slice(exportClose)}`;
  }

  return content;
}

function renderScript(model) {
  const imports = collectComponentImports(model.root);
  const ownerPath = model.screenPath || "screens/MainScreen.vue";
  const importLines = [...imports.entries()]
    .map(
      ([name, path]) =>
        `import ${name} from "${resolveComponentImportPath(ownerPath, path)}";`
    )
    .join("\n");

  const componentList = [...imports.keys()].join(", ");
  const script = model.script || {};
  const isComponent = model.isComponentSheet;
  const propsBlock = renderPropsBlock(script.props, model.componentProps);

  if (isComponent) {
    const propsSection = propsBlock
      ? `  props: {\n${propsBlock}\n  },`
      : "";

    return `${importLines}${importLines ? "\n\n" : ""}export default {
  name: "${script.name || model.screenName}",
  components: { ${componentList} },${propsSection ? `\n${propsSection}` : ""}
};`;
  }

  return `${importLines}${importLines ? "\n\n" : ""}export default {
  name: "${script.name || model.screenName}",
  components: { ${componentList} },
  data() {
    return {};
  },
};`;
}

export function generateVueSfc(model, { structural = false } = {}) {
  if (structural && model.preservedScript) {
    return generateVueSfcPreserved(model, (m) => renderNode(m.root, 2));
  }

  if (model.preservedTemplate && model.preservedScript && !structural) {
    return assembleSfc(model.preservedTemplate, model.preservedScript, model.preservedStyles || "");
  }

  const templateBody = renderNode(model.root, 2);
  const scriptBody = renderScript(model);
  const rootClass = model.root.attrs?.class || "screen";
  const isComponent = model.isComponentSheet || model.screenPath?.startsWith("components/");

  const styleRules = isComponent
    ? `.${rootClass} {
  font-family: Inter, system-ui, sans-serif;
}`
    : `.${rootClass} {
  max-width: 480px;
  margin: 0 auto;
  padding: 28px 24px;
  font-family: Inter, system-ui, sans-serif;
}`;

  return assembleSfc(templateBody, scriptBody, styleRules);
}
