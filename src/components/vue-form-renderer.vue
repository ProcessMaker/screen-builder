<template>
    <div>
        <component @submit="submit" @pageNavigate="pageNavigate" :validationData="data" v-model="data[element.config.name]" v-for="(element,index) in config[currentPage]['items']" :key="index" v-bind="element.config" :is="element['editor-component']"></component>
    </div>
</template>

<script>
import FormText from "./renderer/form-text";
import FormButton from "./renderer/form-button";


import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup
} from "@processmaker/vue-form-elements/src/components";

export default {
  props: ["config"],
  components: {
    FormText,
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormButton
  },
  data() {
    return {
      currentPage: 0,
      data: {}
    };
  },
  watch: {
    config: {
      handler: function() {
        this.updateDataModel();
      },
      immediate: true
    },
    data: {
      handler: function() {
        this.$emit('update', this.data)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.data)
    },
    pageNavigate(page) {
      this.currentPage = page
    },
    updateDataModel() {
      // Iterate through config
      // If item has a name property, then we store that as a name in the data
      this.config.forEach((page) => {
        page.items.forEach((item) => {
          // @todo Check if empty string or blank?
          if (item.config.name) {
            // Field has a name, add it to our data object
            this.$set(this.data, item.config.name, "");
          }
        });
      });
      this.$emit('update', this.data)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

