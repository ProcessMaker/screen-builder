<template>
  <b-modal
    ref="modal"
    size="lg"
    id="computed-properties"
    :title="$t('Watchers')"
    @hidden="displayList"
    hide-footer
    no-close-on-backdrop
  >
    <template v-if="enableList">
      <watchers-list v-model="current" @display-form="displayForm" />
    </template>
    <template v-else>
      <watchers-form v-model="add" @display-list="displayList" @save-form="save" />
    </template>
  </b-modal>
</template>

<script>
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';
import MonacoEditor from 'vue-monaco';
import WatchersList from './watchers-list';
import WatchersForm from './watchers-form';

let Validator = require('validatorjs');

const globalObject = typeof window === 'undefined' ? global : window;

export default {
  components: {
    FormInput,
    FormTextArea,
    MonacoEditor,
    WatchersList,
    WatchersForm,
  },
  props: ['value'],
  data() {
    return {
      enableList: true,
      current: [],
      add: {
        uid:'',
        name:'',
        variable:'',
        script_id:'',
        script_key:'',
        input_data:'',
        script_configuration:'',
        synchronous:false,
      },
    };
  },
  watch: {

  },
  computed: {

  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    displayList() {
      this.add = {};
      this.enableList = true;
    },
    displayForm() {
      this.add = {};
      this.enableList = false;
    },
    save() {
      console.log('... save');
      console.log('popup save');
      console.log(this.add);
      let newWatcher = true;
      let message = this.$t('Watcher Saved');
      this.current.forEach(item => {
        if (item.uid === this.add.uid) {
          item = this.add;
          newWatcher= false;
          message = this.$t('Watcher Updated');
        }
      });
      if (newWatcher) {
        this.current.push(this.add);
      }

      this.showAlert(message);
      this.$emit('input', this.current);
      this.displayList();
    },
    edit(item) {
      console.log('... todo editProperty');
      this.add = item;
    },
    delete(item) {
      console.log('... delete');
      this.current = this.current.filter(val => {
        return val.uid !== item.uid;
      });
      this.$emit('input', this.current);
      this.showAlert(this.$t('Watcher deleted'));
      this.displayList();
    },
    showAlert(message) {
      if (globalObject.ProcessMaker && globalObject.ProcessMaker.alert) {
        globalObject.ProcessMaker.alert(message, 'success');
      }
    },
  },
  created() {

  },
};
</script>
