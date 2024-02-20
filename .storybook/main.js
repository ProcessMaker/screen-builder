/** @type { import('@storybook/vue-vite').StorybookConfig } */
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
  }
};
export default config;
