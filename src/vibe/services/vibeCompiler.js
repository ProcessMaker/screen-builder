import { compileEntryFromProject, compileVueSfcFromProject } from "./vibeSfcRuntime";

function isVueFile(filePath) {
  return typeof filePath === "string" && filePath.toLowerCase().endsWith(".vue");
}

async function compileTarget(filePath, sourceContent = null) {
  try {
    const component = filePath
      ? await compileVueSfcFromProject(filePath, sourceContent)
      : await compileEntryFromProject();

    if (!component) {
      throw new Error(
        filePath
          ? `${filePath} must export a default Vue component`
          : "vibe-project/index.js must export a default Vue component"
      );
    }

    return { component, error: null };
  } catch (err) {
    return {
      component: null,
      error: err.message || String(err),
    };
  }
}

export async function compileEntry() {
  return compileTarget(null);
}

export async function compileVueFile(filePath, sourceContent = null) {
  if (!isVueFile(filePath)) {
    return {
      component: null,
      error: "Only .vue files can be previewed",
    };
  }
  return compileTarget(filePath, sourceContent);
}

export function invalidatePreview() {
  // Runtime compilation always reads fresh file content from the API.
}
