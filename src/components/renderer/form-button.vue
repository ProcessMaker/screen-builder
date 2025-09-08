<template>
  <div class="form-group" style="overflow-x: hidden">
    <button
      v-b-tooltip="options"
      @click="click"
      :class="classList"
      :name="name"
      :aria-label="$attrs['aria-label']"
      :tabindex="$attrs['tabindex']"
      :disabled="showSpinner"
    >
      <b-spinner v-if="showSpinner" small></b-spinner>
      {{ showSpinner ? (!loadingLabel ? "Loading..." : loadingLabel) : label }}
    </button>
  </div>
</template>

<script>
import Mustache from 'mustache';
import { mapActions, mapState } from "vuex";
import { getValidPath } from '@/mixins';
import Worker from "@/workers/worker.js?worker&inline";
import { findRootScreen } from "@/mixins/DataReference";
import { stringify } from 'flatted';

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
    "handler"
  ],
  data() {
    return {
      showSpinner: false
    };
  },
  computed: {
    ...mapState("globalErrorsModule", ["valid"]),
    classList() {
      let variant = this.variant || 'primary';
      return {
        btn: true,
        ['btn-' + variant]: true,
        disabled: this.event === 'submit' && !this.valid
      };
    },
    options() {
      if (!this.tooltip || this.event === 'submit') {
        return {};
      }

      let content = '';
      try {
        content = Mustache.render(this.tooltip.content || '', this.transientData);
      } catch (error) { error; }

      return {
        title: content,
        html: true,
        placement: this.tooltip.position || '',
        trigger: 'hover',
        variant: this.tooltip.variant || '',
        boundary: 'window',
      };
    },
    buttonInfo() {
      return {
        name: this.name,
        label: this.label,
        value: this.fieldValue
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
      if (this.event === 'script') {
        const trueValue = this.fieldValue || '1';
        const value = (this.value == trueValue) ? null : trueValue;
        this.$emit('input', value);
        // Run handler after setting the value
        await this.runHandler();
      }
      if (this.event !== 'pageNavigate' && this.name) {
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      if (this.event === 'submit') {
        if (this.loading && this.valid) {
          this.showSpinner = true;
        }
        this.$emit('input', this.fieldValue);
        // Run handler after setting the value
        await this.runHandler();
        this.$nextTick(() => {
          this.$emit('submit', this.eventData, this.loading, this.buttonInfo);
        });
        return;
      }
      if (this.event === 'pageNavigate') {
        // Run handler for page navigate
        await this.runHandler();
      }
      this.$emit(this.event, this.eventData);
      if (this.event === 'pageNavigate') {
        this.$emit('page-navigate', this.eventData);
      }
    },
    runHandler() {
      if (this.handler) {
        return new Promise((resolve, reject) => {
          try {
            const rootScreen = findRootScreen(this);
            const data = rootScreen.vdata;
            const scope = this.transientData;

            const worker = new Worker();
            // Send the handler code to the worker
            worker.postMessage({
              fn: this.handler,
              dataRefs: stringify({ data, scope })
            });

            // Listen for the result from the worker
            worker.onmessage = (e) => {
              // Handle browser global function calls
              if (e.data.type) {
                switch (e.data.type) {
                  case "alert":
                    alert(e.data.message);
                    break;
                  case "console.log":
                    console.log(...e.data.args);
                    break;
                }
                return; // Don't resolve/reject yet, wait for actual result
              }

              if (e.data.error) {
                reject(e.data.error);
              } else if (e.data.result) {
                // Update the data with the result
                Object.keys(e.data.result).forEach((key) => {
                  if (key === "_root") {
                    Object.assign(data, e.data.result[key]);
                  } else {
                    scope[key] = e.data.result[key];
                  }
                });
                resolve();
              }
            };
          } catch (error) {
            console.error("❌ There is an error in the button handler", error);
          }
        });
      }
    }
  },
};
</script>
