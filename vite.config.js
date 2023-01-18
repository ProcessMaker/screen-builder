import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import {resolve} from "path";

const libraryName = "VueFormBuilder";
const monacoLanguages = ["javascript", "typescript", "css", "json"];
const monacoPrefix = `monaco-editor/esm/vs`;

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      `${monacoPrefix}/language/json/json.worker`,
      `${monacoPrefix}/language/css/css.worker`,
      `${monacoPrefix}/language/html/html.worker`,
      `${monacoPrefix}/language/typescript/ts.worker`,
      `${monacoPrefix}/editor/editor.worker`
    ]
  },
  define: {
    "process.env": {}
  },
  plugins: [
    createVuePlugin(),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src")
      },
      {
        find: "vue",
        replacement: resolve(__dirname, "node_modules/vue/dist/vue.esm.js")
      }
    ],
    extensions: [".js", ".mjs", ".vue", ".json"]
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/components/index.js"),
      name: libraryName,
      fileName: (format) => `vue-form-builder.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "moment"],
      output: {
        exports: "named",
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          moment: "moment"
        }
      }
    }
  }
});
