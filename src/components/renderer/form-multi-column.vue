<template>
    <div class="form-group">
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <div v-for="(element,index) in items[0]" :key="index">
                        <div v-if="element.container" class="container">
                            <component v-model="element.items" v-bind="element.config" :is="element['component']"></component>
                        </div>

                        <div v-else>
                            <component v-bind="element.config" :is="element['component']"></component>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div v-for="(element,index) in items[1]" :key="index">
                        <div v-if="element.container" class="container">
                            <component v-model="element.items" v-bind="element.config" :is="element['component']"></component>
                        </div>

                        <div v-else>
                            <component v-bind="element.config" :is="element['component']"></component>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";

import FormMultiColumn from "./form-multi-column"

import FormText from "../renderer/form-text";
import FormButton from "../renderer/form-button";

import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup
} from "@processmaker/vue-form-elements/src/components";

export default {
    name: 'FormMultiColumn',
  props: ["value", "selected"],
  components: {
    draggable,
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormText,
    FormButton,
    FormMultiColumn
  },
  data() {
    return {
      items: []
    };
  },
  watch: {
    value: {
      handler: function() {
        this.items = this.value;
      },
      immediate: true
    },
    items() {
      this.$emit("input", this.items);
    }
  },
  methods: {
      inspect(element) {
          this.$emit('inspect', element)
      }
  }
};
</script>

<style lang="scss" scoped>


</style>


