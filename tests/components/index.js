const components = {};
const modules = import.meta.glob("./*.vue");
Object.entries(modules).forEach(([path, m]) => {
  components[path.substr(2, path.length - 6)] = m;
});

export default components;
