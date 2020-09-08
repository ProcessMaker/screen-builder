const mixins = [];
const modules = require.context('./', true, /\.js$/i);
modules.keys().map(key => {
  if (key !== './index.js') mixins.push(modules(key).default);
});

export default mixins;
