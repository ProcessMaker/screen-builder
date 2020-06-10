const MonocoEditorPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  runtimeCompiler: true,
  transpileDependencies: ['vuetable-2'],
  configureWebpack: {
    plugins: [
      new MonocoEditorPlugin({
        languages: ['javascript', 'typescript', 'css', 'json'],
      }),
    ],
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
        'node_modules',
      ],
      symlinks: false,
      alias: {
        '@processmaker/vue-form-elements$': process.env.NODE_ENV === 'development'
          ? '@processmaker/vue-form-elements/src/components'
          : '@processmaker/vue-form-elements',
      },
    },
    externals: process.env.NODE_ENV === 'production' ? [
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
