/** @type { import('@storybook/vue-vite').StorybookConfig } */
import monacoEditorPlugin from "vite-plugin-monaco-editor";
const monacoLanguages = ["editorWorkerService", "typescript", "css", "json"];

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
    // Configure Monaco Editor for Storybook
    config.define = {
      ...config.define,
      'process.env.NODE_DEBUG': false,
    };
    
    // Ensure proper worker configuration for Monaco Editor
    config.worker = {
      ...config.worker,
      format: 'es',
    };
    
    // Add Monaco Editor plugin with language workers
    config.plugins = [
      ...(config.plugins || []),
      monacoEditorPlugin({ languageWorkers: monacoLanguages }),
    ];
    
    return config;
  }
};
export default config;
