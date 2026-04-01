const fs = require('fs');
const path = require('path');
const vm = require('vm');

const componentPath = path.join(
  process.cwd(),
  'src/components/task.vue',
);

const source = fs.readFileSync(componentPath, 'utf8');

function getComponentOptions() {
  const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/);

  if (!scriptMatch) {
    throw new Error('Unable to find task.vue script block');
  }

  const executableScript = scriptMatch[1]
    .replace(/^import .*$/gm, '')
    .replace('export default', 'module.exports =');

  const sandbox = {
    module: { exports: {} },
    exports: {},
    window: {
      ProcessMaker: {},
    },
    VueFormRenderer: {},
    simpleErrorMessage: {},
    Promise,
    setTimeout,
    clearTimeout,
    console,
    _: {
      get: (target, accessor, defaultValue = null) => {
        if (!target || !accessor) {
          return defaultValue;
        }

        return accessor.split('.').reduce((value, key) => {
          if (value === undefined || value === null) {
            return undefined;
          }

          return value[key];
        }, target) ?? defaultValue;
      },
      merge: (...args) => Object.assign({}, ...args),
    },
  };

  vm.runInNewContext(executableScript, sandbox, { filename: componentPath });

  return {
    component: sandbox.module.exports,
    sandbox,
  };
}

describe('Task self-service lock', () => {
  const { component: Task, sandbox } = getComponentOptions();

  test('resolveSelfService uses the loaded task when available', () => {
    const result = Task.methods.resolveSelfService.call({
      task: {
        process_request: { status: 'ACTIVE' },
        is_self_service: 1,
      },
    });

    expect(result).toBe(true);
  });

  test('setSelfService prefers the current task over the initial window flag', () => {
    const context = {
      task: {
        process_request: { status: 'ACTIVE' },
        is_self_service: 1,
      },
      isSelfService: false,
      resolveSelfService: Task.methods.resolveSelfService,
      $nextTick: (callback) => callback(),
    };

    sandbox.window.ProcessMaker = {
      isSelfService: false,
    };

    Task.methods.setSelfService.call(context, context.task);

    expect(context.isSelfService).toBe(true);
  });

  test('checkTaskStatus refreshes self-service state before rendering the task screen', () => {
    const setSelfService = jest.fn();
    const prepareTask = jest.fn();
    const closeTask = jest.fn();
    const screen = { config: [] };
    const context = {
      task: {
        status: 'ACTIVE',
        screen,
      },
      screen: null,
      setSelfService,
      prepareTask,
      closeTask,
    };

    Task.methods.checkTaskStatus.call(context);

    expect(setSelfService).toHaveBeenCalledWith(context.task);
    expect(context.screen).toBe(screen);
    expect(prepareTask).toHaveBeenCalled();
    expect(closeTask).not.toHaveBeenCalled();
  });

  test('loadTask refreshes self-service state as soon as task data arrives', async () => {
    const task = {
      id: 223,
      process_request: { status: 'ACTIVE' },
      is_self_service: 1,
      screen: { config: [] },
    };
    const setSelfService = jest.fn();
    const linkTask = jest.fn();
    const checkTaskStatus = jest.fn();
    const getTasks = jest.fn().mockResolvedValue({ data: task });
    const context = {
      taskId: 223,
      nodeId: 'node_1',
      screenVersion: null,
      beforeLoadTask: jest.fn().mockResolvedValue(),
      $dataProvider: { getTasks },
      setSelfService,
      linkTask,
      checkTaskStatus,
      loadingTask: true,
      hasErrors: false,
    };

    await Task.methods.loadTask.call(context, false);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getTasks).toHaveBeenCalled();
    expect(context.task).toBe(task);
    expect(setSelfService).toHaveBeenCalledWith(task);
    expect(linkTask).toHaveBeenCalledWith(false);
    expect(checkTaskStatus).toHaveBeenCalled();
    expect(context.loadingTask).toBe(false);
  });
});
