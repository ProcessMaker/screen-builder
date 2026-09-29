import {
  createScreenModel,
  createComponentNode,
  createContainerNode,
} from "./vibeScreenModel";
import { parsePropsFromVueSource } from "./vibeComponentProps";
import { extractPreservedBlocks } from "./vibeSfcPatch";

function parsePropsFromTag(attrsStr) {
  const props = {};
  attrsStr.replace(/(?:^|\s)([\w-]+)="([^"]*)"/g, (_, key, value) => {
    if (!["class", "id", "data-cy"].includes(key)) {
      props[key] = value;
    }
  });
  return props;
}

function kebabToPascal(tag) {
  return tag
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export function parseVueToScreenModel(screenPath, content) {
  const model = createScreenModel(screenPath);
  model.isComponentSheet = isComponentFile(screenPath);

  if (model.isComponentSheet && content?.trim()) {
    const propSchema = parsePropsFromVueSource(content);
    model.script.props = propSchema;
    model.componentProps = {};
    propSchema.forEach((def) => {
      if (def.default !== undefined) {
        model.componentProps[def.name] = def.default;
      }
    });
  }

  if (!content?.trim()) return model;

  const preserved = extractPreservedBlocks(content);
  model.preservedTemplate = preserved.template;
  model.preservedScript = preserved.script;
  model.preservedStyles = preserved.styles;

  const imports = {};
  content.replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, (_, name, path) => {
    imports[name] = path.replace(/^\.\.\//, "");
  });

  const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
  if (!templateMatch) return model;

  const rootMatch = templateMatch[1].trim().match(/^<(\w+)([^>]*)>([\s\S]*)<\/\1>$/);
  if (rootMatch) {
    model.root.tag = rootMatch[1];
    const attrs = {};
    rootMatch[2].replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => {
      attrs[k] = v;
    });
    model.root.attrs = attrs;
    model.root.templateTagIndex = 0;
  }

  const nameMatch = content.match(/name:\s*["']([^"']+)["']/);
  if (nameMatch) model.script.name = nameMatch[1];

  model.root.children = [];
  const inner = rootMatch ? rootMatch[3] : templateMatch[1];
  const tagOccurrence = {};
  const tagRe = /<([\w-]+)([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>)/g;
  let tagMatch = tagRe.exec(inner);

  while (tagMatch) {
    const tagName = tagMatch[1];
    const attrsStr = tagMatch[2] || "";
    const occurrenceIndex = tagOccurrence[tagName] || 0;
    tagOccurrence[tagName] = occurrenceIndex + 1;
    const pascalName = kebabToPascal(tagName);
    const importName = Object.keys(imports).find(
      (name) => name.toLowerCase() === pascalName.toLowerCase()
    );

    if (importName) {
      let path = imports[importName];
      if (!path.endsWith(".vue")) path += ".vue";
      const node = createComponentNode(path, parsePropsFromTag(attrsStr));
      node.templateTagIndex = occurrenceIndex;
      model.root.children.push(node);
    } else if (!["template", "script", "style"].includes(tagName.toLowerCase())) {
      const attrs = {};
      attrsStr.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => {
        attrs[k] = v;
      });
      const node = createContainerNode(tagName, attrs);
      node.templateTagIndex = occurrenceIndex;
      model.root.children.push(node);
    }
    tagMatch = tagRe.exec(inner);
  }

  return model;
}

export function isScreenFile(filePath) {
  return filePath.startsWith("screens/") && filePath.toLowerCase().endsWith(".vue");
}

export function isComponentFile(filePath) {
  return filePath.startsWith("components/") && filePath.toLowerCase().endsWith(".vue");
}

export function isSheetFile(filePath) {
  return isScreenFile(filePath) || isComponentFile(filePath);
}
