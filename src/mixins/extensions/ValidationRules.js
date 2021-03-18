import { validationMixin } from 'vuelidate';

export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, properties }) {
        if (this.validVariableName(element.config.name)) {
          // Remove validation property from control
          delete properties[':validation'];
          delete properties['validation'];
          // Add validation class and error message
          properties[':class'] = `{ 'form-group--error': $v.vdata.${element.config.name} && $v.vdata.${element.config.name}.$invalid }`;
          properties[':error'] = `$v.vdata.${element.config.name} && validationMessage($v.vdata.${element.config.name})`;
        }
      },
      onbuild({ screen }) {
        screen.mixins.push(validationMixin);
      },
    });
  },
};
