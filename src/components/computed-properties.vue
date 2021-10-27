<template>
  <b-modal
    ref="modal"
    size="lg"
    id="computed-properties"
    :title="$t('Calculated Properties')"
    @hidden="displayTableList"
    content-class="p-3"
    header-class="m-0 p-0 mb-3"
    body-class="m-0 p-0"
    title-class="m-0"
    footer-class="m-0 p-0"
    no-close-on-backdrop
    header-close-content="&times;"
    data-cy="calcs-modal"
  >

    <template v-if="displayList">
      <div class="d-flex align-items-end flex-column mb-3">
        <button type="button" @click.stop="displayFormProperty" class="btn btn-secondary" data-cy="calcs-add-property">
          <i class="fas fa-plus"/> {{ $t('Property') }}
        </button>
      </div>
      <div class="card card-body table-card">
        <b-table
          :css="css"
          :fields="fields"
          :items="current"
          :empty-text="$t('No Data Available')"
          data-cy="calcs-table"
        >
          <template #cell(__actions)="{item}">
            <div class="actions">
              <div class="popout">
                <b-btn
                  variant="link"
                  @click="editProperty(item)"
                  v-b-tooltip.hover
                  :title="$t('Edit')"
                  data-cy="calcs-table-edit"
                >
                  <i class="fas fa-edit fa-lg fa-fw"/>
                </b-btn>
                <b-btn
                  variant="link"
                  @click="deleteProperty(item)"
                  v-b-tooltip.hover
                  :title="$t('Delete')"
                  data-cy="calcs-table-remove"
                >
                  <i class="fas fa-trash-alt fa-lg fa-fw"/>
                </b-btn>
              </div>
            </div>
          </template>
        </b-table>
      </div>
      <template slot="modal-footer">
        <span/>
      </template>
    </template>

    <template v-else>
      <required />
      <form-input
        ref="property"
        v-model="add.property"
        :label="$t('Property Name') + ' *'"
        name="property"
        :error="errors.property"
        class="mb-3"
        data-cy="calcs-property-name"
        required
        aria-required="true"
      />
      <form-text-area
        ref="name"
        v-model="add.name"
        :label="$t('Description') + ' *'"
        name="name"
        :error="errors.name"
        class="mb-3"
        data-cy="calcs-property-description"
        required
        aria-required="true"
      />
      <div class="form-group mb-3" style='position: relative;'>
        <label v-show="isJS">{{ $t('Formula') + ' *' }}</label>
        <div class="float-right">
          <a class='btn btn-sm' :class="expressionTypeClass" @click="switchExpressionType('expression')" data-cy="calcs-switch-formula">
            <i class="fas fa-square-root-alt"/>
          </a>
          <a class='btn btn-sm' :class="javascriptTypeClass" @click="switchExpressionType('javascript')" data-cy="calcs-switch-javascript">
            <i class="fab fa-js-square"/>
          </a>
        </div>

        <form-text-area
          ref="formula"
          v-show="!isJS"
          rows="5"
          v-model="add.formula"
          :label="$t('Formula') + ' *'"
          name="formula"
          :error="errors.formula"
          data-cy="calcs-property-formula"
          required
          aria-required="true"
        />
        <div v-show="isJS" class="editor-border" :class="{'is-invalid':!!errors.formula}"/>
        <monaco-editor
          v-show="isJS"
          :options="monacoOptions"
          class="editor"
          v-model="add.formula"
          language="javascript"
          data-cy="calcs-property-javascript"
          @editorDidMount="editorMounted"
          required
          aria-required="true"
        />
        <div v-if="isJS && errors.formula" class="invalid-feedback d-block">
          <div>{{ errors.formula }}</div>
        </div>
      </div>
      <template slot="modal-footer">
        <div class="d-flex align-items-end">
          <button class="btn btn-outline-secondary" @click="displayTableList" data-cy="calcs-button-cancel">{{ $t('Cancel') }}</button>
          <button
            class="btn btn-secondary ml-3"
            @click="validateData"
            data-cy="calcs-button-save"
          >
            {{ $t('Save') }}
          </button>
        </div>
      </template>
    </template>

  </b-modal>
</template>

<script>
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';
import MonacoEditor from 'vue-monaco';
import FocusErrors from '../mixins/focusErrors';

let Validator = require('validatorjs');

export default {
  mixins: [FocusErrors],
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
      css: {
        tableClass: 'table table-hover table-responsive text-break mb-0',
        loadingClass: 'loading',
        detailRowClass: 'vuetable-detail-row',
        handleIcon: 'grey sidebar icon',
        sortableIcon: 'fas fa-sort',
        ascendingIcon: 'fas fa-sort-up',
        descendingIcon: 'fas fa-sort-down',
        ascendingClass: 'ascending',
        descendingClass: 'descending',
      },
      fields: [
        {
          label: this.$t('Property Name'),
          key: 'property',
        },
        {
          label: this.$t('Description'),
          key: 'name',
        },
        {
          key: '__actions',
          label: '',
          class: 'text-right',
        },
      ],
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: 'off',
        minimap: false,
      },
      monacoEditor: null,
      errors: {},
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
    switchExpressionType(type) {
      this.add.type = type;
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
      this.errors = [];
      
      const rules = {
        property: 'required|exists-property',
        name: 'required',
        formula: 'required',
      };
      const data = {
        property: this.add.property,
        name: this.add.name,
        formula: this.add.formula,
      };

      const validation = new Validator(data, rules);
      const valid = validation.passes();

      this.errors = Object.fromEntries(
        Object.keys(
          validation.errors.all())
          .map(prop => [prop, validation.errors.first(prop)]
          )
      );

      if (valid) {
        this.saveProperty();
      } else {
        this.focusFirstCalculatedPropertiesError();
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
      } else {
        this.current.forEach(item => {
          if (item.id === this.add.id) {
            item.name = this.add.name;
            item.property = this.add.property;
            item.formula = this.add.formula;
            item.type = this.add.type;
          }
        });
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
      this.displayTableList();
    },
    editorMounted(editor) {
      this.monacoEditor = editor;
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
      this.$t('Property already exists'),
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
    height: 8.8em;
    position: absolute;
    pointer-events: none;
    width: 100%;
    z-index: 1;
  }

  .editor-border.is-invalid {
    border-color: #dc3545;
  }
</style>
