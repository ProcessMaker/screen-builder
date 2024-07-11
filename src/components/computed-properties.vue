<template>
  <b-modal
    id="computed-properties"
    ref="modal"
    :size="modalSize"
    content-class="p-3"
    header-class="m-0 p-0 mb-3"
    body-class="m-0 p-0"
    title-class="m-0"
    footer-class="m-0 p-0 border-0"
    no-close-on-backdrop
    header-close-content="&times;"
    data-cy="calcs-modal"
    @hidden="displayTableList"
  >
    <template #modal-title>
      <h5 class="modal-title">{{ $t('Calculated Properties') }}</h5>
      <small v-show="!displayList" class="modal-subtitle my-2">
        {{
          $t(
            'Perform mathematical calculations offering quick, convenient, and accurate operations, enhancing user efficiency and usability.',
          )
        }}
      </small>
    </template>
    <template v-if="displayList">
      <Sortable
        class="mb-3"
        :fields="fields"
        :items="current"
        filter-key="name,type"
        disable-key="byPass"
        :inline-edit="false"
        :data-test-actions="{
          tableBox: { 'data-cy': 'calcs-table' },
          btnNew: { 'data-cy': 'calcs-add-property' },
          btnEdit: { 'data-cy': 'calcs-table-edit' },
          btnDelete: { 'data-cy': 'calcs-table-remove' },
        }"
        @item-edit="editProperty"
        @item-delete="deleteProperty"
        @add-page="displayFormProperty"
        :searchProperties= "searchProperties"
      >
        <template #options="{ item }">
          <button
            v-b-tooltip="{ customClass: 'bypass-btn-tooltip' }"
            :title="item.byPass ? $t('Unbypass Calc') : $t('Bypass Calc')"
            class="btn"
            data-test="calcs-bypass"
            @click="toggleBypass(item.id)"
          >
            <img :src="getByPassIcon(item)" alt="Bypass" width="24" />
          </button>
          <div class="sortable-item-vr"></div>
        </template>
      </Sortable>

      <template slot="modal-footer">
        <div class="d-flex align-items-end">
          <button
            class="btn btn-secondary ml-3 text-uppercase"
            data-cy="calcs-button-close"
            @click="$refs.modal.hide()"
          >
            {{ $t("Done") }}
          </button>
        </div>
      </template>
    </template>

    <template v-else>
      <b-row>
        <b-col>
          <form-input
            ref="property"
            v-model="add.property"
            :label="$t('Property Name') + ' *'"
            name="property"
            :error="errors.property"
            class="mb-3 calcs-input"
            data-cy="calcs-property-name"
            required
            aria-required="true"
          />
        </b-col>
        <b-col>
          <form-text-area
            ref="name"
            v-model="add.name"
            :label="$t('Description') + ' *'"
            name="name"
            :error="errors.name"
            class="mb-3 calcs-input"
            data-cy="calcs-property-description"
            required
            aria-required="true"
          />
        </b-col>
      </b-row>

      <div class="form-group mb-3" style="position: relative">
        <div class="d-flex justify-content-between mb-1">
          <label class="m-0">{{ $t('Formula') + ' *' }}</label>

          <div>
            <a
              class="btn btn-sm"
              :class="expressionTypeClass"
              data-cy="calcs-switch-formula"
              @click="switchExpressionType('expression')"
            >
              <i class="fas fa-square-root-alt" />
            </a>
            <a
              class="btn btn-sm"
              :class="javascriptTypeClass"
              data-cy="calcs-switch-javascript"
              @click="switchExpressionType('javascript')"
            >
              <i class="fab fa-js-square fa-lg"></i>
            </a>
          </div>
        </div>

        <form-text-area
          v-show="!isJS"
          ref="formula"
          v-model="add.formula"
          rows="5"
          name="formula"
          :error="errors.formula"
          data-cy="calcs-property-formula"
          required
          aria-required="true"
          class="calcs-input-formula"
        />
        <div
          v-show="isJS"
          class="editor-border"
          :class="{ 'is-invalid': !!errors.formula }"
        />
        <monaco-editor
          v-show="isJS"
          v-model="add.formula"
          :options="monacoOptions"
          class="editor"
          language="javascript"
          data-cy="calcs-property-javascript"
          required
          aria-required="true"
          @editorDidMount="editorMounted"
        />
        <div v-if="isJS && errors.formula" class="invalid-feedback d-block">
          <div>{{ errors.formula }}</div>
        </div>
      </div>
      <template slot="modal-footer">
        <div class="d-flex align-items-end">
          <button
            class="btn btn-outline-secondary text-uppercase"
            data-cy="calcs-button-cancel"
            @click="displayTableList"
          >
            {{ $t("Cancel") }}
          </button>
          <button
            class="btn btn-secondary ml-3 text-uppercase"
            data-cy="calcs-button-save"
            @click="validateData"
          >
            {{ $t("Save") }}
          </button>
        </div>
      </template>
    </template>
  </b-modal>
</template>

<script>
import { FormInput, FormTextArea } from "@processmaker/vue-form-elements";
import MonacoEditor from "vue-monaco";
import Validator from "@chantouchsek/validatorjs";
import FocusErrors from "../mixins/focusErrors";
import Sortable from './sortable/Sortable.vue';

const globalObject = typeof window === 'undefined' ? global : window;

export default {
  components: {
    FormInput,
    FormTextArea,
    MonacoEditor,
    Sortable,
  },
  mixins: [FocusErrors],
  props: ["value"],
  data() {
    return {
      required: true,
      numberItem: 0,
      displayList: true,
      ruleDescription: "",
      ruleFormula: "",
      rulePropName: "",
      editorInvalid: false,
      existsProperty: false,
      current: [],
      add: {
        id: 0,
        name: "",
        property: "",
        type: "expression",
        formula: ""
      },
      css: {
        tableClass: "table table-hover table-responsive text-break mb-0",
        loadingClass: "loading",
        detailRowClass: "vuetable-detail-row",
        handleIcon: "grey sidebar icon",
        sortableIcon: "fas fa-sort",
        ascendingIcon: "fas fa-sort-up",
        descendingIcon: "fas fa-sort-down",
        ascendingClass: "ascending",
        descendingClass: "descending"
      },
      fields: [
        {
          label: this.$t("Name"),
          key: "property",
        },
        {
          label: this.$t("Type"),
          key: "type",
          cb: (value) => {
            switch (value) {
              case 'expression':
                return 'Formula';
              case 'javascript':
                return 'JavaScript';
              default:
                return value;
            }
          },
        },
      ],
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: "off",
        minimap: false
      },
      monacoEditor: null,
      errors: {},
      searchProperties: ['property', 'type'],
    };
  },
  computed: {
    javascriptTypeClass() {
      const { isJS } = this;
      return {
        "btn-outline-secondary": isJS,
        "text-dark": isJS,
        "btn-outline-light": !isJS,
        "text-secondary": !isJS
      };
    },
    expressionTypeClass() {
      const isJS = !this.isJS;
      return {
        "btn-outline-secondary": isJS,
        "text-dark": isJS,
        "btn-outline-light": !isJS,
        "text-secondary": !isJS
      };
    },
    isJS() {
      return this.add.type === "javascript";
    },
    modalSize() {
      return this.displayList ? 'lg' : 'xl';
    },
  },
  watch: {
    value() {
      this.value.forEach((item) => {
        this.numberItem++;
        item.id = this.numberItem;

        if (!Object.hasOwn(item, 'byPass')) {
          item.byPass = false;
        }
      });

      this.current = this.value;
    },
  },
  created() {
    Validator.register(
      "exists-property",
      () => {
        let response = true;
        this.current.forEach((item) => {
          if (item.property === this.add.property && item.id !== this.add.id) {
            response = false;
          }
        });
        return response;
      },
      this.$t("Property already exists")
    );
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
      this.add.name = "";
      this.add.property = "";
      this.add.type = "expression";
      this.add.formula = "";
      this.editorInvalid = false;
      this.existsProperty = false;
      this.ruleDescription = "";
      this.ruleFormula = "";
      this.rulePropName = "";
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
        property: "required|exists-property",
        name: "required",
        formula: "required"
      };
      const data = {
        property: this.add.property,
        name: this.add.name,
        formula: this.add.formula
      };

      const validation = new Validator(data, rules);
      const valid = validation.passes();

      this.errors = Object.fromEntries(
        Object.keys(validation.errors.all()).map((prop) => [
          prop,
          validation.errors.first(prop)
        ])
      );

      if (valid) {
        this.saveProperty();
      } else {
        this.focusFirstCalculatedPropertiesError();
      }
    },
    toggleBypass(itemId) {
      this.current = this.current.map((item) =>
        item.id === itemId ? { ...item, byPass: !item.byPass } : item,
      );

      this.$emit("input", this.current);
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
          byPass: false,
        });
      } else {
        this.current.forEach((item) => {
          if (item.id === this.add.id) {
            item.name = this.add.name;
            item.property = this.add.property;
            item.formula = this.add.formula;
            item.type = this.add.type;
          }
        });
      }

      this.$emit("input", this.current);
      this.displayTableList();
    },
    editProperty(item) {
      this.add.id = item.id;
      this.add.name = item.name;
      this.add.property = item.property;
      this.add.type = item.type ? item.type : "expression";
      this.add.formula = item.formula;
      this.displayList = false;
    },
    deleteProperty(item) {
      globalObject.ProcessMaker.confirmModal(
        this.$t('Are you sure you want to delete the calc ?'),
        this.$t('If you do, you wont be able to recover the calc configuration.'),
        '',
        () => {
          this.remove(item);
        }
      );
    },
    remove(item) {
      this.current = this.current.filter((val) => {
        return val.id !== item.id;
      });
      this.$emit("input", this.current);
      this.displayTableList();
    },
    editorMounted(editor) {
      this.monacoEditor = editor;
    },
    getByPassIcon(item) {
      return new URL(
        `../assets/icons/${item.byPass ? 'Unbypass' : 'Bypass'}.svg`,
        import.meta.url,
      ).href;
    },
  }
};
</script>

<style lang="scss" scoped>
.editor {
  height: 430px;
  z-index: 0;
}

.editor-border {
  border: 1px solid #CDDDEE;
  border-radius: 4px;
  overflow: hidden;
  height: 430px;
  position: absolute;
  pointer-events: none;
  width: 100%;
  z-index: 1;
}

.editor-border.is-invalid {
  border-color: #dc3545;
}

.bypass-btn-tooltip::v-deep {
  & .tooltip-inner {
    background-color: #EBEEF2 !important;
    color: #444444 !important;
  }

  & .arrow:before {
    border-top-color: #EBEEF2 !important;
    border-bottom-color: #EBEEF2 !important;
  }
}

.modal-subtitle {
  display: block;
  color: #556271;
  font-size: 1rem;
  font-weight: 400;
}

.calcs-input::v-deep {
  & > .form-control {
    height: 86px;
    border-color: #CDDDEE;
  }

  & > input.form-control {
    padding-bottom: 52px;
  }

  & > textarea.form-control {
    resize: none;
  }
}

.calcs-input-formula::v-deep {
  & > textarea.form-control {
    height: 430px;
    border-color: #CDDDEE;
    resize: none;
  }

  & > label {
    display: none;
  }
}
</style>
