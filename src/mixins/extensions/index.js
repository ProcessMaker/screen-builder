const mixins = [];
const modules = import.meta.glob("./*.js", { eager: true });

Object.entries(modules).forEach(([path, m]) => {
  mixins.push(m.default);
});

export default mixins;
