import { componentNameFromPath } from "./vibeScreenModel";

export const VIBE_SHEET_DRAG = "application/vibe-sheet-node";

export const SHEET_LAYOUT_ITEMS = [
  {
    id: "section",
    label: "Section",
    payload: { kind: "container", tag: "section", attrs: { class: "screen-section" } },
  },
  {
    id: "form",
    label: "Form",
    payload: { kind: "container", tag: "form", attrs: { class: "screen-form" } },
  },
  {
    id: "div",
    label: "Container",
    payload: { kind: "container", tag: "div", attrs: { class: "screen-block" } },
  },
];

export function isSheetDraggableComponent(filePath) {
  if (typeof filePath !== "string") return false;
  return filePath.startsWith("components/") && /\.vue$/i.test(filePath);
}

export function buildComponentDragPayload(filePath) {
  return {
    kind: "component",
    path: filePath,
    name: componentNameFromPath(filePath),
  };
}

export function setSheetDragData(event, payload) {
  event.dataTransfer.setData(VIBE_SHEET_DRAG, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = payload?.kind === "move" ? "move" : "copy";
}

export function setSheetMoveDragData(event, nodeId) {
  setSheetDragData(event, { kind: "move", nodeId });
}

export function parseSheetDragPayload(event) {
  const raw = event.dataTransfer?.getData(VIBE_SHEET_DRAG);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
