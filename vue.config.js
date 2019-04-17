const MonocoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  transpileDependencies: ['vuetable-2'],
  configureWebpack: {
    plugins: [
      new MonocoEditorPlugin({
        languages: ['javascript', 'typescript', 'css']
      })
    ],
    externals: {
      subtract: [
        'bootstrap',
        '@processmaker/vue-form-elements',
        'i18next'
      ]
    }
  },
}
