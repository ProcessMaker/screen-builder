<template>
  <div class="form-group">
    <div>
      <label>{{ label }}</label>

      <b-form-checkbox
        v-model="settings.showForDesktop"
        :value="true"
        :unchecked-value="false"
        switch
      >
        {{ $t("Show for Desktop") }}
      </b-form-checkbox>

      <b-form-checkbox
        v-model="settings.showForMobile"
        :value="true"
        :unchecked-value="false"
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
    value: String,
    helper: String,
    options: Object,
  },
  data() {
    return {
      settings: {
        showForDesktop: true,
        showForMobile: true
      }
    };
  },
  watch: {
    settings: {
      handler() {
        this.emitChanges();
      },
      deep: true
    },
  },
  methods: {
    emitChanges() {
      this.$emit("input", this.settings);
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
