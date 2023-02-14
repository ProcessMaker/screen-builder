<template>
  <div>
    <b-input-group size="sm" class="bg-white mt-3">
      <b-form-select
        v-if="showToolbar"
        v-model="currentPage"
        class="form-control"
        data-cy="toolbar-page"
      >
        <option v-for="(data, page) in config" :key="page" :value="page">
          {{ data.name }}
        </option>
      </b-form-select>

      <div v-if="showToolbar">
        <b-button
          size="sm"
          variant="secondary"
          class="ml-1"
          :title="$t('Edit Page Title')"
          data-cy="toolbar-edit"
          @click="openEditPageModal(currentPage)"
        >
          <i class="far fa-edit" />
        </b-button>

        <b-button
          size="sm"
          variant="danger"
          class="ml-1"
          :title="$t('Delete Page')"
          :disabled="!displayDelete"
          data-cy="toolbar-remove"
          @click="confirmDelete()"
        >
          <i class="far fa-trash-alt" />
        </b-button>

        <b-button
          v-b-modal.addPageModal
          size="sm"
          variant="secondary"
          class="ml-1 mr-1"
          :title="$t('Add New Page')"
          data-cy="toolbar-add"
          @click="originalPageName = null"
        >
          <i class="fas fa-plus" />
        </b-button>
      </div>

      <b-button-group size="sm" class="ml-1 ml-auto">
        <b-button :disabled="!canUndo" data-cy="toolbar-undo" @click="undo">{{
          $t("Undo")
        }}</b-button>
        <b-button :disabled="!canRedo" data-cy="toolbar-redo" @click="redo">{{
          $t("Redo")
        }}</b-button>
      </b-button-group>

      <hr class="w-100" />
    </b-input-group>

    <div
      v-if="isCurrentPageEmpty"
      data-cy="screen-drop-zone"
      class="
        w-100
        d-flex
        justify-content-center
        align-items-center
        drag-placeholder
        text-center
        position-absolute
        rounded
        mt-4
      "
    >
      {{ $t("Drag an element here") }}
    </div>

    <draggable
      v-if="renderControls"
      :key="editorContentKey"
      data-cy="editor-content"
      class="h-100"
      ghost-class="form-control-ghost"
      :value="config[currentPage].items"
      v-bind="{
        group: { name: 'controls' },
        swapThreshold: 0.5
      }"
      @input="updateConfig"
    >
      <div
        v-for="(element, index) in config[currentPage].items"
        :key="index"
        class="control-item mt-4 mb-4"
        :class="{
          selected: selected === element,
          hasError: hasError(element)
        }"
        :selector="element.config.customCssSelector"
        @click="inspect(element)"
      >
        <div
          v-if="element.container"
          data-cy="screen-element-container"
          class="card"
          @click="inspect(element)"
        >
          <div
            v-if="selected === element"
            class="card-header form-element-header d-flex align-items-center"
          >
            <i class="fas fa-arrows-alt-v mr-1 text-muted" />
            <i
              v-if="element.config.icon"
              :class="element.config.icon"
              class="mr-2 ml-1"
            />
            {{ element.config.name || element.label || $t("Field Name") }}
            <div class="ml-auto">
              <button
                class="btn btn-sm btn-secondary mr-2"
                :title="$t('Copy Control')"
                @click="duplicateItem(index)"
              >
                <i class="fas fa-copy text-light" />
              </button>
              <button
                class="btn btn-sm btn-danger"
                :title="$t('Delete Control')"
                @click="deleteItem(index)"
              >
                <i class="far fa-trash-alt text-light" />
              </button>
            </div>
          </div>
          <component
            :is="element['editor-component']"
            v-model="element.items"
            :validation-errors="validationErrors"
            class="card-body"
            :class="elementCssClass(element)"
            :selected="selected"
            :config="element.config"
            @inspect="inspect"
            @update-state="updateState"
          />
        </div>

        <div v-else class="card" data-cy="screen-element-container">
          <div
            v-if="selected === element"
            class="card-header form-element-header d-flex align-items-center"
          >
            <i class="fas fa-arrows-alt-v mr-1 text-muted" />
            <i
              v-if="element.config.icon"
              :class="element.config.icon"
              class="mr-2 ml-1"
            />
            {{ element.config.name || $t("Variable Name") }}
            <div class="ml-auto">
              <button
                class="btn btn-sm btn-secondary mr-2"
                :title="$t('Copy Control')"
                @click="duplicateItem(index)"
              >
                <i class="fas fa-copy text-light" />
              </button>
              <button
                class="btn btn-sm btn-danger"
                :title="$t('Delete Control')"
                @click="deleteItem(index)"
              >
                <i class="far fa-trash-alt text-light" />
              </button>
            </div>
          </div>
          <component
            v-bind="element.config"
            :is="element['editor-component']"
            :tabindex="element.config.interactive ? 0 : -1"
            class="card-body m-0 pb-4 pt-4"
            :class="[
              elementCssClass(element),
              { 'prevent-interaction': !element.config.interactive }
            ]"
            @input="
              element.config.interactive
                ? (element.config.content = $event)
                : null
            "
            @focusout.native="updateState"
          />
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import { formTypes } from "@/global-properties";
import draggable from "vuedraggable"
export default {
  name: "BuilderBody",
  components: {
    draggable
  },
  props: {
    config: {
      type: Array,
      default: null
    },
    renderControls: {
      type: Boolean,
      default: true
    },
    validationErrors: {
      type: Array,
      default: null
    },
    accordions:{
      type: Array,
      default: null
    },
    controls:{
      type: Array,
      default: null
    },
    screenType: {
      type: String,
      default: formTypes.form,
    },
    //   collator: {
    //     type: Intl.Collator,
    //     default: null
    //   }
  },
  data() {
    return {
      currentPage: 0,
      editorContentKey: 0,
      selected: null,
    };
  },
  computed: {
    canUndo() {
      return this.$store.getters["undoRedoModule/canUndo"];
    },
    canRedo() {
      return this.$store.getters["undoRedoModule/canRedo"];
    },
    isCurrentPageEmpty() {
      // debugger;
      return this.config[this.currentPage].items.length === 0;
    },
    showToolbar() {
      debugger;
      return this.screenType === formTypes.form;
    },
    displayDelete() {
      return this.config.length > 1;
    },
  
  },
  methods: {
    undo() {
      this.inspect();
      this.$store.dispatch("undoRedoModule/undo");
      this.config = JSON.parse(
        this.$store.getters["undoRedoModule/currentState"].config
      );
      this.currentPage = JSON.parse(
        this.$store.getters["undoRedoModule/currentState"].currentPage
      );
    },
    redo() {
      this.inspect();
      this.$store.dispatch("undoRedoModule/redo");
      this.config = JSON.parse(
        this.$store.getters["undoRedoModule/currentState"].config
      );
      this.currentPage = JSON.parse(
        this.$store.getters["undoRedoModule/currentState"].currentPage
      );
    },
    updateState() {
      this.$store.dispatch("undoRedoModule/pushState", {
        config: JSON.stringify(this.config),
        currentPage: this.currentPage
      });
    },
    updateConfig(items) {
      this.config[this.currentPage].items = items;
      this.updateState();
    },
    hasError(element) {
      return this.validationErrors.some(({ item }) => item === element);
    },
    elementCssClass(element) {
      this.$emit("setElementCssClass",element)
    },
    inspect(element = {}) {
      this.inspection = element;
      this.selected = element;
      const defaultAccordion = this.accordions.find(
        (accordion) => this.getInspectorFields(accordion).length > 0
      );
      if (defaultAccordion) {
        // this.openAccordion(defaultAccordion);
        console.log("open acordion");
      }
    },
    getInspectorFields(accordion) {
      if (!this.inspection.inspector) {
        return [];
      }

      const accordionFields = accordion.fields
        .filter((field) => {
          if (typeof field !== "string") {
            const { component } = this.inspection;
            const { showFor, hideFor } = field;

            return showFor === component || hideFor !== component;
          }

          return true;
        })
        .map((field) => (typeof field !== "string" ? field.name : field));

      const control = this.controls.find(
        (item) => item["editor-control"] === this.inspection["editor-control"]
      ) ||
        this.controls.find(
          (item) => item.component === this.inspection.component
        ) || { inspector: [] };

      return control.inspector.filter(
        (input) =>
          accordionFields.includes(input.field) ||
          (!this.knownField(input.field) && accordion.name === "Configuration")
      );
    },
    getAllAccordionizedFields() {
      if (this._allAccordionizedFields) {
        return this._allAccordionizedFields;
      }
      this._allAccordionizedFields = this.accordions.flatMap((accordion) => {
        return accordion.fields.map((fieldName) => {
          if (typeof fieldName === "string") {
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
    
  }
};
</script>
