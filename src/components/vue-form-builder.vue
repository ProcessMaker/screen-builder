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
            data-cy="controls"
            v-model="filteredControls"
            v-bind="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}"
            :clone="cloneControl"
            class="controls list-group w-auto list-group-flush"
          >
            <b-list-group-item v-for="(element, index) in filteredControls" :key="index" :data-cy="'controls-' + element.component">
              <i v-if="element.config.icon" :class="element.config.icon"/>
              {{ $t(element.label) }}
            </b-list-group-item>

            <li v-if="!filteredControls.length" class="list-group-item">
              <slot/>
            </li>
          </draggable>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Renderer -->
    <b-col id="screen-container" class="overflow-auto mh-100 ml-4 mr-4 p-0 d-flex flex-column position-relative pt-2">
      <b-input-group size="sm" class="bg-white mt-3">
        <b-form-select v-if="showToolbar" v-model="currentPage" class="form-control" data-cy="toolbar-page">
          <option v-for="(data, page) in config" :key="page" :value="page">{{ data.name }}</option>
        </b-form-select>

        <div v-if="showToolbar">
          <b-button
            size="sm"
            variant="secondary"
            class="ml-1"
            :title="$t('Edit Page Title')"
            @click="openEditPageModal(currentPage)"
            data-cy="toolbar-edit"
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
            data-cy="toolbar-remove"
          >
            <i class="far fa-trash-alt"/>
          </b-button>

          <b-button
            size="sm"
            variant="secondary"
            class="ml-1 mr-1"
            @click="originalPageName=null"
            :title="$t('Add New Page')"
            v-b-modal.addPageModal
            data-cy="toolbar-add"
          >
            <i class="fas fa-plus"/>
          </b-button>
        </div>

        <b-button-group size="sm" class="ml-1 ml-auto">
          <b-button @click="undo" :disabled="!canUndo" data-cy="toolbar-undo">{{ $t('Undo') }}</b-button>
          <b-button @click="redo" :disabled="!canRedo" data-cy="toolbar-redo">{{ $t('Redo') }}</b-button>
        </b-button-group>

        <hr class="w-100">
      </b-input-group>


      <div v-if="isCurrentPageEmpty" data-cy="screen-drop-zone"  class="w-100 d-flex justify-content-center align-items-center drag-placeholder text-center position-absolute rounded mt-4">
        {{ $t('Drag an element here') }}
      </div>

      <draggable
        data-cy="editor-content"
        class="h-100 custom-css-scope"
        ghost-class="form-control-ghost"
        :value="config[currentPage].items"
        @input="updateConfig"
        v-bind="{
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
          :selector="element.config.customCssSelector"
        >
          <div v-if="element.container" @click="inspect(element)" class="card" data-cy="screen-element-container">
            <div
              v-if="selected === element"
              class="card-header form-element-header d-flex align-items-center"
            >
              <i class="fas fa-arrows-alt-v mr-1 text-muted"/>
              <i v-if="element.config.icon" :class="element.config.icon" class="mr-2 ml-1"/>
              {{ element.config.name || element.label || $t('Field Name') }}
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
                  :title="$t('Delete Control')"
                  @click="deleteItem(index)"
                >
                  <i class="far fa-trash-alt text-light"/>
                </button>
              </div>
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

          <div v-else class="card" data-cy="screen-element-container">
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
                  :title="$t('Delete Control')"
                  @click="deleteItem(index)"
                >
                  <i class="far fa-trash-alt text-light"/>
                </button>
              </div>
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
              :data-cy="`accordion-${ accordionName(accordion).replace(' ', '') }`"
              :accordion-name="`accordion-${ accordionName(accordion).replace(' ', '') }`"
              :is-open="accordion.open ? '1' : '0'"
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
                :data-cy="'inspector-' + (item.field || item.config.name)"
                :field-name="item.field"
                :field-accordion="`accordion-${ accordionName(accordion).replace(' ', '') }`"
                :builder="builder"
                :formConfig="config"
                :screenType="screenType"
                :currentPage="currentPage"
                :key="index"
                :is="item.type"
                :selectedControl="selected"
                class="border-bottom m-0 p-4"
                v-bind="item.config"
                v-model="inspection.config[item.field]"
                @focusout.native="updateState"
                @setName="inspection.config.name = $event"
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
      header-close-content="&times;"
      data-cy="add-page-modal"
    >
      <form-input v-model="addPageName"
        :name="$t('Page Name')"
        :label="$t('Page Name') + ' *'"
        :helper="$t('The name of the new page to add')"
        validation="unique-page-name|required"
        ref="addPageInput"
        data-cy="add-page-name"
        required
        aria-required="true"
      />
    </b-modal>

    <b-modal ref="editPageModal"
      @ok="editPage"
      :title="$t('Edit Page Title')"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      header-close-content="&times;"
    >
      <form-input v-model="editPageName"
        :label="$t('Page Name') + ' *'"
        :helper="$t('The new name of the page')"
        validation="unique-page-name|required"
        ref="editPageInput"
        required
        aria-required="true"
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
      header-close-content="&times;"
    >
      <p>{{ confirmMessage }}</p>
      <div slot="modal-ok">{{ $t('Delete') }}</div>
    </b-modal>

    <!-- Auxilar instance to get the Tree of variables -->
    <screen-renderer ref="treeOfVariables" :value="{}" :definition="{config:[]}" v-show="false" />
  </b-row>
</template>

<script>
import draggable from 'vuedraggable';
import HasColorProperty from '../mixins/HasColorProperty';
import * as renderer from './renderer';
import * as inspector from './inspector';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import undoRedoModule from '../undoRedoModule';
import accordions from './accordions';
import { keyNameProperty } from '../form-control-common-properties';
import VariableNameGenerator from '@/components/VariableNameGenerator';
import testing from '@/mixins/testing';

let Validator = require('validatorjs');
// To include another language in the Validator with variable processmaker
let globalObject = typeof window === 'undefined'
  ? global
  : window;

if (globalObject.ProcessMaker && globalObject.ProcessMaker.user && globalObject.ProcessMaker.user.lang) {
  Validator.useLang(globalObject.ProcessMaker.user.lang);
}

// Todo: Validation messages are not translated. These will need to be converted
// to Validator.registerAsync() in order to get the $t translator.
// Should also probably be converted to a mixin. These changes would then
// require modifications to to App.vue and PM4 Core implementations
Validator.register(
  'columns-adds-to-12',
  value => {
    const sum = value.reduce((total, options) => {
      return total + parseInt(options['content']);
    }, 0);

    if (sum === 12) {
      return true;
    }
    return false;
  },
  'Columns must add to 12'
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

import RequiredCheckbox from './utils/required-checkbox';

import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import { formTypes } from '@/global-properties';
import _ from 'lodash';

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
    screen: {
      type: Object,
    },
  },
  mixins: [HasColorProperty, testing],
  components: {
    draggable,
    FormInput,
    FormSelectList,
    FormCheckbox,
    FormTextArea,
    FormDatePicker,
    FormHtmlEditor,
    FormHtmlViewer,
    RequiredCheckbox,
    ...inspector,
    ...renderer,
  },
  data() {
    const config = this.initialConfig || defaultConfig;
    this.migrateConfig(config);
    const generator = new VariableNameGenerator();
    let variables = generator.GetVariableNames(config);

    if (this.title && config[0].name === 'Default') {
      config[0].name = this.title;
    }

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
      config,
      confirmMessage: '',
      pageDelete: 0,
      translated: [],
      showAssignment: false,
      showVariable: false,
      showDesign: false,
      filterQuery: '',
      accordions,
      variables,
      generator,
      variablesTree: [],
      language: 'en',
      collator: null,
    };
  },
  computed: {
    builder() {
      return this;
    },
    canUndo() {
      return this.$store.getters['undoRedoModule/canUndo'];
    },
    canRedo() {
      return this.$store.getters['undoRedoModule/canRedo'];
    },
    displayDelete() {
      return this.config.length > 1;
    },
    filteredControls() {
      return this.controls.filter(control => {
        return control.label
          .toLowerCase()
          .includes(this.filterQuery.toLowerCase());
      }).sort((a, b) => {
        return this.collator.compare(a.label, b.label);
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
        this.$emit('change', this.config);
        this.loadVariablesTree();
      },
      deep: true,
    },
    '$parent.computed': {
      deep: true,
      handler() {
        this.loadVariablesTree();
      },
    },
    '$parent.watchers': {
      deep: true,
      handler() {
        this.loadVariablesTree();
      },
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
    loadVariablesTree() {
      const definition = {
        config : this.$parent.config,
        computed : this.$parent.computed,
        customCSS : this.$parent.customCSS,
        watchers : this.$parent.watchers,
      };
      this.variablesTree = this.$refs.treeOfVariables.getVariablesTree(definition);
      this.$refs.treeOfVariables.getVariablesTree({config: []});
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
      config.forEach(page => this.removeDataVariableFromNestedScreens(page.items));
    },
    updateFieldNameValidation(items) {
      items.forEach(item => {
        if (item.inspector) {
          item.inspector.forEach((inspector) => {
            if (inspector.field === 'name' && 'validation' in inspector.config && inspector.config.name !== 'DataVariable' && item.component !== 'FileUpload' && item.component !== 'FormButton') {
              inspector.config.validation = keyNameProperty.config.validation;
            }
          });
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    removeDataVariableFromNestedScreens(items) {
      items.forEach(item => {
        if (item.inspector) {
          const hasDataVariable = item.inspector.find(inspector => inspector.config.name === 'DataVariable');
          item.inspector = item.inspector.filter(inspector => inspector.config.name !== 'DataVariable');
          if (hasDataVariable) {
            delete item.config.name;
          }
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
        if (item['editor-control'] !== 'FormSubmit') {
          item['editor-control'] = item['editor-component'];
        }

        if (item.config.event === 'submit') {
          if (item['editor-component'] === 'FormNestedScreen') {
            // Old nested screens erroneously had an event key. Remove it here
            // and set the editor-control back to FormNestedScreen.
            delete item.config.event;
            item['editor-control'] = 'FormNestedScreen';
            item.config.name = 'Nested Screen';
          } else {
            if (item['editor-control'] !== 'FormImage') {
              item['editor-control'] = 'FormSubmit';
            }
          }
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
      const control = this.controls.find(control => control['editor-control'] === this.inspection['editor-control'])
        || this.controls.find(control => control.component === this.inspection.component)
        || {inspector:[]};
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
      this.$store.dispatch('undoRedoModule/pushState', {'config': JSON.stringify(this.config), 'currentPage': this.currentPage});
    },
    undo() {
      this.inspect();
      this.$store.dispatch('undoRedoModule/undo');
      this.config = JSON.parse(this.$store.getters['undoRedoModule/currentState'].config);
      this.currentPage = JSON.parse(this.$store.getters['undoRedoModule/currentState'].currentPage);
    },
    redo() {
      this.inspect();
      this.$store.dispatch('undoRedoModule/redo');
      this.config = JSON.parse(this.$store.getters['undoRedoModule/currentState'].config);
      this.currentPage = JSON.parse(this.$store.getters['undoRedoModule/currentState'].currentPage);
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
        this.$nextTick(() => {
          const field = this.$el.querySelector(`[field-name="${validation.field}"]`);
          if (field) {
            const accordion = this.$el.querySelector(`[accordion-name="${field.getAttribute('field-accordion')}"]`);
            accordion && accordion.getAttribute('is-open') === '0' && accordion.click();
            field.focus instanceof Function && field.focus();
          }
        });
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
    duplicateItem(index) {
      const duplicate = _.cloneDeep(this.config[this.currentPage].items[index]);
      this.config[this.currentPage].items.push(duplicate);
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
      this.updateState();
    },
    deletePage() {
      this.config.splice(this.pageDelete, 1);
      this.currentPage = (this.pageDelete - 1 >= 0 ? this.pageDelete - 1 : 0);
      this.$store.dispatch('undoRedoModule/pushState', {'config': JSON.stringify(this.config), 'currentPage': this.currentPage, 'deletedPage': true});
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

      //Generate Variable Name
      if (control.inspector.indexOf(keyNameProperty) !== -1 || control.component === 'FormLoop') {
        [this.variables, copy.config.name] = this.generator.generate(this.config, copy['editor-control'] ? copy['editor-control'] :  copy['component']);
        if (_.has(copy, 'config.settings.varname')) {
          copy.config.settings.varname = copy.config.name;
        }
      }

      return copy;
    },
    initiateLanguageSupport() {
      if (document.documentElement.lang) {
        this.language = document.documentElement.lang;
      }
      this.collator = Intl.Collator(this.language);
    },
  },
  created() {
    this.loadVariablesTree = _.debounce(this.loadVariablesTree, 2000);
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
    this.$store.registerModule('undoRedoModule', undoRedoModule);
    this.$store.dispatch('undoRedoModule/pushState', {'config': JSON.stringify(this.config), 'currentPage': this.currentPage});
    this.initiateLanguageSupport();
  },
  mounted() {
    this.loadVariablesTree();
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
