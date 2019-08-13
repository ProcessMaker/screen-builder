<template>
  <b-modal
    ref="modal"
    size="lg"
    id="computed-properties"
    :title="$t('Computed Properties')"
    @hidden="displayTableList"
    no-close-on-backdrop
  >

    <template v-if="displayList">
      <b-row class="float-right">
        <div class="m-2">
          <b-btn size="sm" variant="secondary" @click.stop="displayFormProperty">
            <i class="fas fa-plus"/> {{ $t('Add Property') }}
          </b-btn>
        </div>
      </b-row>

      <b-table :items="current" :fields="fields" responsive striped bordered small hover fixed>
        <template slot="HEAD_property" slot-scope="data">
          {{ $t(data.label) }}
        </template>
        <template slot="HEAD_actions" slot-scope="data">
          {{ $t(data.label) }}
        </template>

        <template slot="actions" slot-scope="row">
          <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
          <a
            variant="action"
            @click.stop="row.toggleDetails"
            class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
            :title="$t('Details')"
          >
            <i class="fa fa-list-alt fa-1x"/>
          </a>
          <a
            size="lg"
            variant="action"
            :title="$t('edit')"
            class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
            @click.stop="editProperty(row.item)"
          >
            <i class="fa fa-edit fa-1x"/>
          </a>
          <a
            size="lg"
            variant="action"
            :title="$t('Delete')"
            class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
            @click.stop="deleteProperty(row.item)"
          >
            <i class="fa fa-trash fa-1x"/>
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
            <b-button class="float-right" size="sm" @click="row.toggleDetails">{{ $t('Hide Details') }}</b-button>
          </b-card>
        </template>
      </b-table>
      <template slot="modal-footer">
        <span/>
      </template>
    </template>

    <template v-else>
      <form-input
        v-model="add.property"
        :label="$t('Property Name')"
        :name="$t('Property Name')"
        :validation="rulesValidation"
      />
      <div v-if="existsProperty" class="invalid-feedback d-block">
        <div>{{ $t('Property already exists.') }}</div>
      </div>
      <form-text-area
        v-model="add.name"
        :label="$t('Description')"
        :name="$t('Description')"
        :validation="rulesValidation"
      />
      <div class="form-group" style='position: relative;'>
        <label v-show="isJS">{{ $t('Formula') }}</label>
        <div class="float-right">
          <a class='btn btn-sm' :class="expressionTypeClass" @click="switchExpressionType">
            <i class="fas fa-square-root-alt"/>
          </a>
          <a class='btn btn-sm' :class="javascriptTypeClass" @click="switchExpressionType">
            <i class="fab fa-js-square"/>
          </a>
        </div>
        <form-text-area
          v-show="!isJS"
          rows="5"
          v-model="add.formula"
          :label="$t('Formula')"
          :name="$t('Formula')"
          :validation="rulesValidation"
        />
        <div v-show="isJS" class="editor-border" :class="{'is-invalid':editorInvalid}"/>
        <monaco-editor v-show="isJS" :options="monacoOptions" class="editor" v-model="add.formula" language="javascript"/>
        <div v-if="isJS && editorInvalid" class="invalid-feedback d-block"><div>{{ $t('The property formula field is required.') }}</div>
        </div>
      </div>
      <template slot="modal-footer">
        <button class="btn btn-outline-secondary" @click="displayTableList">{{ $t('Cancel') }}</button>
        <button
          class="btn btn-secondary ml-2"
          @click="validateData"
        >
          {{ $t('Save') }}
        </button>
      </template>
    </template>

  </b-modal>
</template>

<script>
import {
  FormInput,
  FormTextArea,
} from '@processmaker/vue-form-elements';
import MonacoEditor from 'vue-monaco';

let globalObject = typeof window === 'undefined'
  ? global
  : window;

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
      rulesValidation: '',
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
        this.validateDuplicate();
      },
      deep: true,
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
    isEmpty() {
      this.editorInvalid = this.add.formula.trim() === '';
      if (
        this.add.name.trim() === '' ||
          this.add.property.trim() === '' ||
          this.add.formula.trim() === ''
      ) {
        return true;
      }
      return false;
    },
    switchExpressionType() {
      this.add.type = this.add.type === 'expression' ? 'javascript' : 'expression';
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
      this.rulesValidation = '';
      this.editorInvalid = false;
      this.existsProperty = false;
    },
    displayTableList() {
      this.emptyForm();
      this.displayList = true;
    },
    displayFormProperty() {
      this.emptyForm();
      this.displayList = false;
    },
    validateDuplicate() {
      this.existsProperty = false;
      this.current.forEach(item => {
        if (item.property === this.add.property && item.id !== this.add.id) {
          this.existsProperty = true;
        }
      });
    },
    validateData() {
      this.rulesValidation = 'required';

      if (!this.existsProperty && !this.isEmpty()) {
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
        this.showAlert(this.$t('Property Saved'), 'success');
      } else {
        this.current.forEach(item => {
          if (item.id === this.add.id) {
            item.name = this.add.name;
            item.property = this.add.property;
            item.formula = this.add.formula;
            item.type = this.add.type;
          }
        });
        this.showAlert(this.$t('Property Edited'), 'success');
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
      this.showAlert(this.$t('Property deleted'), 'success');
      this.displayTableList();
    },
    showAlert(message, variant) {
      if (globalObject.ProcessMaker && globalObject.ProcessMaker.alert) {
        globalObject.ProcessMaker.alert(message, variant || 'success');
      }
    },
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
