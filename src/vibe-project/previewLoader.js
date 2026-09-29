/**
 * Webpack entry: bundles all .vue files via require.context and exposes
 * a runtime loader for per-file preview in ProcessMaker.
 */
const vueModules = require.context("./", true, /\.vue$/);

function normalizeKey(relativePath) {
  return `./${String(relativePath).replace(/^\.\//, "")}`;
}

function loadVueFile(relativePath) {
  const key = normalizeKey(relativePath);
  if (!vueModules.keys().includes(key)) {
    throw new Error(`Vue component not found: ${relativePath}`);
  }
  const mod = vueModules(key);
  return mod.default || mod;
}

function loadEntry() {
  const indexModule = require("./index.js");
  return indexModule.default || indexModule;
}

const loader = {
  loadVueFile(relativePath) {
    return Promise.resolve(loadVueFile(relativePath));
  },
  loadEntry() {
    return Promise.resolve(loadEntry());
  },
};

if (typeof window !== "undefined") {
  window.__vibeProjectLoader = loader;
}

export default loader;
export { loadVueFile, loadEntry };
