<template>
  <b-modal
    ref="modal"
    size="lg"
    id="watchers-popup"
    :title="$t('Watchers')"
    @hidden="displayList"
    hide-footer
    header-close-content="&times;"
    no-close-on-backdrop
    data-cy="watchers-modal"
  >
    <template v-if="enableList">
      <watchers-list v-model="current" @display-form="displayForm" @edit-form="edit" @delete-form="confirmRemoval"/>
    </template>
    <template v-else>
      <required />
      <watchers-form refs="form" :config="add" @display-list="displayList" @save-form="save"/>
    </template>
  </b-modal>
</template>

<script>
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';
import MonacoEditor from 'vue-monaco';
import WatchersList from './watchers-list';
import WatchersForm from './watchers-form';
import _ from 'lodash';

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
    value: {
      handler(value) {
        this.current = value;
      },
    },
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
      let message = this.$t('Watcher Saved');
      let index = this.current.findIndex(item => item.uid === this.add.uid);
      if (index === -1) {
        this.current.push(this.add);
      } else {
        message = this.$t('Watcher Updated');
        this.current[index] = this.add;
      }

      this.showAlert(message);
      this.$emit('input', this.current);
      this.displayList();
    },
    edit(item) {
      this.displayForm();
      this.$set(this, 'add', _.cloneDeep(item));
    },
    confirmRemoval(item) {
      globalObject.ProcessMaker.confirmModal(
        this.$t('Caution!'),
        this.$t('Are you sure you want to delete the Watcher?'),
        '',
        () => {
          this.remove(item);
        }
      );
    },
    remove(item) {
      this.current = this.current.filter(val => {
        return val.uid !== item.uid;
      });
      this.$emit('input', this.current);
      this.showAlert(this.$t('Watcher deleted'));
      this.displayList();
    },
    showAlert(message) {
      globalObject.ProcessMaker.alert(message, 'success');
    },
  },
};
</script>
