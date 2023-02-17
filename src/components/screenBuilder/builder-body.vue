<template>
  <!-- Renderer -->
  <b-col
    id="screen-container"
    class="overflow-auto mh-100 ml-4 mr-4 p-0 d-flex flex-column position-relative pt-2"
  >
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
      class="w-100 d-flex justify-content-center align-items-center drag-placeholder text-center position-absolute rounded mt-4"
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
    <b-modal
      ref="editPageModal"
      :title="$t('Edit Page Title')"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      header-close-content="&times;"
      @ok="editPage"
    >
      <required />
      <form-input
        ref="editPageInput"
        v-model="editPageName"
        :name="$t('Page Name')"
        :label="$t('Page Name') + ' *'"
        :helper="$t('The new name of the page')"
        validation="unique-page-name|required"
        required
        aria-required="true"
      />
    </b-modal>
  </b-col>
</template>

<script>
import { formTypes } from "@/global-properties";
import draggable from "vuedraggable";

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
    accordions: {
      type: Array,
      default: null
    },
    controls: {
      type: Array,
      default: null
    },
    screenType: {
      type: String,
      default: formTypes.form
    }
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
      editPageName: "",
      editPageIndex: null,
      originalPageName: null
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
    }
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
      this.$emit("setElementCssClass", element);
    },
    inspect(element = {}) {

      this.selected = element;
     
      this.$emit("inspect", element);
    },
  
    deleteItem(index) {
      this.$emit("deleteItem", index);
    },
    editPage(e) {
      if (this.$refs.editPageInput.validator.errorCount) {
        e.preventDefault();
        return;
      }
      this.config[this.editPageIndex].name = this.editPageName;
    },
    openEditPageModal(index) {
      this.editPageIndex = index;
      this.editPageName = this.originalPageName = this.config[index].name;
      this.$refs.editPageModal.show();
    },
  }
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
