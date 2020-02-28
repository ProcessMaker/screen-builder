<template>
  <div>
    <form v-for="loopIndex in times" :key="loopIndex" @submit.prevent>
      <vue-form-renderer
        :data="getMatrixValue(loopIndex)"
        :config="rendererConfig"
        :computed="null"
        :custom-css="null"
        :watchers="null"
        :is-loop="true"
        @submit="submit"
        @pageNavigate="$emit('pageNavigate', $event)"
        @update="setMatrixValue(loopIndex, $event)"
      />
    </form>
  </div>
</template>

<script>
import Mustache from 'mustache';

export default {
  name: 'FormLoop',
  mixins: [],
  props: ['value', 'name', 'config', 'transientData'],
  data() {
    return {
      matrix: [],
      items: [],
    };
  },
  computed: {
    rendererConfig() {
      let items = this.items;
      return [{
        name: 'LoopItem',
        items,
      }];
    },
    times() {
      // If there is existing data, set the length to what ever it is
      const itemsFromData = _.get(this.transientData, this.name, null);
      if (Array.isArray(itemsFromData)) {
        return [...itemsFromData.keys()];
      }

      if (!this.config) {
        return [];
      }

      let times = this.config.times;

      try {
        times = Mustache.render(times, this.transientData);
      } catch (error) {}

      times = parseInt(times);

      if (Number.isNaN(times)) {
        return [];
      }

      if (times > 100) {
        times = 100;
      }

      return [...Array(times).keys()];
    },
  },
  watch: {
    transientData: {
      handler() {
        if (this.transientData && this.transientData[this.name]) {
          this.matrix = this.transientData[this.name];
        } else {
          this.matrix = [];
        }
        this.setupMatrix();
      },
      immediate: true,
    },
    value: {
      handler() {
        this.items = this.value;
      },
      immediate: true,
    },
    matrix: {
      handler() {
        this.$parent.model[this.name] = this.matrix;
      },
      deep: true,
    },
    times() {
      this.setupMatrix();
    },
  },
  methods: {
    setMatrixValue(i, v) {
      this.$set(this.matrix, i, v);
    },
    getMatrixValue(i) {
      let val = this.matrix[i];
      if (!val) {
        val = '';
      }
      return val;
    },
    setupMatrix() {
      for (const i of this.times) {
        if (typeof this.matrix[i] === 'undefined') {
          this.$set(this.matrix, i, {});
        } else {
        }
      }
    },
    submit() {
      // Just bubble up
      this.$emit('submit');
    },
  },
};
</script>
