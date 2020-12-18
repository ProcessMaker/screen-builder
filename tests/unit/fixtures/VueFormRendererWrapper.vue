<template>
  <vue-form-renderer ref="renderer"
    v-model="previewData"
    :config="config"
    :mode="mode"
    :computed="computed"
    :custom-css="customCSS"
    v-on:css-errors="cssErrors = $event"
  />
</template>

<script>
export default {
  props: [],
  data() {
    return {
      previewData: { bar: 'baz' },
      cssErrors: null,
      config: [{
        items: [],
      }],
      computed: [],
      customCSS: '',
    };
  },
  watch: {
    previewData() {
    },
  },
};
</script>