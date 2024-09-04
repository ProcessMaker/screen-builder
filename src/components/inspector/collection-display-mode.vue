<template>
  <div>
    <div>
      <label for="collectionmode">{{ $t("Mode") }}</label>
      <b-form-select
        id="collectionmode"
        v-model="modeId"
        :options="displayOptions"
        data-cy="inspector-collection"
      />
    </div>
    <div class="mt-2" v-if="modeId !== 'View'">
      <b-form-checkbox v-model="submitCollectionCheck">
      {{  $t("Update collection on submit") }}
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
import ScreenVariableSelector from "../screen-variable-selector.vue";

const CONFIG_FIELDS = ["modeId", "submitCollectionCheck"];
export default {
  components: {
    ScreenVariableSelector
  },
  props: ["value", "screenType"],
  data() {
    return {
      fields: [],
      modeId: null,
      submitCollectionCheck: true,
      displayOptions: []
    };
  },
  mounted() {
    this.getFields();
  },
  computed: {
    options() {
      return Object.fromEntries(
        CONFIG_FIELDS.map((field) => [field, this[field]])
      );
    }
  },
  watch: {
    value: {
      handler(value) {
        if (!value) {
          return;
        }
        CONFIG_FIELDS.forEach((field) => (this[field] = value[field]));
      },
      immediate: true
    },
    modeId: {
      handler() {
        this.getFields();
      }
    },
    submitCollectionCheck(newValue) {
      this.submitCollectionCheck = newValue;
    },
    screenType: {
      handler() {
        this.getFields();
      },
      immediate: true
    },
    options: {
      handler() {
        this.$emit("input", this.options);
      },
      deep: true
    }
  },
  methods: {
    getFields() {
      this.displayOptions = [
        { value: "Edit", text: "Edit" },
        { value: "View", text: "View" }
      ];
    }
  }
};
</script>
