<template>
  <div class="dynaform-builder">

    <div class="palette-container">
      <div class="card-header">
        Controls
      </div>
      <draggable v-model="controls" :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}" :clone="cloneControl">
        <div v-for="(element, index) in controls" :key="index">{{element.label}}</div>
      </draggable>
    </div>

    <div class="form-canvas-container">
      <draggable :element="'ul'" class="nav nav-tabs" v-model="config" :options="{draggable:'.page-item'}" @change="handlePageSort">
        <li class="nav-item page-item" v-for="(data, page) in config" :key="page">
          <a class="nav-link" href="#" @click="currentPage = page" :class="{active: currentPage == page}">{{data.name}}
            <button class="btn btn-sm btn-danger" @click="deletePage(page)">x</button>
          </a>
        </li>
        <li slot="footer" class="nav-item">
          <a class="nav-link" href="#">
            <b-btn variant="success" size="sm" v-b-modal.addPageModal>+ Add Page</b-btn>
          </a>
        </li>
      </draggable>
      <div class="editor-canvas">
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <draggable class="editor-draggable" v-model="config[currentPage]['items']" :options="{group: {name: 'controls'}}">
                <div class="control-item" :class="{selected: selected === element}" v-for="(element,index) in config[currentPage]['items']" :key="index">
                  <component v-bind="element.config" :is="element['editor-component']"></component>
                  <div @click="inspect(currentPage, index)" class="mask"></div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="inspector-container">
      <div class="card-header">
        Inspector
      </div>
      <div class="container-fluid">
        <component v-for="(item, index) in inspection.inspector" :formConfig="config" :key="index" :is="item.type" v-bind="item.config" v-model="inspection.config[item.field]" />
      </div>
    </div>

    <b-modal id="addPageModal" @ok="addPage" title="Add New Page">
      <form-input v-model="addPageName" label="Page Name" helper="The name of the new page to add"></form-input>
    </b-modal>

  </div>
</template>

<script>
import Vue from "vue";
import draggable from "vuedraggable";

import OptionsList from "./inspector/options-list";
import PageSelect from "./inspector/page-select"

import FormText from "./renderer/form-text";
import FormButton from "./renderer/form-button";

import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);

import controlConfig from "../form-builder-controls"

import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup
} from "@processmaker/vue-form-elements/src/components";

export default {
  components: {
    draggable,
    FormInput,
    FormSelect,
    OptionsList,
    FormCheckbox,
    FormRadioButtonGroup,
    FormTextArea,
    FormText,
    FormButton,
    PageSelect
  },
 data() {
    return {
      currentPage: 0,
      selected: null,
      display: "editor",
      inspection: {},
      controls: controlConfig,
      pageAddModal: false,
      addPageName: '',
      config: [
          {
            name: 'Default',
            items: []
          }
      ],
 
    };
  },
  watch: {
    config: {
      handler: function() {
        // @todo, remove inspector stuffs
        this.$emit('change', this.config)
      },
      deep: true
    },
    currentPage() {
      this.inspection = {}
    }
  },
  mounted() {
    this.config = this.config;
  },
  methods: {
    handlePageSort(data) {
      this.currentPage = data.moved.newIndex

    },
    addPage() {
      this.config.push({
        name: this.addPageName,
        items: []
      });
      this.currentPage = this.config.length - 1;
      this.addPageName = '';
    },
    deletePage(page) {
      this.config.splice(page, 1);
    },
    inspect(page, index) {
      this.inspection = this.config[page]['items'][index];
      this.selected = this.config[page]['items'][index];
    },
    // Cloning the control will ensure the config is not a copy of the observable but a plain javascript object
    // This will ensure each control in the editor has it's own config and it's not shared
    cloneControl(control) {
      let copy = {
        config: JSON.parse(JSON.stringify(control.config)),
        inspector: JSON.parse(JSON.stringify(control.inspector)),
        component: control.component,
        "editor-component": control["editor-component"],
        label: control.label
      };
      return copy;
    }
  }
};
</script>

<style lang="scss" scoped>
.dynaform-builder {
  display: flex;
  align-content: stretch;
  height: 100%;
  min-height: 100%;
  max-height: 100%;

  .palette-container {
    min-width: 240px;
    width: 240px;
    max-width: 240px;
    border-right: 1px solid #e9edf1;
  }

  .inspector-container {
    min-width: 340px;
    width: 340px;
    max-width: 340px;
    border-left: 1px solid #e9edf1;
    overflow: auto;
  }

  .form-canvas-container {
    flex-grow: 1;
    display: flex;
    align-content: stretch;
    flex-direction: column;
  }

  .preview-canvas,
  .editor-canvas {
    background-color: #f7f9fa;
    flex-grow: 1;
    padding: 48px;
  }
}

.editor-draggable {
  border: 1px dashed #000;
  min-height: 48px;
  content: "Drag Controls";
}

.control-item {
  position: relative;

  &.selected {
    .mask {
      border: 1px solid red;
    }
  }

  .mask {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;

    &:hover {
      border: 1px solid red;
    }
  }
}
</style>


