<template>
  <b-container fluid>
    <div
      v-if="displayAsyncLoading"
      ref="watchersAsynchronous"
      class="alert alert-light"
      role="alert"
    >
      <svg
        class="lds-gear"
        width="20px"
        height="20px"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <g transform="translate(50 50)">
          <g transform="rotate(248.825)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;360"
              keyTimes="0;1"
              dur="4.7s"
              repeatCount="indefinite"
            />
            <path
              d="M37.43995192304605 -6.5 L47.43995192304605 -6.5 L47.43995192304605 6.5 L37.43995192304605 6.5 A38 38 0 0 1 35.67394948182593 13.090810836924174 L35.67394948182593 13.090810836924174 L44.33420351967032 18.090810836924174 L37.83420351967032 29.34914108612188 L29.17394948182593 24.34914108612188 A38 38 0 0 1 24.34914108612188 29.17394948182593 L24.34914108612188 29.17394948182593 L29.34914108612188 37.83420351967032 L18.090810836924184 44.33420351967032 L13.090810836924183 35.67394948182593 A38 38 0 0 1 6.5 37.43995192304605 L6.5 37.43995192304605 L6.500000000000001 47.43995192304605 L-6.499999999999995 47.43995192304606 L-6.499999999999996 37.43995192304606 A38 38 0 0 1 -13.09081083692417 35.67394948182593 L-13.09081083692417 35.67394948182593 L-18.09081083692417 44.33420351967032 L-29.34914108612187 37.834203519670325 L-24.349141086121872 29.173949481825936 A38 38 0 0 1 -29.17394948182592 24.34914108612189 L-29.17394948182592 24.34914108612189 L-37.83420351967031 29.349141086121893 L-44.33420351967031 18.0908108369242 L-35.67394948182592 13.090810836924193 A38 38 0 0 1 -37.43995192304605 6.5000000000000036 L-37.43995192304605 6.5000000000000036 L-47.43995192304605 6.500000000000004 L-47.43995192304606 -6.499999999999993 L-37.43995192304606 -6.499999999999994 A38 38 0 0 1 -35.67394948182593 -13.090810836924167 L-35.67394948182593 -13.090810836924167 L-44.33420351967032 -18.090810836924163 L-37.834203519670325 -29.34914108612187 L-29.173949481825936 -24.34914108612187 A38 38 0 0 1 -24.349141086121893 -29.17394948182592 L-24.349141086121893 -29.17394948182592 L-29.349141086121897 -37.834203519670304 L-18.0908108369242 -44.334203519670304 L-13.090810836924195 -35.67394948182592 A38 38 0 0 1 -6.500000000000005 -37.43995192304605 L-6.500000000000005 -37.43995192304605 L-6.500000000000007 -47.43995192304605 L6.49999999999999 -47.43995192304606 L6.499999999999992 -37.43995192304606 A38 38 0 0 1 13.090810836924149 -35.67394948182594 L13.090810836924149 -35.67394948182594 L18.090810836924142 -44.33420351967033 L29.349141086121847 -37.83420351967034 L24.349141086121854 -29.17394948182595 A38 38 0 0 1 29.17394948182592 -24.349141086121893 L29.17394948182592 -24.349141086121893 L37.834203519670304 -29.349141086121897 L44.334203519670304 -18.0908108369242 L35.67394948182592 -13.090810836924197 A38 38 0 0 1 37.43995192304605 -6.500000000000007 M0 -20A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20"
            />
          </g>
        </g>
      </svg>
      {{ $t("Loading...") }}
    </div>
    <component
      :is="component"
      ref="component"
      :vdata="value"
      :_parent="_parent"
      :_initial-page="currentPage"
      @after-submit="afterSubmit"
      @submit="submit"
      @asyncWatcherTriggered="onAsyncWatcherOn"
      @asyncWatcherCompleted="onAsyncWatcherOff"
    />
    <screen-renderer-error
      v-if="showErrors && building.error"
      v-model="building"
    />
    <watchers-synchronous ref="watchersSynchronous" />
  </b-container>
</template>

<script>
import { cloneDeep, isEmpty, isEqual } from "lodash";
import Json2Vue from "../mixins/Json2Vue";
import CurrentPageProperty from "../mixins/CurrentPageProperty";
import WatchersSynchronous from "@/components/watchers-synchronous";
import ScreenRendererError from "../components/renderer/screen-renderer-error";

export default {
  name: "ScreenRenderer",
  components: { WatchersSynchronous, ScreenRendererError },
  mixins: [Json2Vue, CurrentPageProperty],
  props: {
    // property used to pass the context of the screen used as prefix for the file upload component
    // e.g. `multi_instance_var.1` or `loop_var.1`
    loopContext: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      currentDefinition: null,
      codigo: "",
      displayAsyncLoading: false
    };
  },
  watch: {
    definition: {
      deep: true,
      handler(definition) {
        if (isEmpty(definition.config)) return;
        this.rebuildScreen(definition);
      }
    }
  },
  mounted() {
    this.currentDefinition = cloneDeep(this.definition);
    this.component = this.buildComponent(this.currentDefinition);
  },
  methods: {
    rebuildScreen(definition) {
      if (!isEqual(definition, this.currentDefinition)) {
        this.currentDefinition = cloneDeep(definition);
        this.component = this.buildComponent(this.currentDefinition);
      }
    },
    onAsyncWatcherOn() {
      this.displayAsyncLoading = typeof this._parent === "undefined";
    },
    onAsyncWatcherOff() {
      this.displayAsyncLoading = false;
    },
    getCurrentPage() {
      return this.$refs.component.getCurrentPage();
    },
    setCurrentPage(page) {
      this.$refs.component.setCurrentPage(page);
    },
    afterSubmit() {
      this.$emit('after-submit', ...arguments);
    }
  }
};
</script>

<style>
.form-group--error {
  animation: none;
}
@keyframes shakeError {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(0.375rem);
  }
  30% {
    transform: translateX(-0.375rem);
  }
  45% {
    transform: translateX(0.375rem);
  }
  60% {
    transform: translateX(-0.375rem);
  }
  75% {
    transform: translateX(0.375rem);
  }
  90% {
    transform: translateX(-0.375rem);
  }
  100% {
    transform: none;
  }
}
</style>
