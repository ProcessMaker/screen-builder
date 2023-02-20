import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import { resolve } from "path";
import istanbul from "vite-plugin-istanbul";

const libraryName = "VueFormBuilder";
const monacoLanguages = ["editorWorkerService", "typescript", "css", "json"];

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.NODE_ENV": process.env.NODE_ENV
  },
  plugins: [
    createVuePlugin(),
    monacoEditorPlugin({ languageWorkers: monacoLanguages }),
    istanbul({
      include: "src/**",
      exclude: ["node_modules"],
      extension: [".js", ".ts", ".vue"],
      /**
       * This allows us to omit the INSTRUMENT_BUILD env variable when running the production build via
       * npm run build.
       * More details below.
       */
      requireEnv: true,
      checkProd: true,
      /**
       * If forceBuildInstrument is set to true, this will add coverage instrumentation to the
       * built dist files and allow the reporter to collect coverage from the (built files).
       * However, when forceBuildInstrument is set to true, it will not collect coverage from
       * running against the dev server: e.g. npm run dev.
       *
       * To allow collecting coverage from running cypress against the dev server as well as the
       * preview server (built files), we use an env variable, INSTRUMENT_BUILD, to set
       * forceBuildInstrument to true when running against the preview server via the
       * instrument-build npm script.
       *
       * When you run `npm run build`, the INSTRUMENT_BUILD env variable is omitted from the npm
       * script which will result in forceBuildInstrument being set to false, ensuring your
       * dist/built files for production do not include coverage instrumentation code.
       */
      forceBuildInstrument: Boolean(process.env.INSTRUMENT_BUILD)
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
      }
    ],
    extensions: [".js", ".mjs", ".vue", ".json"]
  },
  build: {
    cssCodeSplit: false,
    sourcemap: "hidden",
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
  },
  server: {
    watch: {
      ignored: ["coverage", ".nyc-output"]
    }
  }
});
