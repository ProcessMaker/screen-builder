<template>
  <b-row class="h-100 m-0">
    <!-- Controls -->
    
      <!-- Here sidebar -->
      <BuilderSidebar
        :controls="controls"
        :render-controls="renderControls"
        :collator="collator"
        :config="config"
      />


  
      <BuilderBody
        :controls="controls"
        :config="config"
        :render-controls="renderControls"
        :validation-errors="validationErrors"
        @setElementCssClass="setElementCssClass"
        @deleteItem="deleteItem"
        @inspect="inspect"
        :accordions="accordions"
        :screen-type="screenType"

      />
  

    <!-- Inspector -->
    
      <BuilderInspector
        :controls="controls"
        :config="config"
        :accordions="accordions"
        :render-controls="renderControls"
        :inspection="inspection"
        :screen-type="screenType"
        :current-page="currentPage"
        :selected="selected"
      />
     
   
    <!-- Modals -->
    <b-modal
      id="addPageModal"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      :title="$t('Add New Page')"
      header-close-content="&times;"
      data-cy="add-page-modal"
      @ok="addPage"
    >
      <required />
      <form-input
        ref="addPageInput"
        v-model="addPageName"
        :name="$t('Page Name')"
        :label="$t('Page Name') + ' *'"
        :helper="$t('The name of the new page to add')"
        validation="unique-page-name|required"
        data-cy="add-page-name"
        required
        aria-required="true"
      />
    </b-modal>

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

    <b-modal
      ref="confirm"
      :title="$t('Caution!')"
      :ok-title="$t('Delete')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      header-close-content="&times;"
      @ok="deletePage"
      @cancel="hideConfirmModal"
    >
      <p>{{ confirmMessage }}</p>
      <div slot="modal-ok">{{ $t("Delete") }}</div>
    </b-modal>
  </b-row>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import draggable from "vuedraggable";
import {
  FormInput,
  FormSelectList,
  FormTextArea,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormHtmlViewer
} from "@processmaker/vue-form-elements";
import _ from "lodash";
import HasColorProperty from "../mixins/HasColorProperty";
import * as renderer from "./renderer";
import * as inspector from "./inspector";
// import "@processmaker/vue-form-elements/dist/vue-form-elements.css";
import accordions from "./accordions";
import { keyNameProperty } from "../form-control-common-properties";
// eslint-disable-next-line import/no-unresolved, import/extensions
import VariableNameGenerator from "@/components/VariableNameGenerator";
// eslint-disable-next-line import/no-unresolved, import/extensions
import testing from "@/mixins/testing";
// eslint-disable-next-line import/no-unresolved, import/extensions
import defaultValueEditor from "./inspector/default-value-editor";
// eslint-disable-next-line import/no-unresolved, import/extensions
import RequiredCheckbox from "./utils/required-checkbox";
// eslint-disable-next-line import/no-unresolved, import/extensions
import MultipleUploadsCheckbox from "./utils/multiple-uploads-checkbox";
import "@processmaker/vue-form-elements/dist/vue-form-elements.css";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { formTypes } from "@/global-properties";

import { inspectorFields } from "@/mixins";

import BuilderSidebar from "./screenBuilder/builder-sidebar";
import BuilderBody from "./screenBuilder/builder-body";
import BuilderInspector from "./screenBuilder/builder-inspector";
// eslint-disable-next-line import/no-extraneous-dependencies
const Validator = require("validatorjs");
// To include another language in the Validator with variable processmaker
const globalObject = typeof window === "undefined" ? global : window;

if (
  globalObject.ProcessMaker &&
  globalObject.ProcessMaker.user &&
  globalObject.ProcessMaker.user.lang
) {
  Validator.useLang(globalObject.ProcessMaker.user.lang);
}

// Todo: Validation messages are not translated. These will need to be converted
// to Validator.registerAsync() in order to get the $t translator.
// Should also probably be converted to a mixin. These changes would then
// require modifications to to App.vue and PM4 Core implementations
Validator.register(
  "columns-adds-to-12",
  (value) => {
    const sum = value.reduce((total, options) => {
      return total + parseInt(options.content, 10);
    }, 0);

    if (sum === 12) {
      return true;
    }
    return false;
  },
  "Columns must add to 12"
);

const defaultConfig = [
  {
    name: "Default",
    items: []
  }
];

export default {
  components: {
    BuilderSidebar,
    BuilderBody,
    BuilderInspector,
    // draggable,
    FormInput,
    // FormSelectList,
    // FormCheckbox,
    // FormTextArea,
    // FormDatePicker,
    // FormHtmlEditor,
    // FormHtmlViewer,
    // RequiredCheckbox,
    // MultipleUploadsCheckbox,
    // defaultValueEditor,
    ...inspector,
    ...renderer
  },
  mixins: [HasColorProperty, testing, inspectorFields],
  props: {
    renderControls: {
      type: Boolean,
      default: true
    },
    validationErrors: {
      type: Array,
      default: null
    },
    initialConfig: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    screenType: {
      type: String,
      default: formTypes.form
    },
    screen: {
      type: Object,
      default: null
    }
  },
  data() {
    const config = this.initialConfig || defaultConfig;
    this.migrateConfig(config);
    const generator = new VariableNameGenerator();
    const variables = generator.GetVariableNames(config);

    if (this.title && config[0].name === "Default") {
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
      originalPageName: null,
      config,
      confirmMessage: "",
      pageDelete: 0,
      translated: [],
      showAssignment: false,
      showVariable: false,
      showDesign: false,
      // filterQuery: "",
      accordions,
      // variables,
      // generator,
      variablesTree: [],
      language: "en",
      collator: null,
      editorContentKey: 0,
    };
  },
  computed: {
    builder() {
      return this;
    },
    // canUndo() {
    //   return this.$store.getters["undoRedoModule/canUndo"];
    // },
    // canRedo() {
    //   return this.$store.getters["undoRedoModule/canRedo"];
    // },
    // displayDelete() {
    //   return this.config.length > 1;
    // },
    // filteredControls() {
    //   return this.controls
    //     .filter((control) => {
    //       return control.label
    //         .toLowerCase()
    //         .includes(this.filterQuery.toLowerCase());
    //     })
    //     .sort((a, b) => {
    //       return this.collator.compare(a.label, b.label);
    //     });
    // }
    // isCurrentPageEmpty() {
    //   return this.config[this.currentPage].items.length === 0;
    // },
    // showToolbar() {
    //   return this.screenType === formTypes.form;
    // }
  },
  watch: {
    config: {
      handler() {
        // this.checkForCaptchaInLoops();
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
          for (let io in e.inspector[i].config.options) {
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
    refreshContent() {
      this.editorContentKey++;
    },
    checkForCaptchaInLoops() {
      this.config.forEach((page) => {
        this.checkForCaptcha(page.items);
      });
    },
    checkForCaptcha(items, insideLoop = false, nestedScreen = null) {
      items.forEach((item) => {
        if (!item.items && item.component == "Captcha" && insideLoop) {
          if (nestedScreen && nestedScreen.config.screen) {
            this.$root.$emit("remove-nested", nestedScreen.config.screen);
            nestedScreen.config.screen = null;
            globalObject.ProcessMaker.alert(
              this.$t(
                "You are trying to place a nested screen within CAPTCHA elements inside a loop. CAPTCHA controls cannot be placed within a Loop control."
              ),
              "danger"
            );
          } else {
            items.splice(items.indexOf(item), 1);
            globalObject.ProcessMaker.alert(
              this.$t(
                "CAPTCHA controls cannot be placed within a Loop control."
              ),
              "danger"
            );
          }
        }
        if (item.items) {
          this.checkForCaptcha(item.items, true, nestedScreen);
        }
        if (
          item.component == "FormNestedScreen" &&
          item.config.screen &&
          window.nestedScreens
        ) {
          let nestedScreenItems =
            window.nestedScreens["id_" + item.config.screen];
          if (nestedScreenItems) {
            nestedScreenItems.forEach((nestedScreenPage) => {
              this.checkForCaptcha(nestedScreenPage.items, insideLoop, item);
            });
          }
        }
      });
    },
    loadVariablesTree() {
      const definition = {
        config: this.$parent.config,
        computed: this.$parent.computed,
        customCSS: this.$parent.customCSS,
        watchers: this.$parent.watchers
      };
      this.variablesTree =
        this.$refs.treeOfVariables.getVariablesTree(definition);
      this.$refs.treeOfVariables.getVariablesTree({ config: [] });
    },
    // accordionName(accordion) {
    //   return accordion.name instanceof Function
    //     ? accordion.name(this.inspection)
    //     : accordion.name;
    // },
    toggleAccordion(accordion) {
      this.accordions.forEach((panel) =>
        panel !== accordion ? (panel.open = false) : null
      );
      accordion.open = !accordion.open;
    },
    openAccordion(accordion) {
      this.accordions.forEach((panel) => (panel.open = false));
      accordion.open = true;
    },
    migrateConfig(config = this.config) {
      config.forEach((page) => this.replaceFormText(page.items));
      config.forEach((page) => this.migrateFormSubmit(page.items));
      config.forEach((page) => this.updateFieldNameValidation(page.items));
      config.forEach((page) =>
        this.removeDataVariableFromNestedScreens(page.items)
      );
    },
    updateFieldNameValidation(items) {
      items.forEach((item) => {
        if (item.inspector) {
          item.inspector.forEach((inspector) => {
            if (
              inspector.field === "name" &&
              "validation" in inspector.config &&
              inspector.config.name !== "DataVariable" &&
              item.component !== "FileUpload" &&
              item.component !== "FormButton"
            ) {
              inspector.config.validation = keyNameProperty.config.validation;
            }
          });
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    removeDataVariableFromNestedScreens(items) {
      items.forEach((item) => {
        if (item.inspector) {
          const hasDataVariable = item.inspector.find(
            (inspector) => inspector.config.name === "DataVariable"
          );
          item.inspector = item.inspector.filter(
            (inspector) => inspector.config.name !== "DataVariable"
          );
          if (hasDataVariable) {
            delete item.config.name;
          }
        }
      });
    },
    replaceFormText(items) {
      items.forEach((item) => {
        if (item.component === "FormText") {
          item.component = "FormHtmlEditor";
          item["editor-component"] = "FormHtmlEditor";
          const style =
            (item.config.fontSize
              ? "font-size: " + item.config.fontSize + ";"
              : "") +
            (item.config.fontWeight
              ? "font-weight: " + item.config.fontWeight + ";"
              : "") +
            (item.config.textAlign
              ? "text-align: " + item.config.textAlign + ";"
              : "");
          item.config = {
            content:
              '<div style="' + style + '">' + item.config.label + "</div>",
            interactive: true
          };
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    migrateFormSubmit(items) {
      items.forEach((item) => {
        if (item["editor-control"] !== "FormSubmit") {
          item["editor-control"] = item["editor-component"];
        }

        if (item.config.event === "submit") {
          if (item["editor-component"] === "FormNestedScreen") {
            // Old nested screens erroneously had an event key. Remove it here
            // and set the editor-control back to FormNestedScreen.
            delete item.config.event;
            item["editor-control"] = "FormNestedScreen";
            item.config.name = "Nested Screen";
          } else {
            if (item["editor-control"] !== "FormImage") {
              item["editor-control"] = "FormSubmit";
            }
          }
        }
        if (item.config.event === "pageNavigate") {
          item["editor-control"] = "PageNavigation";
        }
        if (
          item.items instanceof Array &&
          item.component === "FormMultiColumn"
        ) {
          item["editor-control"] = "FormMultiColumn";
          item.items.forEach((column) => this.migrateFormSubmit(column));
        }
      });
    },
    // getAllAccordionizedFields() {
    //   if (this._allAccordionizedFields) {
    //     return this._allAccordionizedFields;
    //   }
    //   this._allAccordionizedFields = this.accordions.flatMap((accordion) => {
    //     return accordion.fields.map((fieldName) => {
    //       if (typeof fieldName === "string") {
    //         return fieldName;
    //       }
    //       return fieldName.name;
    //     });
    //   });
    //   return this._allAccordionizedFields;
    // },
    // knownField(field) {
    //   return this.getAllAccordionizedFields().includes(field);
    // },
    // getInspectorFields(accordion) {
    //   if (!this.inspection.inspector) {
    //     return [];
    //   }

    //   const accordionFields = accordion.fields
    //     .filter((field) => {
    //       if (typeof field !== "string") {
    //         const { component } = this.inspection;
    //         const { showFor, hideFor } = field;

    //         return showFor === component || hideFor !== component;
    //       }

    //       return true;
    //     })
    //     .map((field) => (typeof field !== "string" ? field.name : field));

    //   const control = this.controls.find(
    //     (item) => item["editor-control"] === this.inspection["editor-control"]
    //   ) ||
    //     this.controls.find(
    //       (item) => item.component === this.inspection.component
    //     ) || { inspector: [] };

    //   return control.inspector.filter(
    //     (input) =>
    //       accordionFields.includes(input.field) ||
    //       (!this.knownField(input.field) && accordion.name === "Configuration")
    //   );
    // },
    updateState() {
      this.$store.dispatch("undoRedoModule/pushState", {
        config: JSON.stringify(this.config),
        currentPage: this.currentPage
      });
    },
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
        this.$nextTick(() => {
          const field = this.$el.querySelector(
            `[field-name="${validation.field}"]`
          );
          if (field) {
            const accordion = this.$el.querySelector(
              `[accordion-name="${field.getAttribute("field-accordion")}"]`
            );
            accordion &&
              accordion.getAttribute("is-open") === "0" &&
              accordion.click();
            field.focus instanceof Function && field.focus();
          }
        });
      });
    },
    confirmDelete() {
      this.confirmMessage = this.$t(
        "Are you sure you want to delete {{item}}?",
        { item: this.config[this.currentPage].name }
      );
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
      this.updateState();
    },
    duplicateItem(index) {
      const duplicate = _.cloneDeep(this.config[this.currentPage].items[index]);
      this.config[this.currentPage].items.push(duplicate);
    },
    openEditPageModal(index) {
      this.editPageIndex = index;
      this.editPageName = this.originalPageName = this.config[index].name;
      this.$refs.editPageModal.show();
    },
    editPage(e) {
      if (this.$refs.editPageInput.validator.errorCount) {
        e.preventDefault();
        return;
      }
      this.config[this.editPageIndex].name = this.editPageName;
    },
    addPage(e) {
      if (this.$refs.addPageInput.validator.errorCount) {
        e.preventDefault();
        return;
      }
      this.config.push({ name: this.addPageName, items: [] });
      this.currentPage = this.config.length - 1;
      this.addPageName = "";
      this.updateState();
    },
    deletePage() {
      this.config.splice(this.pageDelete, 1);
      this.currentPage = this.pageDelete - 1 >= 0 ? this.pageDelete - 1 : 0;
      this.$store.dispatch("undoRedoModule/pushState", {
        config: JSON.stringify(this.config),
        currentPage: this.currentPage,
        deletedPage: true
      });
    },
    inspect(element = {}) {
      this.inspection = element;
      // this.selected = element;
      const defaultAccordion = this.accordions.find(
        (accordion) => this.getInspectorFields(accordion).length > 0
      );
      if (defaultAccordion) {
        this.openAccordion(defaultAccordion);
      }
    },
    // Cloning the control will ensure the config is not a copy of the observable but a plain javascript object
    // This will ensure each control in the editor has it's own config and it's not shared
    // cloneControl(control) {
    //   let copy = {
    //     config: JSON.parse(JSON.stringify(control.config)),
    //     inspector: JSON.parse(JSON.stringify(control.inspector)),
    //     component: control.component,
    //     "editor-component": control["editor-component"],
    //     "editor-control": control["editor-control"],
    //     label: control.label,
    //     value: control.value
    //   };
    //   if (control.component === "FormDatePicker" && copy.config.phrases) {
    //     copy.config.phrases.ok = this.$t(copy.config.phrases.ok);
    //     copy.config.phrases.cancel = this.$t(copy.config.phrases.cancel);
    //   }
    //   copy.config.label = this.$t(copy.config.label);
    //   if (Array.isArray(copy.config.options)) {
    //     for (var io in copy.config.options) {
    //       copy.config.options[io].content = this.$t(
    //         copy.config.options[io].content
    //       );
    //     }
    //   }

    //   // If it's a container, let's add an items property, with the default of items in the control
    //   if (control.container) {
    //     copy["items"] = JSON.parse(JSON.stringify(control.items));
    //     copy.container = true;
    //   }

    //   //Generate Variable Name
    //   if (
    //     control.inspector.indexOf(keyNameProperty) !== -1 ||
    //     control.component === "FormLoop"
    //   ) {
    //     [this.variables, copy.config.name] = this.generator.generate(
    //       this.config,
    //       copy["editor-control"] ? copy["editor-control"] : copy["component"]
    //     );
    //     if (_.has(copy, "config.settings.varname")) {
    //       copy.config.settings.varname = copy.config.name;
    //     }
    //   }

    //   return copy;
    // },
    initiateLanguageSupport() {
      if (document.documentElement.lang) {
        this.language = document.documentElement.lang;
      }
      this.collator = Intl.Collator(this.language);
    },
    setElementCssClass(element){
      this.elementCssClass(element);
    }
  },
  created() {
    Validator.register(
      "unique-page-name",
      (value) => {
        const pageNames = this.config
          .map((config) => config.name)
          .filter((name) => name !== this.originalPageName);
        return !pageNames.includes(value);
      },
      this.$t("Must be unique")
    );
    this.$store.dispatch("undoRedoModule/pushState", {
      config: JSON.stringify(this.config),
      currentPage: this.currentPage
    });
    this.initiateLanguageSupport();
  },
  mounted() {
    // this.checkForCaptchaInLoops();
    // this.$root.$on("nested-screen-updated", () => {
    //   this.checkForCaptchaInLoops();
    // });
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
