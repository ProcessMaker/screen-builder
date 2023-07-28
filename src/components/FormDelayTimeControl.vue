<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <div class="input-group">
      <input type="number" min="1" class="form-control control repeat" :class="classList" v-model="repeat" >
      <div class="input-group-append">
        <select class="form-control custom-select" :class="classList" v-model="periodicity">
          <option v-for="period in periods" :key="period.name" :value="period">{{ $t(period.name) }}</option>
        </select>
      </div>
    <template v-if="validator && validator.errorCount">
      <div class="invalid-feedback" v-for="(errors, index) in validator.errors.all()" :key="index">
        <div v-for="(error, subIndex) in errors" :key="subIndex">
          {{error}}
        </div>
      </div>
    </template>
    <div class="invalid-feedback" v-if="error">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import ValidationMixin from '../mixins/validation'
import last from 'lodash/last';

const periodNames = {
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  month: 'month',
};

export default {
  mixins: [ValidationMixin],
  props: {
    value: {
      type: String,
      default: 'PT1M',
    },
    error: null,
    name: String,
    label: String,
    helper: String,
  },
  data() {
    const periods = [
      { name: periodNames.minute, value: 'M', isTime: true },
      { name: periodNames.hour, value: 'H', isTime: true },
      { name: periodNames.day, value: 'D' },
      { name: periodNames.month, value: 'M' },
    ];

    return {
      repeat: null,
      periodicity: null,
      periods,
    };
  },
  watch: {
    value: {
      handler(value) {
        this.periodicity = this.getPeriodFromDelayString(value);
        this.repeat = this.getRepeatNumberFromDelayString(value);
      },
      immediate: true,
    },
    durationExpression: {
      handler(durationExpression) {
        this.$emit('input', durationExpression);
      },
      immediate: true,
    },
  },
  computed: {
    classList(){
      let classList = {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error, 
      }
      if(this.controlClass) {
        classList[this.controlClass] = true
      }
      return classList
    },
    durationExpression() {
      if (!this.repeat) return '';
      if (!this.periodicity) return '';
      if (this.periodicity.isTime) {
        return `PT${this.repeat}${this.periodicity.value}`;
      }

      return `P${this.repeat}${this.periodicity.value}`;
    },
  },
  methods: {
    getPeriodFromDelayString(delayString) {
      const isTimePeriod = this.isTimePeriod(delayString);
      const periodicity = last(delayString);

      if (periodicity === 'M') {
        const periodName = isTimePeriod
          ? periodNames.minute
          : periodNames.month;

        return this.periods.find(({ name }) => name === periodName);
      }

      return this.periods.find(({ value }) => value === periodicity);
    },
    isTimePeriod(delayString) {
      return delayString[1] === 'T';
    },
    getRepeatNumberFromDelayString(delayString) {
      const match = delayString.match(/\d+/);
      return match && match[0];
    },
  },
};
</script>

<style scope>
.custom-select {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
}
</style>
