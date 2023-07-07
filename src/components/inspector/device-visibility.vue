<template>
  <div class="form-group">
    <div>
      <label>{{ label }}</label>

      <b-form-checkbox
        v-model="settings.showForDesktop"
        @change="emitChanges"
        switch
      >
        {{ $t("Show for Desktop") }}
      </b-form-checkbox>

      <b-form-checkbox
        v-model="settings.showForMobile"
        @change="emitChanges"
        switch
      >
        {{ $t("Show for Mobile") }}
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    value: {
      type: Object,
      default: () => {
        return { showForDesktop: true, showForMobile: true };
      }
    },
    helper: String,
    options: Object,
  },
  watch: {
    value: {
      handler() {
        this.settings = this.value;
      },
      immediate: true,
    },
  },
  data() {
    return {
      settings: {
        showForDesktop: true,
        showForMobile: true
      }
    };
  },
  methods: {
    emitChanges() {
      this.$emit("input", this.value);
      this.$emit("update-state");
    },
  }
};
</script>

<style lang="scss" scoped>
.image-preview {
  border: 1px solid #ced4da;
  border-radius: 4px;
  height: 4em;
  text-align: center;
  overflow: hidden;
}
</style>
