<template>
  <div class="form-group">
    <label v-uni-for="name">{{ label }}</label>
    <component
      :is="componentType"
      v-model="localValue"
      v-bind="componentConfig"
      v-uni-id="name"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
      type="text"
      :mask="getMask()"
    />
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
import { TheMask } from 'vue-the-mask';
import { Money } from 'v-money';
import maskConfig from '../../form-input-mask-config';

const uniqIdsMixin = createUniqIdsMixin();
const componentTypes = {
  currency: 'money',
  date: 'the-mask',
};

export default {
  inheritAttrs: false,
  components: { TheMask, Money },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'dataMask',
  ],
  methods: {
    gotInput(val) {
      this.$emit('input', this.componentType === 'input' ? val.target.value : val);
    },
    getMask() {
      // @todo prepare de mask from this.getMaskConfig()
      return '##/##/####';
    },
    /**
     * Return the config in ex. currncy.json for the selected currency:
     * {
     *    "Name": "Albanian Lek",
     *    "Format": "####.##",
     *    "Symbol": ""
     * }
     * 
     */
    getMaskConfig() {
      const mask = maskConfig[this.dataFormat] || maskConfig.defaultMask;
      return mask.config[this.dataMask];
    },
  },
  computed: {
    componentConfig() {
      // @todo configure the <money> properties from this.getMaskConfig()
      return Object.assign({}, {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          suffix: ' #',
          precision: 2,
          masked: false
        }, this.$attrs);
    },
    componentType() {
      return componentTypes[this.dataFormat] || 'input';
    },
    maskConfig() {
      return this.getMaskConfig();
    },
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    }
  },
  watch: {
    value(value) {
      value !== this.localValue ? this.localValue = value : null;
    },
    localValue(value) {
      value !== this.value ? this.$emit('input', value) : null;
    },
  },
  data() {
    return {
      validator: null,
      localValue: this.value,
      price: 0,
    }
  }
}
</script>
