<template>
  <b-row class="h-100">
    <!-- Controls -->
    <b-col class="overflow-hidden mh-100 p-0 controls-column">
      <b-card no-body class="h-100">
        <b-card-header>{{ $t('Controls')  }}</b-card-header>
        <b-input-group size="sm">
          <b-input-group-prepend>
            <b-input-group-text class="filter-icon">
              <i class="fas fa-filter"></i>
            </b-input-group-text>
          </b-input-group-prepend>

          <b-form-input v-model="filterQuery" type="text" :placeholder="$t('Filter Controls')"></b-form-input>
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
              <i v-if="element['fa-icon']" :class="element['fa-icon']"></i>
              {{$t(element.label)}}
            </b-list-group-item>

            <li v-if="!filteredControls.length" class="list-group-item">
                        <span class="text-danger">{{ $t('Control Not Found') }}</span>
            </li>
          </draggable>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Renderer -->
    <b-col class="overflow-auto mh-100 pl-4 pr-4">
      <b-input-group size="sm" class="sticky-top bg-white">
        <b-form-select v-model="currentPage" class="form-control">
          <option v-for="(data, page) in config" :key="page" :value="page">{{ data.name }}</option>
        </b-form-select>

        <b-button
          size="sm"
          variant="secondary"
          class="ml-1"
          @click="openEditPageModal(currentPage)"
        >
          <i class="far fa-edit"/>
        </b-button>

        <b-button
          size="sm"
          variant="danger"
          class="ml-1"
          @click="confirmDelete()"
          :disabled="!displayDelete"
        >
          <i class="far fa-trash-alt"/>
        </b-button>

        <b-button size="sm" variant="secondary" class="ml-1" v-b-modal.addPageModal>
          <i class="fas fa-plus"/>
        </b-button>

        <hr class="w-100">
      </b-input-group>
      <draggable
        ghost-class="form-control-ghost"
        :value="config[currentPage].items"
        @input="updateConfig"
        :options="{group: {name: 'controls'}}"
      >
        <div
          class="control-item"
          :class="{selected: selected === element, hasError: hasError(element)}"
          v-for="(element,index) in config[currentPage].items"
          :key="index"
          @click="inspect(element)"
        >
          <div v-if="element.container" @click="inspect(element)" class="card">
            <div
              v-if="selected === element"
              class="card-header form-element-header d-flex align-items-center"
            >
              <i class="fas fa-arrows-alt-v mr-1"/>
              {{ element.config.name || element.label || $t('Field Name') }}
              <button
                class="btn btn-sm btn-danger ml-auto"
                @click="deleteItem(index)">
                <i class="far fa-trash-alt text-light"/>
              </button>
            </div>

            <component
              class="card-body m-2 mr-3 ml-3 pt-3"
              :class="elementCssClass(element)"
              @inspect="inspect"
              :selected="selected"
              v-model="element.items"
              :config="element.config"
              :is="element['editor-component']"
            ></component>
          </div>

          <div v-else class="card">
            <div
              v-if="selected === element"
              class="card-header form-element-header d-flex align-items-center"
            >
              <i class="fas fa-arrows-alt-v mr-1"/>
              {{ element.config.name || $t('Variable Name') }}
              <button
                class="btn btn-sm btn-danger ml-auto"
                @click="deleteItem(index)"
              >
                <i class="far fa-trash-alt text-light"/>
              </button>
            </div>
            <component
              class="card-body m-0 pb-4 pt-4"
              :class="elementCssClass(element)"
              v-bind="element.config"
              :is="element['editor-component']"
              @input="element.config.interactive ? element.config.content = $event : null"
            />
            <div v-if="!element.config.interactive" class="mask" :class="{ selected: selected === element }"></div>
          </div>
        </div>
      </draggable>
    </b-col>

    <!-- Inspector -->
    <b-col class="overflow-hidden h-100 p-0 inspector-column">
      <b-card no-body class="p-0 h-100">
        <b-card-header>{{ $t('Inspector') }}</b-card-header>

        <b-card-body class="p-0 h-100 overflow-auto">
          <b-button
            v-b-toggle.configuration
            variant="outline"
            class="text-left card-header d-flex align-items-center w-100 outline-0 text-capitalize shadow-none"
            @click="showConfiguration = !showConfiguration"
          >
            <i class="fas fa-cog mr-2"></i>
            {{ $t('Configuration') }}
            <i
              class="fas fa-angle-down ml-auto"
              :class="{ 'fas fa-angle-right' : showConfiguration }"
            ></i>
          </b-button>

          <b-collapse id="configuration" visible class="mt-2">
            <component
              v-for="(item, index) in inspection.inspector"
              :formConfig="config"
              :key="index"
              :is="item.type"
              class="border-bottom pt-1 pb-3 pr-4 pl-4"
              v-bind="item.config"
              v-model="inspection.config[item.field]"
            />
          </b-collapse>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Modals -->
    <b-modal
      id="addPageModal"
      centered
      @ok="addPage"
      :ok-title="$t('Save')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      :title="$t('Add New Page')"
    >
      <form-input
        v-model="addPageName"
        :label="$t('Page Name')"
        :helper="$t('The name of the new page to add')"
      ></form-input>
    </b-modal>

    <b-modal
      ref="editPageModal"
      centered
      @ok="editPage"
      :title="$t('Edit Page Title')"
      :ok-title="$t('Save')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
    >
      <form-input
        v-model="editPageName"
        :label="$t('Page Name')"
        :helper="$t('The new name of the page')"
      ></form-input>
    </b-modal>

    <b-modal
      ref="confirm"
      centered
      title="Confirm delete"
      @ok="deletePage"
      @cancel="hideConfirmModal"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
    >
      <p>{{confirmMessage}}</p>
            <div slot="modal-ok">{{ $t('Delete') }}</div>
    </b-modal>
  </b-row>
</template>

<script>
import Vue from "vue";
import draggable from "vuedraggable";
import HasColorProperty from "../mixins/HasColorProperty";
import * as editor from './editor';
import * as renderer from './renderer';
import * as inspector from './inspector';
import FormMultiColumn from '@/components/renderer/form-multi-column';

import BootstrapVue from "bootstrap-vue";

import "@processmaker/vue-form-elements/dist/vue-form-elements.css";

Vue.use(BootstrapVue);

let Validator = require("validatorjs");
Validator.register(
  "attr-value",
  value => {
    return value.match(/^[a-zA-Z0-9-_]+$/);
  },
  "Must be letters, numbers, underscores or dashes"
);

import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup,
  FormDatePicker,
  FormHtmlEditor
} from "@processmaker/vue-form-elements";

import "@processmaker/vue-form-elements/dist/vue-form-elements.css";

const defaultConfig = [{
  name: "Default",
  items: []
}]

export default {
  props: ['validationErrors', 'initialConfig', 'title'],
  mixins: [HasColorProperty],
  components: {
    draggable,
    FormInput,
    FormSelect,
    FormCheckbox,
    FormRadioButtonGroup,
    FormTextArea,
    FormDatePicker,
    FormHtmlEditor,
    FormMultiColumn,
    ...editor,
    ...inspector,
    ...renderer
  },
  data() {
    const config = this.initialConfig || defaultConfig;

    if (this.title) {
      config[0].name = this.title;
    }

    return {
      currentPage: 0,
      selected: null,
      display: "editor",
      inspection: {},
      // Blank at start, assume the parent component will call addControl for each control
      controls: [],
      pageAddModal: false,
      addPageName: "",
      editPageIndex: null,
      editPageName: "",
      config,
      confirmMessage: "",
      pageDelete: 0,
      translated: [],
      showAssignment: false,
      showConfiguration: false,
      filterQuery: ""
    };
  },
  computed: {
    displayDelete() {
      return this.config.length > 1;
    },
    filteredControls() {
      return this.controls.filter(control => {
        return control.label
          .toLowerCase()
          .includes(this.filterQuery.toLowerCase());
      });
    }
  },
  watch: {
    config: {
      handler() {
        // @todo, remove inspector stuffs
        this.$emit("change", this.config);
      },
      deep: true
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
    }
  },
  methods: {
    updateConfig(items) {
      this.config[this.currentPage].items = items;
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
      this.confirmMessage =
        "Are you sure to delete the page " +
        this.config[this.currentPage].name +
        "?";
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
    },
    openEditPageModal(index) {
      this.editPageIndex = index;
      this.editPageName = this.config[index].name;
      this.$refs.editPageModal.show();
    },
    editPage() {
      this.config[this.editPageIndex].name = this.editPageName;
    },
    addPage() {
      this.config.push({ name: this.addPageName, items: [] });
      this.currentPage = this.config.length - 1;
      this.addPageName = "";
    },
    deletePage() {
      this.currentPage = 0;
      this.config.splice(this.pageDelete, 1);
    },
    inspect(element = {}) {
      this.inspection = element;
      this.selected = element;
    },
    // Cloning the control will ensure the config is not a copy of the observable but a plain javascript object
    // This will ensure each control in the editor has it's own config and it's not shared
    cloneControl(control) {
      let copy = {
        config: JSON.parse(JSON.stringify(control.config)),
        inspector: JSON.parse(JSON.stringify(control.inspector)),
        component: control.component,
        "editor-component": control["editor-component"],
        label: control.label,
        value: control.value
      };
      copy.config.label = this.$t(copy.config.label);
      if (copy.config.options) {
        for (var io in copy.config.options) {
          copy.config.options[io].content = this.$t(
            copy.config.options[io].content
          );
        }
      }

      // If it's a container, let's add an items property, with the default of items in the control
      if (control.container) {
        copy["items"] = JSON.parse(JSON.stringify(control.items));
        copy.container = true;
      }
      return copy;
    }
  },
};
</script>

<style lang="scss" scoped>
$header-bg: #f7f7f7;

.control-icon {
  width: 30px;
  font-size: 20px;

  img {
    height: 20px;
  }
}

.control-item {
  position: relative;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

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

  .mask {
    position: absolute;
    left: 0;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    top: 0;
    height: 100%;

    &.selected {
      top: 4rem;
      height: 50%;
    }
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
}

.form-control-ghost {
  margin-bottom: 0;
  border-radius: 0.25rem;
}
</style>
