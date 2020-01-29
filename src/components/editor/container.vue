<template>
  <div v-if="element.container" @click="inspect(element)" class="card">
    <div
      v-if="selected === element"
      class="card-header form-element-header d-flex align-items-center"
    >
      <i class="fas fa-arrows-alt-v mr-1 text-muted"/>
      <i v-if="element.config.icon" :class="element.config.icon" class="mr-2 ml-1"/>
      {{ element.config.name || element.label || $t('Field Name') }}
      <button
        class="btn btn-sm btn-danger ml-auto"
        :title="$t('Delete Control')"
        @click="deleteItem()"
      >
        <i class="far fa-trash-alt text-light"/>
      </button>
    </div>

    <component
      :validationErrors="validationErrors"
      class="card-body"
      :class="elementCssClass(element)"
      @inspect="inspect"
      @update-state="updateState"
      :selected="selected"
      v-model="element.items"
      :config="element.config"
      :is="element['editor-component']"
    />
  </div>

  <div v-else class="card">
    <div
      v-if="selected === element"
      class="card-header form-element-header d-flex align-items-center"
    >
      <i class="fas fa-arrows-alt-v mr-1 text-muted"/>
      <i v-if="element.config.icon" :class="element.config.icon" class="mr-2 ml-1"/>
      {{ element.config.name || $t('Variable Name') }}
      <button
        class="btn btn-sm btn-danger ml-auto"
        :title="$t('Delete Control')"
        @click="deleteItem()"
      >
        <i class="far fa-trash-alt text-light"/>
      </button>
    </div>

    <component
      :tabindex="element.config.interactive ? 0 : -1"
      class="card-body m-0 pb-4 pt-4"
      :class="[elementCssClass(element), { 'prevent-interaction': !element.config.interactive }]"
      v-bind="element.config"
      :is="element['editor-component']"
      @input="element.config.interactive ? element.config.content = $event : null"
      @focusout.native="updateState"
    />
  </div>
</template>

<script>
import HasColorProperty from '../../mixins/HasColorProperty';
import FormMultiColumn from '@/components/renderer/form-multi-column';
import draggable from 'vuedraggable';
import * as renderer from '../renderer';
import * as inspector from '../inspector';

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
  props: ['element', 'selected', 'validationErrors'],
  mixins: [HasColorProperty],
  components: {
    draggable,
    FormInput,
    FormSelectList,
    FormCheckbox,
    FormTextArea,
    FormDatePicker,
    FormHtmlEditor,
    FormHtmlViewer,
    FormMultiColumn,
    ...inspector,
    ...renderer,
  },
  data() {
    return {};
  },
  methods: {
    inspect(element) {
      this.$emit('inspect', element);
    },
    deleteItem() {
      this.$emit('delete-item');
    },
    updateState() {
      this.$emit('update-state');
    }
  }
}
</script>