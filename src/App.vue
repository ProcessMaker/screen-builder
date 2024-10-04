<template>
  <b-container id="screen-builder-container" class="h-100">
    <b-card id="app" no-body class="h-100 bg-white border-top-0 ">
      <!-- Card Header -->
      <b-card-header class="bg-white p-0">
        <b-row>
          <b-col class="d-flex align-items-center">
            <b-button-group size="sm px-2">
              <b-button
                :variant="displayBuilder ? 'secondary' : 'outline-secondary'"
                data-cy="mode-editor"
                @click="changeMode('editor')"
              >
                <i class="fas fa-drafting-compass pr-1" />{{ $t("Design") }}
              </b-button>
              <b-button
                :variant="!displayBuilder ? 'secondary' : 'outline-secondary'"
                data-cy="mode-preview"
                @click="changeMode('preview')"
              >
                <i class="fas fa-cogs pr-1" />{{ $t("Preview") }}
              </b-button>
            </b-button-group>

            <b-button-group v-show="displayPreview" size="sm">
              <b-button
                v-b-tooltip.hover
                :variant="
                  deviceScreen === 'desktop' ? 'secondary' : 'outline-secondary'
                "
                data-cy="device-screen-desktop-button"
                :title="$t('Desktop')"
                @click="changeDeviceScreen('desktop')"
              >
                <i class="fas fa-desktop" />
              </b-button>
              <b-button
                v-b-tooltip.hover
                :variant="
                  deviceScreen === 'mobile' ? 'secondary' : 'outline-secondary'
                "
                data-cy="device-screen-mobile-button"
                :title="$t('Mobile')"
                @click="changeDeviceScreen('mobile')"
              >
                <i class="fas fa-mobile" />
              </b-button>
            </b-button-group>
          </b-col>

          <b-col v-if="displayBuilder && !displayPreview" class="text-right">
            <screen-toolbar
              :disabled="$refs.builder?.isCurrentPageClipboard"
              @undo="$refs.builder.undo()"
              @redo="$refs.builder.redo()"
              @open-calc="openComputedProperties"
              @open-customCss="openCustomCSS"
              @open-watchers="openWatchersPopup"
            >
              <b-btn
                v-b-modal="'uploadmodal'"
                variant="secondary"
                size="sm"
                class="mr-2"
                :title="$t('Load Screen')"
              >
                <i class="fas fa-upload mr-1" />
              </b-btn>
              <b-btn
                v-b-modal.preview-config
                variant="secondary"
                size="sm"
                class="mr-2"
                :title="$t('Save Screen')"
                @click="saveToLocalStorage()"
              >
                <i class="fas fa-save mr-1" />
              </b-btn>
            </screen-toolbar>
          </b-col>
          <b-modal
            id="uploadmodal"
            ref="uploadmodal"
            :title="$t('Upload JSON File')"
            :cancel-title="$t('Cancel')"
            :ok-title="$t('Upload')"
            :ok-disabled="!uploadedJson"
            cancel-variant="outline-secondary"
            ok-variant="secondary"
            header-close-content="&times;"
            @hidden="clearUpload"
            @ok="loadScreenPackage"
          >
            <file-upload v-model="jsonFiles" class="btn btn-primary">
              {{ $t("Select file") }}
            </file-upload>

            <span v-if="jsonFiles[0]" class="ml-3">{{
              jsonFiles[0].name
            }}</span>
          </b-modal>
        </b-row>
      </b-card-header>

      <!-- Card Body -->
      <b-card-body class="overflow-auto p-0 m-0">
        <!-- Vue-form-builder -->
        <vue-form-builder
          ref="builder"
          :validation-errors="validationErrors"
          :class="displayBuilder ? 'd-flex' : 'd-none'"
          :screen="screen"
          title="Default"
          :render-controls="displayBuilder"
          @change="updateConfig"
        >
          <default-loading-spinner />
        </vue-form-builder>

        <!-- Preview -->
        <b-row
          v-show="displayPreview"
          id="preview"
          class="h-100 m-0"
          data-cy="preview"
        >
          <b-col class="d-flex overflow-auto h-100" data-cy="preview-content">
            <vue-form-renderer
              ref="renderer"
              :key="rendererKey"
              v-model="previewData"
              :mode="mode"
              :config="preview.config"
              :computed="preview.computed"
              :custom-css="preview.customCSS"
              :watchers="preview.watchers"
              :show-errors="true"
              :device-screen="deviceScreen"
              @css-errors="cssErrors = $event"
              @submit="previewSubmit"
              @update="updateDataPreview"
            />
          </b-col>

          <b-col class="overflow-hidden h-100 preview-inspector p-0">
            <b-card
              no-body
              class="p-0 h-100 rounded-0 border-top-0 border-right-0 border-bottom-0"
            >
              <b-card-body class="p-0">
                <b-button
                  variant="outline"
                  class="text-left card-header d-flex align-items-center w-100 shadow-none"
                  @click="showDataInput = !showDataInput"
                >
                  <i class="fas fa-file-import mr-2" />
                  {{ $t("Data Input") }}
                  <i
                    class="fas ml-auto"
                    :class="showDataInput ? 'fa-angle-down' : 'fa-angle-right'"
                  />
                </b-button>

                <b-collapse id="showDataInput" v-model="showDataInput">
                  <monaco-editor
                    v-model="previewInput"
                    :options="monacoOptions"
                    class="data-collapse"
                    language="json"
                    data-cy="preview-data-input"
                    @change="updateDataInput"
                  />
                </b-collapse>

                <b-button
                  variant="outline"
                  class="text-left card-header d-flex align-items-center w-100 shadow-none"
                  data-toggle="collapse"
                  @click="showDataPreview = !showDataPreview"
                >
                  <i class="fas fa-file-code mr-2" />
                  {{ $t("Data Preview") }}
                  <i
                    class="fas ml-auto"
                    :class="
                      showDataPreview ? 'fa-angle-down' : 'fa-angle-right'
                    "
                  />
                </b-button>

                <b-collapse
                  id="showDataPreview"
                  v-model="showDataPreview"
                  data-cy="preview-data-content"
                  class="mt-2"
                >
                  <monaco-editor
                    v-model="previewDataStringify"
                    :options="monacoOptions"
                    class="editor"
                    language="json"
                    @editorDidMount="monacoMounted"
                  />
                </b-collapse>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-card-body>

      <!-- Card Footer -->
      <b-card-footer
        class="d-flex d-flex justify-content-end align-items-center"
      >
        <b-form-checkbox v-model="toggleValidation" name="check-button" switch>
          {{ $t("Screen Validation") }}
        </b-form-checkbox>

        <div class="ml-3" @click="showValidationErrors = !showValidationErrors">
          <button
            type="button"
            class="btn btn-light btn-sm"
            data-cy="open-console"
          >
            <i class="fas fa-angle-double-up" />
            {{ $t("Open Console") }}
            <span
              v-if="allErrors === 0 && allWarnings === 0"
              class="badge badge-success"
            >
              <i class="fas fa-check-circle" />
            </span>

            <span v-if="allErrors > 0" class="badge badge-danger">
              <i class="fas fa-times-circle" />
              {{ $t(allErrors) }}
            </span>
            <span v-if="allWarnings > 0" class="badge badge-warning">
              <i class="fas fa-exclamation-triangle" />
              {{ $t(allWarnings) }}
            </span>
          </button>
        </div>

        <div
          v-if="showValidationErrors"
          class="validation-panel position-absolute border-left border-top overflow-auto"
          :class="{
            'd-block': showValidationErrors && validationErrors.length
          }"
          data-cy="validation-panel"
        >
          <div v-if="!previewInputValid" class="p-3 font-weight-bold text-dark">
            <i class="fas fa-times-circle text-danger mr-3" />
            {{ $t("Invalid JSON Data Object") }}
          </div>
          <b-button
            v-for="(validation, index) in warnings"
            :key="index"
            variant="link"
            class="validation__message d-flex align-items-center p-3"
            data-cy="focus-inspector"
            @click="focusInspector(validation)"
          >
            <i class="fas fa-exclamation-triangle text-warning d-block mr-3" />
            <span class="ml-2 text-dark font-weight-bold text-left">
              {{ validation.reference }}
              <span class="d-block font-weight-normal">{{
                validation.message
              }}</span>
            </span>
          </b-button>
          <b-button
            v-for="(validation, index) in validationErrors"
            :key="index"
            variant="link"
            class="validation__message d-flex align-items-center p-3"
            data-cy="focus-inspector"
            @click="focusInspector(validation)"
          >
            <i class="fas fa-times-circle text-danger d-block mr-3" />
            <span class="ml-2 text-dark font-weight-bold text-left">
              {{ validation.item.component }}
              <span class="d-block font-weight-normal">{{
                validation.message
              }}</span>
            </span>
          </b-button>
          <span
            v-if="!allErrors && !allWarnings"
            class="d-flex justify-content-center align-items-center h-100"
            >{{ $t("No Errors") }}</span
          >
        </div>
      </b-card-footer>
    </b-card>
    <!-- Modals -->
    <computed-properties ref="computedProperties" v-model="computed" />
    <custom-css ref="customCSS" v-model="customCSS" :css-errors="cssErrors" />
    <watchers-popup ref="watchersPopup" v-model="watchers" />
    <b-modal
      id="preview-config"
      size="xl"
      title="Screen Config JSON Preview"
      header-close-content="&times;"
    >
      <monaco-editor
        v-model="previewConfig"
        style="height: 500px"
        :options="monacoOptions"
        language="json"
        @editorDidMount="editorDidMount"
      />
    </b-modal>
  </b-container>
</template>

<script>
import MonacoEditor from "vue-monaco";
import { cloneDeep, debounce } from "lodash";
import { mapMutations } from "vuex";
import Validator from "@chantouchsek/validatorjs";
import ComputedProperties from "./components/computed-properties.vue";
import WatchersPopup from "./components/watchers-popup.vue";
import CustomCss from "./components/custom-css.vue";
import VueFormBuilder from "./components/vue-form-builder.vue";
import VueFormRenderer from "./components/vue-form-renderer.vue";
import ScreenToolbar from "./components/ScreenToolbar.vue";
import canOpenJsonFile from "./mixins/canOpenJsonFile";

// Bring in our initial set of controls
import controlConfig from "./form-builder-controls";
import globalProperties from "./global-properties";

import "bootstrap";
import "./assets/css/tabs.css";

// To include another language in the Validator with variable processmaker
const globalObject = typeof window === "undefined" ? global : window;

/* istanbul ignore next */
Validator.register(
  "attr-value",
  (value) => {
    return value.match(/^[a-zA-Z0-9-_]+$/);
  },
  "Must be letters, numbers, underscores or dashes"
);

const exampleScriptsForWatchers = [
  // eslint-disable-next-line no-unused-vars
  (items, filter) => {
    items.push({
      type: "Test Data Sources",
      items: [
        {
          id: "data_source-1",
          title: "Test Data Source",
          endpoints: {
            list: {
              dataMapping: [
                { key: "requestVar1", type: "BODY", value: "responseProp1" },
                { key: "requestVar2", type: "BODY", value: "responseProp2" }
              ]
            }
          }
        }
      ]
    });
    items.push({
      type: "Test Script",
      items: [
        {
          id: "script-1",
          title: "Test Script"
        }
      ]
    });
  }
];

export default {
  name: "App",
  components: {
    ComputedProperties,
    CustomCss,
    VueFormBuilder,
    VueFormRenderer,
    MonacoEditor,
    WatchersPopup,
    ScreenToolbar,
  },
  mixins: [canOpenJsonFile],
  data() {
    return {
      previewDataStringify: "",
      numberOfElements: 0,
      preview: {
        config: [
          {
            name: "Default",
            computed: [],
            items: []
          }
        ],
        computed: [],
        customCSS: "",
        watchers: []
      },
      rendererKey: 0,
      screen: {
        id: 1
      },
      watchers_config: {
        api: {
          scripts: exampleScriptsForWatchers,
          execute: null
        }
      },
      mode: "editor",
      deviceScreen: "desktop",
      // Computed properties
      computed: [],
      // Watchers
      watchers: [],
      config: [
        {
          name: "Default",
          computed: [],
          items: []
        }
      ],
      previewData: {},
      previewInput: "{}",
      customCSS: "",
      cssErrors: "",
      showValidationErrors: false,
      toggleValidation: true,
      showDataPreview: true,
      showDataInput: true,
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: "off",
        minimap: {
          enabled: false
        }
      }
    };
  },
  computed: {
    previewInputValid() {
      try {
        JSON.parse(this.previewInput);
        return true;
      } catch (err) {
        return false;
      }
    },
    previewConfig: {
      get() {
        return JSON.stringify(this.config);
      },
      // eslint-disable-next-line no-unused-vars
      set(val) {}
    },
    displayBuilder() {
      return this.mode === "editor";
    },
    displayPreview() {
      return this.mode === "preview";
    },
    allErrors() {
      let errorCount = 0;

      if (!this.previewInputValid) {
        errorCount++;
      }

      return this.validationErrors.length + errorCount;
    },
    allWarnings() {
      return this.warnings.length;
    },
    validationErrors() {
      if (!this.toggleValidation) {
        return [];
      }

      const validationErrors = [];

      this.config.forEach((page) => {
        validationErrors.push(
          ...this.getValidationErrorsForItems(page.items, page)
        );
      });

      return validationErrors;
    },
    warnings() {
      const warnings = [];
      // Check if screen has watchers that use scripts
      const watchersWithScripts = this.watchers
        ? this.watchers.filter(
            (watcher) => watcher.script.id.substr(0, 7) === "script-"
          ).length
        : 0;
      if (watchersWithScripts > 0) {
        warnings.push({
          message: this.$t(
            "Using watchers with Scripts can slow the performance of your screen."
          )
        });
      }
      // Count form elements
      if (this.numberOfElements >= 25) {
        warnings.push({
          message: this.$t(
            "We recommend using fewer than 25 form elements in your screen for optimal performance."
          )
        });
      }
      return warnings;
    },
     // Get clipboard items from Vuex store
    clipboardItems() {
      return this.$store.getters["clipboardModule/clipboardItems"];
    },
  },
  created() {
    this.updateDataInput = debounce(this.updateDataInput, 1000);
    this.updateDataPreview = debounce(this.updateDataPreview, 1000);
  },
  mounted() {
    this.countElements = debounce(this.countElements, 2000);
    if (
      globalObject.ProcessMaker &&
      globalObject.ProcessMaker.user &&
      globalObject.ProcessMaker.user.lang
    ) {
      Validator.useLang(globalObject.ProcessMaker.user.lang);
    }
    // Iterate through our initial config set, calling this.addControl
    controlConfig.forEach((config) => {
      config.control.inspector.push(...globalProperties[0].inspector);

      this.addControl(
        config.control,
        config.rendererComponent,
        config.rendererBinding,
        config.builderComponent,
        config.builderBinding
      );
    });

    this.loadFromLocalStorage();
  },
  methods: {
    ...mapMutations("globalErrorsModule", { setStoreMode: "setMode" }),
    updateDataInput() {
      this.updateDataInputNow();
    },
    updateDataInputNow() {
      if (this.previewInputValid) {
        // Copy data over
        this.previewData = JSON.parse(this.previewInput);
        this.updateDataPreview();
      }
    },
    updateDataPreview() {
      this.previewDataStringify = JSON.stringify(this.previewData, null, 2);
    },
    monacoMounted(editor) {
      this.editor = editor;
      this.editor.updateOptions({ readOnly: true });
    },
    countElements() {
      this.$refs.renderer.countElements(this.config).then((allElements) => {
        this.numberOfElements = allElements.length;
      });
    },
    changeMode(mode) {
      this.previewData = this.previewInputValid
        ? JSON.parse(this.previewInput)
        : {};
      if (mode === "preview") {
        this.$dataProvider.flushScreenCache();
        this.preview.config = cloneDeep(this.config);
        this.preview.computed = cloneDeep(this.computed);
        this.preview.customCSS = cloneDeep(this.customCSS);
        this.preview.watchers = cloneDeep(this.watchers);
        this.rendererKey++;
        this.$refs.renderer.hasSubmitted(false);
      } else {
        this.$refs.builder.refreshContent();
      }
      this.setStoreMode(this.mode);
      this.mode = mode;
    },
    changeDeviceScreen(deviceScreen) {
      this.deviceScreen = deviceScreen;
      this.$nextTick(() => {
        this.$refs.renderer.checkIfIsMobile();
      });
    },
    loadFromLocalStorage() {
      const savedConfig = localStorage.getItem("savedConfig");
      const savedWatchers = localStorage.getItem("savedWatchers");
      const customCSS = localStorage.getItem("customCSS");
      const computed = localStorage.getItem("computed");
      const savedClipboard = localStorage.getItem("savedClipboard");  

      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.$refs.builder.config = config;
        this.$refs.builder.migrateConfig();
      }

      if (savedWatchers) {
        const watcherConfig = JSON.parse(savedWatchers);
        this.watchers = watcherConfig;
      }

      if (customCSS) {
        this.customCSS = customCSS;
      }

      if (computed) {
        this.computed = JSON.parse(computed);
      }
    },
    saveToLocalStorage() {
      localStorage.setItem("savedConfig", JSON.stringify(this.config));
      localStorage.setItem("savedWatchers", JSON.stringify(this.watchers));
      localStorage.setItem("customCSS", this.customCSS);
      localStorage.setItem("computed", JSON.stringify(this.computed));
    },
    editorDidMount(editor) {
      editor.getAction("editor.action.formatDocument").run();
    },
    getValidationErrorsForItems(items, page) {
      const validationErrors = [];

      items.forEach((item) => {
        if (item.container) {
          item.items.forEach((containerItems) => {
            if (!Array.isArray(containerItems)) {
              containerItems = [containerItems];
            }
            validationErrors.push(
              ...this.getValidationErrorsForItems(containerItems, page)
            );
          });
        }

        const data = item.config || {};
        const rules = {};

        item.inspector.forEach((property) => {
          if (property.config.validation) {
            rules[property.field] = property.config.validation;
          }
        });

        const validator = new Validator(data, rules);

        // To include another language in the Validator with variable processmaker
        if (
          globalObject.ProcessMaker &&
          globalObject.ProcessMaker.user &&
          globalObject.ProcessMaker.user.lang
        ) {
          Validator.useLang(globalObject.ProcessMaker.user.lang);
        }

        // Validation will not run until you call passes/fails on it
        let passes;
        try {
          passes = validator.passes();
        } catch (err) {
          // Prevent errors during validation break the screen builder loading
          passes = false;
        }
        if (!passes) {
          Object.keys(validator.errors.errors).forEach((field) => {
            validator.errors.errors[field].forEach((error) => {
              validationErrors.push({
                message: error,
                page,
                item,
                field
              });
            });
          });
        }
      });

      return validationErrors;
    },
    focusInspector(validate) {
      this.$refs.builder.focusInspector(validate);
    },
    openWatchersPopup() {
      this.$refs.watchersPopup.show();
    },
    openComputedProperties() {
      this.$refs.computedProperties.show();
    },
    openCustomCSS() {
      this.$refs.customCSS.show();
    },
    updateConfig(newConfig) {
      this.config = newConfig;
      // Recount number of elements
      this.countElements();
    },
    previewSubmit() {
      alert("Preview Form was Submitted");
    },
    addControl(
      control,
      rendererComponent,
      rendererBinding,
      builderComponent,
      builderBinding
    ) {
      // Add it to the renderer
      this.$refs.renderer.$options.components[rendererBinding] =
        rendererComponent;
      // Add it to the form builder
      this.$refs.builder.addControl(control, builderComponent, builderBinding);
    }
  }
};
</script>

<style lang="scss">
@import "bootstrap/dist/css/bootstrap";
@import "bootstrap-vue/dist/bootstrap-vue";
@import "assets/css/custom";

$validation-panel-bottom: 3.5rem;
$validation-panel-right: 0;
$validation-panel-height: 10rem;
$validation-panel-width: 41rem;
$primary-white: #f7f7f7;

$preview-inspector-width: 265px;
$data-collapse-height: 300px;

html,
body {
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.header-bg {
  background: $primary-white;
}

.validation-panel {
  background: $primary-white;
  height: $validation-panel-height;
  width: $validation-panel-width;
  bottom: $validation-panel-bottom;
  right: $validation-panel-right;
}

.card-header {
  border-radius: 0 !important;
  background-color: none !important;
}

.border-check {
  border: 1px solid green;
}

.list-group-item:last-child {
  border-bottom: 1px solid #dfdfdf !important;
}

.preview-inspector {
  max-width: $preview-inspector-width;
}

.data-collapse {
  height: $data-collapse-height;
}

.modal-backdrop {
  opacity: 0.5;
}

.form-group--error {
  animation: none;
}
.editor {
  height: 30em;
}
</style>
