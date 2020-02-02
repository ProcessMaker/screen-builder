<template>
  <div class="column-draggable">
    <draggable
      style="min-height: 80px;"
      v-model="items"
      :options="{group: {name: 'controls'}}"
    >
      <div class="control-item"
        :class="{selected: selected === element, hasError: hasError(element)}"
        v-for="(element,index) in items"
        :key="index"
        @click.stop="inspect(element)"
      >
        <container
          :element="element"
          :selected="selected"
          :validationErrors="validationErrors"
          @delete-item="deleteItem(index)"
          @inspect="inspect"
          @update-state="$emit('update-state')"
        ></container>
      </div>
    </draggable>
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
