<template>
  <b-container>
    <component :is="component" :vdata="value" @submit="submit" />
    <watchers-synchronous ref="watchersSynchronous"/>
  </b-container>
</template>

<script>
import Json2Vue from '../mixins/Json2Vue';
import Vue from 'vue';
import VueFormElements from '@processmaker/vue-form-elements';
import FormButton from '../components/renderer/form-button';
import WatchersSynchronous from '@/components/watchers-synchronous';
Vue.use(VueFormElements);
Vue.component('FormButton', FormButton);

export default {
  components: { WatchersSynchronous },
  mixins: [ Json2Vue ],
  data() {
    return {
      codigo: '',
      self: this,
    };
  },
  mounted() {
    this.component = this.buildComponent();
  },
  watch: {
    definition() {
      this.component = this.buildComponent();
    },
  },
};
</script>

<style>

</style>
