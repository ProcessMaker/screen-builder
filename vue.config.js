const path = require('path');

const plugins = [];
if (process.env.NODE_ENV !== 'production') {
  const MonocoEditorPlugin = require('monaco-editor-webpack-plugin');
  plugins.push(new MonocoEditorPlugin({
    languages: ['javascript', 'typescript', 'css', 'json'],
  }));
}

module.exports = {
  runtimeCompiler: true,
  lintOnSave: process.env.NODE_ENV === 'production',
  transpileDependencies: ['vuetable-2'],
  configureWebpack: {
    plugins,
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
        'node_modules',
      ],
      symlinks: false,
    },
    externals: process.env.NODE_ENV === 'production' ? [
      'vue-monaco',
      'monaco-editor',
      'vue-deepset',
      /^@fortawesome\/.+$/,
      'vue',
      'vuex',
      /^bootstrap\/.+$/,
      /^@processmaker\/.+$/,
      'i18next',
      '@panter/vue-i18next',
      'validatorjs',
    ] : [],
  },
};
