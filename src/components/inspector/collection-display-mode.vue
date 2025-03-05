<template>
  <div>
    <div>
      <label for="collection-mode">{{ $t(label) }}</label>
      <b-form-select
        id="collection-mode"
        v-model="mode"
        :options="options"
        data-cy="inspector-collection"
        @change="saveFields"
      />
    </div>
    <div v-show="showCollectionCheck" class="mt-2">
      <b-form-checkbox v-model="submitCollectionCheck" @change="saveFields">
        {{ $t("Update collection on submit") }}
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    screenType: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mode: "",
      submitCollectionCheck: null,
      defaultMode: 'Edit',
    };
  },
  computed: {
    showCollectionCheck() {
      return this.mode === this.defaultMode;
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.updateModeAndCollectionCheck(newValue);
      },
      deep: true,
    }
  },
  mounted() {
    // Set the default data
    this.updateModeAndCollectionCheck(this.value);
  },
  methods: {
    /**
     * Update the mode and collection check value
     *
     * @param {Object} value
     */
    updateModeAndCollectionCheck(value) {
      this.mode = value.modeId || this.defaultMode;
      this.submitCollectionCheck = value.submitCollectionCheck ?? true;
    },
    saveFields() {
      this.$emit("input", {
        modeId: this.mode,
        submitCollectionCheck: this.submitCollectionCheck
      });
    }
  }
};
</script>
