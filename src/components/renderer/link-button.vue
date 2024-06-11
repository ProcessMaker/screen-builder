<template>
  <div class="form-group">
    <a :class="classColor" :href="inputUrlLink"> {{ label }} </a>
  </div>
</template>

<script>
export default {
  props: [
    "variant",
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
      return `btn btn-${this.variant}`;
    }
  }
};
</script>
