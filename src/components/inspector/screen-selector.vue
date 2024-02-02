<template>
  <div>
    <label class="typo__label">{{ label }}</label>
    <multiselect
      :value="selectedOption"
      :placeholder="placeholder"
      :options="options"
      :multiple="multiple"
      :track-by="trackBy"
      :show-labels="false"
      :searchable="true"
      :internal-search="false"
      label="title"
      @input="change"
      @search-change="loadOptions"
      @open="loadOptions()"
    >
      <template slot="noResult">
        <slot name="noResult">{{ $t("Not found") }}</slot>
      </template>
      <template slot="noOptions">
        <slot name="noOptions">{{ $t("No Data Available") }}</slot>
      </template>
    </multiselect>
    <div v-if="value" class="screen-link mt-2">
      <a :href="`/designer/screen-builder/${value}/edit`" target="_blank">
        {{ $t("Open Screen") }}
        <i class="ml-1 fas fa-external-link-alt" />
      </a>
    </div>
  </div>
</template>

<script>
import { get } from "lodash";
import { multiselectApi } from "@/mixins";
import { formTypes } from "@/global-properties";

const globalObject = typeof window === "undefined" ? global : window;

export default {
  mixins: [multiselectApi],
  props: {
    api: {
      type: String,
      default: "screens"
    },
    builder: {
      type: Object,
      required: true
    },
    screenType: {
      type: String,
      default: formTypes.form
    },
    validateNested: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$root.$on("remove-nested", (nestedScreenId) => {
      if (this.value === nestedScreenId) {
        this.$emit("input", null);
      }
    });

    let pmql = '(type = "FORM" or type = "DISPLAY")';
    if (this.screenType === formTypes.display) {
      pmql = '(type = "DISPLAY")';
    }
    if (this.builder.screen) {
      pmql += ` and id != ${this.builder.screen.id}`;
    }
    this.pmql = pmql;
    this.fields = "screens.id,title";
  },
  methods: {
    isNavButton(item) {
      return (
        item.config &&
        item.component === "FormButton" &&
        item.config.event === "pageNavigate"
      );
    },
    containsNavbutton(config) {
      config.forEach((item) => {
        // If the element has containers
        if (Array.isArray(item)) {
          this.containsNavbutton(item);
        }

        // If the element has items
        if (item.items) {
          this.containsNavbutton(item.items);
        }

        // hidden buttons
        if (this.isNavButton(item)) {
          this.nav = true;
        }
      });
    },

    change(value) {
      if (value && this.validateNested) {
        // validate if the nested form has navigation buttons
        this.nav = false;
        this.containsNavbutton(value.config);
        if (this.nav) {
          globalObject.ProcessMaker.alert(
            this.$t("The nested form contains navigation buttons"),
            "warning"
          );
          return false;
        }
      }
      const id = this.storeId ? get(value, this.trackBy) : value;
      // Make sure to load latest config from screen and nested screens
      this.$dataProvider.flushScreenCache();
      this.$emit("input", id);
    }
  }
};
</script>
