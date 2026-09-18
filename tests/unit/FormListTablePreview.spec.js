const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadComponentOptions(relativePath, { processMakerUser = {}, processmakerUser = {} } = {}) {
  const componentPath = path.join(process.cwd(), relativePath);
  const source = fs.readFileSync(componentPath, "utf8");
  const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/);

  if (!scriptMatch) {
    throw new Error(`Unable to find script block in ${relativePath}`);
  }

  const executableScript = scriptMatch[1]
    .replace(/^import .*$/gm, "")
    .replace("export default", "module.exports =");

  const processMaker = {
    app: { url: "https://example.test" },
    user: processMakerUser,
    apiClient: {
      get: jest.fn(() =>
        Promise.resolve({ data: { data: [], meta: { total: 0 } } })
      )
    }
  };
  const processmaker = {
    user: processmakerUser
  };

  const sandboxWindow = {
    ProcessMaker: processMaker,
    Processmaker: processmaker,
    open: jest.fn()
  };

  const sandbox = {
    module: { exports: {} },
    exports: {},
    window: sandboxWindow,
    ProcessMaker: processMaker,
    Processmaker: processmaker,
    Vue: {
      nextTick: (callback) => callback()
    },
    createUniqIdsMixin: () => ({}),
    datatableMixin: {},
    formEmpty: {},
    FormTasks: {},
    FormRequests: {},
    FormNewRequest: {},
    console,
    Promise,
    setTimeout,
    clearTimeout
  };

  vm.runInNewContext(executableScript, sandbox, { filename: componentPath });

  return {
    component: sandbox.module.exports,
    sandbox
  };
}

describe("FormListTable preview resilience", () => {
  test("openExternalLink does not open about:blank when url is missing", () => {
    const { component: FormListTable, sandbox } = loadComponentOptions(
      "src/components/renderer/form-list-table.vue"
    );

    FormListTable.methods.openExternalLink.call({
      dataControl: {}
    });

    expect(sandbox.window.open).not.toHaveBeenCalled();
  });

  test("openExternalLink opens the cases route when url is present", () => {
    const { component: FormListTable, sandbox } = loadComponentOptions(
      "src/components/renderer/form-list-table.vue"
    );

    FormListTable.methods.openExternalLink.call({
      dataControl: { url: "/cases" }
    });

    expect(sandbox.window.open).toHaveBeenCalledWith("/cases", "_blank");
  });
});

describe("FormRequests preview resilience", () => {
  test("emitDataControls always includes the /cases navigation url", () => {
    const { component: FormRequests } = loadComponentOptions(
      "src/components/renderer/form-requests.vue"
    );
    const emit = jest.fn();

    FormRequests.methods.emitDataControls.call({ $emit: emit }, 3);

    expect(emit).toHaveBeenCalledWith("requestsCount", {
      dataControls: expect.objectContaining({
        count: "3",
        url: "/cases",
        dropdownShow: "requests"
      }),
      tasksDropdown: []
    });
  });

  test("mounted emits /cases controls and skips fetch when username is missing", () => {
    const { component: FormRequests } = loadComponentOptions(
      "src/components/renderer/form-requests.vue"
    );
    const emit = jest.fn();
    const fetch = jest.fn();
    const context = {
      setupColumns: jest.fn(),
      fetch,
      showTable: true,
      currentUser: {},
      emitDataControls: FormRequests.methods.emitDataControls,
      $emit: emit,
      $root: { $on: jest.fn() }
    };

    FormRequests.mounted.call(context);

    expect(fetch).not.toHaveBeenCalled();
    expect(context.showTable).toBe(false);
    expect(emit).toHaveBeenCalledWith(
      "requestsCount",
      expect.objectContaining({
        dataControls: expect.objectContaining({ url: "/cases" })
      })
    );
  });

  test("mounted builds requester PMQL when username is available", () => {
    const { component: FormRequests } = loadComponentOptions(
      "src/components/renderer/form-requests.vue"
    );
    const fetch = jest.fn();
    const context = {
      setupColumns: jest.fn(),
      fetch,
      showTable: true,
      pmql: "",
      currentUser: { id: 7, username: "admin" },
      emitDataControls: FormRequests.methods.emitDataControls,
      $emit: jest.fn(),
      $root: { $on: jest.fn() }
    };

    FormRequests.mounted.call(context);

    expect(context.pmql).toBe('requester = "admin"');
    expect(fetch).toHaveBeenCalled();
  });

  test("currentUser merges Processmaker.user and ProcessMaker.user", () => {
    const { component: FormRequests, sandbox } = loadComponentOptions(
      "src/components/renderer/form-requests.vue",
      {
        processMakerUser: { id: 1, timezone: "UTC" },
        processmakerUser: { id: 2, username: "legacy" }
      }
    );

    const originalWindow = global.window;
    global.window = sandbox.window;
    try {
      expect(FormRequests.computed.currentUser()).toEqual({
        id: 1,
        username: "legacy",
        timezone: "UTC"
      });
    } finally {
      global.window = originalWindow;
    }
  });
});
