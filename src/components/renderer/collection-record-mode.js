export default function resolveCollectionMode(
  collectionMode,
  defaultMode = "Edit"
) {
  return collectionMode?.modeId ?? defaultMode;
}
