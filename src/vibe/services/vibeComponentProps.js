import { fetchFile } from "./vibeProjectApi";

const schemaCache = new Map();

function extractScriptBlock(source) {
  const match = source.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return match ? match[1] : "";
}

function extractPropsBlock(script) {
  const propsIdx = script.search(/\bprops\s*:/);
  if (propsIdx === -1) return null;

  const afterProps = script.slice(propsIdx);
  const arrayMatch = afterProps.match(/props\s*:\s*\[([\s\S]*?)\]/);
  if (arrayMatch) {
    return { kind: "array", content: arrayMatch[1] };
  }

  const objStart = afterProps.indexOf("{");
  if (objStart === -1) return null;

  let depth = 0;
  for (let i = objStart; i < afterProps.length; i += 1) {
    const ch = afterProps[i];
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return { kind: "object", content: afterProps.slice(objStart + 1, i) };
      }
    }
  }

  return null;
}

function splitTopLevelEntries(content) {
  const segments = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    if (ch === "," && depth === 0) {
      if (current.trim()) segments.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }

  if (current.trim()) segments.push(current.trim());
  return segments;
}

function parseDefaultValue(raw) {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1);
  }
  return raw;
}

function parsePropObjectBody(name, body) {
  const typeMatch = body.match(/type\s*:\s*(\w+)/);
  const type = typeMatch ? typeMatch[1] : "String";

  let defaultValue;
  const defaultMatch = body.match(
    /default\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|-?\d+(?:\.\d+)?|true|false)/
  );
  if (defaultMatch) {
    defaultValue = parseDefaultValue(defaultMatch[1]);
  }

  let options = null;
  const validatorMatch = body.match(/validator[\s\S]*?\[([^\]]+)\]/);
  if (validatorMatch) {
    options = [...validatorMatch[1].matchAll(/"([^"]+)"|'([^']+)'/g)].map(
      (match) => match[1] || match[2]
    );
  }

  return { name, type, default: defaultValue, options };
}

function parsePropSegment(segment) {
  const match = segment.match(/^(\w+)\s*:\s*([\s\S]+)$/);
  if (!match) return null;

  const name = match[1];
  const value = match[2].trim();

  if (value.startsWith("{")) {
    return parsePropObjectBody(name, value.slice(1, -1));
  }

  return {
    name,
    type: value.replace(/[,;]\s*$/, ""),
    default: undefined,
    options: null,
  };
}

export function parsePropsFromVueSource(source) {
  const script = extractScriptBlock(source);
  const block = extractPropsBlock(script);
  if (!block) return [];

  if (block.kind === "array") {
    return [...block.content.matchAll(/"([^"]+)"|'([^']+)'/g)].map((match) => ({
      name: match[1] || match[2],
      type: "String",
      default: "",
      options: null,
    }));
  }

  return splitTopLevelEntries(block.content)
    .map(parsePropSegment)
    .filter(Boolean);
}

export async function fetchComponentPropSchema(componentPath) {
  if (schemaCache.has(componentPath)) {
    return schemaCache.get(componentPath);
  }

  const { content } = await fetchFile(componentPath);
  const schema = parsePropsFromVueSource(content);
  schemaCache.set(componentPath, schema);
  return schema;
}

export function invalidateComponentPropSchema(componentPath) {
  if (componentPath) {
    schemaCache.delete(componentPath);
  } else {
    schemaCache.clear();
  }
}

export function mergePropValues(schema, currentProps = {}) {
  const fields = schema.map((def) => ({
    ...def,
    value:
      currentProps[def.name] !== undefined
        ? currentProps[def.name]
        : def.default !== undefined
          ? def.default
          : def.type === "Boolean"
            ? false
            : "",
  }));

  Object.entries(currentProps).forEach(([name, value]) => {
    if (!schema.some((def) => def.name === name)) {
      fields.push({
        name,
        type: typeof value === "boolean" ? "Boolean" : typeof value === "number" ? "Number" : "String",
        default: value,
        options: null,
        value,
        custom: true,
      });
    }
  });

  return fields;
}

export function fieldsToPropsObject(fields) {
  const props = {};
  fields.forEach((field) => {
    if (!field.name) return;
    if (field.type === "Boolean") {
      props[field.name] = Boolean(field.value);
      return;
    }
    if (field.type === "Number") {
      const num = Number(field.value);
      props[field.name] = Number.isNaN(num) ? field.value : num;
      return;
    }
    props[field.name] = field.value ?? "";
  });
  return props;
}

export function formatPropLabel(name) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}
