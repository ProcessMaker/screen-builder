import Vue from 'vue';
import Loop from '../components/editor/loop';
import MultiColumn from '../components/editor/multi-column';
import FormLoop from '../components/renderer/form-loop'
import FormMultiColumn from '../components/renderer/form-multi-column'

// Container elements must be registered globally because they
// could rely on eachother.
Vue.component('Loop', Loop);
Vue.component('FormLoop', FormLoop);
Vue.component('MultiColumn', MultiColumn);
Vue.component('FormMultiColumn', FormMultiColumn);