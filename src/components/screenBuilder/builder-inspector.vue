<template>
  <b-col
    v-if="renderControls"
    class="overflow-hidden h-100 p-0 inspector-column"
  >
    <b-card
      no-body
      class="h-100 rounded-0 border-top-0 border-bottom-0 border-left-0"
    >
      <b-card
        no-body
        class="p-0 h-100 border-top-0 border-bottom-0 border-right-0 rounded-0"
      >
        <b-card-body class="p-0 h-100 overflow-auto">
          <template v-for="accordion in accordions">
            <b-button
              v-if="getInspectorFields(accordion).length > 0"
              :key="`${accordionName(accordion)}-button`"
              variant="outline"
              class="text-left card-header d-flex align-items-center w-100 outline-0 text-capitalize shadow-none"
              :data-cy="`accordion-${accordionName(accordion).replace(
                ' ',
                ''
              )}`"
              :accordion-name="`accordion-${accordionName(accordion).replace(
                ' ',
                ''
              )}`"
              :is-open="accordion.open ? '1' : '0'"
              @click="toggleAccordion(accordion)"
            >
              <i class="fas fa-cog mr-2" />
              {{ $t(accordionName(accordion)) }}
              <i
                class="fas fa-angle-down ml-auto"
                :class="{ 'fas fa-angle-right': !accordion.open }"
              />
            </b-button>
            <b-collapse
              :id="accordionName(accordion)"
              :key="`${accordionName(accordion)}-collapse`"
              v-model="accordion.open"
            >
              <component
                :is="item.type"
                v-for="(item, index) in getInspectorFields(accordion)"
                :key="index"
                v-bind="item.config"
                v-model="inspection.config[item.field]"
                :data-cy="'inspector-' + (item.field || item.config.name)"
                :field-name="item.field"
                :field-accordion="`accordion-${accordionName(accordion).replace(
                  ' ',
                  ''
                )}`"
                :builder="builder"
                :form-config="config"
                :screen-type="screenType"
                :current-page="currentPage"
                :selected-control="selected"
                class="border-bottom m-0 p-4"
                @focusout.native="updateState"
                @setName="inspection.config.name = $event"
              />
            </b-collapse>
          </template>
        </b-card-body>
      </b-card>
    </b-card>
  </b-col>
</template>

<script>
import {
  FormInput,
  FormSelectList,
  FormTextArea,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormHtmlViewer
} from "@processmaker/vue-form-elements";
import * as renderer from "../renderer";
import * as inspector from "../inspector";
import { inspectorFields } from "@/mixins";
import { formTypes } from "@/global-properties";
// import defaultValueEditor from "./inspector/default-value-editor";
import RequiredCheckbox from "../utils/multiple-uploads-checkbox.vue";
import MultipleUploadsCheckbox from "../utils/multiple-uploads-checkbox";
import defaultValueEditor from "../inspector/default-value-editor";

//

export default {
  name: "BuilderInspector",
  components: {
    FormInput,
    FormSelectList,
    FormCheckbox,
    FormTextArea,
    FormDatePicker,
    FormHtmlEditor,
    FormHtmlViewer,
    RequiredCheckbox,
    MultipleUploadsCheckbox,
    defaultValueEditor,
    ...inspector,
    ...renderer
  },
  mixins: [inspectorFields],
  props: {
    controls: {
      type: Array,
      default: null
    },
    accordions: {
      type: Array,
      default: null
    },
    renderControls: {
      type: Boolean,
      default: true
    },
    config: {
      type: Array,
      default: null
    },
    screenType: {
      type: String,
      default: formTypes.form
    },
    currentPage: {
      type: Number,
      default: 0
    },
    selected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      inspection: {}
    };
  },
  computed: {
    builder() {
      return this;
    }
  },
  watch: {
    selected(item) {
      this.inspection = item;
      const defaultAccordion = this.accordions.find(
        (accordion) => this.getInspectorFields(accordion).length > 0
      );
      console.log(defaultAccordion);
      if (defaultAccordion) {
        this.openAccordion(defaultAccordion);
      }
    }
  },
  methods: {
    /**
     * Gets the accordion name
     * @param {*} accordion
     */
    accordionName(accordion) {
      // Returns the result of calling the "name" function with the argument "this.inspection".
      // If it is not a function, it returns the value of the "name" property.
      return accordion.name instanceof Function
        ? accordion.name(this.inspection)
        : accordion.name;
    },
    /**
     * Toggles an accordion open or closed.
     * Takes in an accordion as parameter.
     * @param {array} accordion
     */
    toggleAccordion(accordion) {
      // Sets all of them to false except for the one passed in as a parameter.
      this.accordions.forEach((panel) => {
        if (panel !== accordion) {
          panel.open = false;
        }
      });
      // sets the open property of the accordion passed in as a parameter to its opposite (true if false, false if true).
      accordion.open = !accordion.open;
    },
    /**
     * Open an accordion.
     * Takes in an accordion as parameter.
     * @param {array} accordion
     */
    openAccordion(accordion) {
      // loops throught all accodions and sets the open property of each panel to false.
      this.accordions.forEach((panel) => (panel.open = false));
      // sets the open property of the passed in accordion to true, thus opening it.
      accordion.open = true;
    },
    /**
     * Fire emits an event called "updateState".
     */
    updateState() {
      this.$emit("updateState");
    }
  }
};
</script>
