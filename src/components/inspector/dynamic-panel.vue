<template>
  <div>
    <div class="form-group border-bottom">
      <FormInput
        v-model="settings.varname"
        :label="$t('Variable Name')"
        :name="$t('Variable Name')"
        :helper="$t('This variable will contain an array of objects')"
        validation="regex:/^(?:[A-Z_.a-z])(?:[0-9A-Z_.a-z])*$/|required"
        data-test="i1177-inspector-name"
      />
    </div>


    <div v-if="screenType == 'form' && settings.type === 'new'" class="form-group border-bottom">
      <FormInput
        v-model="settings.indexName"
        :label="$t('Index Name')"
        :name="$t('Index Name')"
        :helper="$t('Index Name of the dynamic panel')"
        validation="required"
        data-test="i1177-inspector-index-name"
      />
    </div>

    <div class="form-group border-bottom">
      <FormTextArea
        v-model="settings.emptyStateMessage"
        :label="$t('Empty State Message')"
        :name="$t('Empty State Message')"
        :helper="$t('Custom message to display when the panel has no data. Supports HTML and Mustache placeholders')"
        :rows="3"
        data-test="i1177-inspector-empty-state-message"
      />
    </div>
  </div>
</template>

<script>
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';

export default {
  props: ['value', 'screenType'],
  inheritAttrs: false,
  components: { FormInput, FormTextArea },
  data() {
    return {
      settings: {
        type: 'new',
        varname: '',
        indexName: '',
        emptyStateMessage: this.$t('No data available for this dynamic panel'),
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
};
</script>

