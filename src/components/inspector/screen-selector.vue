<template>
  <div>
    <label class="typo__label">{{ label }}</label>
    <multiselect
      :value="selectedOption"
      @input="change"
      :placeholder="placeholder"
      :options="options"
      :multiple="multiple"
      :track-by="trackBy"
      :show-labels="false"
      :searchable="true"
      :internal-search="false"
      label="title"
      @search-change="loadOptions"
      @open="loadOptions"
    >
      <template slot="noResult">
        <slot name="noResult">{{ $t('Not found') }}</slot>
      </template>
      <template slot="noOptions">
        <slot name="noOptions">{{ $t('No Data Available') }}</slot>
      </template>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { multiselectApi } from '@/mixins';
import { formTypes } from '@/global-properties'

export default {
  mixins: [multiselectApi],
  components: { Multiselect },
  props: {
    api: {
      type: String,
      default: 'screens',
    },
    builder: {
      type: Object,
      required: true,
    },
    screenType: {
      type: String,
      default: formTypes.form
    }
  },
  mounted() {
    let pmql = '(type = "FORM" or type = "DISPLAY")';
    if (this.screenType === formTypes.display) {
      pmql = '(type = "DISPLAY")';
    }
    if (this.builder.screen) {
      pmql += ' and id != ' + this.builder.screen.id;
    }
    this.pmql = pmql;
  },
};
</script>
