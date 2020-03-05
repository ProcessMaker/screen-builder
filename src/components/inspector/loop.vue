<template>
  <div>
    <label for="type">{{ $t('Data Source') }}</label>
    <b-form-select id="type" v-model="settings.type" :options="options"/>
    <small class="form-text text-muted mb-3">{{ $t('Data Connector to use') }}</small>
    
    <FormInput
      v-model="settings.varname"
      :label="$t('Variable Name')"
      :name="$t('Variable Name')"
      :helper="$t('This variable will contain an array of objects')"
      validation="regex:/^(?:[A-Z_.a-z])(?:[0-9A-Z_.a-z])*$/|required"
      >
    </FormInput>
    
    <FormInput
      v-if="settings.type === 'new'"
      v-model="settings.times"
      :label="$t('Default Loop Count')"
      :name="$t('Default Loop Count')"
      :helper="$t('Number of times to show the loop. Value must be greater than zero.')"
      validation="required|integer|min:1|max:1000"
      >
    </FormInput>

    <form-checkbox name="add"
      :label="$t('Allow additional loops')"
      v-model="settings.add"
      :helper="$t('Check this box to allow task assignee to add additional loops')">
    </form-checkbox>
  </div>
</template>

<script>
import { FormInput, FormCheckbox } from '@processmaker/vue-form-elements';
// import ValidationMixin from '@processmaker/vue-form-elements/src/components/mixins/validation';

export default {
  components: { },
  props: ['value', 'name', 'formConfig', 'inspectionConfig'],
  // mixins: [ValidationMixin],
  inheritAttrs: false,
  components: { FormInput, FormCheckbox },
  data() {
    return {
      options: [
        { value: 'new', text: this.$t('New Array of Objects')},
        { value: 'existing', text: this.$t('Existing Array')},
      ],
      settings: {
        type: 'new',
        varname: '',
        times: '3',
        add: false,
      }
    }
  },
  watch: {
    settings: {
      handler() {
        this.$emit('input', this.settings);
        this.$emit('setName', this.settings.varname);
      },
      deep: true,
    },
    value: {
      handler() {
        this.settings = this.value;
      },
      immediate: true,
    },
    // 'inspectionConfig.name': {
    //   handler() {
    //     this.settings.varname = this.inspectionConfig.name;
    //   },
    //   immediate: true,
    // }
  },
  computed: {
  },
};
</script>

<style lang="scss">
</style>
