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
        :debug-context="'Loop #' + loopIndex"
        @submit="submit"
        @pageNavigate="$emit('pageNavigate', $event)"
        @update="setMatrixValue(loopIndex, $event)"
        :mode="mode"
        :loop-context="getLoopContext(loopIndex)"
        :form-config="formConfig"
      />
    </form>
    <b-row class="justify-content-md-center" v-if="config.settings.add">
      <b-col md="auto">
        <b-button size="sm" variant="secondary" class="ml-1 mr-1" @click="add" :title="$t('Add Item')">
          <i class="fas fa-plus"/>
        </b-button>
        <b-button v-if="times.length > 0" size="sm" variant="outline-danger" class="ml-1 mr-1" @click="removeConfirm" :title="$t('Delete Item')">
          <i class="fas fa-minus"/>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Mustache from 'mustache';
import _ from 'lodash';

export default {
  name: 'FormLoop',
  mixins: [],
  props: ['value', 'config', 'transientData', 'name', 'mode', 'formConfig'],
  data() {
    return {
      matrix: [],
      items: [],
      additionalItems: 0,
      transientDataCopy: null,
      parentObjectChanges: [],
    };
  },
  computed: {
    parentLoopContext() {
      let parent = this.$parent;
      let i = 0;
      let context = '';
      while (!parent.loopContext) {
        parent = parent.$parent;

        if (parent === this.$root) {
          parent = null;
          break;
        }
        
        if (i > 100) {
          throw 'Loop Error';
        }

        i++;
      }

      if (parent) {
        context = parent.loopContext;
      }

      return context;
    },
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
      } catch (error) { error; }

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
        this.transientDataCopy = _.cloneDeep(this.transientData);
        this.$delete(this.transientDataCopy, this.name);

        const data = _.get(this, 'transientData.' + this.name, null);
        if (data && Array.isArray(data)) {
          this.matrix = data;
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
        if (_.isEqual(this.$parent.transientData[this.name], this.matrix)) {
          return;
        }
        this.$set(this.$parent.transientData, this.name, _.cloneDeep(this.matrix));
      },
      deep: true,
    },
    times() {
      this.setupMatrix();
    },
    'config.settings.times': {
      handler() {
        this.additionalItems = 0;
      },
    },
  },
  methods: {
    getLoopContext(i) {
      let context = this.name + '.' + i.toString();
      if (this.parentLoopContext !== '') {
        context = this.parentLoopContext + '.' + context;
      }
      return context;
    },
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
    removeConfirm() {
      const message = this.$t('Are you sure you want to delete this?');
      window.ProcessMaker.confirmModal(
        this.$t('Caution!'),
        message,
        '',
        () => {
          this.remove();
        }
      );
    },
    setMatrixValue(i, v) {
      let item = _.omit(v, '_parent');
      this.registerParentVariableChanges(v);
      this.$set(this.matrix, i, item);
      this.setChagnedParentVariables();
    },
    registerParentVariableChanges(obj) {
      if (obj._parent) {
        Object.keys(obj._parent).forEach(parentKey => {
          if (!_.isEqual(this.transientDataCopy[parentKey], obj._parent[parentKey])) {
            this.parentObjectChanges.push({key: parentKey, value: obj._parent[parentKey]});
          }
        });
      }
    },
    setChagnedParentVariables() {
      this.parentObjectChanges.forEach(change => {
        this.$set(this.$parent.transientData, change.key, change.value);
      });
      this.parentObjectChanges = [];
    },
    getMatrixValue(i) {
      let val = _.cloneDeep(this.matrix[i]);
      if (!val) {
        val = {};
      }
      
      val._parent = _.cloneDeep(this.transientDataCopy);
      return val;
    },
    setupMatrix() {
      for (const i of this.times) {
        if (typeof this.matrix[i] === 'undefined') {
          this.setMatrixValue(i, {});
        }
      }
      // Exclude any elements that were removed
      if (this.matrix.length !== this.times.length) {
        this.matrix = this.matrix.slice(0, this.times.length);
      }
    },
    submit() {
      // Just bubble up
      this.$emit('submit');
    },
  },
  mounted() {
    this.$set(this.$parent.transientData, this.name, _.cloneDeep(this.matrix));
  },
};
</script>
