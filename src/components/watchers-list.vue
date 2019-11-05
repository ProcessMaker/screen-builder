<template>
  <div>
    <b-row class="mb-2">
      <b-col sm="8">
        Filter
      </b-col>
      <b-col sm="4" class="text-right">
        <b-btn size="sm" variant="secondary" @click.stop="displayFormProperty">
          <i class="fas fa-plus" />
          {{ $t('Watcher') }}
        </b-btn>
      </b-col>
    </b-row>

    <b-table :items="current" :fields="fields" responsive striped bordered small hover fixed>
      <template slot="HEAD_property" slot-scope="data">{{ $t(data.label) }}</template>
      <template slot="HEAD_actions" slot-scope="data">{{ $t(data.label) }}</template>

      <template slot="actions" slot-scope="row">
        <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
        <a
          variant="action"
          @click.stop="row.toggleDetails"
          class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
          :title="$t('Details')"
        >
          <i class="fa fa-list-alt fa-1x" />
        </a>
        <a
          size="lg"
          variant="action"
          :title="$t('edit')"
          class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
          @click.stop="editProperty(row.item)"
        >
          <i class="fa fa-edit fa-1x" />
        </a>
        <a
          size="lg"
          variant="action"
          :title="$t('Delete')"
          class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
          @click.stop="deleteProperty(row.item)"
        >
          <i class="fa fa-trash fa-1x" />
        </a>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-row class="mb-1">
            <b-col sm="3" class="text-sm-right">
              <b>{{ $t('Field:') }}</b>
            </b-col>
            <b-col>{{ $t(row.item.property) }}</b-col>
          </b-row>
          <b-row class="mb-1">
            <b-col sm="3" class="text-sm-right">
              <b>{{ $t('Formula:') }}</b>
            </b-col>
            <b-col>{{ $t(row.item.formula) }}</b-col>
          </b-row>
          <b-button
            class="float-right"
            size="sm"
            @click="row.toggleDetails"
          >{{ $t('Hide Details') }}</b-button>
        </b-card>
      </template>
    </b-table>
    <template slot="modal-footer">
      <span />
    </template>
  </div>
</template>

<script>
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';
import MonacoEditor from 'vue-monaco';

let Validator = require('validatorjs');

const globalObject = typeof window === 'undefined' ? global : window;

export default {
  components: {
    FormInput,
    FormTextArea,
    MonacoEditor,
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
          key: 'name',
          label: 'Name',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'watching',
          label: 'Watching',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'variable',
          label: 'Variable',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'script',
          label: 'Script',
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
