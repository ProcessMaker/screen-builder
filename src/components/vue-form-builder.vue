<template>
    <div class="overflow-hidden">
      <div class="row card-body">
        <div class="col-2">
          <div class="card">
            <div class="card-header">{{$t('Controls')}}</div>
              <b-input-group size="sm">
                <b-input-group-prepend>
                  <b-input-group-text class="filter-icon">
                    <i class="fas fa-filter"></i>
                  </b-input-group-text>
                </b-input-group-prepend>

                <b-form-input v-model="filterQuery" type="text" placeholder="Filter Controls"></b-form-input>
              </b-input-group>
              <div >
                  <draggable id="controls"
                              v-model="controls"
                              :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}"
                              :clone="cloneControl">
                      <ul class="list-group list-group-flush"
                            v-for="(element, index) in filteredControls"
                            :key="index">
                          <li class="list-group-item">
                                <i v-if="element['fa-icon']" :class="element['fa-icon']"></i>
                                {{$t(element.label)}}

                          </li>
                          <li v-if="!filteredControls.length" class="list-group-item">
                            <span class="text-danger">Control Not Found</span>
                          </li>
                      </ul>
                  </draggable>
              </div>
            </div>
        </div>
        <div class="col-7">
          <div class="row">
            <div class="col-md-7">
              <b-form-select v-model="currentPage" class="form-control">
                <option v-for="(data, page) in config" :key="page" :value="page">{{ data.name }}</option>
              </b-form-select>
            </div>
            <div class="col-md-5 text-right">
              <button class="btn btn-secondary btn-sm" @click="openEditPageModal(page)">{{$t('Edit')}}</button>
              <button type="button" class="btn btn-secondary btn-sm" style="margin:3px 7px;" v-b-modal.addPageModal><i class="fas fa-plus"></i> Add Screen</button>
              <button class="btn btn-secondary btn-sm" @click="confirmDelete(page)" v-show="displayDelete"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>
          <hr>
          <div>
              <div class="row">
                  <div class="col-sm">
                      <draggable  class="p4"
                                  v-model="config[currentPage]['items']"
                                  :options="{group: {name: 'controls'}}">                                 
                          <div class="card mb-4"
                                :class="{selected: selected === element}"
                                v-for="(element,index) in config[currentPage]['items']"
                                :key="index"
                                @click="inspect(element)">
                              <div class="card-header">
                                <i class="fas fa-arrows-alt-v"></i>
                                <button type="button" class="btn btn-secondary btn-sm float-right" @click="deleteItem(index)">
                                  <i class="fas fa-trash-alt"></i>
                                </button>
                              </div>
                              <div class="card-body" v-if="element.container" @click="inspect(element)">
                                  <component :class="elementCssClass(element)"
                                              @inspect="inspect"
                                              :selected="selected"
                                              v-model="element.items"
                                              :config="element.config"
                                              :is="element['editor-component']">
                                  </component>
                              </div>

                              <div v-else class="card-body">
                                  <component
                                    :class="elementCssClass(element)"
                                    v-bind="element.config"
                                    :is="element['editor-component']"
                                    @input="element.config.interactive ? element.config.content = $event : null"
                                  />
                                  <div v-if="!element.config.interactive" class="mask"></div>
                              </div>
                              
                          </div>
                          <div class="text-center text-black-50">Drag an element here</div>
                      </draggable>
                  </div>
              </div>
          </div>
        </div>
        <div class="col-3">
          <div class="card">
            <div class="card-header">
                {{$t('Inspector')}}
            
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
                            <b>{{$t(validation.item.label)}}</b>
                            {{$t(validation.message)}}
                        </a>
                    </div>
                </div>
            </div>
            <div class="card-body flex-wrap mb-5 box-flex-1" id="inspector">
                <component v-for="(item, index) in inspection.inspector"
                            :formConfig="config"
                            :key="index"
                            :is="item.type"
                            v-bind="item.config"
                            v-model="inspection.config[item.field]"/>
            </div>
          </div>
        </div>
      </div>




      <b-modal id="addPageModal" @ok="addPage" :title="$t('Add New Page')">
          <form-input v-model="addPageName"
                      :label="$t('Page Name')"
                      :helper="$t('The name of the new page to add')"></form-input>
      </b-modal>

      <b-modal ref="editPageModal" @ok="editPage" :title="$t('Edit Page Title')">
          <form-input v-model="editPageName" :label="$t('Page Name')" :helper="$t('The new name of the page')"></form-input>
      </b-modal>

      <b-modal ref="confirm"
                centered
                title="Confirm delete"
                @ok="deletePage"
                @cancel="hideConfirmModal"
                cancel-variant="btn btn-outline-secondary"
                ok-variant="btn btn-secondary ml-2">
          <p>{{$t(confirmMessage)}}</p>
          <div slot="modal-ok">{{$t('Save')}}</div>
      </b-modal>
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

  import '@processmaker/vue-form-elements/dist/vue-form-elements.css';

  Vue.use(BootstrapVue);

  let Validator = require('validatorjs');
  Validator.register('attr-value', value => {
    return value.match(/^[a-zA-Z0-9-_]+$/);
  }, 'Must be letters, numbers, underscores or dashes');

  import {
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormDatePicker,
    FormHtmlEditor
  } from "@processmaker/vue-form-elements/src/components";
import { constants } from 'fs';

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
      FormButton,
      PageSelect,
      MultiColumn,
      FormMultiColumn,
      FormDatePicker,
      FormRecordList,
      FormImage,
      ImageUpload,
      ColorSelect,
      FormHtmlEditor
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
        pageDelete: 0,
        translated: [],
        filterQuery: ""
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
      filteredControls() {
        return this.controls.filter(control => {
          return control.label
            .toLowerCase()
            .includes(this.filterQuery.toLowerCase());
        });
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
      },
      inspection(e) {
        if (this.translated.includes(e)) {
          // already translated, don't translate again!
          return
        }
        for (var i in e.inspector) {
          e.inspector[i].config.label = this.$t(e.inspector[i].config.label)
          e.inspector[i].config.helper = this.$t(e.inspector[i].config.helper)
          if (e.inspector[i].config.options) {
            for (var io in e.inspector[i].config.options) {
              e.inspector[i].config.options[io].content = this.$t(e.inspector[i].config.options[io].content)
            }
          }
        }
        this.translated.push(e);
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
          label: control.label,
          value: control.value
        };

        copy.config.label = this.$t(copy.config.label)
        if (copy.config.options) {
          for (var io in copy.config.options) {
            copy.config.options[io].content = this.$t(copy.config.options[io].content)
          }
        }

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
        width: 30px;
        font-size: 20px;

        img {
          height: 20px;
        }
    }

    .control-item {
        position: relative;
        border: 1px solid transparent;

        .delete {
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
        }

        &.selected,
        &:hover {
            border: 1px solid red;

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
