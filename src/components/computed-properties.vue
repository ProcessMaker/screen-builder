<template>
  <b-modal
    id="computed-properties"
    ref="modal"
    size="lg"
    :title="$t('Calculated Properties')"
    content-class="p-3"
    header-class="m-0 p-0 mb-3"
    body-class="m-0 p-0"
    title-class="m-0"
    footer-class="m-0 p-0"
    no-close-on-backdrop
    header-close-content="&times;"
    data-cy="calcs-modal"
    @hidden="displayTableList"
  >
    <template v-if="displayList">
      <Sortable
        :fields="fields"
        :items="current"
        filter-key="name"
        :inline-edit="false"
        :data-test-actions="{ btnNew: { 'data-cy': 'calcs-add-property' } }"
        @item-edit="editProperty"
        @item-delete="deleteProperty"
        @add-page="displayFormProperty"
      >
        <template #options>
          <button
            v-b-tooltip="{ customClass: 'bypass-btn-tooltip' }"
            title="Unbypass Calc"
            class="btn"
          >
            <i class="fas fa-sign-in-alt"></i>
          </button>
          <div class="sortable-item-vr"></div>
        </template>
      </Sortable>

      <template slot="modal-footer">
        <span />
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
      <div class="form-group mb-3" style="position: relative">
        <label v-show="isJS">{{ $t("Formula") + " *" }}</label>
        <div class="float-right">
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
            <i class="fab fa-js-square" />
          </a>
        </div>

        <form-text-area
          v-show="!isJS"
          ref="formula"
          v-model="add.formula"
          rows="5"
          :label="$t('Formula') + ' *'"
          name="formula"
          :error="errors.formula"
          data-cy="calcs-property-formula"
          required
          aria-required="true"
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
            class="btn btn-outline-secondary"
            data-cy="calcs-button-cancel"
            @click="displayTableList"
          >
            {{ $t("Cancel") }}
          </button>
          <button
            class="btn btn-secondary ml-3"
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
        },
      ],
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: "off",
        minimap: false
      },
      monacoEditor: null,
      errors: {}
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
    }
  },
  watch: {
    value() {
      this.value.forEach((item) => {
        this.numberItem++;
        item.id = this.numberItem;
      });
      this.current = this.value;
    }
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
    saveProperty() {
      if (this.add.id === 0) {
        this.numberItem++;
        this.current.push({
          id: this.numberItem,
          property: this.add.property,
          name: this.add.name,
          formula: this.add.formula,
          type: this.add.type
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
      this.current = this.current.filter((val) => {
        return val.id !== item.id;
      });
      this.$emit("input", this.current);
      this.displayTableList();
    },
    editorMounted(editor) {
      this.monacoEditor = editor;
    }
  }
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
</style>
