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
    <b-row class="justify-content-md-center" v-if="config.settings.add">
      <b-col md="auto">
        <b-button size="sm" variant="secondary" class="ml-1 mr-1" @click="add" :title="$t('Add Item')">
          <i class="fas fa-plus"/>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Mustache from 'mustache';

export default {
  name: 'FormLoop',
  mixins: [],
  props: ['value', 'config', 'transientData', 'name'],
  data() {
    return {
      matrix: [],
      items: [],
      additionalItems: 0,
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
      if (!this.config || !this.config.settings) {
        return [];
      }

      if (this.config.settings.type === 'existing') {
        const itemsFromData = _.get(this.transientData, this.name, null);
        if (!itemsFromData) {
          return [];
        }
        return [...itemsFromData.keys()];
      }

      let times = this.config.settings.times;

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

      times += this.additionalItems;

      return [...Array(times).keys()];
    },
  },
  watch: {
    transientData: {
      handler() {
        const data = _.get(this, 'transientData.' + this.name, null);
        this.matrix = data ? data : [];
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
        this.$set(this.$parent.model, this.name, this.matrix);
      },
      deep: true,
    },
    times() {
      this.setupMatrix();
    },
    'config.settings.times': {
      handler() {
        this.additionalItems = 0;
      }
    }
  },
  methods: {
    add() {
      if (this.config.settings.type === 'existing') {
        this.setMatrixValue(this.matrix.length, {});
      } else {
        this.additionalItems++;
      }
    },
    remove() {
      if (this.config.settings.type === 'existing') {
        this.$delete(this.matrix, this.matrix.length - 1);
      } else {
        this.additionalItems--;
      }
    },
    setMatrixValue(i, v) {
      delete v._parent;
      this.$set(this.matrix, i, v);
    },
    getMatrixValue(i) {
      let val = this.matrix[i];
      if (!val) {
        val = {};
      }
      return Object.assign({}, val, { '_parent' : this.transientData });
    },
    setupMatrix() {
      for (const i of this.times) {
        if (typeof this.matrix[i] === 'undefined') {
          this.setMatrixValue(i, {});
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
