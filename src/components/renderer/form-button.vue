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
      this.$emit(this.event, this.eventData);
      if (this.event === 'pageNavigate') {
        this.$emit('page-navigate', this.eventData);
      }
    },
    async runHandler() {
      if (this.handler) {
        try {
          const data = this.getScreenDataReference(
            null,
            (screen, name, value) => {
              // Enable the data reference to be updated by the handler
              screen.$set(screen.vdata, name, value);
            }
          );

          const rawData = data[Symbol.for("__v_raw")];

          const worker = new Worker();
          console.log("rawData ==> ", rawData);
          worker.postMessage({
            fn: this.handler,
            data: rawData,
          });

          worker.onmessage = (e) => {
            console.log("Received:", e.data);
            if (e.data.error) {
              console.error("Worker error:", e.data.error);
            } else if (e.data.result) {
              console.log("Worker result:", e.data.result);

              // Update the data with the result
              Object.keys(e.data.result).forEach(key => {
                rawData[key] = e.data.result[key];
              });
            }
          };

          // await new Function(['toRaw'], this.handler).apply(data, [(item) => {
          //   return item[Symbol.for('__v_raw')];
          // }]);
        } catch (error) {
          console.error("❌ There is an error in the button handler", error);
        }
      }
    }
  },
};
</script>
