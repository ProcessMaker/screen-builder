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
import VueFormRenderer from '../../../src/components/vue-form-renderer';
import Vue from 'vue';
Vue.component('vue-form-renderer', VueFormRenderer);

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