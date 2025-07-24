/** @type { import('@storybook/vue-vite').StorybookConfig } */
const path = require('path');
const { mergeConfig } = require('vite');

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-interactions"
  ],
  framework: {
    name: "@storybook/vue-vite",
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          'vue-monaco': path.resolve(__dirname, '../node_modules/vue-monaco/dist/vue-monaco.js'),
        },
      },
    });
  },
};
export default config;
