const path = require("path");
const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");

const plugins = [];
if (process.env.NODE_ENV !== "production") {
  plugins.push(
    new MonacoEditorPlugin({
      languages: ["javascript", "typescript", "css", "json"]
    })
  );
}

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  transpileDependencies: ["vuetable-2"],
  configureWebpack: {
    plugins,
    resolve: {
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
      symlinks: false,
      alias: {
        "@processmaker/vue-form-elements$":
          process.env.NODE_ENV === "development"
            ? "@processmaker/vue-form-elements/src/components"
            : "@processmaker/vue-form-elements"
      }
    },
    externals:
      process.env.NODE_ENV === "production"
        ? [
            "vue-monaco",
            "monaco-editor",
            "vue-deepset",
            /^@fortawesome\/.+$/,
            "vue",
            "vuex",
            /^bootstrap\/.+$/,
            /^@processmaker\/.+$/,
            "i18next",
            "@panter/vue-i18next",
            "validatorjs",
            "SharedComponents"
          ]
        : []
  }
};
