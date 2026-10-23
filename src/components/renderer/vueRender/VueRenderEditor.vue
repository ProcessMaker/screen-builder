<template>
  <div class="form-group pointer-events-none">
    <div :class="classList">
      <VueRenderTemplate
        :key="componentRenderKey"
        :templateVue="templateVue"
        :handlerVue="handlerVue"
        :validation-data="validationData || {}"
        :transient-data="validationData || {}"
      />
    </div>
    <div
      v-if="error"
      class="invalid-feedback"
    >
      {{ error }}
    </div>
    <small
      v-if="helper"
      class="form-text text-muted"
    >{{ helper }}</small>
  </div>
</template>
<script>
import VueRenderTemplate from './VueRenderTemplate';

export default {
  name: 'VueRenderEditor',
  components: { VueRenderTemplate },
  inheritAttrs: false,
  props: {
    error: { type: String, default: null },
    name: { type: String, default: null },
    helper: { type: String, default: null },
    controlClass: { type: String, default: null },
    templateVue: { type: String, default: null },
    handlerVue: { type: String, default: null },
    validationData: { type: Object, default: null },
    label: { type: String, default: null },
    renderVarHtml: { type: Boolean, default: null },
  },
  data() {
    return {
      originalEscapeFn: null,
      customFunctions: {},
      editorSettings: {
        inline: true,
        menubar: false,
        plugins: ['link', 'lists'],
        toolbar: `undo redo | link | styleselect | bold italic forecolor |
             alignleft aligncenter alignright alignjustify | bullist numlist outdent indent`,
        skin: false,
        relative_urls: false,
        convert_urls: false,
        remove_script_host: false,
      },
    };
  },
  computed: {
    componentRenderKey() {
      return [this.templateVue, this.handlerVue].join('::');
    },
    classList() {
      const classList = {
        'is-invalid': Boolean(this.error),
      };
      if (this.controlClass) {
        classList[this.controlClass] = true;
      }
      return classList;
    },
    rendered() {
      // If we have't validationData, we can't evaluate the mustache variables
      // Used by ScreenBuilder in Design Mode
      return this.templateVue;
    },
    inPreviewMode() {
      return ((this.mode === 'preview' && !window.exampleScreens) || this.mode === 'editor');
    },
    mode() {
      return this.$root.$children[0].mode;
    },
  },
};
</script>

<style scoped>
.invalid-feedback {
    display: block;
}

.is-invalid {
    border: 1px solid #dc3545;
    border-radius: 0.25rem;
}
.pointer-events-none {
    pointer-events: none;
}
</style>
