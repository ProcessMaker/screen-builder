<template>
  <b-container>
    <component :is="component" :vdata="value" :_parent="_parent" @submit="submit" />
    <screen-renderer-error v-if="showErrors && building.error" v-model="building" />
    <watchers-synchronous ref="watchersSynchronous"/>
  </b-container>
</template>

<script>
import Json2Vue from '../mixins/Json2Vue';
import Vue from 'vue';
import VueFormElements from '@processmaker/vue-form-elements';
import FormButton from '../components/renderer/form-button';
import FileUpload from '../components/renderer/file-upload.vue';
import FileDownload from '../components/renderer/file-download.vue';
import FormRecordList from '../components/renderer/form-record-list.vue';
import WatchersSynchronous from '@/components/watchers-synchronous';
import ScreenRendererError from '../components/renderer/screen-renderer-error';
import { cloneDeep, isEqual } from 'lodash';

Vue.use(VueFormElements);
Vue.component('FormButton', FormButton);
Vue.component('FileUpload', FileUpload);
Vue.component('FileDownload', FileDownload);
Vue.component('FormRecordList', FormRecordList);

export default {
  components: { WatchersSynchronous, ScreenRendererError },
  mixins: [ Json2Vue ],
  data() {
    return {
      currentDefinition: null,
      codigo: '',
      self: this,
      component: null,
    };
  },
  mounted() {
    this.currentDefinition = cloneDeep(this.definition);
    this.component = this.buildComponent(this.currentDefinition);
  },
  watch: {
    definition: {
      deep: true,
      handler(definition) {
        if (!isEqual(definition, this.currentDefinition)) {
          this.currentDefinition = cloneDeep(definition);
          this.component = this.buildComponent(this.currentDefinition);
        }
      },
    },
  },
};
</script>

<style>
.form-group--error {
  animation-name: shakeError;
  animation-fill-mode: forwards;
  animation-duration: .6s;
  animation-timing-function: ease-in-out;
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
