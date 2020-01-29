<template>
  <b-row class="h-100 m-0">
    <!-- Controls -->
    <b-col class="overflow-hidden h-100 p-0 controls-column">
      <b-card no-body class="h-100 rounded-0 border-top-0 border-bottom-0 border-left-0">
        <b-input-group size="sm">
          <b-input-group-prepend>
            <b-input-group-text class="filter-icon border-left-0 border-top-0 rounded-0">
              <i class="fas fa-filter"/>
            </b-input-group-text>
          </b-input-group-prepend>

          <b-form-input
            class="border-top-0 border-right-0 rounded-0"
            v-model="filterQuery"
            type="text"
            :placeholder="$t('Filter Controls')"
          />
        </b-input-group>

        <b-card-body no-body class="p-0 overflow-auto">
          <draggable
            id="controls"
            v-model="filteredControls"
            :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}"
            :clone="cloneControl"
            class="controls list-group w-auto list-group-flush"
          >
            <b-list-group-item v-for="(element, index) in filteredControls" :key="index">
              <i v-if="element.config.icon" :class="element.config.icon"/>
              {{ $t(element.label) }}
            </b-list-group-item>

            <li v-if="!filteredControls.length" class="list-group-item">
              <span class="text-danger">{{ $t('Control Not Found') }}</span>
            </li>
          </draggable>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Renderer -->
    <b-col class="overflow-auto mh-100 ml-4 mr-4 p-0 d-flex flex-column position-relative pt-2">
      <b-input-group size="sm" class="bg-white mt-3">
        <b-form-select v-if="showToolbar" v-model="currentPage" class="form-control">
          <option v-for="(data, page) in config" :key="page" :value="page">{{ data.name }}</option>
        </b-form-select>

        <div v-if="showToolbar">
          <b-button
            size="sm"
            variant="secondary"
            class="ml-1"
            :title="$t('Edit Page Title')"
            @click="openEditPageModal(currentPage)"
          >
            <i class="far fa-edit"/>
          </b-button>

          <b-button
            size="sm"
            variant="danger"
            class="ml-1"
            :title="$t('Delete Page')"
            @click="confirmDelete()"
            :disabled="!displayDelete"
          >
            <i class="far fa-trash-alt"/>
          </b-button>

          <b-button size="sm" variant="secondary" class="ml-1 mr-1" @click="originalPageName=null" :title="$t('Add New Page')" v-b-modal.addPageModal>
            <i class="fas fa-plus"/>
          </b-button>
        </div>

        <b-button-group size="sm" class="ml-1 ml-auto">
          <b-button @click="undo" :disabled="!canUndo">{{ $t('Undo') }}</b-button>
          <b-button @click="redo" :disabled="!canRedo">{{ $t('Redo') }}</b-button>
        </b-button-group>

        <hr class="w-100">
      </b-input-group>


      <div v-if="isCurrentPageEmpty" class="w-100 d-flex justify-content-center align-items-center drag-placeholder text-center position-absolute rounded mt-4">
        {{ $t('Drag an element here') }}
      </div>

      <draggable
        class="h-100"
        ghost-class="form-control-ghost"
        :value="config[currentPage].items"
        @input="updateConfig"
        :options="{
          group: {name: 'controls'},
          swapThreshold: 0.5
        }"
      >
        <div
          class="control-item mt-4 mb-4"
          :class="{selected: selected === element, hasError: hasError(element)}"
          v-for="(element,index) in config[currentPage].items"
          :key="index"
          @click="inspect(element)"
        >

        <container
          :element="element"
          :selected="selected"
          :validationErrors="validationErrors"
          @delete-item="deleteItem(index)"
          @inspect="inspect"
          @update-state="updateState"
        ></container>
          
        </div>
      </draggable>
    </b-col>

    <!-- Inspector -->
    <b-col class="overflow-hidden h-100 p-0 inspector-column">
      <b-card no-body class="p-0 h-100 border-top-0 border-bottom-0 border-right-0 rounded-0">
        <b-card-body class="p-0 h-100 overflow-auto">
          <template v-for="accordion in accordions">
            <b-button
              :key="`${accordionName(accordion)}-button`"
              v-if="getInspectorFields(accordion).length > 0"
              variant="outline"
              class="text-left card-header d-flex align-items-center w-100 outline-0 text-capitalize shadow-none"
              @click="toggleAccordion(accordion)"
            >
              <i class="fas fa-cog mr-2"/>
              {{ $t(accordionName(accordion)) }}
              <i
                class="fas fa-angle-down ml-auto"
                :class="{ 'fas fa-angle-right' : !accordion.open }"
              />
            </b-button>
            <b-collapse :key="`${accordionName(accordion)}-collapse`" :id="accordionName(accordion)" v-model="accordion.open">
              <component
                v-for="(item, index) in getInspectorFields(accordion)"
                :formConfig="config"
                :currentPage="currentPage"
                :key="index"
                :is="item.type"
                :selectedControl="selected"
                class="border-bottom m-0 p-4"
                v-bind="item.config"
                v-model="inspection.config[item.field]"
                @focusout.native="updateState"
              />
            </b-collapse>
          </template>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Modals -->
    <b-modal id="addPageModal"
      @ok="addPage"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      :title="$t('Add New Page')"
    >
      <form-input v-model="addPageName"
        :name="$t('Page Name')"
        :label="$t('Page Name')"
        :helper="$t('The name of the new page to add')"
        validation="unique-page-name|required"
        ref="addPageInput"
      />
    </b-modal>

    <b-modal ref="editPageModal"
      @ok="editPage"
      :title="$t('Edit Page Title')"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
    >
      <form-input v-model="editPageName"
        :label="$t('Page Name')"
        :helper="$t('The new name of the page')"
        validation="unique-page-name|required"
        ref="editPageInput"
      />
    </b-modal>

    <b-modal ref="confirm"
      :title="$t('Caution!')"
      :ok-title="$t('Delete')"
      :cancel-title="$t('Cancel')"
      @ok="deletePage"
      @cancel="hideConfirmModal"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
    >
      <p>{{ confirmMessage }}</p>
      <div slot="modal-ok">{{ $t('Delete') }}</div>
    </b-modal>

  </b-row>
</template>

<script>
import Vue from 'vue';
import draggable from 'vuedraggable';
import HasColorProperty from '../mixins/HasColorProperty';
import * as editor from './editor';
import * as renderer from './renderer';
import * as inspector from './inspector';
import FormMultiColumn from '@/components/renderer/form-multi-column';
import BootstrapVue from 'bootstrap-vue';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import undoRedoModule from '../undoRedoModule';
import accordions from './accordions';
import { keyNameProperty } from '../form-control-common-properties';

Vue.use(BootstrapVue);
Vue.component('Container', editor.Container);
Vue.component('MultiColumn', editor.MultiColumn);
Vue.component('Loop', editor.Loop);

let Validator = require('validatorjs');
// To include another language in the Validator with variable processmaker
let globalObject = typeof window === 'undefined'
  ? global
  : window;

if (globalObject.ProcessMaker && globalObject.ProcessMaker.user && globalObject.ProcessMaker.user.lang) {
  Validator.useLang(globalObject.ProcessMaker.user.lang);
}

Validator.register(
  'attr-value',
  value => {
    return value.match(/^[a-zA-Z0-9-_]+$/);
  },
  'Must be letters, numbers, underscores or dashes'
);

import {
  FormInput,
  FormSelectList,
  FormTextArea,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormHtmlViewer,
} from '@processmaker/vue-form-elements';

import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import { formTypes } from '@/global-properties';

const defaultConfig = [{
  name: 'Default',
  items: [],
}];

export default {
  props: {
    validationErrors: {
      type: Array,
    },
    initialConfig: {
      type: Array,
    },
    title: {
      type: String,
    },
    screenType: {
      type: String,
      default: formTypes.form,
    },
  },
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
    this.loadInitailConfig();

    return {
      currentPage: 0,
      selected: null,
      display: 'editor',
      inspection: {},
      // Blank at start, assume the parent component will call addControl for each control
      controls: [],
      pageAddModal: false,
      addPageName: '',
      editPageIndex: null,
      editPageName: '',
      originalPageName: null,
      config: defaultConfig,
      confirmMessage: '',
      pageDelete: 0,
      translated: [],
      showAssignment: false,
      showVariable: false,
      showDesign: false,
      filterQuery: '',
      accordions,
    };
  },
  computed: {
    canUndo() {
      return this.$store.getters[`page-${this.currentPage}/canUndo`];
    },
    canRedo() {
      return this.$store.getters[`page-${this.currentPage}/canRedo`];
    },
    displayDelete() {
      return this.config.length > 1;
    },
    filteredControls() {
      return this.controls.filter(control => {
        return control.label
          .toLowerCase()
          .includes(this.filterQuery.toLowerCase());
      });
    },
    isCurrentPageEmpty() {
      return this.config[this.currentPage].items.length === 0;
    },
    showToolbar() {
      return this.screenType === formTypes.form;
    },
  },
  watch: {
    config: {
      handler() {
        // @todo, remove inspector stuffs
        this.$emit('change', this.config);
      },
      deep: true,
    },
    initialConfig() {
      this.loadInitailConfig();
    },
    currentPage() {
      this.inspect();
    },
    inspection(e) {
      if (this.translated.includes(e)) {
        // already translated, don't translate again!
        return;
      }
      for (var i in e.inspector) {
        e.inspector[i].config.label = this.$t(e.inspector[i].config.label);
        e.inspector[i].config.helper = this.$t(e.inspector[i].config.helper);
        if (e.inspector[i].config.options) {
          for (var io in e.inspector[i].config.options) {
            e.inspector[i].config.options[io].content = this.$t(
              e.inspector[i].config.options[io].content
            );
          }
        }
      }
      this.translated.push(e);
    },
  },
  methods: {
    loadInitailConfig() {
      const config = this.initialConfig;
      this.migrateConfig(config);

      if (this.title && config[0].name === 'Default') {
        config[0].name = this.title;
      }

      this.config = config;
    },
    accordionName(accordion) {
      return accordion.name instanceof Function ? accordion.name(this.inspection) : accordion.name;
    },
    toggleAccordion(accordion) {
      this.accordions.forEach(panel => panel !== accordion ? panel.open = false : null);
      accordion.open = !accordion.open;
    },
    openAccordion(accordion) {
      this.accordions.forEach(panel => panel.open = false);
      accordion.open = true;
    },
    migrateConfig(config = this.config) {
      config.forEach(page => this.replaceFormText(page.items));
      config.forEach(page => this.migrateFormSubmit(page.items));
      config.forEach(page => this.updateFieldNameValidation(page.items));
    },
    updateFieldNameValidation(items) {
      items.forEach(item => {
        if (item.inspector) {
          item.inspector.forEach((inspector) => {
            if (inspector.field === 'name' && 'validation' in inspector.config) {
              inspector.config.validation = keyNameProperty.config.validation;
            }
          });
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    replaceFormText(items) {
      items.forEach(item => {
        if (item.component === 'FormText') {
          item.component = 'FormHtmlEditor';
          item['editor-component'] = 'FormHtmlEditor';
          const style =
            (item.config.fontSize ? 'font-size: ' + item.config.fontSize + ';' : '') +
            (item.config.fontWeight ? 'font-weight: ' + item.config.fontWeight + ';' : '') +
            (item.config.textAlign ? 'text-align: ' + item.config.textAlign + ';' : '');
          item.config = {
            content: '<div style="' + style + '">' + item.config.label + '</div>',
            interactive: true,
          };
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    migrateFormSubmit(items) {
      items.forEach(item => {
        item['editor-control'] = item['editor-component'];

        if (item.config.event === 'submit') {
          item['editor-control'] = 'FormSubmit';
        }
        if (item.config.event === 'pageNavigate') {
          item['editor-control'] = 'PageNavigation';
        }
        if (item.items instanceof Array && item.component === 'FormMultiColumn') {
          item['editor-control'] = 'FormMultiColumn';
          item.items.forEach(column => this.migrateFormSubmit(column));
        }
      });
    },
    getAllAccordionizedFields() {
      if (this._allAccordionizedFields) {
        return this._allAccordionizedFields;
      }
      this._allAccordionizedFields = this.accordions.flatMap(accordion => {
        return accordion.fields.map(fieldName => {
          if (typeof fieldName === 'string') {
            return fieldName;
          }
          return fieldName.name;
        });
      });
      return this._allAccordionizedFields;
    },
    knownField(field) {
      return this.getAllAccordionizedFields().includes(field);
    },
    getInspectorFields(accordion) {
      if (!this.inspection.inspector) {
        return [];
      }

      const accordionFields = accordion.fields
        .filter(field => {
          if (typeof field !== 'string') {
            const component = this.inspection.component;
            const { showFor, hideFor } = field;

            if (showFor) {
              return showFor === component;
            }

            if (hideFor) {
              return hideFor !== component;
            }
          }

          return true;
        })
        .map(field => {
          if (typeof field !== 'string') {
            return field.name;
          }

          return field;
        });
      const control = this.controls.find(control => control['editor-control'] === this.inspection['editor-control']) || this.inspection;
      return control.inspector.filter(input => {
        if (accordionFields.includes(input.field)) {
          return true;
        } else if (!this.knownField(input.field) && accordion.name === 'Configuration') {
          // If it's not a known inspector field from accordion.js and this is the
          // configuration accordion, then add it here
          return true;
        }
        return false;
      });
    },
    updateState() {
      const items = this.config[this.currentPage].items;
      this.$store.dispatch(`page-${this.currentPage}/pushState`, JSON.stringify(items));
    },
    undo() {
      this.inspect();
      this.$store.dispatch(`page-${this.currentPage}/undo`);
      this.config[this.currentPage].items = JSON.parse(this.$store.getters[`page-${this.currentPage}/currentState`]);
    },
    redo() {
      this.inspect();
      this.$store.dispatch(`page-${this.currentPage}/redo`);
      this.config[this.currentPage].items = JSON.parse(this.$store.getters[`page-${this.currentPage}/currentState`]);
    },
    updateConfig(items) {
      this.config[this.currentPage].items = items;
      this.updateState();
    },
    hasError(element) {
      return this.validationErrors.some(({ item }) => item === element);
    },
    focusInspector(validation) {
      this.showConfiguration = true;
      this.currentPage = this.config.indexOf(validation.page);
      this.$nextTick(() => {
        this.inspect(validation.item);
      });
    },
    confirmDelete() {
      this.confirmMessage = this.$t('Are you sure you want to delete {{item}}?', {item: this.config[this.currentPage].name});
      this.pageDelete = this.currentPage;
      this.$refs.confirm.show();
    },
    hideConfirmModal() {
      this.$refs.confirm.hide();
    },
    addControl(control) {
      this.controls.push(control);
    },
    deleteItem(index) {
      // Remove the item from the array in currentPage
      this.config[this.currentPage].items.splice(index, 1);
      this.inspection.inspector.splice(0, this.inspection.inspector.length);
      this.updateState();
    },
    openEditPageModal(index) {
      this.editPageIndex = index;
      this.editPageName = this.originalPageName = this.config[index].name;
      this.$refs.editPageModal.show();
    },
    editPage(e) {
      if (this.$refs.editPageInput.validator.errorCount) {
        e.preventDefault();
        return;
      }
      this.config[this.editPageIndex].name = this.editPageName;
    },
    addPage(e) {
      if (this.$refs.addPageInput.validator.errorCount) {
        e.preventDefault();
        return;
      }
      this.config.push({ name: this.addPageName, items: [] });
      this.currentPage = this.config.length - 1;
      this.addPageName = '';
      this.$store.registerModule(`page-${this.currentPage}`, undoRedoModule);
      this.updateState();
    },
    deletePage() {
      this.currentPage = 0;
      this.config.splice(this.pageDelete, 1);
    },
    inspect(element = {}) {
      this.inspection = element;
      this.selected = element;
      const defaultAccordion = this.accordions.find(accordion => this.getInspectorFields(accordion).length > 0);
      if (defaultAccordion) {
        this.openAccordion(defaultAccordion);
      }
    },
    // Cloning the control will ensure the config is not a copy of the observable but a plain javascript object
    // This will ensure each control in the editor has it's own config and it's not shared
    cloneControl(control) {
      let copy = {
        config: JSON.parse(JSON.stringify(control.config)),
        inspector: JSON.parse(JSON.stringify(control.inspector)),
        component: control.component,
        'editor-component': control['editor-component'],
        'editor-control': control['editor-control'],
        label: control.label,
        value: control.value,
      };
      if (control.component === 'FormDatePicker' && copy.config.phrases) {
        copy.config.phrases.ok = this.$t(copy.config.phrases.ok);
        copy.config.phrases.cancel = this.$t(copy.config.phrases.cancel);
      }
      copy.config.label = this.$t(copy.config.label);
      if (Array.isArray(copy.config.options)) {
        for (var io in copy.config.options) {
          copy.config.options[io].content = this.$t(
            copy.config.options[io].content
          );
        }
      }

      // If it's a container, let's add an items property, with the default of items in the control
      if (control.container) {
        copy['items'] = JSON.parse(JSON.stringify(control.items));
        copy.container = true;
      }
      return copy;
    },
  },
  created() {
    Validator.register(
      'unique-page-name',
      value => {
        const pageNames = this.config
          .map(config => config.name)
          .filter(name => name !== this.originalPageName);
        return !pageNames.includes(value);
      },
      this.$t('Must be unique')
    );

    this.config.forEach((config, index) => {
      this.$store.registerModule(`page-${index}`, undoRedoModule);
      this.$store.dispatch(`page-${index}/pushState`, JSON.stringify(config.items));
    });
  },
};
</script>

<style>
.prevent-interaction {
  pointer-events: none;
}
</style>


<style lang="scss" scoped>
$header-bg: #f7f7f7;
$side-bar-font-size: 0.875rem;

.control-icon {
  width: 30px;
  font-size: 20px;

  img {
    height: 20px;
  }
}

.control-item {
  .delete {
    position: absolute;
    top: 0px;
    right: 0px;
    display: none;
  }

  &:hover {
    cursor: move;
  }

  &.selected {
    border-radius: 5px;
    cursor: move;
  }

  &:not(.selected) .card {
    border: none;
  }
}

.hasError {
  border: 1px solid red;
  border-radius: 0.25rem;

  .form-element-header {
    border-bottom: 1px solid red;
    color: red;
  }
}

.inspector-header {
  background: $header-bg;
}

.validation-panel {
  background: $header-bg;
  height: 10rem;
  width: 21.35rem;
  bottom: 3rem;
}

.validation__message {
  text-decoration: none;

  &:hover {
    background: rgba(51, 151, 225, 0.3);
  }
}

.controls-header {
  border-bottom: none;
}

.header-bg {
  background: $header-bg;
}

.controls {
  cursor: move;
  user-select: none;
  font-size: $side-bar-font-size;
}

.header-button {
  height: 38px;
  width: 38px;
}

.filter-icon {
  background-color: #e9ecef;
}

.controls-column {
  max-width: 185px;
}

.inspector-column {
  max-width: 265px;
  font-size: $side-bar-font-size;
}

.form-control-ghost {
  margin-bottom: 0;
  border-radius: 0.25rem;
}

.drag-placeholder {
  height: 8rem;
  top: 4rem;
  border: 1px dashed rgba(0, 0, 0, 0.125);
}
</style>
