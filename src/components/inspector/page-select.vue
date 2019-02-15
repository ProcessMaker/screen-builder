<template>
  <div class="mb-2">
    <label class="typo__label">{{label}}</label>
    <multiselect v-model="target" label="content" :options="options" :helper="helper"></multiselect>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<style lang="scss" scoped>
@import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>

<script>
import Multiselect from "vue-multiselect";
export default {
  props: ["label", "helper", "formConfig", "value"],
  data() {
    return {
      target: 0
    };
  },
  watch: {
    value: {
      handler: function() {
        if (this.target != this.value) {
          this.target = this.value;
        }
      },
      immediate: true
    },
    target: function() {
      if (this.value != this.target) {
        this.$emit("input", this.target);
      }
    }
  },
  components: {
    Multiselect
  },
  computed: {
    options() {
      let options = [];
      // Get the page values (array index), and the content (page title)
      for (var index in this.formConfig) {
        options.push({
          value: index,
          content: this.formConfig[index].name
        });
      }
      return options;
    }
  }
};
</script>