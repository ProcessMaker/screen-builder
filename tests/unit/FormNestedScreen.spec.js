const fs = require('fs');
const path = require('path');
const vm = require('vm');

const componentPath = path.join(
  process.cwd(),
  'src/components/renderer/form-nested-screen.vue',
);

const source = fs.readFileSync(componentPath, 'utf8');

function getComponentOptions() {
  const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/);

  if (!scriptMatch) {
    throw new Error('Unable to find form-nested-screen.vue script block');
  }

  const executableScript = scriptMatch[1]
    .replace(/^import .*$/gm, '')
    .replace('export default', 'module.exports =');

  const sandbox = {
    module: { exports: {} },
    exports: {},
    window: {},
    global: {},
    VueFormRenderer: {},
    Promise,
    setTimeout,
    clearTimeout,
    console,
  };

  vm.runInNewContext(executableScript, sandbox, { filename: componentPath });

  return sandbox.module.exports;
}

const FormNestedScreen = getComponentOptions();

const makeContext = (parents) => {
  let parent = null;

  [...parents].reverse().forEach((options) => {
    parent = { $options: options, $parent: parent };
  });

  return { $parent: parent };
};

describe('FormNestedScreen design mode watchers', () => {
  test('detects vue-form-builder tag in parent chain', () => {
    const context = makeContext([
      { _componentTag: 'div' },
      { _componentTag: 'vue-form-builder' },
    ]);

    expect(FormNestedScreen.methods.isInScreenBuilder.call(context)).toBe(true);
  });

  test('detects VueFormBuilder tag in parent chain', () => {
    const context = makeContext([
      { _componentTag: 'VueFormBuilder' },
    ]);

    expect(FormNestedScreen.methods.isInScreenBuilder.call(context)).toBe(true);
  });

  test('detects VueFormBuilder name in parent chain', () => {
    const context = makeContext([
      { _componentTag: 'div', name: 'VueFormBuilder' },
    ]);

    expect(FormNestedScreen.methods.isInScreenBuilder.call(context)).toBe(true);
  });

  test('returns false outside screen builder', () => {
    const context = makeContext([
      { _componentTag: 'screen-renderer' },
    ]);

    expect(FormNestedScreen.methods.isInScreenBuilder.call(context)).toBe(false);
  });

  test('detects screen builder through deeply nested screens', () => {
    const context = makeContext([
      { _componentTag: 'vue-form-renderer' },
      { _componentTag: 'FormNestedScreen' },
      { _componentTag: 'vue-form-renderer' },
      { _componentTag: 'FormNestedScreen' },
      { _componentTag: 'vue-form-builder', name: 'VueFormBuilder' },
    ]);

    expect(FormNestedScreen.methods.isInScreenBuilder.call(context)).toBe(true);
  });

  test('does not treat preview renderer as screen builder', () => {
    const context = makeContext([
      { _componentTag: 'vue-form-renderer' },
      { _componentTag: 'b-col' },
      { _componentTag: 'b-row' },
    ]);

    expect(FormNestedScreen.methods.isInScreenBuilder.call(context)).toBe(false);
  });

  test('does not load watchers when rendered inside screen builder', async () => {
    const watchers = [{ uid: 'watcher-1', run_onload: true }];
    const context = Object.assign(
      makeContext([{ _componentTag: 'vue-form-builder' }]),
      FormNestedScreen.methods,
      {
        config: [],
        computed: [],
        customCSS: null,
        watchers: [],
        screenTitle: null,
        ancestorScreens: [],
        $attrs: {},
        $root: { $emit: jest.fn() },
        $dataProvider: {
          getScreen: jest.fn().mockResolvedValue({
            data: {
              config: [{ name: 'Page 1', items: [] }],
              computed: [],
              custom_css: '',
              watchers,
              title: 'Nested Screen',
            },
          }),
        },
      },
    );

    await FormNestedScreen.methods.loadScreen.call(context, 1);

    expect(context.watchers).toEqual([]);
  });

  test('loads watchers in preview/runtime context', async () => {
    const watchers = [{ uid: 'watcher-1', run_onload: true }];
    const context = Object.assign(
      makeContext([{ _componentTag: 'screen-renderer' }]),
      FormNestedScreen.methods,
      {
        config: [],
        computed: [],
        customCSS: null,
        watchers: [],
        screenTitle: null,
        ancestorScreens: [],
        $attrs: {},
        $root: { $emit: jest.fn() },
        $dataProvider: {
          getScreen: jest.fn().mockResolvedValue({
            data: {
              config: [{ name: 'Page 1', items: [] }],
              computed: [],
              custom_css: '',
              watchers,
              title: 'Nested Screen',
            },
          }),
        },
      },
    );

    await FormNestedScreen.methods.loadScreen.call(context, 1);

    expect(context.watchers).toEqual(watchers);
  });
});
