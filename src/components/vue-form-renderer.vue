<template>
  <div
    id="vue-form-renderer"
    ref="formRendererContainer"
    :class="[containerClass, containerDeviceClass]"
    :style="cssDevice"
    data-cy="screen-renderer-container"
  >
    <custom-css-output>{{ customCssWrapped }}</custom-css-output>
    <screen-renderer
      ref="renderer"
      :value="data"
      :_parent="_parent || data._parent"
      :definition="definition"
      :current-page="currentPage"
      data-cy="screen-renderer"
      :show-errors="showErrors"
      :test-screen-definition="testScreenDefinition || false"
      class="p-0"
      :loop-context="loopContext"
      :taskdraft="taskdraft"
      @after-submit="afterSubmit"
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import _ from "lodash";
import Inputmask from "inputmask";
import * as csstree from "css-tree";
import Scrollparent from "scrollparent";
import CustomCssOutput from "./custom-css-output";
import currencies from "../currency.json";
import { getItemsFromConfig } from "../itemProcessingUtils";
import { ValidatorFactory } from "../factories/ValidatorFactory";
import CurrentPageProperty from "../mixins/CurrentPageProperty";
import DeviceDetector, { MAX_MOBILE_WIDTH } from "../mixins/DeviceDetector";
import ScreenRenderer from "@/components/screen-renderer.vue";

export default {
  name: "VueFormRenderer",
  components: { ScreenRenderer, CustomCssOutput },
  mixins: [CurrentPageProperty, DeviceDetector],
  model: {
    prop: "data",
    event: "update"
  },
  props: [
    "config",
    "data",
    "_parent",
    "page",
    "computed",
    "customCss",
    "mode",
    "watchers",
    "isLoop",
    "ancestorScreens",
    "loopContext",
    "showErrors",
    "testScreenDefinition",
    "deviceScreen",
    "taskdraft"
  ],
  data() {
    return {
      definition: {
        config: this.config,
        computed: this.computed,
        customCss: this.customCss,
        watchers: this.watchers,
        isMobile: false
      },
      formSubmitErrorClass: "",
      // watcher URLs
      watchers_config: {
        api: {
          execute: null,
          execution: null
        }
      },
      customCssWrapped: "",
      // Custom Functions for Rich Text Control
      customFunctions: {
        formatCurrency() {
          const format = (value, currency) => {
            const definition = currencies.find(
              (definition) => definition.code === currency
            );
            const options = { alias: "currency" };
            if (definition) {
              const separators = definition.format.match(/[.,]/g);
              if (separators.length === 0) separators.push("", ".");
              else if (separators.length === 1)
                separators.push(separators[0] === "." ? "," : ".");
              options.digits = (
                definition.format.split(separators[1])[1] || ""
              ).length;
              options.radixPoint = separators[1];
              options.groupSeparator = separators[0];
              options.prefix = `${definition.symbol} `;
              options.suffix = ` ${definition.code}`;
            }
            return Inputmask.format(value, options);
          };
          return function (text) {
            const params = JSON.parse(`[${text}]`);
            return format(_.get(this, params[0]), params[1]);
          };
        }
      },
      scrollable: null,
      containerObserver: null
    };
  },
  computed: {
    containerClass() {
      return this.parentScreen
        ? `screen-${this.parentScreen}`
        : "custom-css-scope";
    },
    cssDevice() {
      return {
        "--mobile-width": MAX_MOBILE_WIDTH
      };
    },
    containerDeviceClass() {
      return this.deviceScreen === "mobile"
        ? "container-mobile"
        : "container-desktop";
    }
  },
  watch: {
    customCss(customCss) {
      this.definition.customCss = customCss;
      this.parseCss();
    },
    config: {
      deep: true,
      handler(config) {
        this.definition.config = config;
        this.$nextTick(() => {
          this.registerCustomFunctions();
        });
      }
    },
    data: {
      deep: true,
      handler() {
        this.$emit("update", this.data);
        const mainScreen = this.getMainScreen();
        if (mainScreen) {
          this.validate(mainScreen);
        }
      }
    },
    computed: {
      deep: true,
      handler(computed) {
        this.definition.computed = computed;
      }
    },
    watchers: {
      deep: true,
      handler(watchers) {
        this.definition.watchers = watchers;
      }
    }
  },
  created() {
    this.parseCss = _.debounce(this.parseCss, 500, { leading: true });

    this.containerObserver = new ResizeObserver(this.onContainerObserver);
  },
  mounted() {
    this.registerCustomFunctions();
    if (window.ProcessMaker && window.ProcessMaker.EventBus) {
      window.ProcessMaker.EventBus.$emit("screen-renderer-init", this);
    }
    this.scrollable = Scrollparent(this.$el);

    this.containerObserver.observe(this.$refs.formRendererContainer);
    
    // Initialize the clipboard module
    this.$store.dispatch('clipboardModule/initializeClipboard');
  },
  methods: {
    ...mapActions("globalErrorsModule", [
      "validate",
      "hasSubmitted",
      "showValidationOnLoad",
      "restartValidation"
    ]),
    getMainScreen() {
      return this.$refs.renderer && this.$refs.renderer.$refs.component;
    },
    countElements(config) {
      const definition = { config };
      return this.$refs.renderer.countElements(definition);
    },
    checkForRecordList(items, config) {
      items.forEach((item) => {
        if (item.items) {
          this.checkForRecordList(item.items, config);
        }

        if (item.component === "FormRecordList") {
          this.removeRecordListForms(item, config);
        }
      });
      return config;
    },
    removeRecordListForms(item, config) {
      const recordListFormId = item.config.form;
      delete config[recordListFormId];
      return config;
    },
    checkForNestedScreenErrors(child) {
      if (child.$options._componentTag !== "FormNestedScreen") {
        return;
      }

      return child.errors();
    },
    /**
     * Check if a form is valid for submitting
     *
     * @deprecated Since version 2.4.4
     */
    isValid() {
      const items = getItemsFromConfig(this.definition.config);
      const config = _.cloneDeep(this.definition.config);

      this.checkForRecordList(items, config);
      this.dataTypeValidator = ValidatorFactory(config, this.data);
      this.errors = this.dataTypeValidator.getErrors();

      if (this.errors) {
        this.formSubmitErrorClass = "invalid-form-submission";
      }
      return _.size(this.errors) === 0;
    },
    registerCustomFunctions(node = this) {
      if (node.registerCustomFunction instanceof Function) {
        Object.keys(this.customFunctions).forEach((key) => {
          node.registerCustomFunction(key, this.customFunctions[key]);
        });
      }
      if (node.$children instanceof Array) {
        node.$children.forEach((child) => this.registerCustomFunctions(child));
      }
    },
    afterSubmit() {
      this.$emit('after-submit', ...arguments);
    },
    submit(eventData, loading = false, buttonInfo = null) {
      this.$emit("submit", this.data, loading, buttonInfo);
    },
    parseCss() {
      const containerSelector = `.${this.containerClass}`;

      try {
        const ast = csstree.parse(this.customCss, {
          onParseError(error) {
            // throw "CSS has the following errors:\n\n" + error.formattedMessage
            throw error.formattedMessage;
          }
        });

        let i = 0;
        csstree.walk(ast, function (node, item, list) {
          if (
            node.type.match(/^.+Selector$/) &&
            node.name !== containerSelector &&
            list
          ) {
            // Wait until we get to the first item before prepending our container selector
            if (!item.prev) {
              list.prependData({ type: "WhiteSpace", loc: null, value: " " });
              list.prependData({
                type: "TypeSelector",
                loc: null,
                name: containerSelector
              });
            }
          }
          if (i > 5000) {
            throw Error("CSS is too long");
          }

          i += 1;
        });

        // Find the media block
        const mediaConditions = [];
        csstree.walk(ast, {
          visit: "Atrule",
          enter: (node, item, list) => {
            if (!item.prev && node.name === "media") {
              const mediaCondition = {
                minWidth: 0,
                maxWidth: Math.max(
                  document.documentElement.clientWidth,
                  window.innerWidth || 0
                ),
                rules: []
              };

              csstree.walk(node.prelude, {
                visit: "MediaFeature",
                enter: (featureNode) => {
                  if (["min-width", "max-width"].includes(featureNode.name)) {
                    mediaCondition[_.camelCase(featureNode.name)] = parseInt(
                      featureNode.value.value,
                      10
                    );

                    if (mediaCondition.rules.length === 0) {
                      csstree.walk(node.block, {
                        visit: "Rule",
                        enter: (ruleNode) => {
                          const rule = csstree.generate(ruleNode);

                          mediaCondition.rules.push(rule);
                        }
                      });
                    }

                    mediaConditions.push(mediaCondition);
                  }
                }
              });

              list.remove(item);
            }
          }
        });

        this.customCssWrapped = csstree.generate(ast);

        mediaConditions.forEach((condition) => {
          const { width: currentWidth } =
            this.$refs.formRendererContainer.getBoundingClientRect();

          if (
            currentWidth >= condition.minWidth &&
            currentWidth <= condition.maxWidth
          ) {
            this.customCssWrapped += condition.rules.join(" ");
          }
        });

        this.$emit("css-errors", "");
      } catch (error) {
        this.$emit("css-errors", error);
      }
    },
    getCurrentPage() {
      return this.$refs.renderer.getCurrentPage();
    },
    setCurrentPage(page) {
      this.$refs.renderer.setCurrentPage(page);
    },
    onContainerObserver(entries) {
      // Control coordinates
      const controlEl = entries[0].target.getBoundingClientRect();
      this.parseCss();
    },
    saveClipboarToLocalStorage(items){
      localStorage.setItem("savedClipboard", JSON.stringify(items));
    },
  }
};
</script>

<style scoped lang="scss">
.container-desktop {
  width: 100%;
}

.container-mobile {
  width: calc(var(--mobile-width) * 1px);
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.125);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
