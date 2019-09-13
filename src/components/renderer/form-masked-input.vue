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
      :modelClean="true"
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
import MaskedInput, {conformToMask} from 'vue-text-mask'

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: { MaskedInput, Money },
  mixins: [uniqIdsMixin, ValidationMixin ], //DataFormatMixin
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
    setPercentageFormatter() {
      this.percentageFormatter = new Intl.NumberFormat(this.lang, { style: 'percent', maximumFractionDigits: 20 });
      // this was an attempt to use v-money for percentages, didn't work
      // let parts = this.percentageFormatter.formatToParts('111.1111');
      // this.vMoneyConfig = this.partsToMaskConfig(parts);
    },
    setCurrencyFormatter(code) {
      this.currencyFormatter = new Intl.NumberFormat(this.lang, { style: 'currency', currency: code });
      let parts = this.currencyFormatter.formatToParts('11111.11');
      this.vMoneyConfig = this.partsToMaskConfig(parts);
    },
    partsToMaskConfig(parts) {
      let prefix = '';
      let decimal = '';
      let suffix = '';

      let startIdx = 0;
      if (parts[0].type === 'currency' || parts[0].type === 'percentSign') {
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
      return {
        decimal,
        thousands,
        prefix,
        suffix,
      }
    },
    mask(value) {
      console.log("Mask fn got value", value);
      if (typeof value === 'string') {
        value = this.stripPercentage(value);
      }
      console.log("Formatting to parts with", value / 100)
      const parts = this.percentageFormatter.formatToParts(value / 100);
      console.log("parts: ", parts);
      let mask = parts.flatMap((part) => {
        if (part.type === 'integer') {
          return part.value.split('').map((char) => {
            return /\d/;
          });
        }
        return part.value;
      });
      console.log("So returning mask", mask)
      // for (const part in parts) {
      //   if (part.type === 'integer') {
      //   }
      // }
      // return ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      return mask;
    },
    maskConfig() {
      const precision = this.vMoneyConfig.decimal === "" ? 0 : 2;
      return { 
          ...this.vMoneyConfig,
          precision,
          masked: false
      }
    },
    stripPercentage(value) {
      if (value === "") {
        return 0;
      }
      console.log("stripPercentage", value)
      return parseFloat(value.replace(/\D/g, ''));
      
      // TODO . and % need to be localized
      // return value.replace("%", '').replace('/\.$');
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
      console.log("VALUE CHANGED TO", this.value, '(local value is ', this.localValue)
      if (this.isPercentage) {
          let newval = conformToMask(this.localValue, this.mask(this.value)).conformedValue;
          console.log("Formatting incoming value to: ", newval)
          this.localValue = newval;
      } else {
        if (this.value !== this.localValue) {
          this.localValue = this.value;
        }
      }
    },
    localValue() {
      console.log("LOCAL CHANGED TO, EMITTING", this.localValue)
      let emitValue = this.localValue;
      if (this.isPercentage) {
        // value comes back formatted so strip out the formatting here
        emitValue = this.stripPercentage(this.localValue)
      }
      console.log("Actually emiting", emitValue)
      this.$emit('input', emitValue);
    },
    dataFormat() {
      if (this.isCurrency) {
        this.component = 'money'
      } else if (this.isPercentage) {
        this.component = 'masked-input'
      } else {
        this.component = 'input';
      }
    },
    'dataMask.code': {
      handler() {
        if (this.isCurrency) {
          this.setCurrencyFormatter(this.dataMask.code);
        }
      }
    },
  },
  computed: {
    isCurrency() {
      return this.dataFormat === 'currency';
    },
    isPercentage() {
      return this.dataFormat === 'percentage';
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
      percentageFormatter: null,
      component: 'input',
      vMoneyConfig: null,
    }
  },
  mounted() {
    if (document && document.documentElement && document.documentElement.lang) {
      this.lang = document.documentElement.lang;
    }
    this.setCurrencyFormatter('USD'); // default
    this.setPercentageFormatter();
  }
}
</script>
