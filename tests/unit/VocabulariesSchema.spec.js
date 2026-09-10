const fs = require("fs");
const path = require("path");
const vm = require("vm");

const mixinPath = path.join(process.cwd(), "src/mixins/ScreenBase.js");

const source = fs.readFileSync(mixinPath, "utf8");

function getScreenBaseOptions() {
  const executableScript = source
    .replace(/^import .*$/gm, "")
    .replace("export default", "module.exports =");

  const sandbox = {
    module: { exports: {} },
    exports: {},
    window: {
      ProcessMaker: {}
    },
    DataReference: {},
    VariablesToSubmitFilter: {},
    computedFields: {},
    ValidationMsg: {},
    Mustache: { render: jest.fn() },
    get: jest.fn(),
    isEqual: jest.fn(),
    set: jest.fn(),
    debounce: jest.fn(),
    findRootScreen: jest.fn(),
    mapActions: jest.fn(() => ({})),
    mapGetters: jest.fn(() => ({})),
    mapState: jest.fn(() => ({}))
  };

  vm.runInNewContext(executableScript, sandbox, { filename: mixinPath });

  return {
    screenBase: sandbox.module.exports,
    sandbox
  };
}

describe("Vocabularies schema cache", () => {
  const { screenBase: ScreenBase, sandbox } = getScreenBaseOptions();
  const getVocabulariesSchema = ScreenBase.schema[0];

  beforeEach(() => {
    sandbox.window.ProcessMaker = {
      packages: ["package-vocabularies"],
      VocabulariesSchemaUrl: "vocabularies/task_schema/123",
      apiClient: {
        get: jest.fn()
      }
    };
  });

  test("shares one in-flight vocabulary schema request for the current task", async () => {
    const schema = { properties: { course: { type: "string" } } };
    let resolveRequest;
    const request = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    sandbox.window.ProcessMaker.apiClient.get.mockReturnValue(request);

    const firstSchema = getVocabulariesSchema();
    const secondSchema = getVocabulariesSchema();

    expect(secondSchema).toBe(firstSchema);
    expect(sandbox.window.ProcessMaker.apiClient.get).toHaveBeenCalledTimes(1);
    expect(sandbox.window.ProcessMaker.apiClient.get).toHaveBeenCalledWith(
      "vocabularies/task_schema/123"
    );

    resolveRequest({ data: schema });
    await expect(firstSchema).resolves.toBe(schema);

    expect(getVocabulariesSchema()).toBe(schema);
    expect(sandbox.window.ProcessMaker.apiClient.get).toHaveBeenCalledTimes(1);
  });

  test("loads a new vocabulary schema once when the task URL changes", async () => {
    const firstSchema = { task: 123 };
    const secondSchema = { task: 456 };

    sandbox.window.ProcessMaker.apiClient.get
      .mockResolvedValueOnce({ data: firstSchema })
      .mockResolvedValueOnce({ data: secondSchema });

    await expect(getVocabulariesSchema()).resolves.toBe(firstSchema);

    sandbox.window.ProcessMaker.VocabulariesSchemaUrl =
      "vocabularies/task_schema/456";

    await expect(getVocabulariesSchema()).resolves.toBe(secondSchema);

    expect(sandbox.window.ProcessMaker.apiClient.get).toHaveBeenCalledTimes(2);
    expect(sandbox.window.ProcessMaker.apiClient.get).toHaveBeenNthCalledWith(
      1,
      "vocabularies/task_schema/123"
    );
    expect(sandbox.window.ProcessMaker.apiClient.get).toHaveBeenNthCalledWith(
      2,
      "vocabularies/task_schema/456"
    );
    expect(getVocabulariesSchema()).toBe(secondSchema);
  });

  test("does not let a stale task response overwrite the current schema cache", async () => {
    let resolveFirstRequest;
    const firstRequest = new Promise((resolve) => {
      resolveFirstRequest = resolve;
    });
    const secondSchema = { task: 456 };

    sandbox.window.ProcessMaker.apiClient.get
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValueOnce({ data: secondSchema });

    const firstSchema = getVocabulariesSchema();

    sandbox.window.ProcessMaker.VocabulariesSchemaUrl =
      "vocabularies/task_schema/456";
    sandbox.window.ProcessMaker.VocabulariesSchemaCache = null;

    await expect(getVocabulariesSchema()).resolves.toBe(secondSchema);

    resolveFirstRequest({ data: { task: 123 } });
    await expect(firstSchema).resolves.toEqual({ task: 123 });

    expect(sandbox.window.ProcessMaker.VocabulariesSchemaCache).toEqual({
      url: "vocabularies/task_schema/456",
      data: secondSchema
    });
  });
});
