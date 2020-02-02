<template>
  <div class="form-group">
    <div v-for="loopIndex in times" :key="loopIndex">
      <vue-form-renderer
        @submit="submit"
        :data="getMatrixValue(loopIndex)"
        @update="setMatrixValue(loopIndex, $event)"
        :config="rendererConfig"
        :computed="null"
        :custom-css="null"
        :watchers="null"
        />
    </div>
  </div>
</template>

<script>
import VueFormRenderer from '../vue-form-renderer.vue';

export default {
  name: 'FormLoop',
  mixins: [],
  props: ['value', 'name', 'config', 'transientData'],
  components: {
    VueFormRenderer
  },
  data() {
    return {
      matrix: [],
    };
  },
  computed: {
    rendererConfig() {
      return [{
        name: 'LoopItem',
        items: this.items,
      }];
    },
    times() {
      if (!this.config) {
        return [];
      }

      let times = this.config.times;

      try {
        times = Mustache.render(times, this.transientData);
      } catch (error) {}

      times = parseInt(times);
      if (times > 100) {
        times = 100;
      }
      return [...Array(times).keys()];
    }
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
      console.log("Times changed, setting up matrix");
      this.setupMatrix();
    }
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
    _fmt(val) {
      try {
        return JSON.parse(JSON.stringify(val));
      } catch(e) {
        return val;
      }
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
