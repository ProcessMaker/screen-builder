<template>
    <div class="card-body overflow-hidden pl-1 pr-1">
            <div class="form-builder__controls d-flex col-2">
              <div class="card border d-flex">
                  <div class="card-header controls-header">
                    Controls
                  </div>
                  <div class="input-group input-group-sm sticky-top">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1"><i class="fas fa-filter"></i></span>
                    </div>
                    <input v-model="filterQuery" type="text" class="form-control" placeholder="Filter Controls">
                  </div>
                <draggable id="controls"
                              v-model="controls"
                              :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}"
                              :clone="cloneControl"
                              class="overflow-auto"

                            >
                            <ul class="list-group list-group-flush" v-for="(element, index) in filteredControls"
                            :key="index">
                              <li class="list-group-item">
                                <i v-if="element['fa-icon']" :class="element['fa-icon']"></i>
                                {{$t(element.label)}}
                              </li>
                            </ul>

                            <li v-if="!filteredControls.length" class="list-group-item">
                              <span class="text-danger">Control Not Found</span>
                            </li>
                </draggable>
              </div>
            </div>

            <div class="form-builder__designer col-7 pl-3">
                <div class="input-group bg-white">
                  <b-form-select v-model="currentPage" class="mr-2 screen-select form-builder__designer--select">
                    <option
                      v-for="(data, page) in config"
                      :key="page"
                      :value="page"
                    >
                      {{ data.name }}
                    </option>
                  </b-form-select>

                  <b-button size="sm" class="mr-2" @click="openEditPageModal(currentPage)">
                    <i class="far fa-edit" />
                  </b-button>

                  <b-button size="sm" class="mr-2" @click="confirmDelete()" :disabled="!displayDelete">
                    <i class="far fa-trash-alt" />
                  </b-button>

                  <b-button size="sm" class="flex-shrink-0 ml-5" v-b-modal.addPageModal>
                    <i class="fas fa-plus mr-2" />
                    {{$t('Add Screen')}}
                  </b-button>

                  <hr class="w-100 mb-0 mt-3 mb-3" />
              </div>
                <draggable
                          class="overflow-auto h-100"
                          v-model="config[currentPage]['items']"
                          :options="{group: {name: 'controls'}}">
                    <div class="control-item"
                        :class="{selected: selected === element, hasError: hasError(element)  }"
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

                        <div v-else class="card">
                          <span v-if="selected === element" class="card-header form-element-header p-3 pt-3 pb-3">
                            <i class="fas fa-arrows-alt-v" />
                            {{ element.config.name || 'Field Name' }}
                          </span>

                          <component
                            class="card-body m-0 pb-4"
                            :class="elementCssClass(element)"
                            v-bind="element.config"
                            :is="element['editor-component']"
                            @input="element.config.interactive ? element.config.content = $event : null"
                          />

                          <div v-if="!element.config.interactive" class="mask"></div>
                          <button class="delete btn btn-sm btn-secondary mr-3 mt-3" @click="deleteItem(index)">
                            <i class="far fa-trash-alt text-light"></i>
                          </button>
                        </div>
                    </div>
                    <div class="card">
                      <div  class="card-body text-center">
                        Drag an element here
                      </div>
                    </div>
                </draggable>
            </div>
            <div class="form-builder__inspector col-3 shadow-sm pl-0 pr-0 mr-3 card">
                <div class="card-header inspector-header">
                    Inspector
                </div>
                <div class="overflow-auto">
                  <b-button v-b-toggle.configuration variant="outline-*" class="text-left card-header d-flex align-items-center w-100" @click="showConfiguration = !showConfiguration">
                    <i class="fas fa-cog mr-2"></i>
                      Configuration
                    <i class="fas fa-angle-down ml-auto" :class="{ 'fas fa-angle-right' : showConfiguration }"></i>
                  </b-button>

                  <b-collapse id="configuration" visible class="mt-2">
                        <component v-for="(item, index) in inspection.inspector"
                                  :formConfig="config"
                                  :key="index"
                                  :is="item.type"
                                  class="border-bottom pt-1 pb-3 pr-4 pl-4"
                                  v-bind="item.config"
                                  v-model="inspection.config[item.field]"/>
                  </b-collapse>
                </div>
            </div>

            <b-modal id="addPageModal"
                     centered
                     @ok="addPage"
                     :ok-title="$t('Save')"
                     cancel-variant="btn btn-outline-secondary"
                     ok-variant="btn btn-secondary ml-2"
                     :title="$t('Add New Page')">
                <form-input v-model="addPageName"
                            :label="$t('Page Name')"
                            :helper="$t('The name of the new page to add')"></form-input>
            </b-modal>

            <b-modal ref="editPageModal"
                     centered
                     @ok="editPage"
                     :title="$t('Edit Page Title')"
                     :ok-title="$t('Save')"
                     cancel-variant="btn btn-outline-secondary"
                     ok-variant="btn btn-secondary ml-2">
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
    props: ['validationErrors'],
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
        showValidationErrors: false,
        showAssignment: false,
        showConfiguration: false,
        filterQuery: ''
      };
    },
    computed: {
      displayDelete() {
        return this.config.length > 1;
      },
      filteredControls() {
        return this.controls.filter(control => {
          return control.label.toLowerCase().includes(this.filterQuery.toLowerCase())
        });
      },
      formBuilderCount() {
        return this.config[0].items.length
      },
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
        this.confirmMessage = 'Are you sure to delete the page ' + this.config[this.currentPage].name + '?';
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
    },
  };
</script>

<style lang="scss" scoped>
$header-bg: #f7f7f7;

.form-builder__designer {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 1.5rem;

  &--select {
    border-radius: 5px !important;
  }
}
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

          .delete {
            display: initial;
          }
        }

        &:not(.selected) .card {
          border: none;
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
        background: rgba(51,151,225,0.30);
      }
    }

    .list-group:last-child {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    .controls-header {
      border-bottom: none;
    }

    .header-bg {
      background: $header-bg;
    }
</style>
