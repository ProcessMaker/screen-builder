const fs = require('fs');
const path = require('path');
const vm = require('vm');

const componentPath = path.join(process.cwd(), 'src/components/task.vue');
const source = fs.readFileSync(componentPath, 'utf8');
let browserWindow;

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
  browserWindow = sandbox.window;

  return sandbox.module.exports;
}

describe('Task Web Entry redirects', () => {
  const Task = getComponentOptions();

  function nextTaskContext(task, isWebEntry = true) {
    const tasks = Array.isArray(task) ? task : [task];
    return {
      requestId: 10,
      userId: 7,
      isWebEntry,
      redirecting: null,
      disabled: true,
      parentRequest: null,
      task: null,
      $dataProvider: {
        getTasks: jest.fn().mockResolvedValue({ data: { data: tasks } }),
      },
      $emit: jest.fn(),
      unsubscribeSocketListeners: jest.fn(),
      emitIfTaskCompleted: jest.fn(),
      loadTask: jest.fn(),
    };
  }

  beforeEach(() => {
    browserWindow.location.href = '';
  });

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

  test('selects the task identified by the socket token', async () => {
    const otherTask = {
      id: 43,
      process_request_id: 12,
      element_id: 'node_other',
      web_entry_available: true,
    };
    const targetTask = {
      id: 44,
      process_request_id: 11,
      element_id: 'node_target',
      web_entry_available: true,
    };
    const context = nextTaskContext([otherTask, targetTask]);

    const handled = await Task.methods.loadNextAssignedTask.call(context, 10, '44');

    expect(handled).toBe(true);
    expect(context.$dataProvider.getTasks).toHaveBeenCalledWith(
      expect.stringContaining('&task_id=44')
    );
    expect(context.$emit).toHaveBeenCalledWith('redirect', targetTask, true);
  });

  test('retries successful lookups that do not resolve the target task', async () => {
    const apiCall = jest.fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const handled = await Task.methods.retryApiCall(
      apiCall,
      3,
      0,
      (result) => result !== true
    );

    expect(handled).toBe(true);
    expect(apiCall).toHaveBeenCalledTimes(3);
  });

  test('retries rejected target task lookups', async () => {
    const apiCall = jest.fn()
      .mockRejectedValueOnce(new Error('Not ready'))
      .mockRejectedValueOnce(new Error('Not ready'))
      .mockResolvedValueOnce(true);

    const handled = await Task.methods.retryApiCall(apiCall, 3, 0);

    expect(handled).toBe(true);
    expect(apiCall).toHaveBeenCalledTimes(3);
  });

  test('resolves the complete task before handling a Web Entry socket redirect', async () => {
    const loadNextAssignedTask = jest.fn().mockResolvedValue(true);
    const retryApiCall = jest.fn((apiCall) => apiCall());
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
      retryApiCall,
      reload: jest.fn(),
    };
    context.handleWebEntryTaskRedirect = Task.methods.handleWebEntryTaskRedirect.bind(context);

    await Task.methods.handleRedirectToTask.call(context, {
      params: [{ tokenId: 44, userId: 7, nodeId: 'node_2' }],
    });

    expect(loadNextAssignedTask).toHaveBeenCalledWith(10, 44);
    expect(retryApiCall).toHaveBeenCalled();
    expect(context.nodeId).toBe('node_1');
    expect(context.taskId).toBe(43);
    expect(context.reload).not.toHaveBeenCalled();
  });

  test('uses the event fallback and clears loading when the target remains unavailable', async () => {
    const context = {
      requestId: 10,
      userId: 7,
      isWebEntry: true,
      loadingTask: false,
      disabled: true,
      task: {
        allow_interstitial: true,
        elementDestination: { type: 'taskSource' },
      },
      renderComponent: 'task-screen',
      loadNextAssignedTask: jest.fn(),
      retryApiCall: jest.fn().mockResolvedValue(false),
      reload: jest.fn(),
    };
    context.handleWebEntryTaskRedirect = Task.methods.handleWebEntryTaskRedirect.bind(context);

    await Task.methods.handleRedirectToTask.call(context, {
      params: [{
        tokenId: 44,
        userId: 7,
        nodeId: 'node_2',
        payloadUrl: '/requests/11',
      }],
    });

    expect(browserWindow.location.href).toBe('/requests/11');
    expect(context.loadingTask).toBe(false);
    expect(context.disabled).toBe(false);
  });

  test('falls back to the exact task URL after a lookup error', async () => {
    const context = {
      requestId: 10,
      userId: 7,
      isWebEntry: true,
      loadingTask: false,
      disabled: true,
      task: {
        allow_interstitial: true,
        elementDestination: { type: 'taskSource' },
      },
      renderComponent: 'task-screen',
      loadNextAssignedTask: jest.fn(),
      retryApiCall: jest.fn().mockRejectedValue(new Error('Network error')),
      reload: jest.fn(),
    };
    context.handleWebEntryTaskRedirect = Task.methods.handleWebEntryTaskRedirect.bind(context);

    await Task.methods.handleRedirectToTask.call(context, {
      params: [{ tokenId: 44, userId: 7, nodeId: 'node_2' }],
    });

    expect(browserWindow.location.href).toBe('/tasks/44/edit');
    expect(context.loadingTask).toBe(false);
    expect(context.disabled).toBe(false);
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
