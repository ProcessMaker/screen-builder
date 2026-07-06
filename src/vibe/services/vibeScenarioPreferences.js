import { flattenProjectPaths } from "./vibeAiPrompt";

export const DEFAULT_SCENARIO_PATH = "tests/scenarios.yaml";
export const SCENARIO_FILE_PATTERN = /^tests\/.+\.ya?ml$/i;

export function isScenarioFilePath(filePath) {
  if (typeof filePath !== "string") return false;
  const normalized = filePath.replace(/^\.\//, "").replace(/\\/g, "/").trim();
  return SCENARIO_FILE_PATTERN.test(normalized);
}

export function loadScenarioPreferences() {
  try {
    const raw = localStorage.getItem("vibe-scenario-preferences");
    if (!raw) return { scenarioFilePath: DEFAULT_SCENARIO_PATH };
    const parsed = JSON.parse(raw);
    return {
      scenarioFilePath: isScenarioFilePath(parsed.scenarioFilePath)
        ? parsed.scenarioFilePath
        : DEFAULT_SCENARIO_PATH,
    };
  } catch {
    return { scenarioFilePath: DEFAULT_SCENARIO_PATH };
  }
}

export function saveScenarioPreferences({ scenarioFilePath }) {
  if (!isScenarioFilePath(scenarioFilePath)) return;
  localStorage.setItem(
    "vibe-scenario-preferences",
    JSON.stringify({ scenarioFilePath })
  );
}

export function listScenarioFilesFromTree(tree) {
  const paths = flattenProjectPaths(tree).filter(isScenarioFilePath);
  paths.sort((a, b) => a.localeCompare(b));
  const unique = [...new Set(paths)];
  if (!unique.includes(DEFAULT_SCENARIO_PATH)) {
    unique.unshift(DEFAULT_SCENARIO_PATH);
  }
  return unique;
}
