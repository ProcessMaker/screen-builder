<template>
  <b-container fluid>
    <component ref="component" :is="component" :vdata="value" :_parent="_parent" @submit="submit" :_initial-page="currentPage" />
    <screen-renderer-error v-if="showErrors && building.error" v-model="building" />
    <watchers-synchronous ref="watchersSynchronous"/>
  </b-container>
</template>

<script>
import Json2Vue from '../mixins/Json2Vue';
import CurrentPageProperty from '../mixins/CurrentPageProperty';
import WatchersSynchronous from '@/components/watchers-synchronous';
import ScreenRendererError from '../components/renderer/screen-renderer-error';
import { cloneDeep, isEqual, debounce } from 'lodash';

export default {
  name: 'screen-renderer',
  components: { WatchersSynchronous, ScreenRendererError },
  mixins: [ Json2Vue, CurrentPageProperty ],
  data() {
    return {
      currentDefinition: null,
      codigo: '',
      self: this,
    };
  },
  mounted() {
    this.currentDefinition = cloneDeep(this.definition);
    this.component = this.buildComponent(this.currentDefinition);
    // debounce rebuildScreen
    this.rebuildScreen = debounce(this.rebuildScreen, 300);
  },
  watch: {
    definition: {
      deep: true,
      handler(definition) {
        this.rebuildScreen(definition);
      },
    },
  },
  methods: {
    rebuildScreen(definition) {
      if (!isEqual(definition, this.currentDefinition)) {
        this.currentDefinition = cloneDeep(definition);
        this.component = this.buildComponent(this.currentDefinition);
      }
    },
    onAsyncWatcherOn() {
      this.displayAsyncLoading = typeof this._parent === 'undefined';
    },
    onAsyncWatcherOff() {
      this.displayAsyncLoading = false;
    },
    getCurrentPage() {
      return this.$refs.component.getCurrentPage();
    },
    setCurrentPage(page) {
      this.$refs.component.setCurrentPage(page);
    },
  },
};
</script>

<style>
.form-group--error {
  animation: none;
}
@keyframes shakeError {
  0% {
    transform: translateX(0); }
  15% {
    transform: translateX(0.375rem); }
  30% {
    transform: translateX(-0.375rem); }
  45% {
    transform: translateX(0.375rem); }
  60% {
    transform: translateX(-0.375rem); }
  75% {
    transform: translateX(0.375rem); }
  90% {
    transform: translateX(-0.375rem); }
  100% {
    transform: none;
  }
}
</style>
