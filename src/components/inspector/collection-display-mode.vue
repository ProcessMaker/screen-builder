<template>
  <div>
    <div>
      <label for="collectionMode">{{ $t("Mode") }}</label>
      <b-form-select
        id="collectionMode"
        v-model="displayMode"
        :options="optionsList"
        data-cy="inspector-collection"
        @change="changeMode"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import ScreenVariableSelector from "../screen-variable-selector.vue";

const CONFIG_FIELDS = [
  "displayMode"
];

export default {
  components: {
    ScreenVariableSelector
  },
  props: ["value", "screenType"],
  data() {
    return {
      optionsList : [],
      fields: [],
      labelField: null,
      valueField: null,
      displayMode: null
    };
  },
  created() {
    this.onDebouncedPmqlChange = debounce((pmql) => {
      this.onPmqlChange(pmql);
    }, 1000);
  },
  mounted() {
    let mode = "";
    console.log("mounted collection display mode: ", this.displayMode);
    if(this.screenType === "display") {
      this.getModeDisplay();
      mode = "View";
    } else {
      mode = "Edit"
      this.getModeForm();
    }
    this.$root.$emit("collection-mode", this.screenType);
    this.$root.$on("display-mode-changed", (newMode) => {
      console.log("carga $on en display mode: ", newMode);
      this.displayMode = newMode;
    });
  },
  watch: {
    displayMode(val) {
      console.log("watch en collection display mode: ", val);
      this.displayMode = val;
    }
  },
  methods: {
    changeMode(newMode) {
      this.$emit("input", newMode);
    },
    getModeDisplay() {
        //this.displayMode = "View";
        this.optionsList = [
          { value: "View", text: "View" }
        ];
    },
    getModeForm() {
        this.optionsList = [
          { value: "View", text: "View" },
          { value: "Edit", text: "Edit" },
        ];
    },
  }
};
</script>
