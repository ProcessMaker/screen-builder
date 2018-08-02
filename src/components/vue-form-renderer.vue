<template>
  <div>
    <div v-for="(element,index) in config[currentPage]['items']" :key="index">
      <div v-if="element.container">
        <component :selected="selected" v-model="element.items" v-bind="element.config" :is="element['component']"></component>
      </div>

      <div v-else>
        <component :validationData="transientData" v-model="transientData[element.config.name]" @submit="submit" @pageNavigate="pageNavigate" v-bind="element.config" :is="element['component']"></component>
      </div>
    </div>

  </div>
</template>

<script>
import FormText from "./renderer/form-text";
import FormButton from "./renderer/form-button";
import FormMultiColumn from "./renderer/form-multi-column";

import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup
} from "@processmaker/vue-form-elements/src/components";

export default {
  props: ["config", "data"],
  model: {
    prop: 'data',
    event: 'update'
  },
  components: {
    FormText,
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormButton,
    FormMultiColumn
  },
  data() {
    return {
      currentPage: 0,
      transientData: JSON.parse(JSON.stringify(this.data))
    };
  },
  watch: {
    data() {
      this.transientData = JSON.parse(JSON.stringify(this.data))
    },
   transientData: {
      handler: function() {
        // Only emit the update message if transientData does NOT equal this.data
        // Instead of deep object property comparison, we'll just compare the JSON representations of both
        if(JSON.stringify(this.transientData) != JSON.stringify(this.data)) {
          this.$emit("update", this.transientData);
          return;
        }
      },
      deep: true
    }
  },
  methods: {
    submit() {
      this.$emit("submit", this.transientData);
    },
    pageNavigate(page) {
      this.currentPage = page;
    },
    /*
    updateDataModel() {
      // Iterate through config
      // If item has a name property, then we store that as a name in the data
      this.config.forEach(page => {
        page.items.forEach(item => {
          // @todo Check if empty string or blank?
          if (item.config.name) {
            // Field has a name, add it to our data object
            this.$set(this.data, item.config.name, "");
          }
        });
      });
      this.$emit("update", this.data);
    }
    */
  }
};
</script>

<style lang="scss" scoped>
</style>

