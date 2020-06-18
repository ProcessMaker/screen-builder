import Vue from 'vue';
import Loop from '../components/editor/loop';
import MultiColumn from '../components/editor/multi-column';
import FormLoop from '../components/renderer/form-loop';
import FormMultiColumn from '../components/renderer/form-multi-column';
import NewFormMultiColumn from '../components/renderer/new-form-multi-column';
import FormNestedScreen from '../components/renderer/form-nested-screen';
import ScreenRenderer from '../components/screen-renderer';
import AddLoopRow from '../components/renderer/add-loop-row';

// Container elements must be registered globally because they
// could rely on eachother.
Vue.component('Loop', Loop);
Vue.component('FormLoop', FormLoop);
Vue.component('MultiColumn', MultiColumn);
Vue.component('FormMultiColumn', FormMultiColumn);
Vue.component('NewFormMultiColumn', NewFormMultiColumn);
Vue.component('FormNestedScreen', FormNestedScreen);
Vue.component('ScreenRenderer', ScreenRenderer);
Vue.component('AddLoopRow', AddLoopRow);
