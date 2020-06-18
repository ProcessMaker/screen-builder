<template>
  <b-container>
    <component :is="component" :vdata="value" @submit="submit" />
  </b-container>
</template>

<script>
import Json2Vue from '../mixins/Json2Vue';
import Vue from 'vue';
import VueFormElements from '@processmaker/vue-form-elements';
import FormButton from '../components/renderer/form-button';
Vue.use(VueFormElements);
Vue.component('FormButton', FormButton);

export default {
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
