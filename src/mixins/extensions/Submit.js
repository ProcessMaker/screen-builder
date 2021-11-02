export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, properties }) {
        if (element.component === 'FormButton' && element.config.event === 'submit') {
          properties[':validate'] = '$v';
        }
      },
    });
  },
};
