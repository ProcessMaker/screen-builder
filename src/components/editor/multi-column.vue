<template>
  <div :class="classContainer" class="mb-1 mt-1 pb-0 pt-0">
    <div>
      <div class="row">
        <template v-for="(item, index) in items">
          <draggable :class="classColumn(index)"
            class="column-draggable"
            v-model="items[index]"
            :value="items[index]"
            @input="updateContainerConfig($event, index)"
            :options="{group: {name: 'controls'}}"
            :key="index"
          >
            <div class="control-item"
              :class="{selected: selected === element, hasError: hasError(element)}"
              v-for="(element,row) in item"
              :key="row"
              @click.stop="inspect(element)"
            >

              <container
                :element="element"
                :selected="selected"
                :validationErrors="validationErrors"
                @delete-item="deleteItem(index, row)"
                @inspect="inspect"
                @update-state="$emit('update-state')"
              ></container>
              
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
