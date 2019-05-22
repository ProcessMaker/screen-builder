<template>
    <div class="form-group">

        <h3>{{label}}</h3>
        <form-checkbox name="type"
                       toggle="true"
                       :label="$t('Show in Json Format')"
                       v-model="displayList"
                       helper="">
        </form-checkbox>

        <template v-if="displayList">
            <div class="alert"
                 :class="{'alert-success': isValidJson, 'alert-danger': !isValidJson}">
                <span v-if="isValidJson">{{ $t('Valid JSON Data Object') }}</span>
                <span v-else>{{ $t('Invalid JSON Data Object') }}</span>
            </div>
            <form-text-area name="dataJson"
                            label="Json Options"
                            rows="8"
                            :helper="$t('It must be a correct json format')"
                            v-model="dataJson">
            </form-text-area>
            <b-btn @click="saveDataJson" :disabled="!isValidJson">{{ $t('Save') }}</b-btn>
        </template>

        <template v-else>
            <table class="table table-sm">
                <thead class="thead-dark">
                <tr>
                    <th>{{ $t('Value') }}</th>
                    <th>{{ $t('Content') }}</th>
                    <th>{{ $t('Actions') }}</th>
                </tr>
                </thead>
                <draggable @update="updateSort"
                           :element="'tbody'"
                           v-model="existingOptions"
                           :options="{group:'options'}"
                           @start="drag=true"
                           @end="drag=false">
                    <tr v-for="(option, index) in existingOptions" :key="index">
                        <td>{{option.value}}</td>
                        <td>{{option.content}}</td>
                        <td>
                            <button @click="removeOption(index)" class="btn btn-danger btn-sm">x</button>
                        </td>
                    </tr>
                </draggable>
            </table>
            <b-btn v-b-modal.addOptionModal>{{ $t('Add Option') }}</b-btn>

            <b-modal centered @cancel="resetAdd" @ok="addNewOption" id="addOptionModal" :title="$t('Add New Option')">
                <form-input :label="$t('Variable Name')" v-model="addValue" :error="this.addError"></form-input>
                <form-input :label="$t('Field Label')" v-model="addContent"></form-input>
            </b-modal>
        </template>

        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>

<script>
  import draggable from "vuedraggable";
  import {FormInput, FormCheckbox, FormTextArea} from "@processmaker/vue-form-elements";

  export default {
    components: {
      FormInput,
      FormCheckbox,
      FormTextArea,
      draggable
    },
    data() {
      return {
        addValue: "",
        addContent: "",
        addError: "",
        existingOptions: [],
        dataJson: [],
        displayList: false,
      };
    },
    computed: {
      isValidJson() {
        try {
          JSON.parse(this.dataJson);
          return true
        } catch (err) {
          return false
        }
      },
    },
    mounted() {
      this.existingOptions = JSON.parse(JSON.stringify(this.options));
    },
    watch: {
      displayList() {
        if (this.displayList) {
          this.dataJson = this.options ? JSON.stringify(this.options) : '';
        }
      },
      options() {
        this.existingOptions = JSON.parse(JSON.stringify(this.options));
      }
    },
    props: ["label", "options", "helper"],
    model: {
      prop: "options",
      event: "change"
    },
    methods: {
      saveDataJson() {
        if (this.isValidJson) {
          this.$emit('change', JSON.parse(this.dataJson));
        }
      },
      updateSort() {
        let newOptions = JSON.parse(JSON.stringify(this.existingOptions))
        this.$emit('change', newOptions)
      },
      resetAdd() {
        this.addValue = "";
        this.addContent = "";
        this.addError = "";
      },
      addNewOption(event) {
        let newOptions = JSON.parse(JSON.stringify(this.options));
        // Iterate through each element, and if the value already exists, then fail out
        for (var existingOption of newOptions) {
          if (existingOption.value === this.addValue) {
            // Found, let's return cancel?
            this.addError = this.$t("This value already exists in the list of options");
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
    }
  };
</script>

<style lang="scss" scoped>
</style>
