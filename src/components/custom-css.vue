<template>
  <b-modal
    ref="modal"
    size="lg"
    id="custom-css"
    centered
    title="Custom CSS"
    @ok="save"
    @cancel="close"
    @hide="hide"
    cancel-variant="btn btn-outline-secondary"
    ok-variant="btn btn-secondary ml-2"
  >
    <p>You can use field names as css class selectors (prefixed by a ".")</p>
    <textarea v-model="innerValue"></textarea>

    <b-alert :show="cssErrors != ''" variant="danger">
      <pre>{{ cssErrors }}</pre>
    </b-alert>

    <div slot="modal-ok">Save</div>
  </b-modal>
</template>

<script>
export default {
  props: ["value", "cssErrors"],
  data() {
    return {
      saveValue: '',
      innerValue: '',
    }
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
    }
  }
};
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
  height: 300px;
  font-family: monospace;
}
</style>