const fs = require('fs');
const path = require('path');
const vm = require('vm');

const componentPath = path.join(process.cwd(), 'src/components/task.vue');
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
      Cypress: true,
      location: { href: '' },
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

  return sandbox.module.exports;
}

describe('Task Web Entry redirects', () => {
  const Task = getComponentOptions();

  function nextTaskContext(task, isWebEntry = true) {
    return {
      requestId: 10,
      userId: 7,
      isWebEntry,
      redirecting: null,
      disabled: true,
      parentRequest: null,
      task: null,
      $dataProvider: {
        getTasks: jest.fn().mockResolvedValue({ data: { data: [task] } }),
      },
      $emit: jest.fn(),
      unsubscribeSocketListeners: jest.fn(),
      emitIfTaskCompleted: jest.fn(),
      loadTask: jest.fn(),
    };
  }

  test('emits the complete child task for Web Entry redirects', async () => {
    const task = {
      id: 44,
      process_request_id: 11,
      element_id: 'node_2',
      web_entry_available: true,
    };
    const context = nextTaskContext(task);

    await Task.methods.loadNextAssignedTask.call(context);

    expect(context.$emit).toHaveBeenCalledWith('redirect', task, true);
    expect(context.unsubscribeSocketListeners).toHaveBeenCalled();
    expect(context.loadTask).not.toHaveBeenCalled();
  });

  test('preserves the numeric redirect contract outside Web Entry', async () => {
    const task = {
      id: 44,
      process_request_id: 11,
      element_id: 'node_2',
    };
    const context = nextTaskContext(task, false);

    await Task.methods.loadNextAssignedTask.call(context);

    expect(context.$emit).toHaveBeenCalledWith('redirect', 44, true);
  });

  test('hard redirects a same-request task that is not Web Entry enabled', async () => {
    const task = {
      id: 45,
      process_request_id: 10,
      element_id: 'node_3',
      web_entry_available: false,
    };
    const context = nextTaskContext(task);

    await Task.methods.loadNextAssignedTask.call(context);

    expect(context.$emit).toHaveBeenCalledWith('redirect', task, true);
    expect(context.loadTask).not.toHaveBeenCalled();
  });

  test('resolves the complete task before handling a Web Entry socket redirect', async () => {
    const loadNextAssignedTask = jest.fn().mockResolvedValue();
    const context = {
      requestId: 10,
      userId: 7,
      isWebEntry: true,
      loadingTask: false,
      nodeId: 'node_1',
      taskId: 43,
      task: {
        allow_interstitial: true,
        elementDestination: { type: 'taskSource' },
      },
      renderComponent: 'task-screen',
      loadNextAssignedTask,
      reload: jest.fn(),
    };

    await Task.methods.handleRedirectToTask.call(context, {
      params: [{ tokenId: 44, userId: 7, nodeId: 'node_2' }],
    });

    expect(loadNextAssignedTask).toHaveBeenCalledWith(10);
    expect(context.nodeId).toBe('node_1');
    expect(context.taskId).toBe(43);
    expect(context.reload).not.toHaveBeenCalled();
  });

  test('ignores socket redirects intended for another user', async () => {
    const context = {
      requestId: 10,
      userId: 7,
      isWebEntry: true,
      loadingTask: false,
      task: {
        allow_interstitial: true,
        elementDestination: { type: null },
      },
      loadNextAssignedTask: jest.fn(),
      reload: jest.fn(),
    };

    await Task.methods.handleRedirectToTask.call(context, {
      params: [{ tokenId: 44, userId: 8, nodeId: 'node_2' }],
    });

    expect(context.loadNextAssignedTask).not.toHaveBeenCalled();
    expect(context.reload).not.toHaveBeenCalled();
  });
});
