export default {
  name: 'custom-css-output',
  render(createElement) {
    return createElement('style', this.$slots.default);
  },
};