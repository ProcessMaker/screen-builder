<template>
  <b-row class="h-100">
    <!-- Controls -->
    <b-col cols="2" class="overflow-hidden mh-100 p-0 controls-column">
      <b-card no-body class="h-100">
        <b-card-header>Controls</b-card-header>
        <b-input-group>
          <b-input-group-prepend>
            <b-button size="sm" variant="light" class="border">
              <i class="fas fa-filter"></i>
            </b-button>
          </b-input-group-prepend>

          <b-form-input v-model="filterQuery" type="text" placeholder="Filter Controls"></b-form-input>
        </b-input-group>

        <card-body no-body class="p-0 overflow-auto">
          <draggable
            id="controls"
            v-model="controls"
            :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}"
            :clone="cloneControl"
            class="controls list-group w-auto list-group-flush"
          >
            <b-list-group-item v-for="(element, index) in filteredControls" :key="index">
              <i v-if="element['fa-icon']" :class="element['fa-icon']"></i>
              {{$t(element.label)}}
            </b-list-group-item>

            <li v-if="!filteredControls.length" class="list-group-item">
              <span class="text-danger">Control Not Found</span>
            </li>
          </draggable>
        </card-body>
      </b-card>
    </b-col>

    <!-- Renderer -->
    <b-col cols="7" class="overflow-auto mh-100 pl-4 pr-4 flex-grow-1 mw-100">
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
          <div v-if="element.container" @click="inspect(element)">
            <component
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
              {{ element.config.name || 'Field Name' }}
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
              @focusout.native="updateState"
            />

            <div v-if="!element.config.interactive" class="mask"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-body text-center">Drag an element here</div>
        </div>
      </draggable>
    </b-col>

    <!-- Inspector -->
    <b-col cols="3" class="overflow-hidden h-100 p-0 inspector-column">
      <b-card no-body class="p-0 h-100">
        <b-card-header>Inspector</b-card-header>

        <b-card-body class="p-0 h-100 overflow-auto">
          <b-button
            v-b-toggle.configuration
            variant="outline"
            class="text-left card-header d-flex align-items-center w-100 outline-0 text-capitalize"
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
              @focusout.native="updateState"
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
      <div slot="modal-ok">Delete</div>
    </b-modal>
  </b-row>

  <!-- <div class="card-body overflow-hidden pl-1 pr-3">
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
                              class="overflow-auto controls list-group w-auto list-group-flush"

                            >
                              <b-list-group-item v-for="(element, index) in filteredControls" :key="index">
                                <i v-if="element['fa-icon']" :class="element['fa-icon']"></i>
                                {{$t(element.label)}}
                              </b-list-group-item>

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


                    <b-button size="sm" class="mr-2 header-button d-flex justify-content-center" @click="openEditPageModal(currentPage)">
                      <i class="far fa-edit" />
                    </b-button>

                    <b-button size="sm" variant="danger" class="mr-2 header-button d-flex justify-content-center" @click="confirmDelete()" :disabled="!displayDelete">
                      <i class="far fa-trash-alt" />
                    </b-button>


                    <b-button size="sm" class="flex-shrink-0 header-button d-flex justify-content-center" v-b-modal.addPageModal>
                      <i class="fas fa-plus" />
                    </b-button>

                    <button type="button" class="btn btn-secondary btn-sm ml-1"><i class="fas fa-save"></i></button>

                  <b-button-group size="sm" class="ml-1">
                    <b-button @click="undo" :disabled="!canUndo">{{ $t('Undo') }}</b-button>
                    <b-button @click="redo" :disabled="!canRedo">{{ $t('Redo') }}</b-button>
                  </b-button-group>

                  <hr class="w-100 mb-0 mt-3 mb-3" />
              </div>
                <draggable
                          class="overflow-auto h-100"
                          :value="config[currentPage].items"
                          @input="updateConfig"
                          :options="{group: {name: 'controls'}}">
                    <div class="control-item"
                        :class="{selected: selected === element, hasError: hasError(element)  }"
                        v-for="(element,index) in config[currentPage].items"
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

                        <div v-else class="card mb-3">
                          <div v-if="selected === element" class="card-header form-element-header d-flex align-items-center">
                            <i class="fas fa-arrows-alt-v mr-1" />
                            {{ element.config.name || 'Field Name' }}
                            <button class="btn btn-sm btn-danger ml-auto" @click="deleteItem(index)">
                              <i class="far fa-trash-alt text-light" />
                            </button>
                          </div>

                          <component
                            class="card-body m-0 pb-4"
                            :class="elementCssClass(element)"
                            v-bind="element.config"
                            :is="element['editor-component']"
                            @input="element.config.interactive ? element.config.content = $event : null"
                            @focusout.native="updateState"
                          />

                          <div v-if="!element.config.interactive" class="mask"></div>
                        </div>
                    </div>
                    <div class="card">
                      <div  class="card-body text-center">
                        Drag an element here
                      </div>
                    </div>
                </draggable>
            </div>

            <div class="form-builder__inspector col-3 pl-0 pr-0 card">
                <div class="card-header inspector-header">
                    Inspector
                </div>
                <div class="overflow-auto">
                  <b-button v-b-toggle.configuration variant="outline-*" class="text-left card-header d-flex align-items-center w-100" @click="showConfiguration = !showConfiguration">
                    <i class="fas fa-cog mr-2"></i>
                      {{ $t('Configuration') }}
                    <i class="fas fa-angle-down ml-auto" :class="{ 'fas fa-angle-right' : showConfiguration }"></i>
                  </b-button>

                  <b-collapse id="configuration" visible class="mt-2">
                        <component v-for="(item, index) in inspection.inspector"
                                  :formConfig="config"
                                  :key="index"
                                  :is="item.type"
                                  class="border-bottom pt-1 pb-3 pr-4 pl-4"
                                  v-bind="item.config"
                                  v-model="inspection.config[item.field]"
                                  @focusout.native="updateState"/>
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
  </div>-->
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

import "@processmaker/vue-form-elements/dist/vue-form-elements.css";
import undoRedoModule from "../undoRedoModule";

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

export default {
  props: ["validationErrors"],
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
      config: [],
      confirmMessage: "",
      pageDelete: 0,
      translated: [],
      showAssignment: false,
      showConfiguration: false,
      filterQuery: ""
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
    formBuilderCount() {
      return this.config[0].items.length;
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
    updateState() {
      const items = this.config[this.currentPage].items;
      this.$store.dispatch(
        `page-${this.currentPage}/pushState`,
        JSON.stringify(items)
      );
    },
    undo() {
      this.inspect();
      this.$store.dispatch(`page-${this.currentPage}/undo`);
      this.config[this.currentPage].items = JSON.parse(
        this.$store.getters[`page-${this.currentPage}/currentState`]
      );
    },
    redo() {
      this.inspect();
      this.$store.dispatch(`page-${this.currentPage}/redo`);
      this.config[this.currentPage].items = JSON.parse(
        this.$store.getters[`page-${this.currentPage}/currentState`]
      );
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
      this.config.push({ name: this.addPageName, items: [] });
      this.currentPage = this.config.length - 1;
      this.addPageName = "";

      this.$store.registerModule(`page-${this.currentPage}`, undoRedoModule);
      this.updateState();
    },
    deletePage() {
      this.$store.unregisterModule(`page-${this.currentPage}`);
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
  created() {
    this.addPageName = "Default";
    this.addPage();
  }
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
  }

  &:not(.selected) .card {
    border: none;
  }

  .mask {
    position: absolute;
    top: 4rem;
    left: 0px;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 50%;
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

.controls-column {
  max-width: 150px;
}

.inspector-column {
  max-width: 250px;
}
</style>
