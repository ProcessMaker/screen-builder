<template>
  <!-- <div>
    <form id="form" cf-form>
      <input type="text" name="name" cf-questions="what is your name?" />
    </form>
    <div id="cf-context" role="cf-context" cf-context></div>
  </div> -->
  <div :class="containerClass">
    <custom-css>{{ customCssWrapped }}</custom-css>
    <screen-renderer :value="data" :definition="definition" @submit="submit" data-cy="screen-renderer" :show-errors="showErrors" />
  </div>
</template>

<script>
import Vue from 'vue';
import * as VueDeepSet from 'vue-deepset';
import _ from 'lodash';
import CustomCSS from './custom-css';
import currencies from '../currency.json';
import Inputmask from 'inputmask';
import DataProvider from '../DataProvider';
import { getItemsFromConfig } from '../itemProcessingUtils';
import { ValidatorFactory } from '../factories/ValidatorFactory';

const csstree = require('css-tree');
const Scrollparent = require('scrollparent');

Vue.component('custom-css', {
  render(createElement) {
    return createElement('style', this.$slots.default);
  },
});

Vue.use(VueDeepSet);
Vue.use(DataProvider);

export default {
  name: 'VueFormRenderer',
  components: { CustomCSS },
  props: ['config', 'data', 'page', 'computed', 'customCss', 'mode', 'watchers', 'isLoop', 'ancestorScreens', 'loopContext', 'showErrors'],
  model: {
    prop: 'data',
    event: 'update',
  },
  computed: {
    containerClass() {
      return this.parentScreen ? 'screen-' + this.parentScreen : 'custom-css-scope';
    },
  },
  data() {
    return {
      definition: {
        config: this.config,
        computed: this.computed,
        customCss: this.customCss,
        watchers: this.watchers,
      },
      formSubmitErrorClass: '',
      // watcher URLs
      watchers_config: {
        api: {
          execute: null,
          execution: null,
        },
      },
      customCssWrapped: '',
      // Custom Functions for Rich Text Control
      customFunctions: {
        formatCurrency() {
          const format = (value, currency) => {
            const definition = currencies.find(definition => definition.code === currency);
            const options = { alias: 'currency' };
            if (definition) {
              const separators = definition.format.match(/[.,]/g);
              if (separators.length === 0) separators.push('', '.');
              else if (separators.length === 1) separators.push(separators[0] === '.' ? ',': '.');
              options.digits = (definition.format.split(separators[1])[1] || '').length;
              options.radixPoint = separators[1];
              options.groupSeparator = separators[0];
              options.prefix = definition.symbol + ' ';
              options.suffix = ' ' + definition.code;
            }
            return Inputmask.format(value, options);
          };
          return function(text) {
            const params = JSON.parse(`[${text}]`);
            return format(_.get(this, params[0]), params[1]);
          };
        },
      },
    };
  },
  watch: {
    customCss(customCss) {
      this.definition.customCss = customCss;
      this.parseCss();
    },
    config: {
      deep: true,
      handler(config) {
        this.definition.config = config;
        this.$nextTick(() => {this.registerCustomFunctions();});
      },
    },
    data: {
      deep: true,
      handler() {
        this.$emit('update', this.data);
      },
    },
    computed: {
      deep: true,
      handler(computed) {
        this.definition.computed = computed;
      },
    },
    watchers: {
      deep: true,
      handler(watchers) {
        this.definition.watchers = watchers;
      },
    },
  },
  created() {
    this.parseCss = _.debounce(this.parseCss, 500, {leading: true});
  },
  mounted() {
    this.parseCss();
    this.registerCustomFunctions();
    if (window.ProcessMaker && window.ProcessMaker.EventBus) {
      window.ProcessMaker.EventBus.$emit('screen-renderer-init', this);
    }
    this.scrollable = Scrollparent(this.$el);
    // HARDCODED DEMO
    // let json = [
    //   {
    //     "tag": "input",
    //     "name": "name",
    //     "type": "text",
    //     "cf-questions": "What is your name?"
    //   },
    //   {
    //     "tag": "input",
    //     "name": "age",
    //     "type": "text",
    //     "cf-questions": "How old are you?"
    //   }
    // ];
    // this.cf = window.conversationalform.ConversationalForm.startTheConversation({
    //   tags:json, 
    //   options: {
    //     preventAutoFocus: false,
    //     submitCallback: this.submitCallback
    //   } 
    // });
  },
  methods: {
    submitCallback() {
      let formDataSerialized = this.cf.getFormData(true);
      console.log('FormData, obj:', formDataSerialized);
      this.cf.addRobotChatResponse("You are done.");
    },
    checkForRecordList(items, config) {
      items.forEach(item => {
        if (item.items) {
          this.checkForRecordList(item.items, config);
        }

        if (item.component === 'FormRecordList') {
          this.removeRecordListForms(item, config);
        }
      });
      return config;
    },
    removeRecordListForms(item, config) {
      const recordListFormId = item.config.form;
      delete config[recordListFormId];
      return config;
    },
    checkForNestedScreenErrors(child) {
      if (child.$options._componentTag !== 'FormNestedScreen') {
        return;
      }

      return child.errors();
    },
    isValid() {
      const items = getItemsFromConfig(this.config);
      let config = _.cloneDeep(this.config);

      this.checkForRecordList(items, config);
      this.dataTypeValidator = ValidatorFactory(config, this.data);
      this.errors = this.dataTypeValidator.getErrors();

      this.$children.forEach(child => {
        const childErrors = this.checkForNestedScreenErrors(child);
        if (!childErrors) {
          return;
        }
        this.errors = Object.assign(this.errors, childErrors);
      });
      if (this.errors) {
        this.formSubmitErrorClass = 'invalid-form-submission';
      }
      return _.size(this.errors) === 0;
    },
    registerCustomFunctions(node=this) {
      if (node.registerCustomFunction instanceof Function) {
        Object.keys(this.customFunctions).forEach(key => {
          node.registerCustomFunction(key, this.customFunctions[key]);
        });
      }
      if (node.$children instanceof Array) {
        node.$children.forEach(child => this.registerCustomFunctions(child));
      }
    },
    submit() {
      if (this.isValid()) {
        this.$emit('submit', this.data);
      }
    },
    parseCss() {
      const containerSelector = '.' + this.containerClass;
      try {
        const ast = csstree.parse(this.customCss, {
          onParseError(error) {
            // throw "CSS has the following errors:\n\n" + error.formattedMessage
            throw error.formattedMessage;
          },
        });
        let i = 0;
        csstree.walk(ast, function(node, item, list) {
          if (node.type === 'Atrule' && list) {
            throw 'CSS \'At-Rules\' (starting with @) are not allowed.';
          }
          if (
            node.type.match(/^.+Selector$/) &&
              node.name !== containerSelector &&
              list
          ) {
            // Wait until we get to the first item before prepending our container selector
            if (!item.prev) {
              list.prependData({type: 'WhiteSpace', loc: null, value: ' '});
              list.prependData({
                type: 'TypeSelector',
                loc: null,
                name: containerSelector,
              });
            }
          }
          if (i > 5000) {
            throw 'CSS is too big';
          }
          i = i + 1;
        });

        this.customCssWrapped = csstree.generate(ast);

        // clear errors
        this.$emit('css-errors', '');
      } catch (error) {
        this.$emit('css-errors', error);
      }
    },
  },
};
</script>

<style scoped>
  /* #cf-context { 
    width: 100vw; 
    height: 100vh; 
  }  */
</style>
