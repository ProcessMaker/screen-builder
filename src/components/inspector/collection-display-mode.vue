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
      submitCollectionCheck: null
    };
  },
  computed: {
    showCollectionCheck() {
      return this.mode === "Edit";
    }
  },
  mounted() {
    // Set the defaulta data
    this.mode = this.value.modeId || "Edit";
    this.submitCollectionCheck =
      this.value.submitCollectionCheck !== undefined
        ? this.value.submitCollectionCheck
        : true;
  },
  methods: {
    saveFields() {
      this.$emit("input", {
        modeId: this.mode,
        submitCollectionCheck: this.submitCollectionCheck
      });
    }
  }
};
</script>
