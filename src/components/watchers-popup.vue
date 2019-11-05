<template>
  <b-modal
    ref="modal"
    size="lg"
    id="computed-properties"
    :title="$t('Watchers')"
    @hidden="displayTableList"
    no-close-on-backdrop
  >
    <template v-if="displayList">
      <watchers-list v-model="current" @display-form="displayFormProperty" />
    </template>
    <template v-else>
      Form
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
      required: true,
      numberItem: 0,
      displayList: true,
      ruleDescription: '',
      ruleFormula: '',
      rulePropName: '',
      editorInvalid: false,
      existsProperty: false,
      current: [],
      add: {
        id: 0,
        name: '',
        property: '',
        type: 'expression',
        formula: '',
      },
      fields: [
        {
          key: 'property',
          label: 'Property Name',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
          class: 'text-center',
          sortable: false,
        },
      ],
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: 'off',
        minimap: false,
      },
    };
  },
  watch: {
    value() {
      this.value.forEach(item => {
        this.numberItem++;
        item.id = this.numberItem;
      });
      this.current = this.value;
    },
    'add.property': {
      handler() {
        this.rulePropName = 'required|exists-property';
      },
    },
    'add.name': {
      handler() {
        this.ruleDescription = 'required';
      },
    },
    'add.formula': {
      handler() {
        this.ruleFormula = 'required';
        this.editorInvalid = this.add.formula.trim() === '';
      },
    },
  },
  computed: {
    javascriptTypeClass() {
      const isJS = this.isJS;
      return {
        'btn-outline-secondary': isJS,
        'text-dark': isJS,
        'btn-outline-light': !isJS,
        'text-secondary': !isJS,
      };
    },
    expressionTypeClass() {
      const isJS = !this.isJS;
      return {
        'btn-outline-secondary': isJS,
        'text-dark': isJS,
        'btn-outline-light': !isJS,
        'text-secondary': !isJS,
      };
    },
    isJS() {
      return this.add.type === 'javascript';
    },
  },
  methods: {
    switchExpressionType() {
      this.add.type =
        this.add.type === 'expression' ? 'javascript' : 'expression';
    },
    show() {
      this.$refs.modal.show();
    },
    emptyForm() {
      this.add.id = 0;
      this.add.name = '';
      this.add.property = '';
      this.add.type = 'expression';
      this.add.formula = '';
      this.editorInvalid = false;
      this.existsProperty = false;
      this.ruleDescription = '';
      this.ruleFormula = '';
      this.rulePropName = '';
    },
    displayTableList() {
      this.emptyForm();
      this.displayList = true;
    },
    displayFormProperty() {
      this.emptyForm();
      this.displayList = false;
    },
    validateData() {
      this.ruleDescription = 'required';
      this.ruleFormula = 'required';
      this.rulePropName = 'required|exists-property';
      this.editorInvalid = this.add.formula.trim() === '';

      let valid = true;
      for (let item in this.$refs) {
        if (
          this.$refs[item].name &&
          this.$refs[item].validator &&
          this.$refs[item].validator.errorCount !== 0
        ) {
          valid = false;
        }
      }

      if (valid && !this.editorInvalid) {
        this.saveProperty();
      }
    },
    saveProperty() {
      if (this.add.id === 0) {
        this.numberItem++;
        this.current.push({
          id: this.numberItem,
          property: this.add.property,
          name: this.add.name,
          formula: this.add.formula,
          type: this.add.type,
        });
        this.showAlert(this.$t('Property Saved'));
      } else {
        this.current.forEach(item => {
          if (item.id === this.add.id) {
            item.name = this.add.name;
            item.property = this.add.property;
            item.formula = this.add.formula;
            item.type = this.add.type;
          }
        });
        this.showAlert(this.$t('Property Edited'));
      }

      this.$emit('input', this.current);
      this.displayTableList();
    },
    editProperty(item) {
      this.add.id = item.id;
      this.add.name = item.name;
      this.add.property = item.property;
      this.add.type = item.type ? item.type : 'expression';
      this.add.formula = item.formula;
      this.displayList = false;
    },
    deleteProperty(item) {
      this.current = this.current.filter(val => {
        return val.id !== item.id;
      });
      this.$emit('input', this.current);
      this.showAlert(this.$t('Property deleted'));
      this.displayTableList();
    },
    showAlert(message) {
      if (globalObject.ProcessMaker && globalObject.ProcessMaker.alert) {
        globalObject.ProcessMaker.alert(message, 'success');
      }
    },
  },
  created() {
    Validator.register(
      'exists-property',
      () => {
        let response = true;
        this.current.forEach(item => {
          if (item.property === this.add.property && item.id !== this.add.id) {
            response = false;
          }
        });
        return response;
      },
      this.$t('Property already exists.')
    );
  },
};
</script>

<style lang="scss" scoped>
.editor {
  height: 8.5em;
  z-index: 0;
}

.editor-border {
  border: 1px solid #ced4da;
  border-radius: 4px;
  overflow: hidden;
  height: 8.5em;
  position: absolute;
  pointer-events: none;
  width: 100%;
  z-index: 1;
}

.editor-border.is-invalid {
  border-color: #dc3545;
}
</style>
