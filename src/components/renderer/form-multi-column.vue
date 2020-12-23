<template>
  <div class="form-group">
    <div class="row">
      <div
        v-for="(item, index) in items"
        :class="classColumn(index)"
        class="column-draggable"
        :key="index"
      >
        <template v-for="(element, index) in item.filter(shouldElementBeVisible)">
          <component
            :key="index"
            v-if="element.container"
            :class="elementCssClass(element)"
            ref="container"
            v-model="element.items"
            :transientData="transientData"
            @submit="submit"
            @pageNavigate="pageNavigate"
            :config="element.config"
            :is="element.component"
            :name="element.config.name !== undefined ? element.config.name : null"
            :form-config="formConfig"
          />

          <div v-else :id="element.config.name ? element.config.name : undefined" :key="index" class="w-100" :selector="element.config.customCssSelector">
            <component
              :class="elementCssClass(element)"
              ref="elements"
              v-model="model[getValidPath(element.config.name)]"
              :validationData="transientData"
              @submit="submit"
              @pageNavigate="pageNavigate"
              v-bind="element.config"
              :is="element.component"
              :disabled="element.config.interactive || element.config.disabled"
              :form-config="formConfig"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import * as renderer from '@/components/renderer';
import { HasColorProperty, shouldElementBeVisible, getValidPath } from '@/mixins';
import FormMaskedInput from '@/components/renderer/form-masked-input';

import {
  // eslint-disable-next-line no-unused-vars
  FormInput,
  FormSelectList,
  FormTextArea,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormHtmlViewer,
} from '@processmaker/vue-form-elements';

const defaultColumnWidth = 1;

export default {
  name: 'FormMultiColumn',
  mixins: [HasColorProperty, shouldElementBeVisible, getValidPath],
  props: ['value', 'selected', 'name', 'config', 'transientData', 'formConfig'],
  components: {
    draggable,
    FormInput: FormMaskedInput,
    FormSelectList,
    FormTextArea,
    FormCheckbox,
    FormDatePicker,
    FormHtmlEditor,
    FormHtmlViewer,
    ...renderer,
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    model() {
      return this.$parent.model;
    },
  },
  watch: {
    value: {
      handler() {
        this.items = this.value;
      },
      immediate: true,
    },
    items() {
      this.$emit('input', this.items);
    },
  },
  methods: {
    classColumn(index) {
      let column = defaultColumnWidth;

      if (this.config.options[index] && this.config.options[index].content) {
        column = this.config.options[index].content;
      }

      return `col-sm-${column} ${this.columnVerticalAlign(index)}`;
    },
    columnVerticalAlign(index) {
      let verticalAlignClass = '';

      // Only apply vertical align to text when it's the only element in the column
      if (this.items.length > 0
           && this.items[index].length === 1) {
        let formTexts  = this.items[0].filter(item => item.component === 'FormText');
        if (formTexts.length === 0) {
          return '';
        }

        let formText = formTexts[0];
        let justify = ' justify-content-' + (formText.config.textAlign === 'right' ? 'end' : formText.config.textAlign);
        switch (formText.config.verticalAlign) {
          case 'top':
            verticalAlignClass = 'd-flex align-items-start' + justify;
            break;
          case 'middle':
            verticalAlignClass = 'd-flex align-items-center' + justify;
            break;
          case 'bottom':
            verticalAlignClass = 'd-flex align-items-end' + justify;
            break;
        }
      }
      return verticalAlignClass;
    },
    inspect(element) {
      this.$emit('inspect', element);
    },
    submit() {
      // Just bubble up
      this.$emit('submit');
    },
    pageNavigate(page) {
      // Just bubble up
      this.$emit('pageNavigate', page);
    },
  },
};
</script>
