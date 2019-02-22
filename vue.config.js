const MonocoEditorPlugin = require('monaco-editor-webpack-plugin');

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MonocoEditorPlugin({
        languages: ['javascript', 'typescript', 'css']
      })
    ]
  }
}
