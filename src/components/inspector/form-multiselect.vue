<template>
  <div class="form-group">
    <label class="typo__label">{{label}}</label>
    <multiselect :options="options"
                 selectedLabel="Primary"
                 :class="classList"
                 :placeholder="$t('Select...')"
                 :show-labels="false"
                 label="content"
                 track-by="value"
                 v-model="selected">
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.')}}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available')}}
      </template>
    </multiselect>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<style lang="scss">
  @import "~vue-multiselect/dist/vue-multiselect.min.css";

  .is-invalid .multiselect__tags {
    border-color: red !important;
  }
</style>

<script>
  import Multiselect from "vue-multiselect";
  import ValidationMixin from "@processmaker/vue-form-elements/src/components/mixins/validation";
  export default {
    components: {
      Multiselect
    },
    mixins: [ValidationMixin],
    props: [
      "label",
      "error",
      "value",
      "options",
      "helper",
      "disabled",
      "required",
      "size",
      "name",
      "controlClass",
      "multiple"
    ],
    data() {
      return {
        // The v-model for the multiselect. Should be prepopulated with the
        // object that represents the selected value, pulled from our options
        initialValue: null,
        selected: null,
      };
    },
    watch: {
      selected() {
        let value = '';
        if (this.selected && this.selected.value) {
          value = this.selected.value;
        }
        this.$emit("input", value);
      }
    },
    computed:{
      classList() {
        return {
          'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        }
      }
    },
    mounted() {
      // We go through our options for a first-match of our options
      // to our value, if there is one
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          this.selected = JSON.parse(JSON.stringify(this.options[i]));
          // Get out of for loop
          break;
        }
      }
    },
    methods: {
      updateValue(value) {
        this.content = value.value;
        this.$emit("input", this.content);
      }
    }
  };
</script>