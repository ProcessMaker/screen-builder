<template>
  <div class="form-group">
    <required-asterisk /><label v-uni-for="name">{{label}}</label>
    <input
      v-bind="$attrs"
      v-uni-id="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
    >
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from '../mixins/validation'
import DataFormatMixin from '../mixins/DataFormat';
import DisplayErrors from './common/DisplayErrors.vue';
import RequiredAsterisk from './common/RequiredAsterisk.vue';

const uniqIdsMixin = createUniqIdsMixin();

export default {
  name: 'FormInput',
  inheritAttrs: false,
  components: {
    DisplayErrors,
    RequiredAsterisk,
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
  ],
  computed:{
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    }
  },
  data() {
    return {
      validator: null
    }
  },
}
</script>
