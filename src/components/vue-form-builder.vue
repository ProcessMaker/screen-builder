<template>
    <div class="h-100 mb-3">
          <div class="form-builder card-body row">
            <div class="form-builder__controls col-2">
              <div class="card">
                <div class="card-header">
                  Controls
                </div>
                <div class="input-group input-group-sm mb-1">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1"><i class="fas fa-filter"></i></span>
                  </div>
                  <input type="text" class="form-control" placeholder="Filter Controls" aria-label="Username" aria-describedby="basic-addon1">
                </div>

                <draggable id="controls"
                              v-model="controls"
                              :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}"
                              :clone="cloneControl">
                            <ul class="list-group list-group-flush" v-for="(element, index) in controls"
                            :key="index">
                              <li class="list-group-item">
                                <i v-if="element['fa-icon']" class="text-secondary" :class="element['fa-icon']"></i>
                                {{$t(element.label)}}
                              </li>
                            </ul>
                </draggable>
              </div>
            </div>

            <div class="form-builder__designer h-50rem col-8 overflow-auto">
                 <div class="row">
                <draggable :element="'ul'"
                           class="nav nav-tabs d-flex"
                           v-model="config"
                           :options="{draggable:'.page-item'}"
                           @change="handlePageSort">
                    <li class="nav-item page-item" v-for="(data, page) in config" :key="page">
                        <a class="nav-link"
                           href="#"
                           @click="currentPage = page"
                           :class="{active: currentPage != page}">
                            {{data.name}}
                            <button class="btn btn-sm mr-1 btn-outline-*"
                                @click="openEditPageModal(page)">
                                <i class="far fa-edit"></i>
                            </button>
                             <button v-show="displayDelete" class="delete btn btn-outline-* mr-2" @click="confirmDelete(page)">
                                      <i class="far fa-trash-alt text-danger"></i>
                            </button>
                        </a>
                    </li>
                </draggable>
                <b-btn variant="outline-success" size="sm" v-b-modal.addPageModal>
                  <i class="fas fa-plus mr-2"></i>
                  {{$t('Add Page')}}
                </b-btn>

                <div class="container p-4 m-0">
                      <div class="row">
                          <div class="col">
                              <draggable class="p-4"
                                        v-model="config[currentPage]['items']"
                                        :options="{group: {name: 'controls'}}">
                                  <div class="control-item"
                                      :class="{selected: selected === element}"
                                      v-for="(element,index) in config[currentPage]['items']"
                                      :key="index"
                                      @click="inspect(element)">
                                      <div v-if="element.container" @click="inspect(element)">
                                          <component :class="elementCssClass(element)"
                                                    @inspect="inspect"
                                                    :selected="selected"
                                                    v-model="element.items"
                                                    :config="element.config"
                                                    :is="element['editor-component']">
                                          </component>
                                      </div>

                                      <div v-else class="card mb-5">
                                          <span class="card-header">{{ element.config.name || 'Field Name' }}</span>
                                          <component
                                            class="card-body"
                                            :class="elementCssClass(element)"
                                            v-bind="element.config"
                                            :is="element['editor-component']"
                                            @input="element.config.interactive ? element.config.content = $event : null"
                                          />
                                          <div v-if="!element.config.interactive" class="mask"></div>
                                      </div>

                                    <button class="delete btn btn-outline-* mt-2 mr-3" @click="deleteItem(index)">
                                      <i class="far fa-trash-alt text-danger"></i>
                                    </button>

                                  </div>
                              </draggable>
                              <div class="card">
                              <div class="card-body text-center">
                                Drag an element here
                              </div>
                            </div>
                          </div>
                      </div>
                  </div>
                  </div>

            </div>

            <div class="form-builder__inspector h-50rem col-2 border shadow-sm overflow-auto pl-0 pr-0">
                <div class="card-header sticky-top inspector-header">
                    Inspector
                </div>
                <div class="card-body flex-wrap overflow-auto" id="inspector">
                    <component v-for="(item, index) in inspection.inspector"
                              :formConfig="config"
                              :key="index"
                              :is="item.type"
                              v-bind="item.config"
                              v-model="inspection.config[item.field]"/>
                </div>
            </div>
          </div>


            <b-modal id="addPageModal" @ok="addPage" title="Add New Page">
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
                <p>{{confirmMessage}}</p>
                <div slot="modal-ok">Delete</div>
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
      };
    },
    computed: {
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

        .delete {
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
        }

        &.selected,
        &:hover,{
            box-shadow: 0 3px 6px rgba(255,0,0,0.30), 0 3px 6px rgba(255,0,0,0.60);
            border-radius: 5px;
            border: none;

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

    .h-50rem {
      height: 50rem;
    }

    .inspector-header {
      background: #f7f7f7;
    }

    .validation-panel {
      background: #f7f7f7;
      height: 10rem;
      width: 21.35rem;
      bottom: 3rem;
    }

    .validation__message {
      text-decoration: none;

      &:hover {
        background: rgba(51,151,225,0.30);
      }
    }

    .nav-tabs > li > a{
      border: medium none;

      &:hover {
        color: rgb(51,151,225);
      }
    }
</style>
