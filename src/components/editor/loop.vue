<template>
  <div class="column-draggable" :selector="config.customCssSelector">
    <draggable
      style="min-height: 80px;"
      :list="items"
      group="controls"
    >
      <div class="control-item"
        :class="{selected: selected === element, hasError: hasError(element)}"
        v-for="(element,index) in items"
        :key="index"
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
                  :title="$t('Copy Control')"
                  @click="duplicateItem(index)"
                >
                  <i class="fas fa-copy text-light"/>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteItem(index)"
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
                  @click="duplicateItem(index)"
                >
                  <i class="fas fa-copy text-light"/>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteItem(index)"
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

export default {
  name: 'Loop',
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
  },
  methods: {
    hasError(element) {
      if (!this.validationErrors) { return false; }
      return this.validationErrors.some(({ item }) => item === element);
    },
    inspect(element) {
      this.$emit('inspect', element);
    },
    deleteItem(index) {
      // Remove the item from the array in currentPage
      this.items.splice(index, 1);
      this.$emit('update-state');
    },
    duplicateItem(index) {
      const duplicate = _.cloneDeep(this.items[index]);
      this.items.push(duplicate);
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

    .selected .column-draggable {
      border: none;
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
