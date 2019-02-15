<template>
  <div class="dynaform-builder">

    <div class="palette-container">
      <div class="card-header">
        Controls
      </div>
      <draggable id="controls" v-model="controls" :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}" :clone="cloneControl">
        <div class="control" v-for="(element, index) in controls" :key="index">
          <div class="icon">
            <img v-if="element['editor-icon']" :src="element['editor-icon']" />
            <i v-if="element['fa-icon']" :class="element['fa-icon']"></i>
          </div>
          <div class="label">
            {{element.label}}
          </div>
        </div>
      </draggable>
    </div>

    <div class="form-canvas-container">
      <draggable :element="'ul'" class="nav nav-tabs" v-model="config" :options="{draggable:'.page-item'}" @change="handlePageSort">
        <li class="nav-item page-item" v-for="(data, page) in config" :key="page">
          <a class="nav-link" href="#" @click="currentPage = page" :class="{active: currentPage == page}">{{data.name}}
            <button class="btn btn-sm btn-primary" @click="openEditPageModal(page)">Edit</button>
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
              <draggable class="editor-draggable" @start="onStartDrag" @end="onEndDrag" v-model="config[currentPage]['items']" :options="{handle: '.handle', animation: 150, group: {name: 'controls'}}">
                <div class="control-item" :class="{selected: selected === element}" v-for="(element,index) in config[currentPage]['items']" :key="index">
                  <div v-if="element.container">
                    <component :class="elementCssClass(element)" @inspect="inspect" :selected="selected" v-model="element.items" v-bind="element.config" :is="element['editor-component']"></component>
                    <button class="delete btn btn-danger" @click="deleteItem(index)">x</button>
                  </div>

                  <div v-else>
                    <div v-if="element.component == 'FormText'" @click="inspect(element)" class="text-wrapper">
                      <div class="handle">
                        <i class="fas fa-arrows-alt"></i>
                      </div>
                      <component :editable="textEditable" :class="elementCssClass(element)" @onUpdate="gotUpdate($event, element)" @focused="inspect(element)" v-bind="element.config" :is="element['editor-component']" mode="editor"></component>
                      <button class="delete btn btn-danger" @click="deleteItem(index)">x</button>
                    </div>
                    <div v-else class="mask-wrapper">
                      <component :class="elementCssClass(element)" v-bind="element.config" :is="element['editor-component']" mode="editor"></component>
                      <div @click="inspect(element)" class="mask handle"></div>
                      <button class="delete btn btn-danger" @click="deleteItem(index)">x</button>
                    </div>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex flex-row flex-column">
      <div class="card-header">
        Inspector
      </div>
      <div class="card-body">
        <component v-for="(item, index) in inspection.inspector" :formConfig="config" :key="index" :is="item.type" v-bind="item.config" v-model="inspection.config[item.field]" />
      </div>
    </div>

    <b-modal id="addPageModal" @ok="addPage" title="Add New Page">
      <form-input v-model="addPageName" label="Page Name" helper="The name of the new page to add"></form-input>
    </b-modal>

    <b-modal ref="editPageModal" @ok="editPage" title="Edit Page Title">
      <form-input v-model="editPageName" label="Page Name" helper="The new name of the page"></form-input>
    </b-modal>

  </div>
</template>

<script>
import Vue from "vue";
import draggable from "vuedraggable";

import OptionsList from "./inspector/options-list";
import PageSelect from "./inspector/page-select";
import ImageUpload from './inspector/image-upload'
import ColorSelect from "./inspector/color-select"
import HasColorProperty from "../mixins/HasColorProperty"

import FormMultiColumn from "./renderer/form-multi-column";
import MultiColumn from "./editor/multi-column";

import FormText from "./renderer/form-text";
import FormButton from "./renderer/form-button";
import FormRecordList from "./renderer/form-record-list";
import FormImage from "./renderer/form-image";

import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);

import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup,
  FormDatePicker
} from "@processmaker/vue-form-elements/src/components";

export default {
  mixins: [HasColorProperty],
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
    PageSelect,
    MultiColumn,
    FormMultiColumn,
    FormDatePicker,
    FormRecordList,
    FormImage,
    ImageUpload,
    ColorSelect,
  },
  data() {
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
      config: [
        {
          name: "Default",
          items: []
        }
      ],
      textEditable: true,
    };
  },
  watch: {
    config: {
      handler: function() {
        // @todo, remove inspector stuffs
        this.$emit("change", this.config);
      },
      deep: true
    },
    currentPage() {
      this.inspection = {};
    }
  },
  methods: {
    onStartDrag() {
      this.textEditable = false;
    },

    onEndDrag() {
      this.textEditable = true;
    },
    gotUpdate(html, element) {
      element.config.label = html;
      element.config.value = html;
    },
    addControl(control) {
      this.controls.push(control);
    },
    deleteItem(index) {
      // Remove the item from the array in currentPage
      this.config[this.currentPage].items.splice(index, 1);
    },
    handlePageSort(data) {
      this.currentPage = data.moved.newIndex;
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
      this.config.push({
        name: this.addPageName,
        items: []
      });
      this.currentPage = this.config.length - 1;
      this.addPageName = "";
    },
    deletePage(page) {
      this.config.splice(page, 1);
    },
    inspect(element) {
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
        label: control.label
      };
      // If it's a container, let's add an items property, with the default of items in the control
      if (control.container) {
        copy["items"] = JSON.parse(JSON.stringify(control.items));
        copy.container = true;
      }
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

    #controls {
      display: flex;
      flex-wrap: wrap;

      .control {
        margin: 8px;
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;

        .icon {
          width: 42px;
          margin-right: 8px;
          img {
            max-width: 42px;
            max-height: 21px;
          }
          text-align: right;
          i {
            font-size: 24px;
            margin-right: 8px;
          }
        }

        .label {
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
          font-size: 14px;
        }
      }
    }
  }

  .dynaform-builder .d-flex{
    border-left: 1px solid #e9edf1;
    overflow: hidden;
  }

  .d-flex > .card-body {
    min-width: 340px;
    width: 340px;
    max-width: 340px;
    overflow: auto;
    padding-bottom: 50px;
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
    .icon {
      width: 42px;
      margin-right: 8px;
      img {
        max-width: 42px;
        max-height: 21px;
      }
    }
  }
}

.editor-draggable {
  border: 1px dashed #000;
  min-height: 48px;
  content: "Drag Controls";
}

.control-item {
  // position: relative;

  .delete {
    position: absolute;
    top: 0px;
    right: 0px;
    float: right;
    display: none;
  }

  .mask-wrapper, .text-wrapper {
    position: relative;
  }

  &.selected,
  &:hover {
    .mask, .text-wrapper {
      border: 1px solid red;
    }
    .text-wrapper {
      margin: -1px;
    }
    .delete {
      display: inline-block;
    }
  }

  .text-wrapper .handle { 
    cursor: grab;
    text-align: center;
    &:hover {
      background-color: rgba(0, 0, 0, .1);
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


