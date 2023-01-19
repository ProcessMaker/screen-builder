<template>
  <div class="form-group" style="overflow-x: hidden">
    <button
      v-b-tooltip="tooltipOptions"
      :class="classList"
      :name="name"
      :aria-label="ariaLabel"
      :tabindex="tabIndex"
      @click="click"
    >
      {{ label }}
    </button>
  </div>
</template>

<script>
import Mustache from "mustache";
import { getValidPath } from "@/mixins";

export default {
  mixins: [getValidPath],
  props: {
    variant: {
      type: String,
      default: "primary"
    },
    label: {
      type: String,
      default: "New Submit"
    },
    event: {
      type: String,
      default: "submit"
    },
    eventData: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    fieldValue: {
      type: String,
      default: "1"
    },
    value: {
      type: String,
      default: "1"
    },
    tooltip: {
      type: Object,
      default: null
    },
    transientData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ariaLabel: this.$attrs["aria-label"],
      tabIndex: this.$attrs.tabindex
    };
  },
  computed: {
    classList() {
      const variant = this.variant || "primary";
      return {
        btn: true,
        [`btn-${variant}`]: true,
        disabled: this.event === "submit" && !this.valid
      };
    },
    tooltipOptions() {
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
        const value = this.value === trueValue ? null : trueValue;
        this.$emit("input", value);
      }
      if (this.event !== "pageNavigate" && this.name) {
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      if (this.event === "submit") {
        this.$emit("input", this.fieldValue);
        this.$nextTick(() => {
          this.$emit("submit", this.eventData);
        });
        return;
      }
      this.$emit(this.event, this.eventData);
      if (this.event === "pageNavigate") {
        this.$emit("page-navigate", this.eventData);
      }
    }
  }
};
</script>
