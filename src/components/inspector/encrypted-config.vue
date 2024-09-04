<template>
  
    <div>
      <div class="form-group">
        <b-form-checkbox
          v-model="settings.encrypted"
          @change="emitChanges"
          switch
        >
          {{ $t("Encrypted") }}
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
        return { encrypted: false };
      }
    },
    helper: String,
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
        encrypted: false,
      },
      assignments: null,
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
</style>
