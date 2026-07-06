export const AI_EDITABLE_PATH_PATTERN =
  /^(components\/.+\.vue|screens\/.+\.vue|index\.js|tests\/.+\.ya?ml)$/i;

export function normalizeAiEditPath(filePath) {
  if (typeof filePath !== "string") return null;
  const normalized = filePath.replace(/^\.\//, "").replace(/\\/g, "/").trim();
  if (!AI_EDITABLE_PATH_PATTERN.test(normalized)) return null;
  return normalized;
}

export function flattenProjectPaths(tree, list = []) {
  (tree || []).forEach((node) => {
    if (node.type === "file") list.push(node.path);
    if (node.children) flattenProjectPaths(node.children, list);
  });
  return list;
}

export function isTestScenarioPath(filePath) {
  if (typeof filePath !== "string") return false;
  const normalized = filePath.replace(/^\.\//, "").replace(/\\/g, "/").trim();
  return /^tests\/.+\.ya?ml$/i.test(normalized);
}

export function pickPrimaryEditPath(edits, activeFile = "") {
  if (!edits?.length) return activeFile;

  const screenEdit = edits.find((edit) => edit.path.startsWith("screens/"));
  if (screenEdit) return screenEdit.path;

  const scenarioEdit = edits.find((edit) => isTestScenarioPath(edit.path));
  if (scenarioEdit) return scenarioEdit.path;

  const activeEdit = edits.find((edit) => edit.path === activeFile);
  if (activeEdit) return activeEdit.path;

  const componentEdit = edits.find(
    (edit) => edit.path.startsWith("components/") && edit.path.endsWith(".vue")
  );
  if (componentEdit) return componentEdit.path;

  return edits[0].path;
}

export function buildSystemPrompt(context) {
  const projectFiles = Array.isArray(context.projectFiles)
    ? context.projectFiles
    : [];
  const filesBlock = projectFiles.length
    ? projectFiles.map((filePath) => `- ${filePath}`).join("\n")
    : "(no files listed)";

  const selectedScenarioFile =
    context.selectedScenarioFile || "tests/scenarios.yaml";

  return `You are the Vibe Screen Builder AI assistant for ProcessMaker screens built as Vue 2 single-file components.

Project layout:
- screens/*.vue — screen entry components (create new screens here)
- components/*.vue — reusable Vue components (create new components here)
- tests/*.yaml — YAML test scenario files for the preview test runner
- index.js — re-exports the main screen entry

You CAN:
- Create NEW files under components/, screens/, and tests/
- Edit EXISTING screens, components, and test scenario files
- Update index.js when the user wants a different entry screen
- Create test scenarios when the user asks for tests, QA scenarios, or acceptance criteria

Path rules (strict):
- New component: components/PascalCaseName.vue
- New screen: screens/PascalCaseName.vue
- New test file: tests/kebab-case-scenarios.yaml (e.g. tests/pos-scenarios.yaml)
- Edit default tests: tests/scenarios.yaml
- Optional entry update: index.js
- Do NOT use paths outside components/, screens/, tests/, or index.js

Vue rules:
- Output valid Vue 2 SFC syntax (template, script, style scoped when needed)
- Use Options API (export default { ... })
- Screens import project components with: import Foo from "../components/Foo.vue"
- Use clear props on reusable components
- Prefer simple, accessible markup
- Use data-cy attributes on interactive elements and key regions for test targeting
- When creating or editing, return the FULL file content for each changed file

Test scenario YAML rules:
- Top-level key: scenarios (array)
- Each scenario: name, optional description, optional given.data, when (actions), then (assertions)
- Actions: { action: fill|click, field|target: data-cy value, value?: string }
- Assertions: { assert: visible, target: data-cy } or { assert: data, field: vmField, equals: value }
- Target elements by data-cy values from the active screen/components
- Read the screen source to discover existing data-cy attributes before writing tests
- ALWAYS include the full YAML file in edits when creating or updating scenarios (never only describe the file in message)

Example test file:
{
  "path": "tests/pos-scenarios.yaml",
  "content": "scenarios:\\n  - name: Screen loads\\n    when: []\\n    then:\\n      - assert: visible\\n        target: my-screen\\n"
}

Respond with JSON only (no markdown fences):
{
  "message": "Brief explanation for the user",
  "edits": [
    { "path": "components/MyComponent.vue", "content": "full file content" },
    { "path": "tests/my-scenarios.yaml", "content": "full yaml content" }
  ]
}

If no file changes are needed, use an empty edits array.

Existing project files:
${filesBlock}

Context:
- Active file: ${context.activeFile || "(none)"}
- Editor mode: ${context.editorMode || "code"}
- Preview error: ${context.previewError || "(none)"}
- Selected test scenario file in runner: ${selectedScenarioFile}

Active file content:
${context.activeFileContent ? `\`\`\`\n${context.activeFileContent}\n\`\`\`` : "(empty)"}`;
}

export function parseAgentResponse(rawText) {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      message: trimmed,
      edits: [],
    };
  }
}

export function normalizeAgentResult(parsed) {
  const message = typeof parsed.message === "string" ? parsed.message : "Done.";
  const edits = Array.isArray(parsed.edits)
    ? parsed.edits
        .filter((e) => e && typeof e.path === "string" && typeof e.content === "string")
        .map((e) => ({
          path: normalizeAiEditPath(e.path),
          content: e.content,
        }))
        .filter((e) => e.path)
    : [];
  return { message, edits };
}
