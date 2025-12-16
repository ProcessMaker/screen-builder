<template>
  <div class="form-group" style="overflow-x: hidden">
    <button
      v-b-tooltip="options"
      :class="classList"
      :name="name"
      :aria-label="$attrs['aria-label']"
      :tabindex="$attrs['tabindex']"
      :disabled="showSpinner"
      @click="click"
    >
      <b-spinner v-if="showSpinner" small></b-spinner>
      {{ showSpinner ? (!loadingLabel ? "Loading..." : loadingLabel) : label }}
    </button>
  </div>
</template>

<!-- eslint-disable import/no-extraneous-dependencies -->
<!-- eslint-disable import/no-unresolved -->
<!-- eslint-disable import/extensions -->
<script>
import Mustache from "mustache";
import { mapState } from "vuex";
import { stringify } from "flatted";
import { getValidPath } from "@/mixins";
import Worker from "@/workers/worker.js?worker&inline";
import { findRootScreen } from "@/mixins/DataReference";

export default {
  mixins: [getValidPath],
  props: [
    "variant",
    "label",
    "event",
    "eventData",
    "name",
    "fieldValue",
    "value",
    "tooltip",
    "transientData",
    "loading",
    "loadingLabel",
    "handler",
    "handlerSecurityEnabled",
    "config"
  ],
  data() {
    return {
      showSpinner: false
    };
  },
  computed: {
    ...mapState("globalErrorsModule", ["valid"]),
    classList() {
      const variant = this.variant || "primary";
      return {
        btn: true,
        [`btn-${variant}`]: true,
        disabled: this.event === "submit" && !this.valid
      };
    },
    options() {
      if (!this.tooltip || this.event === "submit") {
        return {};
      }

      let content = "";
      try {
        content = Mustache.render(
          this.tooltip.content || "",
          this.transientData
        );
      } catch (error) {
        console.error(error);
      }

      return {
        title: content,
        html: true,
        placement: this.tooltip.position || "",
        trigger: "hover",
        variant: this.tooltip.variant || "",
        boundary: "window"
      };
    },
    buttonInfo() {
      return {
        name: this.name,
        label: this.label,
        value: this.fieldValue,
        variablesToSubmit: this.config?.variablesToSubmit
      };
    }
  },
  methods: {
    setValue(parent, name, value) {
      if (parent) {
        if (parent.items) {
          this.setValue(parent.$parent, name, value);
        } else {
          this.setValue(parent.data, this.getValidPath(name), value);
        }
      }
    },
    async click() {
      if (this.event === "script") {
        const trueValue = this.fieldValue || "1";
        // eslint-disable-next-line eqeqeq
        const value = this.value == trueValue ? null : trueValue;
        this.$emit("input", value);
        // Run handler after setting the value
        await this.runHandler();
      }
      if (this.event !== "pageNavigate" && this.name) {
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      if (this.event === "submit") {
        if (this.loading && this.valid) {
          this.showSpinner = true;
        }
        this.$emit("input", this.fieldValue);
        // Run handler after setting the value
        await this.runHandler();
        this.$nextTick(() => {
          this.$emit("submit", this.eventData, this.loading, this.buttonInfo);
        });
        return;
      }
      if (this.event === "pageNavigate") {
        // Run handler for page navigate
        await this.runHandler();
      }
      this.$emit(this.event, this.eventData);
      if (this.event === "pageNavigate") {
        this.$emit("page-navigate", this.eventData);
      }
    },
    runHandler() {
      if (!this.handler) {
        return Promise.resolve();
      }

      const rootScreen = findRootScreen(this);
      const data = rootScreen.vdata;
      const scope = this.transientData;

      if (this.handlerSecurityEnabled === false) {
        return this.executeHandlerWithoutWorker(data, scope);
      }

      return this.executeHandlerWithWorker(data, scope);
    },
    executeHandlerWithWorker(data, scope) {
      return new Promise((resolve, reject) => {
        try {
          const worker = new Worker();
          worker.postMessage({
            fn: this.handler,
            dataRefs: stringify({ data, scope })
          });

          worker.onmessage = (e) => {
            worker.terminate();
            if (e.data.error) {
              console.error(
                "There is an error in the button handler",
                e.data.error
              );
              reject(e.data.error);
              return;
            }
            this.applyHandlerResult(e.data.result, data, scope);
            resolve();
          };

          worker.onerror = (errorEvent) => {
            worker.terminate();
            console.error(
              "There is an error in the button handler",
              errorEvent
            );
            reject(errorEvent);
          };
        } catch (error) {
          console.error("There is an error in the button handler", error);
          reject(error);
        }
      });
    },
    executeHandlerWithoutWorker(data, scope) {
      const hasDataReferenceHelper =
        typeof this.getScreenDataReference === "function";
      const dataReference = hasDataReferenceHelper
        ? this.getScreenDataReference(null, (screen, name, value) => {
            screen.$set(screen.vdata, name, value);
          })
        : data;
      const parentReference =
        hasDataReferenceHelper && dataReference
          ? dataReference._parent
          : undefined;
      const context = scope || dataReference;
      const toRaw = (item) => (item && item[Symbol.for("__v_raw")]) || item;
      const functionBody = `return (async () => { ${this.handler} })();`;

      try {
        // eslint-disable-next-line no-new-func, max-len
        const userFunc = new Function("data", "parent", "toRaw", functionBody); // NOSONAR. This dynamic code execution is safe because it only occurs when the user has explicitly disabled the security worker.
        const result = userFunc.apply(context, [
          dataReference,
          parentReference,
          toRaw
        ]);
        return this.resolveHandlerResult(result, data, scope);
      } catch (error) {
        console.error("There is an error in the button handler", error);
        return Promise.reject(error);
      }
    },
    resolveHandlerResult(result, data, scope) {
      if (result && typeof result.then === "function") {
        return result
          .then((resolved) => {
            this.applyHandlerResult(resolved, data, scope);
          })
          .catch((error) => {
            console.error("There is an error in the button handler", error);
            throw error;
          });
      }

      this.applyHandlerResult(result, data, scope);
      return Promise.resolve();
    },
    applyHandlerResult(result, data, scope) {
      if (!result || typeof result !== "object") {
        return;
      }

      const targetScope = scope || this.transientData || {};

      Object.keys(result).forEach((key) => {
        if (key === "_root") {
          Object.assign(data, result[key]);
        } else {
          this.$set(targetScope, key, result[key]);
        }
      });
    }
  }
};
</script>
