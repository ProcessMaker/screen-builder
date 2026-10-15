import JSZip from "jszip";
import { exportProject, importProject } from "./vibeProjectApi";

export async function exportProjectAsZip() {
  const { files } = await exportProject();
  const zip = new JSZip();

  files.forEach(({ path, content }) => {
    zip.file(path, content);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vibe-project.zip";
  link.click();
  URL.revokeObjectURL(url);
}

export async function importProjectFromZip(file) {
  const zip = await JSZip.loadAsync(file);
  const files = [];

  const entries = Object.keys(zip.files).filter(
    (name) => !zip.files[name].dir && !name.startsWith("__MACOSX")
  );

  await Promise.all(
    entries.map(async (name) => {
      const content = await zip.files[name].async("string");
      files.push({ path: name, content });
    })
  );

  if (files.length === 0) {
    throw new Error("ZIP file contains no files");
  }

  const hasIndex = files.some((f) => f.path === "index.js" || f.path.endsWith("/index.js"));
  const hasVueScreen = files.some((f) => f.path.includes("screens/") && f.path.endsWith(".vue"));

  if (!hasIndex && !hasVueScreen) {
    throw new Error("ZIP must contain index.js and at least one .vue file in screens/");
  }

  await importProject(files);
  return files.length;
}
