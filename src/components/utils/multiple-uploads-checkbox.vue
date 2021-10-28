<template>
  <div>
    <b-form-checkbox v-model="selected">{{ $t('Upload multiple files') }}</b-form-checkbox>
  </div>
</template>

<script>
export default {
  name: 'multiple-upload-checkbox',
  props: ['value'],
  data() {
    return {
      selected: false,
    };
  },
  watch: {
    value: {
      handler() {
        if (this.value) {
          this.selected = true;
        } else {
          this.selected = false;
        }
      },
      immediate: true,
    },
    selected: {
      handler() {
        this.$emit('input', this.selected);
      },
    },
  },
};
</script>
