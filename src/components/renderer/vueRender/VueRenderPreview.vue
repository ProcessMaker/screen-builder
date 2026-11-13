<template>
  <vue-render-template
    v-bind="$attrs"
    :name="name"
    :helper="helper"
    :error="error"
    :control-class="controlClass"
    :templateVue="templateVue"
    :handlerVue="handlerVue"
    :validation-data="validationData"
    :label="label"
    :render-var-html="renderVarHtml"
    v-on="$listeners"
  />
</template>

<script>
import VueRenderTemplate from './VueRenderTemplate';

export default {
  name: 'VueRenderPreview',
  components: { VueRenderTemplate },
  inheritAttrs: false,
  props: {
    name: { type: String, default: null },
    helper: { type: String, default: null },
    error: { type: String, default: null },
    controlClass: { type: String, default: null },
    templateVue: { type: String, default: null },
    handlerVue: { type: String, default: null },
    validationData: { type: Object, default: null },
    label: { type: String, default: null },
    renderVarHtml: { type: Boolean, default: null },
  },
};
</script>
