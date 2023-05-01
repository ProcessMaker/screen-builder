import { camelCase, upperFirst } from "lodash-es";

const components = [];
const modules = import.meta.globEager("./*.vue");
Object.entries(modules).forEach(([path, m]) => {
  const componentFiles = upperFirst(
    camelCase(
      path
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );

  components.push(m.default);
});

export default components;
