<template>
  <div v-if="dataType === 'currency'">
    <label>{{ $t('Currency Format') }}</label>
    <multiselect 
      v-model="selectedCurrency"
      :options="currencyList"
      :show-labels="false"
      :allow-empty="false"
      track-by="code"
      label="code" />
  </div>
</template>

<script>
import currencyJson from '../../currency.json';
import Multiselect from 'vue-multiselect';

export default {
  props: ['currency'],
  model: {
    prop: 'currency',
    event: 'change',
  },
  components: {
    Multiselect
  },
  data() {
    return {
      dataType: null,
      selectedCurrency: {},
      currencyList: [],
    }
  },
  computed: {
    getSelectedDataType: function() {
      return this.$parent.$children[1].value;
    }
  },
  watch: {
    getSelectedDataType: {
      handler(newValue) {
        this.dataType = newValue;
        this.getDataType();
      }
    },
    currency() { 
      this.setCurrencyFormat();
    },
    selectedCurrency() {
      this.$emit('change', this.selectedCurrency);
    }
  },
  methods: {
    getDataType() {
      if (this.dataType === 'currency') {
        this.populateCurrencySelectList(); 
        this.setCurrencyFormat();
      }
    },
    populateCurrencySelectList() {
      this.currencyList = currencyJson; 
    },
    setCurrencyFormat() {
      this.selectedCurrency = this.currency;
    }
  },
  mounted() {
    this.getDataType();
  }
}
</script>