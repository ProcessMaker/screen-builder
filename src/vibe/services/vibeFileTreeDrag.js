export const VIBE_FILE_TREE_DRAG = "application/vibe-file-tree";

export function setFileTreeDragData(event, node) {
  event.dataTransfer.setData(
    VIBE_FILE_TREE_DRAG,
    JSON.stringify({
      path: node.path,
      type: node.type,
    })
  );
  event.dataTransfer.effectAllowed = "move";
}

export function parseFileTreeDragData(event) {
  const raw = event.dataTransfer?.getData(VIBE_FILE_TREE_DRAG);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isFileTreeMoveDrag(event) {
  return !!parseFileTreeDragData(event);
}
