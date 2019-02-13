<template>
  <div class="mb-2">
    <label class="typo__label">Select with search</label>
    <multiselect
      @input="updateValue"
      :options="mutiOptions"
      placeholder="Select one"
      label="content"
      track-by="value"
      v-model="multiSelected"
    ></multiselect>
  </div>
</template>

<style lang="scss" scoped>
@import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>

<script>
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },
  props: [
    "label",
    "error",
    "selected",
    "value",
    "options",
    "helper",
    "disabled",
    "required",
    "size",
    "name",
    "controlClass",
    "multiple"
  ],
  data() {
    return {
      mutiOptions: this.$props.options,
      content: "",
      multiSelected: this.options[0].value
    };
  },
  mounted() {
    if (!this.value && this.options) {
      this.content = this.options[0].value;
      this.$emit("input", this.content);
    }
  },
  methods: {
    updateValue(value) {
      this.content = value.value;
      this.$emit("input", this.content);
    }
  }
};
</script>