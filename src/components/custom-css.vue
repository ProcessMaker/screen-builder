<template>
  <b-modal
    ref="modal"
    size="lg"
    id="custom-css"
    centered
    :title="$t('Custom CSS')"
    @ok="save"
    @cancel="close"
    @hide="hide"
    cancel-variant="btn btn-outline-secondary"
    ok-variant="btn btn-secondary ml-2"
  >
    <p>{{ $t("You can set CSS Selector names in the inspector. Use them here with [selector='my-selector']") }}</p>
    <div class="editor">
      <monaco-editor :options="monacoOptions" class="monaco" v-model="innerValue"/>
    </div>

    <b-alert :show="cssErrors != ''" variant="danger">
      <pre>{{ cssErrors }}</pre>
    </b-alert>
    <div slot="modal-cancel">{{ $t('Cancel') }}</div>
    <div slot="modal-ok">{{ $t('Save') }}</div>
  </b-modal>
</template>

<script>
import MonacoEditor from 'vue-monaco';
export default {
  props: ['value', 'cssErrors'],
  components: { MonacoEditor },
  data() {
    return {
      saveValue: '',
      innerValue: '',
      monacoOptions: {
        language: 'css',
        automaticLayout: true,
        minimap: { enabled: false },
      },
    };
  },
  watch: {
    innerValue(value) {
      this.$emit('input', value);
    },
  },
  methods: {
    show() {
      this.innerValue = this.value;
      this.saveValue = this.value;
      this.$refs.modal.show();
    },
    close() {
      this.$refs.modal.hide();
    },
    hide() {
      this.innerValue = this.saveValue;
      this.$emit('input', this.innerValue);
    },
    save() {
      this.saveValue = this.innerValue;
      this.$refs.modal.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 5px;

  .monaco {
    height: 97%;
    margin: 3px;
  }
}
</style>