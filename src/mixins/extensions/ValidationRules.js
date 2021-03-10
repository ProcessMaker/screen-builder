import { set, get } from 'lodash';
import { validationMixin } from 'vuelidate';
import { validators } from '../ValidationRules';

export default {
  methods: {
    getRules(items, validationRule) {
      items.forEach((item) => {
        if (!item) return;
        //If the element has containers
        if (Array.isArray(item)) {
          this.getRules(item, validationRule);
        }

        //If the element has items
        if (item.items) {
          if (item.component === 'FormLoop') {
            set(validationRule, item.config.name, {});
            const validationLoopRule = get(validationRule, item.config.name);
            this.ruleFormLoop(item.items, validationLoopRule);
          } else {
            this.getRules(item.items, validationRule);
          }
        }

        if (item.component === 'FormNestedScreen' && item.config.screen) {
          
          //const nestedScreen = _.get(window, 'nestedScreens.id_' + item.config.screen);
          //if (nestedScreen) {
            //this.getRules(nestedScreen, validationRule);
          //}
        }

        //If the element has configuration only
        if (item.config && item.config.name && item.config.validation) {
          console.log('searach item nested...' + item.config.name);
          set(validationRule, item.config.name, {});
          const validationItemRule = get(validationRule, item.config.name);
          this.addRules(item.config.validation, validationItemRule);
        }
      });
    },
    ruleFormLoop(items, validationRule) {
      console.log('add rules Formlooop');
      //Collections validation
      validationRule['$each'] = [];

      items.forEach((item) => {
        set(validationRule['$each'], item.config.name, {});
        const validationLoopRule = get(validationRule['$each'], item.config.name);
        this.addRules(item.config.validation, validationLoopRule);
      });
    },
    loadNestedScreen(id, validationRule) {
      if (!id) {
        return;
      }
      this.$dataProvider.getScreen(id)
        .then(response => {
          console.log('........load nested.. ' + id);
          this.getRules(response.data.config, validationRule);

          /*if (this.ancestorScreens.includes(this.screenTitle)) {
            globalObject.ProcessMaker.alert(`Rendering of nested "${this.screenTitle}" screen was disallowed to prevent loop.`, 'warning');
          } else {
            if (!globalObject['nestedScreens']) {
              globalObject['nestedScreens'] = {};
            }
            globalObject.nestedScreens['id_' + id] = this.config;
          }*/
        });
    },
    addRules(config, validationRule) {
      if (config instanceof Array) {
        config.forEach((validation) => {
          const rule = this.camelCase(validation.value.split(':')[0]);
          if (!rule) {
            return;
          }
          let validationFn = validators[rule];
          if (!validationFn) {
            // eslint-disable-next-line no-console
            console.error(`Undefined validation rule "${rule}"`);
            return;
          }
          if (validation.configs instanceof Array) {
            const params = [];
            validation.configs.forEach((cnf) => {
              params.push(cnf.value);
            });
            validationFn = validationFn(...params);
          }
          validationRule[rule] = validationFn;
        });
      } else if (typeof config === 'string' && config) {
        let validationFn = validators[config];
        if (!validationFn) {
          // eslint-disable-next-line no-console
          console.error(`Undefined validation rule "${config}"`);
          return;
        }
        validationRule[config] = validationFn;
      }
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties({ element, screen, properties }) {
        console.log(element.component);
        console.log(element.config.name);
        if (element.component === 'FormNestedScreen' && element.config.screen) {
          console.log('nested screen load configuration');
          console.log(element.config);
          console.log(element.config.screen);
          set(screen.validations.vdata, 'nestedScreens.id_' + element.config.screen, {});
          const nestedScreen = get(screen.validations.vdata, 'nestedScreens.id_' + element.config.screen);
          //const nestedScreen = get(screen,'validations');

          this.loadNestedScreen(element.config.screen, nestedScreen);
          console.log('data loaded of nested screen......');
          console.log(nestedScreen);
        }

        if (this.validVariableName(element.config.name)) {

          set(screen.validations.vdata, element.config.name, {});
          const validationRule = get(screen.validations.vdata, element.config.name);
          this.addRules(element.config.validation, validationRule);

          if (element.component === 'FormLoop') {
            this.ruleFormLoop(element.items, validationRule);
            /*console.log('add rules Formlooop');
            //Collections validation
            validationRule['$each'] = [];

            element.items.forEach((item) => {
              set(validationRule['$each'], item.config.name, {});
              const validationLoopRule = get(validationRule['$each'], item.config.name);
              this.addRules(item.config.validation, validationLoopRule);
            });*/
          }

          // Remove the validation from inside the control
          delete properties[':validation'];
          delete properties['validation'];
          properties[':class'] = `{ 'form-group--error': $v.vdata.${element.config.name}.$invalid }`;
          properties[':error'] = `validationMessage($v.vdata.${element.config.name})`;
        }



      },
      onbuild({ screen }) {
        screen.mixins.push(validationMixin);
      },
    });
  },
};
