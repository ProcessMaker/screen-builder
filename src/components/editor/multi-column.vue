<template>
  <div :class="classContainer" class="mb-1 mt-1 pb-0 pt-0">
    <div :selector="config.customCssSelector">
      <div class="row">
        <template v-for="(item, index) in items">
          <draggable :class="classColumn(index)"
            class="column-draggable"
            v-model="items[index]"
            :value="items[index]"
            @input="updateContainerConfig($event, index)"
            group="controls"
            :key="index"
          >
            <div class="control-item"
              :class="{selected: selected === element, hasError: hasError(element)}"
              v-for="(element,row) in item"
              :key="row"
              @click.stop="inspect(element)"
            >
              <div v-if="element.container" @click.stop="inspect(element)">
                <div class="m-2 card border-0">
                  <div
                    v-if="selected === element"
                    class="card-header form-element-header d-flex align-items-center border rounded"
                  >
                    <i class="fas fa-arrows-alt-v mr-1 text-muted"/>
                    <i v-if="element.config.icon" :class="element.config.icon" class="mr-2 ml-1"/>
                    {{ element.config.name || $t('Variable Name') }}
                    <div class="ml-auto">
                      <button
                        class="btn btn-sm btn-secondary mr-2"
                        @click="duplicateItem(index, row)"
                        :aria-label="$t('Duplicate')"
                      >
                        <i class="fas fa-copy text-light"/>
                      </button>
                      <button
                        class="btn btn-sm btn-danger"
                        @click="deleteItem(index, row)"
                        :aria-label="$t('Delete')"
                      >
                        <i class="far fa-trash-alt text-light"/>
                      </button>
                    </div>
                  </div>
                  <component :class="elementCssClass(element)"
                    :validationErrors="validationErrors"
                    class="mb-3 mr-3 ml-3"
                    :selected="selected"
                    @inspect="inspect"
                    @update-state="$emit('update-state')"
                    v-model="element.items"
                    :config="element.config"
                    :is="element['editor-component']"
                  />
                </div>
              </div>

              <div v-else :id="element.config.name ? element.config.name : undefined">
                <div class="m-2" :class="{ 'card' : selected === element }">
                  <div
                    v-if="selected === element"
                    class="card-header form-element-header d-flex align-items-center"
                  >
                    <i class="fas fa-arrows-alt-v mr-1 text-muted"/>
                    <i v-if="element.config.icon" :class="element.config.icon" class="mr-2 ml-1"/>
                    {{ element.config.name || $t('Variable Name') }}
                    <div class="ml-auto">
                      <button
                        class="btn btn-sm btn-secondary mr-2"
                        :title="$t('Copy Control')"
                        @click="duplicateItem(index, row)"
                      >
                        <i class="fas fa-copy text-light"/>
                      </button>
                      <button
                        class="btn btn-sm btn-danger"
                        @click="deleteItem(index, row)"
                        :aria-label="$t('Delete')"
                      >
                        <i class="far fa-trash-alt text-light"/>
                      </button>
                    </div>
                  </div>

                  <component
                    class="p-3"
                    :class="[elementCssClass(element), { 'prevent-interaction': !element.config.interactive }]"
                    :tabindex="element.config.interactive ? 0 : -1"
                    v-bind="element.config"
                    :config="element.config"
                    @input="element.config.interactive ? element.config.content = $event : null"
                    :is="element['editor-component']"
                  />
                </div>
              </div>
            </div>
          </draggable>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { HasColorProperty } from '@/mixins';
import * as renderer from '@/components/renderer';
import _ from 'lodash';

import {
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
  name: 'MultiColumn',
  mixins: [HasColorProperty],
  props: ['value', 'name', 'config', 'selected', 'validationErrors'],
  components: {
    draggable,
    FormInput,
    FormSelectList,
    FormCheckbox,
    FormTextArea,
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
    'config.options'(options) {
      this.items = options.map((option, index) => {
        return this.items[index]
          ? this.items[index]
          : [];
      });
    },
  },
  computed: {
    classContainer() {
      return this.items.length > 0 ? 'form-group' : 'column-draggable';
    },
  },
  methods: {
    hasError(element) {
      return this.validationErrors.some(({ item }) => item === element);
    },
    updateContainerConfig(config, index) {
      this.items[index] = config;
      this.$emit('update-state');
    },
    classColumn(index) {
      let column = defaultColumnWidth;

      if (this.config.options[index] && this.config.options[index].content) {
        column = this.config.options[index].content;
      }

      return 'col-sm-' + column;
    },
    inspect(element) {
      this.$emit('inspect', element);
    },
    deleteItem(col, index) {
      // Remove the item from the array in currentPage
      this.items[col].splice(index, 1);
      this.$emit('update-state');
    },
    duplicateItem(col,index) {
      const duplicate = _.cloneDeep(this.items[col][index]);
      this.items[col].push(duplicate);
      this.$emit('update-state');
    },
  },
};
</script>

<style lang="scss" scoped>
    .hasError {
      border: 1px solid red;
      border-radius: 0.25rem;

      .form-element-header {
        border-bottom: 1px solid red;
        color: red;
      }
    }

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
