<template>
  <div
    v-b-tooltip.hover
    class="mustache"
    :title="$t('This field accepts mustache syntax')"
  >
    {}
  </div>
</template>

<script>
export default {
  name: "MustacheHelper"
};
</script>

<style scoped>
.mustache {
  float: right;
  font-size: 1em;
  color: #ced4da;
  font-weight: bold;
  cursor: pointer;
}
</style>
