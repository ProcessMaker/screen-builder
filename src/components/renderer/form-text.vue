<template>
    <div class="form-group">
        <div :style="styles" v-html="rendered"></div>
    </div>
</template>

<script>
import Mustache from "mustache";

export default {
  props: [
    "label",
    "fontSize",
    "fontWeight",
    "textAlign",
    "validationData",
    "color",
    "name"
  ],
  computed: {
    styles() {
      return {
        fontSize: this.fontSize,
        fontWeight: this.fontWeight,
        textAlign: this.textAlign,
        color: this.color
      };
    },
    rendered() {
      try {
        return Mustache.render(this.label, this.validationData);
      } catch (e) {
        return this.label;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


