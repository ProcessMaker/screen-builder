<template>
  <b-container>
    <component :is="component" :vdata="value" />
  </b-container>
</template>

<script>
import Vue from 'vue';
import Json2Vue from '../mixins/Json2Vue';
import VueFormElements from '@processmaker/vue-form-elements';

Vue.use(VueFormElements);

export default {
  props: {
    value: Object,
    definition: Object,
  },
  mixins: [ Json2Vue ],
  data() {
    return {
      self: this,
    };
  },
};
</script>

<style>

</style>