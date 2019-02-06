<template>
  <b-modal
    ref="modal"
    size="lg"
    id="custom-css"
    centered
    title="Custom CSS"
  >
    <textarea v-bind:value="value" v-on:input="$emit('input', $event.target.value)" />
  <div slot="modal-footer">
    <b-btn @click="close">Close</b-btn>
  </div>
  </b-modal>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {}
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    close() {
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
.popup-buttons {
    margin-bottom: 0.5em;
}
</style>