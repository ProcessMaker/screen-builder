const components = {};
const modules = require.context('./', true, /\.vue$/i);
modules.keys().map(key => {
  if (key !== './index.js') components[key.substr(2, key.length - 6)] = (modules(key).default);
});

export default components;
