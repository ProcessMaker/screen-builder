<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <the-mask
      v-bind="$attrs"
      v-uni-id="name"
      :value="value"
      @input="gotInput"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
      type="text"
      :mask="getMask()"
    ></the-mask>
      <template v-if="validator && validator.errorCount">
        <div class="invalid-feedback" v-for="(errors, index) in validator.errors.all()" :key="index">
          <div v-for="(error, subIndex) in errors" :key="subIndex">
            {{error}}
          </div>
        </div>
      </template>
      <div class="invalid-feedback" v-if="error">{{error}}</div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from '@processmaker/vue-form-elements/src/components/mixins/validation';
import DataFormatMixin from '@processmaker/vue-form-elements/src/components/mixins/DataFormat';
import { TheMask } from 'vue-the-mask'

const uniqIdsMixin = createUniqIdsMixin()

export default {
  inheritAttrs: false,
  components: { TheMask },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
  ],
  methods: {
    gotInput(val) {
      this.$emit('input', val)
    },
    getMask() {
      return '##/##/####';
    },
  },
  computed: {
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    }
  },
  data() {
    return {
      validator: null,
    }
  }
}
</script>
