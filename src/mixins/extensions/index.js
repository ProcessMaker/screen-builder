import { camelCase, upperFirst } from "lodash-es";

const mixins = [];
const modules = import.meta.globEager("./*.js");

Object.entries(modules).forEach(([path, m]) => {
  const mixingName = upperFirst(
    camelCase(
      path
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );

  mixins.push(m.default);
});

export default mixins;
