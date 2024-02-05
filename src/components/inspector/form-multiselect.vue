<template>
  <div>
    <required-asterisk /><label class="typo__label">{{ label }}</label>
    <multiselect
      v-bind="$attrs"
      :value="value"
      :placeholder="$t('Select...')"
      :show-labels="false"
      :options="options.map((option) => option.value)"
      :class="classList"
      :custom-label="getLabelFromValue"
      v-on="$listeners"
    >
      <template slot="noResult">
        {{ $t("No elements found. Consider changing the search query.") }}
      </template>
      <template slot="noOptions">
        {{ $t("No Data Available") }}
      </template>
    </multiselect>

    <div
      v-if="(validator && validator.errorCount) || error"
      class="invalid-feedback d-block"
    >
      <div v-for="(error, index) in validator.errors.get(name)" :key="index">
        {{ error }}
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import {
  RequiredAsterisk,
  ValidationMixin
} from "@processmaker/vue-form-elements";

export default {
  components: {
    RequiredAsterisk
  },
  mixins: [ValidationMixin],
  inheritAttrs: false,
  props: [
    "label",
    "error",
    "options",
    "helper",
    "name",
    "value",
    "selectedControl"
  ],
  computed: {
    classList() {
      return {
        "has-errors":
          (this.validator && this.validator.errorCount) || this.error
      };
    }
  },
  methods: {
    getLabelFromValue(value) {
      const selectedOption = this.options.find(
        (option) => option.value == value
      );
      return selectedOption ? selectedOption.content : null;
    }
  }
};
</script>

<style lang="scss">
.has-errors .multiselect__tags {
  border-color: red;
}
</style>
