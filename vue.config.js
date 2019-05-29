const MonocoEditorPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  transpileDependencies: ['vuetable-2'],
  configureWebpack: {
    plugins: [
      new MonocoEditorPlugin({
        languages: ['javascript', 'css', 'json']
      }),
    ],
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
        'node_modules',
      ],
      symlinks: false,
    },
    externals: {
      subtract: ['bootstrap', '@processmaker/vue-form-elements']
    }
  },
}
