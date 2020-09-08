<template>
  <div class="mustache" :title="$t('This field accepts mustache syntax')" v-b-tooltip.hover>{}</div>
</template>

<script>
export default {
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