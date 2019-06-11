<template>
    <div class="form-group">
        <div class="row">
            <div
                v-for="(item, key) in items"
                :class="classColumn(key)"
                :key="key"
            >
                <div v-for="(element, index) in item.filter(shouldElementBeVisible)" :key="index">
                    <component
                        v-if="element.container"
                        :class="elementCssClass(element)"
                        ref="container"
                        v-model="element.items"
                        :transientData="transientData"
                        @submit="submit"
                        @pageNavigate="pageNavigate"
                        :config="element.config"
                        :is="element.component"
                    />

                    <div class="column-draggable" :class="classColumn(key)" :key="key">
                        <div v-for="(element,index) in item" :key="index">

                            <template v-if="element.container">
                                <component :class="elementCssClass(element)"
                                           ref="container"
                                           v-model="element.items"
                                           :transientData="transientData"
                                           @submit="submit"
                                           @pageNavigate="pageNavigate"
                                           :config="element.config"
                                           :is="element['component']">
                                </component>
                            </template>

                            <template v-else>
                                <div :id="element.config.name ? element.config.name : undefined">
                                    <component :class="elementCssClass(element)"
                                               ref="elements"
                                               v-model="model[element.config.name]"
                                               :validationData="transientData"
                                               @submit="submit"
                                               @pageNavigate="pageNavigate"
                                               v-bind="element.config"
                                               :is="element['component']"
                                               v-show="showElement[element.config.name] !== undefined ? showElement[element.config.name] : true">
                                    </component>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import draggable from "vuedraggable";
  import * as renderer from '@/components/renderer';
  import { HasColorProperty, shouldElementBeVisible } from "@/mixins";

  import {
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormDatePicker,
    FormHtmlEditor
  } from "@processmaker/vue-form-elements";

  const defaultColumnWidth = 1;

  export default {
    mixins: [HasColorProperty, shouldElementBeVisible],
    name: "FormMultiColumn",
    props: ["value", "selected", "name", "config", "transientData"],
    components: {
      draggable,
      FormInput,
      FormSelect,
      FormTextArea,
      FormCheckbox,
      FormRadioButtonGroup,
      FormDatePicker,
      FormHtmlEditor,
      ...renderer
    },
    data() {
      return {
        items: []
      };
    },
    computed: {
      model() {
        return this.$parent.model;
      }
    },
    watch: {
      value: {
        handler: function () {
          this.items = this.value;
        },
        immediate: true
      },
      items() {
        this.$emit("input", this.items);
      }
    },
    methods: {
      classColumn(index) {
        let column = defaultColumnWidth;

        if (this.config.options[index] && this.config.options[index].content) {
          column = this.config.options[index].content;
        }

        return `col-sm-${column} ${this.columnVerticalAlign(index)}`;
      },
      columnVerticalAlign (index) {
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
        this.$emit("inspect", element);
      },
      submit() {
        // Just bubble up
        this.$emit("submit");
      },
      pageNavigate(page) {
        // Just bubble up
        this.$emit("pageNavigate", page);
      }
    }
  };
</script>
