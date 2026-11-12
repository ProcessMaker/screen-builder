/* eslint-disable import/no-extraneous-dependencies */
import { expect, within, userEvent } from '@storybook/test';
import '../bootstrap';
import VueRenderTemplate from '../components/renderer/vueRender/VueRenderTemplate';
import VueRenderEditor from '../components/renderer/vueRender/VueRenderEditor.vue';
import VueRenderPreview from '../components/renderer/vueRender/VueRenderPreview.vue';

const defaultHandler = 'return {}';

export default {
  title: 'Components/VueRender',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export const TemplateWithCustomMarkup = {
  name: 'VueRenderTemplate / custom template',
  render: () => ({
    components: { VueRenderTemplate },
    template: `
      <vue-render-template
        :template-vue="templateVue"
        :handler-vue="handlerVue"
      />
    `,
    data() {
      return {
        templateVue: '<p data-test="vue-render-message">Hello from templateVue</p>',
        handlerVue: defaultHandler,
      };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('vue-render-message')).toHaveTextContent('Hello from templateVue');
  },
};

export const TemplateWithHandlerMethod = {
  name: 'VueRenderTemplate / handlerVue methods',
  render: () => ({
    components: { VueRenderTemplate },
    template: `
      <vue-render-template
        :template-vue="templateVue"
        :handler-vue="handlerVue"
        :validation-data="validationData"
      />
    `,
    data() {
      return {
        validationData: {},
        templateVue: `
          <div>
            <button type="button" data-test="vue-render-action" @click="onAction">Run</button>
            <span data-test="vue-render-result">{{ result }}</span>
          </div>
        `,
        handlerVue: `
          return {
            data() { return { result: '' }; },
            methods: {
              onAction() { this.result = 'done'; }
            }
          };
        `,
      };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('vue-render-action'));
    await expect(canvas.getByTestId('vue-render-result')).toHaveTextContent('done');
  },
};

export const TemplateHandlerError = {
  name: 'VueRenderTemplate / invalid handlerVue',
  render: () => ({
    components: { VueRenderTemplate },
    template: `
      <vue-render-template
        template-vue="<div></div>"
        handler-vue="return null"
      />
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent(/plain object/i);
  },
};

export const TemplateFieldError = {
  name: 'VueRenderTemplate / error prop',
  render: () => ({
    components: { VueRenderTemplate },
    template: `
      <vue-render-template
        template-vue="<div></div>"
        :handler-vue="handlerVue"
        error="Field error"
      />
    `,
    data() {
      return { handlerVue: defaultHandler };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Field error');
  },
};

export const TemplateWithHelper = {
  name: 'VueRenderTemplate / helper',
  render: () => ({
    components: { VueRenderTemplate },
    template: `
      <vue-render-template
        template-vue="<div></div>"
        :handler-vue="handlerVue"
        helper="Help text"
      />
    `,
    data() {
      return { handlerVue: defaultHandler };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Help text')).toBeInTheDocument();
  },
};

export const TemplateNamedFieldSync = {
  name: 'VueRenderTemplate / named field data',
  render: () => ({
    components: { VueRenderTemplate },
    template: `
      <vue-render-template
        name="myField"
        :value="value"
        :validation-data="validationData"
        :template-vue="templateVue"
        :handler-vue="handlerVue"
        @input="onInput"
      />
    `,
    data() {
      return {
        value: 'a',
        validationData: { myField: 'a' },
        templateVue: '<div data-test="vue-render-field">{{ data.myField }}</div>',
        handlerVue: defaultHandler,
        lastInput: null,
      };
    },
    methods: {
      onInput(next) {
        this.lastInput = next;
      },
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('vue-render-field')).toHaveTextContent('a');
  },
};

export const EditorDefault = {
  name: 'VueRenderEditor / design canvas',
  render: () => ({
    components: { VueRenderEditor },
    template: `
      <div data-test="vue-render-editor-root">
        <vue-render-editor
          :template-vue="templateVue"
          :handler-vue="handlerVue"
          :validation-data="validationData"
        />
      </div>
    `,
    data() {
      return {
        templateVue: '<p data-test="vue-render-editor-content">Editor preview</p>',
        handlerVue: defaultHandler,
        validationData: { sample: 1 },
      };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId('vue-render-editor-root');
    await expect(root.querySelector('.form-group.pointer-events-none')).toBeTruthy();
    await expect(canvas.getByTestId('vue-render-editor-content')).toHaveTextContent('Editor preview');
  },
};

export const EditorWithValidationError = {
  name: 'VueRenderEditor / error state',
  render: () => ({
    components: { VueRenderEditor },
    template: `
      <vue-render-editor
        template-vue="<div></div>"
        :handler-vue="handlerVue"
        error="Invalid"
        helper="Hint"
      />
    `,
    data() {
      return { handlerVue: defaultHandler };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Invalid')).toBeInTheDocument();
    await expect(canvas.getByText('Hint')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.is-invalid')).toBeTruthy();
  },
};

export const PreviewDefault = {
  name: 'VueRenderPreview / runtime',
  render: () => ({
    components: { VueRenderPreview },
    template: `
      <vue-render-preview
        name="field1"
        :template-vue="templateVue"
        :handler-vue="handlerVue"
        :validation-data="validationData"
        data-test="vue-render-preview"
      />
    `,
    data() {
      return {
        templateVue: '<p data-test="vue-render-preview-content">Preview content</p>',
        handlerVue: defaultHandler,
        validationData: { field1: 'value' },
      };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('vue-render-preview-content')).toHaveTextContent('Preview content');
  },
};

export const PreviewWithError = {
  name: 'VueRenderPreview / error',
  render: () => ({
    components: { VueRenderPreview },
    template: `
      <vue-render-preview
        template-vue="<div></div>"
        :handler-vue="handlerVue"
        error="Preview error"
        helper="Preview helper"
      />
    `,
    data() {
      return { handlerVue: defaultHandler };
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview error')).toBeInTheDocument();
    await expect(canvas.getByText('Preview helper')).toBeInTheDocument();
  },
};
