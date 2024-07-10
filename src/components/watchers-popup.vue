<template>
  <b-modal
    ref="modal"
    :size="modalSize"
    id="watchers-popup"
    @hidden="displayList"
    hide-footer
    header-close-content="&times;"
    no-close-on-backdrop
    data-cy="watchers-modal"
  >
    <template #modal-title>
      {{ $t('Watchers') }}
      <small class="d-block my-2 modal-subtitle">
        {{ $t('Manage your active watchers for this screen') }}
      </small>
    </template>
    <template v-if="enableList">
      <watchers-list
        v-model="current"
        @display-form="displayForm"
        @edit-form="edit"
        @delete-form="confirmRemoval"
        @toggle-bypass="toggleBypass"
        @ordered="$emit('input', $event)"
      />  

      <div class="d-flex justify-content-end mt-3 mr-1">
        <div class="d-flex align-items-end">
          <button
            class="btn btn-secondary ml-3 text-uppercase"
            data-cy="calcs-button-close"
            @click="$refs.modal.hide()"
          >
            {{ $t("Done") }}
          </button>
        </div>
      </div>
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
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      enableList: true,
      current: [],
      add: {
        uid: '',
        name: '',
        variable: '',
        script_id: '',
        script_key: '',
        input_data: '',
        script_configuration: '',
        synchronous: false,
        byPass: false,
      },
    };
  },
  computed: {
    modalSize() {
      return "xl";
    },
  },
  watch: {
    value: {
      handler(value) {
        this.current = this.getValuesWithOutputVarsNames(value);
      },
    },
  },
  methods: {
    getValuesWithOutputVarsNames(values) {
      const list = values.map((watcher) => {
        const newItem = { ...watcher };

        if (!Object.hasOwn(newItem, 'byPass')) {
          newItem.byPass = false;
        }

        // If watcher is a data source, extract the output vars
        if (newItem?.script?.id?.substr(0, 11) === 'data_source') {
          const scriptConfig = JSON.parse(newItem.script_configuration);
          const vars = scriptConfig?.dataMapping
            ? scriptConfig.dataMapping.map((mapping) => mapping.key).join(', ')
            : '';

          // var names string won't have more than 50 characters to avoid distorting the UI
          const maxLen = 50;
          newItem.output_variable =
            vars.length > maxLen ? `${vars.substr(0, maxLen)}...` : vars;
        }

        return newItem;
      });

      return list;
    },
    toggleBypass(itemUid) {
      this.current = this.current.map((item) =>
        item.uid === itemUid ? { ...item, byPass: !item.byPass } : item,
      );

      this.$emit('input', this.current);
    },
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

<style lang="scss" scoped>
.modal-subtitle {
  color: #556271;
  font-size: 1rem;
  font-weight: 400;
}
</style>
