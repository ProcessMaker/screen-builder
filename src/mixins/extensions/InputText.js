import Vue from 'vue';
import FormMaskedInput from '../../components/renderer/form-masked-input';

Vue.component('FormMaskedInput', FormMaskedInput);

export default {
  mounted() {
    this.alias['FormInput'] = 'form-masked-input';
  },
};
