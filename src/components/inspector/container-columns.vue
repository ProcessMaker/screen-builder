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
                <span v-if="isValidJson">Valid JSON Data Object</span>
                <span v-else>Invalid JSON Data Object</span>
            </div>
            <form-text-area name="dataJson"
                            label="Json Options"
                            rows="8"
                            helper="It must be a correct json format."
                            v-model="dataJson">
            </form-text-area>
            <b-btn @click="saveDataJson" :disabled="!isValidJson">{{ $t('Save') }}</b-btn>
        </template>

        <template v-else>
            <table class="table table-sm">
                <thead class="thead-dark">
                <tr>
                    <th>{{ $t('Column') }}</th>
                    <th>{{ $t('Colspan') }}</th>
                    <th>{{ $t('Remove') }}</th>
                </tr>
                </thead>
                <draggable
                        @update="updateSort"
                        :element="'tbody'"
                        v-model="existingOptions"
                        :options="{group:'options'}">
                    <tr v-for="(option, index) in existingOptions" :key="index">
                        <td>{{option.value}}</td>
                        <td>{{option.content}}</td>
                        <td>
                            <button @click="removeOption(index)" class="btn btn-danger btn-sm" v-if="deleteIf">x
                            </button>
                        </td>
                    </tr>
                </draggable>
            </table>
            <b-btn v-b-modal.addOptionModal>{{ $t('Add Column') }}</b-btn>
            <small v-if="helper" class="form-text text-muted">{{$t(helper)}}</small>

            <b-modal @cancel="resetAdd" @ok="addNewOption" id="addOptionModal" :title="$t('Add New Column')">
                <form-input
                        :label="$t('Column Width')"
                        v-model="addContent"
                        validate="required|numeric|between:1,12"
                        :error="this.addError"
                ></form-input>
            </b-modal>
        </template>
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
    computed: {
      deleteIf() {
        //must have at least one column
        return this.options.length > 1;
      },
      isValidJson() {
        try {
          JSON.parse(this.dataJson);
          return true
        } catch (err) {
          return false
        }
      },
    },
    methods: {
      saveDataJson() {
        if (this.isValidJson) {
          this.$emit('change', JSON.parse(this.dataJson));
        }
      },
      updateSort() {
        this.existingOptions.forEach((item, index) => {
          item.value = index + 1;
        });
        let newOptions = JSON.parse(JSON.stringify(this.existingOptions));
        this.$emit("change", newOptions);
      },
      resetAdd() {
        this.addValue = "";
        this.addContent = "";
        this.addError = "";
      },
      addNewOption(event) {
        let newOptions = JSON.parse(JSON.stringify(this.options));

        if (isNaN(this.addContent)) {
          this.addError = this.$t("This value must be numeric");
          event.preventDefault();
          return;
        }

        if (!(0 < this.addContent && this.addContent < 13)) {
          this.addError = this.$t("This value must be between 1-12");
          event.preventDefault();
          return;
        }
        let newIndex = 0,
          sum = 0;
        this.existingOptions.forEach(item => {
          newIndex++;
          sum += Number(item.content);
          item.value = newIndex;
        });

        if (sum + Number(this.addContent) > 12) {
          this.addError = this.$t("The total size of the columns exceeds 12");
          event.preventDefault();
          return;
        }

        newOptions.push({
          value: newIndex + 1,
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
        newOptions.forEach((item, index) => {
          item.value = index + 1;
        });
        this.$emit("change", newOptions);
      }
    }
  };
</script>
