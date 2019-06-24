<template>
  <div class="mb-2">
    <label class="typo__label">{{ label }}</label>
    <multiselect
      v-model="target"
      label="content"
      :placeholder="$t('Select...')"
      :show-labels="false"
      :options="options"
    >
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available') }}
      </template>
    </multiselect>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<style lang="scss" scoped>
    @import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>

<script>
import Multiselect from 'vue-multiselect';

export default {
  props: ['label', 'helper', 'formConfig', 'value'],
  data() {
    return {
      target: 0,
    };
  },
  watch: {
    value: {
      handler() {
        const value = this.target ? this.target.value : '';
        if (value !== this.value) {
          this.target = this.options.find(item => {
            return item.value === this.value;
          });
        }
      },
      immediate: true,
    },
    target() {
      const value = this.target ? this.target.value : '';
      if (this.value !== value) {
        this.$emit('input', value);
      }
    },
  },
  components: {
    Multiselect,
  },
  computed: {
    options() {
      let options = [];
      // Get the page values (array index), and the content (page title)
      for (var index in this.formConfig) {
        options.push({
          value: index,
          content: this.formConfig[index].name,
        });
      }
      return options;
    },
  },
};
</script>