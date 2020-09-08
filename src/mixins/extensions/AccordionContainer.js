export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ componentName, properties, element }) {
        if (componentName === 'FormAccordion') {
          properties[':value'] = this.byRef(element.items);
        }
      },
    });
  },
};
