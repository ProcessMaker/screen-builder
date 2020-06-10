<template>
  <b-container>
    <component :is="component" :vdata="value" />
  </b-container>
</template>

<script>
import Json2Vue from '../mixins/Json2Vue';
import Vue from 'vue';
import VueFormElements from '@processmaker/vue-form-elements';
Vue.use(VueFormElements);

export default {
  mixins: [ Json2Vue ],
  data() {
    return {
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
