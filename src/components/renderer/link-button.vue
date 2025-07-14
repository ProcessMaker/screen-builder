<template>
  <div class="form-group link-button">
    <a :class="classColor" :href="inputUrlLink">
      <i v-if="variantStyle === 'button'" class="fas fa-external-link-alt" />
      {{ label }}
    </a>
  </div>
</template>

<script>
export default {
  props: [
    "variant",
    "variantStyle",
    "label",
    "event",
    "eventData",
    "name",
    "fieldValue",
    "value",
    "inputUrlLink"
  ],
  computed: {
    classColor() {
      if (this.variantStyle === "link") {
        return `text-${this.variant}`;
      }
      return `btn btn-${this.variant}`;
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: underline;
}
</style>
