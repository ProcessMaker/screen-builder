/** @type { import('@storybook/vue').Preview } */

import Vue from "vue";
import MonacoEditor from "vue-monaco";

Vue.component("MonacoEditor", MonacoEditor);

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
