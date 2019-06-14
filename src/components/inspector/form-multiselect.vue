<template>
    <div class="mb-2">
        <label class="typo__label">{{label}}</label>
        <multiselect :options="options"
                     selectedLabel="Primary"
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
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>

<style lang="scss" scoped>
    @import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>

<script>
  import Multiselect from "vue-multiselect";

  export default {
    components: {
      Multiselect
    },
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