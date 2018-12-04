<template>
  <b-modal ref="modal" id="computed-properties" title="Computed Properties">
    <div v-for="(property, index) in value" :key="index">
      <div v-text="property.property"></div>
      <div v-text="property.formula"></div>
    </div>

    <form-input v-model="add.property" label="Property Name"></form-input>
    <form-text-area v-model="add.formula" label="Formula (javascript)"></form-text-area>
    <button class="btn btn-success" @click="addProperty">Add Property</button>
  </b-modal>
</template>

<script>
import {
  FormInput,
  FormTextArea,
} from "@processmaker/vue-form-elements/src/components";


export default {
  components: {
    FormInput,
    FormTextArea
  },
  props: [
    'value'
  ],
  data() {
    return {
      current: this.value,
      add: {
        property: '',
        type: 'expression',
        formula: ''
      }
    }
  },
  methods: {
    show() {
      this.$refs.modal.show()
    },
    addProperty() {
      this.current.push({
        property: this.add.property,
        formula: this.add.formula
      })
      this.$emit('input', this.current);
    }
  }

}
    
</script>

<style lang="scss" scoped>
    
</style>