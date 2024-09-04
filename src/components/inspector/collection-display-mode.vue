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
  </div>
</template>

<script>

import ScreenVariableSelector from "../screen-variable-selector.vue";

const CONFIG_FIELDS = [
  "modeId"
];
export default {
  components: {
    ScreenVariableSelector
  },
  props: ["value", "screenType"],
  data() {
    return {
      fields: [],
      modeId: null,
      displayOptions: [],
    };
  },
  mounted() {
    //console.log("value mounted: ", this.value);
    //console.log("CDM Mounted dispalyMode: ", this.displayMode);
    //this.getModes();
    // this.$root.$on("change-mode-inspector", (val) => {
    //   console.log("CDM $on val: ", val);
    //   this.displayMode = val;
    // });
    //if (this.modeId) {
      this.getFields();
    //}
  },
  computed: {
    options() {
      console.log("CDM computed options");
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
    options: {
      handler() {
        this.$emit("input", this.options);
        console.log("CDM handler watcher options: ", this.options);
      },
      deep: true
    }
  },
  methods: {
    getFields() {
      // if (!this.modeId) {
      //   return;
      // }
      //this.fields = [{value: "Edit", text: "Edit"},{value: "View", text: "View"}];
      this.displayOptions = [{value: "Edit", text: "Edit"},{value: "View", text: "View"}];
    },
    // changeMode(newMode) {
    //   console.log("CDM changeMode emit newMode: ", newMode);
    //   this.auxData = newMode;
    //   this.$emit("input", newMode);
    // },
    // getModes() {
    //     if(!this.displayMode) {

    //     }
    //     this.displayOptions = ["Edit", "View"];
    // },
  }
};
</script>
