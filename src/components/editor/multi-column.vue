<template>
    <div :class="classContainer" class="mb-1 mt-1 pb-0 pt-0">
        <div>
            <div class="row">
                <template v-for="(item, index) in items">
                    <draggable :class="classColumn(index)"
                            class="column-draggable"
                            v-model="items[index]"
                            :options="{group: {name: 'controls'}}"
                            :key="index">
                        <div class="control-item"
                                :class="{selected: selected === element}"
                                v-for="(element,row) in item"
                                :key="row"
                                @click.stop="inspect(element)"
                                >
                            <div v-if="element.container" @click.stop="inspect(element)">
                                <component :class="elementCssClass(element)"
                                        :selected="selected"
                                        @inspect="inspect"
                                        v-model="element.items"
                                        :config="element.config"
                                        :is="element['editor-component']">
                                </component>
                            </div>

                            <div v-else :id="element.config.name ? element.config.name : undefined">
                                <component :class="elementCssClass(element)"
                                        v-bind="element.config"
                                        :config="element.config"
                                        @input="element.config.interactive ? element.config.content = $event : null"
                                        :is="element['editor-component']"
                                        >
                                </component>
                                <div v-if="!element.config.interactive" class="mask" :class="{ selected: selected === element }"></div>
                            </div>

                            <button class="delete btn btn-sm btn-danger" @click="deleteItem(index, row)">x</button>
                        </div>
                    </draggable>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
  import draggable from "vuedraggable";
  import HasColorProperty from "../../mixins/HasColorProperty";
  import * as renderer from '@/components/renderer';
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
    name: "FormMultiColumn",
    mixins: [HasColorProperty],
    props: ["value", "name", "config", "selected"],
    components: {
      draggable,
      FormInput,
      FormSelect,
      FormCheckbox,
      FormRadioButtonGroup,
      FormTextArea,
      FormDatePicker,
      FormHtmlEditor,
      ...renderer,
    },
    data() {
      return {
        items: []
      };
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
      },
      'config.options'(options) {
        this.items = options.map((option, index) => {
          return this.items[index]
            ? this.items[index]
            : []
        });
      }
    },
    computed: {
      classContainer() {
        return this.items.length > 0 ? "form-group" : "column-draggable";
      }
    },
    methods: {
      classColumn(index) {
        let column = defaultColumnWidth;

        if (this.config.options[index] && this.config.options[index].content) {
          column = this.config.options[index].content;
        }

        return "col-sm-" + column;
      },
      inspect(element) {
        this.$emit("inspect", element);
      },
      deleteItem(col, index) {
        // Remove the item from the array in currentPage
        this.items[col].splice(index, 1);
      }
    }
  };
</script>

<style lang="scss" scoped>
    .column-draggable {
        border: 1px dashed #000;
        min-height: 80px;
        content: "Drag Controls";
    }

    .control-item {
        position: relative;

        .delete {
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
        }

        &.selected,
        &:hover {
            .mask {
                border: 1px solid red;
            }

            .delete {
                display: inline-block;
            }
        }

        .mask {
            position: absolute;
            top: 0px;
            left: 0px;
            background-color: rgba(0, 0, 0, 0);
            width: 100%;
            height: 100%;
        }
    }
</style>
