import { validationMixin } from 'vuelidate';

export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, properties }) {
        if (this.validVariableName(element.config.name)) {
          // Remove the validation from inside the control
          delete properties[':validation'];
          delete properties['validation'];
          // Add validation class and error message
          console.log(element.config.name);
          properties[':class'] = `{ 'form-group--error': ${this.checkVariableExists('$v.vdata.' + element.config.name)} && $v.vdata.${element.config.name}.$invalid }`;
          properties[':error'] = `${this.checkVariableExists('$v.vdata.' + element.config.name)} && validationMessage($v.vdata.${element.config.name})`;
        }
      },
      onbuild({ screen }) {
        screen.mixins.push(validationMixin);
      },
    });
  },
  methods: {
    checkVariableExists(name) {
      const check =name.split('.').reduce((check, el) => {
        check.variable = check.variable ? `${check.variable}.${el}` : el;
        check.str = check.str ? `${check.str} && ${check.variable}`: el;
        return check;
      }, {str: '', variable: ''});
      return check.str;
    },
  },
};
