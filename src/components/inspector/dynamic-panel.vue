<template>
  <div>
    <div class="form-group border-bottom">
      <FormInput
        v-model="settings.varname"
        :label="$t('Variable Name')"
        :name="$t('Variable Name')"
        :helper="$t('This variable will contain an array of objects')"
        validation="regex:/^(?:[A-Z_.a-z])(?:[0-9A-Z_.a-z])*$/|required"
        data-cy="inspector-name"
      />
    </div>


    <div v-if="screenType == 'form' && settings.type === 'new'" class="form-group border-bottom">
      <FormInput
        v-model="settings.indexOf"
        :label="$t('Index')"
        :name="$t('Index')"
        :helper="$t('Index of the dynamic panel')"
        validation="required"
        data-cy="inspector-times"
      />
    </div>
  </div>
</template>

<script>
import { FormInput, FormCheckbox } from '@processmaker/vue-form-elements';

export default {
  props: ['value', 'screenType'],
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
        indexOf: '',
        add: false,
      },
    };
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
  },
  computed: {
  },
};
</script>

<style lang="scss">
</style>
