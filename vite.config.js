import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import { resolve } from "path";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

const libraryName = "VueFormBuilder";
const monacoLanguages = ["editorWorkerService", "typescript", "css", "json"];

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {}
  },
  plugins: [
    vue(),
    // https://github.com/vdesjs/vite-plugin-monaco-editor/issues/21
    monacoEditorPlugin.default({ languageWorkers: monacoLanguages }),
    viteCommonjs()
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
      external: [
        "vue",
        "vuex",
        "moment",
        "moment-timezone",
        "lodash",
        "@processmaker/vue-form-elements",
        "@processmaker/vue-multiselect",
        "@chantouchsek/validatorjs"
      ],
      output: {
        exports: "named",
        assetFileNames: `vue-form-builder.[ext]`,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          vuex: "Vuex",
          moment: "moment",
          "moment-timezone": "moment-timezone",
          lodash: "lodash",
          "@processmaker/vue-form-elements": "VueFormElements",
          "@processmaker/vue-multiselect": "VueMultiselect",
          "@chantouchsek/validatorjs": "Validator"
        }
      }
    }
  },
  server: {
    watch: {
      ignored: ["coverage"]
    }
  }
});
