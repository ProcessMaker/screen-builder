<template>
    <div class="h-100 mb-3">
        <div class="d-flex h-100 mb-5">

            <div class="w-25 border overflow-auto">
                <div class="card-header">Controls</div>
                <div class="card-body d-flex flex-wrap mb-5">
                    <draggable id="controls"
                               v-model="controls"
                               :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}"
                               :clone="cloneControl">
                        <div class="d-flex align-content-center flex-wrap p-2"
                             v-for="(element, index) in controls"
                             :key="index">
                            <div class="control-icon">
                                <img v-if="element['editor-icon']" :src="element['editor-icon']">
                                <i v-if="element['fa-icon']" :class="element['fa-icon']"></i>
                            </div>
                            <div class="font-weight-normal text-capitalize">{{element.label}}</div>
                        </div>
                    </draggable>
                </div>
            </div>

            <div class="w-75 flex-grow-1 overflow-auto">
                <draggable :element="'ul'"
                           class="nav nav-tabs"
                           v-model="config"
                           :options="{draggable:'.page-item'}"
                           @change="handlePageSort">
                    <li class="nav-item page-item" v-for="(data, page) in config" :key="page">
                        <a class="nav-link"
                           href="#"
                           @click="currentPage = page"
                           :class="{active: currentPage == page}">
                            {{data.name}}
                            <button class="btn btn-sm btn-primary mr-1"
                                    @click="openEditPageModal(page)">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-danger mr-1"
                                    @click="confirmDelete(page)"
                                    v-show="displayDelete">x
                            </button>
                        </a>
                    </li>
                    <li slot="footer" class="nav-item">
                        <a class="nav-link" href="#">
                            <b-btn variant="success" size="sm" v-b-modal.addPageModal>+ Add Page</b-btn>
                        </a>
                    </li>
                </draggable>

                <div class="container p-4 mb-5">
                    <div class="row">
                        <div class="col-sm">
                            <draggable class="p-4"
                                       style="border: 1px dashed #000;"
                                       v-model="config[currentPage]['items']"
                                       :options="{group: {name: 'controls'}}">
                                <div class="control-item"
                                     :class="{selected: selected === element}"
                                     v-for="(element,index) in config[currentPage]['items']"
                                     :key="index">
                                    <div v-if="element.container" @click="inspect(element)">
                                        <component :class="elementCssClass(element)"
                                                   @inspect="inspect"
                                                   :selected="selected"
                                                   v-model="element.items"
                                                   :config="element.config"
                                                   :is="element['editor-component']">
                                        </component>
                                    </div>

                                    <div v-else>
                                        <component :class="elementCssClass(element)"
                                                   v-bind="element.config"
                                                   :is="element['editor-component']">
                                        </component>
                                        <div @click="inspect(element)" class="mask"></div>
                                    </div>

                                    <button class="delete btn btn-sm btn-danger" @click="deleteItem(index)">x</button>
                                </div>
                            </draggable>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-25 border d-flex flex-column">
                <div class="card-header header-fixed">
                    Inspector
                    <div class="float-right dropdown">
                        <button v-if="!validationErrors.length" class="btn btn-sm btn-outline-light" type="button">
                            <i class="fas fa-check-circle text-success"></i>
                        </button>
                        <button v-if="validationErrors.length" class="btn btn-sm btn-outline-warning" type="button" @click="showValidationErrors=!showValidationErrors">
                            <i class="fas fa-times-circle text-danger"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" :class="{'d-block':showValidationErrors && validationErrors.length}">
                            <a v-for="(validation,index) in validationErrors" :key="index"
                                href="javascript:void()"
                                class="dropdown-item" @click="focusInspector(validation)">
                                <i class="fas fa-times-circle text-danger"></i>
                                <b>{{validation.item.component}}</b>
                                {{validation.message}}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="card-body flex-wrap mb-5 overflow-auto box-flex-1" id="inspector">
                    <component v-for="(item, index) in inspection.inspector"
                               :formConfig="config"
                               :key="index"
                               :is="item.type"
                               v-bind="item.config"
                               v-model="inspection.config[item.field]"/>
                </div>
            </div>

            <b-modal id="addPageModal" @ok="addPage" title="Add New Page">
                <form-input v-model="addPageName"
                            label="Page Name"
                            helper="The name of the new page to add"></form-input>
            </b-modal>

            <b-modal ref="editPageModal" @ok="editPage" title="Edit Page Title">
                <form-input v-model="editPageName" label="Page Name" helper="The new name of the page"></form-input>
            </b-modal>

            <b-modal ref="confirm"
                     centered
                     title="Confirm delete"
                     @ok="deletePage"
                     @cancel="hideConfirmModal"
                     cancel-variant="btn btn-outline-secondary"
                     ok-variant="btn btn-secondary ml-2">
                <p>{{confirmMessage}}</p>
                <div slot="modal-ok">Save</div>
            </b-modal>
        </div>
    </div>
</template>

<script>
  import Vue from "vue";
  import draggable from "vuedraggable";

  import FormMultiselect from "./inspector/form-multiselect";
  import OptionsList from "./inspector/options-list";
  import ContainerColumns from "./inspector/container-columns";
  import PageSelect from "./inspector/page-select";
  import ImageUpload from "./inspector/image-upload";
  import ColorSelect from "./inspector/color-select";
  import HasColorProperty from "../mixins/HasColorProperty";

  import FormMultiColumn from "./renderer/form-multi-column";
  import MultiColumn from "./editor/multi-column";

  import FormText from "./renderer/form-text";
  import FormButton from "./renderer/form-button";
  import FormRecordList from "./renderer/form-record-list";
  import FormImage from "./renderer/form-image";

  import BootstrapVue from "bootstrap-vue";

  Vue.use(BootstrapVue);

  let Validator = require('validatorjs');

  import {
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormDatePicker,
    FormHtmlEditor
  } from "@processmaker/vue-form-elements/src/components";

  export default {
    mixins: [HasColorProperty],
    components: {
      draggable,
      FormInput,
      FormSelect,
      FormMultiselect,
      OptionsList,
      ContainerColumns,
      FormCheckbox,
      FormRadioButtonGroup,
      FormTextArea,
      FormText,
      FormHtmlEditor,
      FormButton,
      PageSelect,
      MultiColumn,
      FormMultiColumn,
      FormDatePicker,
      FormRecordList,
      FormImage,
      ImageUpload,
      ColorSelect
    },
    data() {
      return {
        showValidationErrors: false,
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
        confirmMessage: '',
        pageDelete: 0
      };
    },
    computed: {
      validationErrors() {
        const validationErrors = [];
        this.config.forEach(page => {
          page.items.forEach(item => {
            let data = item.config ? item.config : {};
            let rules = {};
            item.inspector.forEach(property => {
              if (property.config.validation) {
                rules[property.field] = property.config.validation;
              }
            });
            let validator = new Validator(data, rules);
            // Validation will not run until you call passes/fails on it
            if(!validator.passes()) {
              Object.keys(validator.errors.errors).forEach(field => {
                validator.errors.errors[field].forEach(error => {
                  validationErrors.push({
                    message: error,
                    page: page,
                    item: item,
                  });
                });
              });
            }
          });
        });
        return validationErrors;
      },
      displayDelete() {
        return this.config.length > 1;
      }
    },
    watch: {
      config: {
        handler: function () {
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
      focusInspector(validation) {
        this.currentPage = this.config.indexOf(validation.page);
        this.$nextTick(() => {
          this.inspect(validation.item);
        });
      },
      confirmDelete(page) {
        this.confirmMessage = 'Are you sure to delete the page ' + this.config[page].name + '?';
        this.pageDelete = page;
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
      deletePage() {
        this.currentPage = 0;
        this.config.splice(this.pageDelete, 1);
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
    .control-icon {
        width: 20px;
        margin-right: 8px;

        img {
            max-width: 20px;
            max-height: 20px;
        }

        text-align: right;

        i {
            font-size: 21px;
            margin-right: 8px;
        }
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
    .box-flex-1 {
        -webkit-box-flex: 1;
           -moz-box-flex: 1;
            -ms-box-flex: 1;
                box-flex: 1;
        -webkit-flex: 1;
           -moz-flex: 1;
            -ms-flex: 1;
                flex: 1;
    }
</style>