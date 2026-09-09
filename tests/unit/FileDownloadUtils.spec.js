const fs = require("fs");
const path = require("path");
const vm = require("vm");

const componentPath = path.join(
  process.cwd(),
  "src/components/renderer/file-download.vue"
);

const source = fs.readFileSync(componentPath, "utf8");

function getComponentOptions() {
  const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/);

  if (!scriptMatch) {
    throw new Error("Unable to find file-download.vue script block");
  }

  const executableScript = scriptMatch[1]
    .replace(/^import .*$/gm, "")
    .replace("export default", "module.exports =");

  const sandbox = {
    module: { exports: {} },
    exports: {}
  };

  vm.runInNewContext(executableScript, sandbox, { filename: componentPath });

  return sandbox.module.exports;
}

describe("File Download Web Entry temporary files", () => {
  const FileDownload = getComponentOptions();
  const { isWebEntryTemporaryFileId } = FileDownload.methods;

  test("recognizes a Web Entry temporary file ID", () => {
    expect(isWebEntryTemporaryFileId("webentry_upload_123_document.pdf")).toBe(
      true
    );
  });

  test.each([123, "123", "request_file_123", null, undefined, {}, []])(
    "does not classify %p as a temporary file ID",
    (fileId) => {
      expect(isWebEntryTemporaryFileId(fileId)).toBe(false);
    }
  );
});
