let idCounter = 0;

export function createNodeId(prefix = "node") {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function componentNameFromPath(filePath) {
  const base = filePath.split("/").pop() || "Component";
  return base.replace(/\.vue$/i, "");
}

export function createContainerNode(tag = "div", attrs = {}) {
  return {
    id: createNodeId("container"),
    type: "container",
    tag,
    attrs: { ...attrs },
    children: [],
  };
}

export function createComponentNode(componentPath, props = {}) {
  const name = componentNameFromPath(componentPath);
  return {
    id: createNodeId("comp"),
    type: "component",
    componentPath,
    componentName: name,
    props: { ...props },
    children: [],
  };
}

export function createNodeFromPayload(payload) {
  if (payload?.kind === "container") {
    return createContainerNode(payload.tag || "div", payload.attrs || {});
  }
  if (payload?.kind === "component" && payload.path) {
    return createComponentNode(payload.path, {});
  }
  return null;
}

export function createScreenModel(screenPath, existing = null) {
  const screenName = componentNameFromPath(screenPath);
  if (existing) {
    return JSON.parse(JSON.stringify(existing));
  }
  return {
    screenPath,
    screenName,
    root: createContainerNode("div", {
      class: screenName.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "") || "screen",
      "data-cy": screenName.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "") || "screen",
    }),
    script: {
      name: screenName,
      data: {},
      methods: {},
    },
  };
}

export function findNode(root, nodeId) {
  if (root.id === nodeId) return { node: root, parent: null };
  return findNodeInChildren(root, nodeId, root);
}

function findNodeInChildren(node, nodeId, parent) {
  for (const child of node.children || []) {
    if (child.id === nodeId) return { node: child, parent: node };
    const found = findNodeInChildren(child, nodeId, node);
    if (found) return found;
  }
  return null;
}

export function addNode(model, parentId, node) {
  const parent = parentId === model.root.id
    ? model.root
    : findNode(model.root, parentId)?.node;
  if (!parent) return null;
  if (!parent.children) parent.children = [];
  parent.children.push(node);
  return node;
}

export function insertNode(model, parentId, node, index) {
  const parent =
    parentId === model.root.id
      ? model.root
      : findNode(model.root, parentId)?.node;
  if (!parent) return null;
  if (!parent.children) parent.children = [];

  const insertIndex = Math.max(
    0,
    Math.min(index ?? parent.children.length, parent.children.length)
  );
  parent.children.splice(insertIndex, 0, node);
  return node;
}

export function removeNode(model, nodeId) {
  if (nodeId === model.root.id) return false;
  const result = findNode(model.root, nodeId);
  if (!result?.parent) return false;
  const idx = result.parent.children.findIndex((c) => c.id === nodeId);
  if (idx === -1) return false;
  result.parent.children.splice(idx, 1);
  return true;
}

export function isNodeDescendant(root, ancestorId, nodeId) {
  const ancestor = ancestorId === root.id ? root : findNode(root, ancestorId)?.node;
  if (!ancestor) return false;
  if (ancestor.id === nodeId) return true;

  const walk = (node) => {
    if (node.id === nodeId) return true;
    return (node.children || []).some(walk);
  };

  return (ancestor.children || []).some(walk);
}

export function moveNode(model, nodeId, targetParentId, targetIndex = null) {
  if (nodeId === model.root.id) return false;

  const source = findNode(model.root, nodeId);
  if (!source?.parent) return false;

  const targetParent =
    targetParentId === model.root.id
      ? model.root
      : findNode(model.root, targetParentId)?.node;
  if (!targetParent) return false;

  if (isNodeDescendant(model.root, nodeId, targetParentId)) {
    return false;
  }

  const fromIndex = source.parent.children.findIndex((child) => child.id === nodeId);
  if (fromIndex === -1) return false;

  const [node] = source.parent.children.splice(fromIndex, 1);
  if (!targetParent.children) targetParent.children = [];

  let insertIndex =
    targetIndex === null || targetIndex === undefined
      ? targetParent.children.length
      : targetIndex;

  if (source.parent === targetParent && fromIndex < insertIndex) {
    insertIndex -= 1;
  }

  insertIndex = Math.max(0, Math.min(insertIndex, targetParent.children.length));
  targetParent.children.splice(insertIndex, 0, node);
  return true;
}

function cloneNodeTree(node) {
  const prefix = node.type === "component" ? "comp" : "container";
  const cloned = {
    ...JSON.parse(JSON.stringify(node)),
    id: createNodeId(prefix),
  };
  if (cloned.children?.length) {
    cloned.children = cloned.children.map(cloneNodeTree);
  }
  return cloned;
}

export function duplicateNode(model, nodeId) {
  if (nodeId === model.root.id) return null;

  const result = findNode(model.root, nodeId);
  if (!result?.parent) return null;

  const clone = cloneNodeTree(result.node);
  const siblings = result.parent.children;
  const fromIndex = siblings.findIndex((child) => child.id === nodeId);
  siblings.splice(fromIndex + 1, 0, clone);
  return clone;
}

export function updateNodeProps(model, nodeId, props) {
  const result = findNode(model.root, nodeId);
  if (!result) return false;
  result.node.props = { ...props };
  return true;
}

export function updateNodeAttrs(model, nodeId, attrs) {
  const result = findNode(model.root, nodeId);
  if (!result || result.node.type !== "container") return false;
  result.node.attrs = { ...attrs };
  return true;
}

export function collectComponentImports(root, imports = new Map()) {
  if (root.type === "component" && root.componentPath) {
    imports.set(root.componentName, root.componentPath);
  }
  (root.children || []).forEach((child) => collectComponentImports(child, imports));
  return imports;
}

export function flattenPaletteComponents(tree, list = []) {
  tree.forEach((node) => {
    if (node.type === "file" && node.path.toLowerCase().endsWith(".vue")) {
      if (node.path.startsWith("components/") || node.path.includes("/components/")) {
        list.push({
          path: node.path,
          name: componentNameFromPath(node.path),
        });
      }
    }
    if (node.children) flattenPaletteComponents(node.children, list);
  });
  return list;
}
