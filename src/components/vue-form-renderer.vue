<template>
  <div class="custom-css-scope">
    <div class="page">
      <div
        v-for="(element, index) in visibleElements"
        :key="index"
      >
        <component
          v-if="element.container"
          :class="elementCssClass(element)"
          ref="container"
          selected="selected"
          :transientData="transientData"
          v-model="element.items"
          @submit="submit"
          :config="element.config"
          :name="element.config.name !== undefined ? element.config.name : null"
          @pageNavigate="pageNavigate"
          v-bind="element.config"
          :is="element.component"
        />

        <div v-else :id="element.config.name ? element.config.name : undefined" :selector="element.config.customCssSelector">
          <component
            :class="elementCssClass(element)"
            ref="elements"
            :validationData="transientData"
            v-model="model[getValidPath(element.config.name)]"
            @submit="submit"
            @pageNavigate="pageNavigate"
            :name="element.config.name !== undefined ? element.config.name : null"
            v-bind="element.config"
            :is="element.component"
            :disabled="element.config.interactive"
          />
        </div>
      </div>
      <custom-css>{{ customCssWrapped }}</custom-css>
    </div><!-- end page -->
  </div><!-- end custom-css-scope -->
</template>

<script>
import Vue from 'vue';
import * as VueDeepSet from 'vue-deepset';
import debounce from 'lodash/debounce';
import { HasColorProperty, shouldElementBeVisible, getValidPath } from '@/mixins';
import * as editor from './editor';
import * as renderer from './renderer';
import * as inspector from './inspector';
import FormMultiColumn from '@/components/renderer/form-multi-column';
import CustomCSS from './custom-css';
import {
  FormInput,
  FormSelect,
  FormPolySelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup,
  FormDatePicker,
  FormHtmlEditor,
} from '@processmaker/vue-form-elements';
import { Parser } from 'expr-eval';

const csstree = require('css-tree');

Vue.component('custom-css', {
  render(createElement) {
    return createElement('style', this.$slots.default);
  },
});

Vue.use(VueDeepSet);

function removeInvalidOptions(option) {
  return Object.keys(option).includes('value', 'contemnt') &&
    option.content != null;
}

function getOptionsFromDataSource(inputOptions, data) {
  const { jsonData, key, value, dataName } = inputOptions;
  let options = [];

  const convertToSelectOptions = option => ({
    value: option[key || 'value'],
    content: option[value || 'content'],
  });

  if (jsonData) {
    try {
      options = JSON.parse(jsonData)
        .map(convertToSelectOptions)
        .filter(removeInvalidOptions);
    } catch (error) {
      /* Ignore error */
    }
  }

  if (dataName) {
    try {
      options = data[dataName]
        .map(convertToSelectOptions)
        .filter(removeInvalidOptions);
    } catch (error) {
      /* Ignore error */
    }
  }

  return options;
}

export default {
  name: 'VueFormRenderer',
  props: ['config', 'data', 'page', 'computed', 'customCss', 'mode'],
  model: {
    prop: 'data',
    event: 'update',
  },
  mixins: [HasColorProperty, shouldElementBeVisible, getValidPath],
  components: {
    FormInput,
    FormSelect,
    FormCheckbox,
    FormRadioButtonGroup,
    FormTextArea,
    FormDatePicker,
    FormHtmlEditor,
    FormMultiColumn,
    CustomCSS,
    ...editor,
    ...inspector,
    ...renderer,
  },
  computed: {
    model() {
      return this.$deepModel(this.transientData);
    },
    visibleElements() {
      return this.config[this.currentPage].items.filter(this.shouldElementBeVisible);
    },
  },
  data() {
    return {
      valid: true,
      errors: [],
      currentPage: this.page || 0,
      transientData: JSON.parse(JSON.stringify(this.data)),
      defaultValues: {
        FormInput: '',
        FormSelect: null,
        FormPolySelect: null,
        FormCheckbox: false,
        FormRadioButtonGroup: null,
        FormTextArea: '',
        FormText: '',
        FormDatePicker: null,
        FormRecordList: [],
      },
      customCssWrapped: '',
    };
  },
  watch: {
    mode() {
      this.currentPage = 0;
    },
    data() {
      this.transientData = JSON.parse(JSON.stringify(this.data));
    },
    transientData: {
      handler() {
        if (this.computed) {
          this.computed.forEach(prop => {
            let value;
            try {
              if (prop.type==='expression') {
                value = Parser.evaluate(prop.formula, this.transientData);
              } else if (prop.type==='javascript') {
                var func = new Function(prop.formula);
                value = this.transientData[prop.property] = func.bind(JSON.parse(JSON.stringify(this.transientData)))();
              }
            } catch (e) {
              value = String(e);
            }
            this.$set(this.transientData, prop.property, value);
            this.$set(this.data, prop.property, value);
          });
        }
        // Only emit the update message if transientData does NOT equal this.data
        // Instead of deep object property comparison, we'll just compare the JSON representations of both

        if (JSON.stringify(this.transientData) != JSON.stringify(this.data)) {
          this.$emit('update', this.transientData);
          return;
        }
      },
      deep: true,
    },
    customCss() {
      this.parseCss();
    },
  },
  created() {
    this.parseCss = debounce(this.parseCss, 500, { leading: true });
  },
  mounted() {
    this.parseCss();
  },
  methods: {
    submit() {
      if (this.isValid()) {
        this.setDefaultValues();
        this.$emit('submit', this.transientData);
      }
    },
    validateElements(elements) {
      elements.forEach(element => {
        if (element.validator && element.validator.errorCount !== 0) {
          this.valid = false;
          this.errors.push(element.validator.errors.errors);
        }
      });
    },
    validateContainer(container) {
      if (container.$refs && container.$refs.container) {
        this.validateContainer(container.$refs.container);
      }
      container.forEach(element => {
        if (element.$refs && element.$refs.elements) {
          this.validateElements(element.$refs.elements);
        }
      });
    },
    isValid() {
      this.errors = [];
      this.valid = true;

      if (this.$refs && this.$refs.elements) {
        this.validateElements(this.$refs.elements);
      }

      if (this.$refs && this.$refs.container) {
        this.validateContainer(this.$refs.container);
      }
      return this.valid;
    },
    pageNavigate(page) {
      if (!this.config[page]) {
        return;
      }

      this.currentPage = page;
    },
    setDefaultValues() {
      // Iterate through config, if item has a name property,
      // then we set the default value
      this.config.forEach(page => {
        page.items.forEach(item => {
          this.setDefaultValueItem(item);
        });
      });
    },
    setDefaultValueItem(item) {
      if (item.component === 'FormMultiColumn') {
        item.items.forEach(column => {
          column.forEach(innerItem => {
            this.setDefaultValueItem(innerItem);
          });
        });
      }

      if (
        !item.config.name ||
        this.model[this.getValidPath(item.config.name)] !== undefined ||
        item.component === 'FormButton'
      ) {
        return;
      }

      let defaultValue = null;

      if (['FormInput', 'FormTextArea', 'FormText'].includes(item.component)) {
        defaultValue = '';
      }

      if (['FormSelect', 'FormRadioButtonGroup'].includes(item.component) && item.config.options) {
        const options = getOptionsFromDataSource(item.config.options, this.transientData);

        defaultValue = options[0] ? options[0].value : null;
      }

      if (['FormPolySelect', 'FormRadioButtonGroup'].includes(item.component) && item.config.options) {
        const options = getOptionsFromDataSource(item.config.options, this.transientData);

        defaultValue = options[0] ? options[0].value : null;
      }

      if (item.component === 'FormCheckbox') {
        defaultValue = item.config.initiallyChecked || false;
      }

      if (item.component === 'FormRecordList') {
        defaultValue = [];
      }

      this.model[this.getValidPath(item.config.name)] = defaultValue;
    },
    parseCss() {
      const containerSelector = '.custom-css-scope';
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
              list.prependData({ type: 'WhiteSpace', loc: null, value: ' ' });
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
