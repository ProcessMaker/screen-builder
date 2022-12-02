import { validationMixin } from 'vuelidate';
import { mapGetters } from 'vuex';
import VueVuelidateJsonschema from 'vue-vuelidate-jsonschema';
import { javascriptReservedKeywords } from '../../form-control-common-properties';

export default {
  mounted() {
    this.extensions.push({
      onloadproperties({ element, properties }) {
        if (this.validVariableName(element.config.name)) {
          // Remove validation property from control
          delete properties[':validation'];
          delete properties['validation'];
          // Add validation class and error message
          if (!this.isValidVariableName(element.config.name)) {
            if (this.getMode() === "preview") {
              console.error("Invalid variable name");
            }
          } else {
            properties[':class'] = `{ 'form-group--error': ${this.checkVariableExists('$v.vdata.' + element.config.name)} && $v.vdata.${element.config.name}.$invalid || ${this.checkVariableExists('$v.schema.' + element.config.name)} && $v.schema.${element.config.name}.$invalid }`;
            properties[':error'] = `${this.checkVariableExists('$v.vdata.' + element.config.name)} && validationMessage($v.vdata.${element.config.name}) || ${this.checkVariableExists('$v.schema.' + element.config.name)} && validationMessage($v.schema.${element.config.name})`;
          }
        }
      },
      onbuild({ screen }) {
        screen.mixins.push(validationMixin);
        screen.mixins.push(VueVuelidateJsonschema.mixin);
      },
    });
  },
  methods: {
    ...mapGetters("globalErrorsModule", ["getMode"]),
    isValidVariableName(name) {
      const validVariableNameExp = RegExp('^[A-Za-z][0-9a-zA-Z_$]*$');
      const nameParts = name.split(".");
      let valid = true;
      nameParts.forEach((item) => {
        if (!validVariableNameExp.test(item)) {
          valid = false;
        }
        if (javascriptReservedKeywords.split(",").includes(item)) {
          valid = false;
        }
      });

      return valid;
    },
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
