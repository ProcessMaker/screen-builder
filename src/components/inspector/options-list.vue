<template>
    <div>
        <h3>{{label}}</h3>
        <table class="table table-sm">
            <thead class="thead-dark">
                <tr>
                    <th>Value</th>
                    <th>Content</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(option, index) in options" :key="index">
                    <td>{{option.value}}</td>
                    <td>{{option.content}}</td>
                    <td>
                        <button @click="removeOption(index)" class="btn btn-danger btn-sm">x</button>
                    </td>
                </tr>
            </tbody>

        </table>
        <b-btn v-b-modal.addOptionModal>Add Option</b-btn>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>

        <b-modal @cancel="resetAdd" @ok="addNewOption" id="addOptionModal" title="Add New Option">
            <form-input label="Option Value" v-model="addValue" :error="this.addError"></form-input>
            <form-input label="Option Label" v-model="addContent"></form-input>
        </b-modal>
    </div>
</template>

<script>
import { FormInput } from "@processmaker/vue-form-elements/src/components";

export default {
  components: {
    FormInput
  },
  data() {
    return {
      addValue: "",
      addContent: "",
      addError: ""
    };
  },
  props: ["label", "options", "helper"],
  model: {
    prop: "options",
    event: "change"
  },
  methods: {
    resetAdd() {
      this.addValue = "";
      this.addContent = "";
      this.addError = "";
    },
    addNewOption(event) {
      let newOptions = JSON.parse(JSON.stringify(this.options));
      // Iterate through each element, and if the value already exists, then fail out
      for (var existingOption of newOptions) {
        if (existingOption.value == this.addValue) {
          // Found, let's return cancel?
          this.addError = "This value already exists in the list of options";
          event.preventDefault();
          return;
        }
      }
      newOptions.push({
        value: this.addValue,
        content: this.addContent
      });
      this.$emit("change", newOptions);
      // Reset values
      this.resetAdd();
    },
    removeOption(index) {
      // Convert to plain array
      let newOptions = JSON.parse(JSON.stringify(this.options));
      // Remove index from array
      newOptions.splice(index, 1);
      this.$emit("change", newOptions);
    },
    showAddOptionModal() {}
  }
};
</script>

<style lang="scss" scoped>
</style>


