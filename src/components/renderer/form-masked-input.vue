<template>
  <div class="form-group">
    <label v-uni-for="name">{{ label }}</label>
    <money v-if="component === 'money'"
      v-bind="{...$attrs, ...maskConfig()}"
      v-uni-id="name"
      :value="localValue"
      @input="gotInput"
      :name="name"
      class="form-control"
      :class="classList"
    ></money>

    <masked-input v-if="component === 'masked-input'"
      v-bind="$attrs"
      v-uni-id="name"
      :value="localValue"
      @input="gotInput"
      :name="name"
      class="form-control"
      :class="classList"
      :mask="mask"
      :guide="false"
    ></masked-input>

    <input v-if="component === 'input'"
      v-bind="$attrs"
      v-uni-id="name"
      :value="localValue"
      @input="gotInput"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
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
// import { TheMask } from 'vue-the-mask';
import { Money } from 'v-money';
// import maskConfig from '../../form-input-mask-config';
import MaskedInput from 'vue-text-mask'

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: { MaskedInput, Money },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'dataFormat',
    'dataMask',
  ],
  methods: {
    gotInput(val) {
      if (typeof val === 'object') {
        val = val.target.value
      }
      this.localValue = val;
    },
    setCurrencyFormatter(code) {
      this.currencyFormatter = new Intl.NumberFormat(this.lang, { style: 'currency', currency: code });
      
      const parts = this.currencyFormatter.formatToParts('11111.11');

      let prefix = '';
      let decimal = '';
      let suffix = '';

      let startIdx = 0;
      if (parts[0].type === 'currency') {
        prefix = parts[0].value;
        startIdx = 1
        
        if (parts[1].type === 'literal') {
          prefix += parts[1].value;
          startIdx = 2
        }
      }

      if (parts[startIdx].type !== 'integer' || parts[startIdx + 1].type !== 'group') {
        throw "Part Error: " + JSON.stringify(parts);
      }

      let thousands = parts[startIdx + 1].value

      let endIdx = startIdx + 3;
      if (parts[startIdx + 3] && parts[startIdx + 3].type === 'decimal') {
        decimal = parts[startIdx + 3].value;
        endIdx += 2;
      }

      if (parts[endIdx]) {
        if (parts[endIdx].type == 'literal') {
          suffix = parts[endIdx].value + parts[endIdx + 1].value;
        } else {
          suffix = parts[endIdx].value
        }
      }
      this.currencyParts = {
        decimal,
        thousands,
        prefix,
        suffix,
      }
    },
    mask(value) {
    },
    maskConfig() {
      const precision = this.currencyParts.decimal === "" ? 0 : 2;
      return { 
          ...this.currencyParts,
          precision,
          masked: false
      }
    }
  },
  computed: {
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    }
  },
  watch: {
    value() {
      if (this.value !== this.localValue) {
        this.localValue = this.value;
      }
    },
    localValue() {
      this.$emit('input', this.value);
    },
    dataFormat() {
      if (this.isCurrency) {
        this.component = 'money'
      } else {
        this.component = 'input';
      }
    },
    'dataMask.code': {
      handler() {
        this.setCurrencyFormatter(this.dataMask.code);
      }
    },
  },
  computed: {
    isCurrency() {
      return this.dataFormat === 'currency';
    },
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
      localValue: '',
      lang: 'en-US',
      currencyFormatter: null,
      component: 'input',
      currencyParts: null,
    }
  },
  mounted() {
    if (document && document.documentElement && document.documentElement.lang) {
      this.lang = document.documentElement.lang;
    }
    this.setCurrencyFormatter('USD'); // default
  }
}
</script>
