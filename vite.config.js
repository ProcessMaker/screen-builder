import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import { resolve } from "path";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import istanbulPlugin from "vite-plugin-istanbul";

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
    monacoEditorPlugin({ languageWorkers: monacoLanguages }),
    viteCommonjs(),
    istanbulPlugin({
      include: "src/**",
      exclude: ["node_modules", "test/"],
      extension: [".js", ".ts", ".vue"],
      requireEnv: true
    })
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
      },
      {
        find: "axios/lib",
        replacement: resolve(__dirname, "node_modules/axios/lib")
      }
    ],
    extensions: [".mjs", ".js", ".vue", ".json"]
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/components/index.js"),
      name: libraryName,
      fileName: (format) => `vue-form-builder.${format}.js`,
      formats: ["es"],
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
        "vue-monaco",
        "monaco-editor",
        "SharedComponents"
      ],
      output: {
        preserveModules: true,
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
          SharedComponents: "SharedComponents"
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    watch: {
      ignored: ["**/coverage/**", "**/.nyc-output/**"]
    }
  }
});
