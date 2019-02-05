<template>
  <b-modal
    ref="modal"
    size="lg"
    id="computed-properties"
    centered
    hide-footer
    title="Computed Properties"
    @hidden="displayTableList"
  >
    <b-alert
      :variant="alertVariant"
      dismissible
      :show="showDismissibleAlert"
      @dismissed="showDismissibleAlert=false"
    >{{ message }}</b-alert>
    <template v-if="displayList">
      <b-row class="float-right">
        <b-col md="6" class="m-2">
          <b-btn size="sm" variant="primary" @click.stop="displayFormProperty">
            <i class="fas fa-plus"></i> Add Property
          </b-btn>
        </b-col>
      </b-row>

      <b-table :items="current" :fields="fields" responsive striped bordered small hover fixed>
        <template slot="actions" slot-scope="row">
          <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
          <a
            variant="action"
            @click.stop="row.toggleDetails"
            class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
            title="Details"
          >
            <i class="fa fa-list-alt fa-1x"></i>
          </a>
          <a
            size="lg"
            variant="action"
            title="edit"
            class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
            @click.stop="editProperty(row.item)"
          >
            <i class="fa fa-edit fa-1x"></i>
          </a>
          <a
            size="lg"
            variant="action"
            title="Delete"
            class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
            @click.stop="deleteProperty(row.item)"
          >
            <i class="fa fa-trash fa-1x"></i>
          </a>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <b-row class="mb-1">
              <b-col sm="3" class="text-sm-right">
                <b>Field:</b>
              </b-col>
              <b-col>{{ row.item.property }}</b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col sm="3" class="text-sm-right">
                <b>Formula:</b>
              </b-col>
              <b-col>{{ row.item.formula }}</b-col>
            </b-row>
            <b-button class="float-right" size="sm" @click="row.toggleDetails">Hide Details</b-button>
          </b-card>
        </template>
      </b-table>
    </template>

    <template v-else>
      <form-input
        v-model="add.property"
        label="Property Name"
        name="property name"
        validation="required"
      ></form-input>
      <form-text-area
        v-model="add.name"
        label="Description"
        name="property description"
        validation="required"
      ></form-text-area>
      <div class="form-group" style='position: relative;'>
        <label>Formula</label>
        <div class="float-right btn-group">
          <a class='btn btn-sm' :class="{
             'btn-outline-secondary': isJS,
             'text-dark': isJS,
             'btn-outline-light': !isJS,
             'text-secondary': !isJS
          }" @click="isJS=!isJS">
             <i class="fab fa-js-square"></i>
          </a>
        </div>
        <textarea v-show="!isJS" name="formula" v-model="add.formula" class="form-control" :class="{'is-invalid':!add.formula}"></textarea>
        <div v-show="isJS" class="editor-border" :class="{'is-invalid':!add.formula}"></div>
        <monaco-editor v-show="isJS" :options="monacoOptions" :minimap="{enabled:false}" class="editor" v-model="add.formula" language="javascript">
        </monaco-editor>
        <div v-if="!add.formula" class="invalid-feedback"><div>The property formula field is required.</div></div>
      </div>
      <button
        class="btn btn-success float-right m-1"
        @click="validateData"
        :disabled="disabled"
      >Save Property</button>
      <button class="btn btn-secondary float-right m-1" @click="displayTableList">Cancel</button>
    </template>
  </b-modal>
</template>

<script>
import {
  FormInput,
  FormTextArea
} from "@processmaker/vue-form-elements/src/components";
import MonacoEditor from "vue-monaco";

export default {
  components: {
    FormInput,
    FormTextArea,
    MonacoEditor,
  },
  props: ["value"],
  data() {
    return {
      isJS: true,
      showDismissibleAlert: false,
      alertVariant: "danger",
      message: "",
      required: true,
      numberItem: 0,
      displayList: true,
      current: [],
      add: {
        id: 0,
        name: "",
        property: "",
        type: "expression",
        formula: ""
      },
      fields: [
        {
          key: "property",
          label: "Property Name",
          class: "text-center",
          sortable: true
        },
        {
          key: "actions",
          label: "",
          class: "text-center",
          sortable: false
        }
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
      let that = this;
      that.value.forEach(item => {
        this.numberItem++;
        item.id = this.numberItem;
      });
      this.current = this.value;
    },
    'add.formula'(formula) {
      const isComplex = formula.length > 64 || formula.split("\n").length > 1;
      this.isJS = isComplex || this.isJS;
    },
  },
  computed: {
    disabled() {
      if (
        this.add.name.trim() === "" ||
        this.add.property.trim() === "" ||
        this.add.formula.trim() === ""
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    emptyForm() {
      this.add.id = 0;
      this.add.name = "";
      this.add.property = "";
      this.add.type = "expression";
      this.add.formula = "";
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
      let validation = true;
      let that = this;
      this.current.forEach(item => {
        if (item.property === that.add.property && item.id !== that.add.id) {
          validation = false;
          this.showAlert("Property already exists", "danger");
        }
      });
      if (validation) {
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
          formula: this.add.formula
        });
        this.showAlert("Property Saved", "success");
      } else {
        let that = this;
        this.current.forEach(item => {
          if (item.id === that.add.id) {
            item.name = that.add.name;
            item.property = that.add.property;
            item.formula = that.add.formula;
          }
        });
        this.showAlert("Property Edited", "success");
      }

      this.$emit("input", this.current);
      this.displayTableList();
    },
    editProperty(item) {
      this.add.id = item.id;
      this.add.name = item.name;
      this.add.property = item.property;
      this.add.type = "expression";
      this.add.formula = item.formula;
      this.displayList = false;
    },
    deleteProperty(item) {
      this.current = this.current.filter(val => {
        return val.id !== item.id;
      });
      this.$emit("input", this.current);
      this.showAlert("Property deleted", "success");
      this.displayTableList();
    },
    showAlert(message, variant) {
      this.alertVariant = variant || "success";
      this.message = message || "";
      this.showDismissibleAlert = true;
    }
  }
};
</script>

<style lang="scss" scoped>
    .editor{
        height: 4em;
        z-index: 0;
    }
    .editor-border {
        border: 1px solid #ced4da;
        border-radius: 4px;
        overflow: hidden;
        height: 4em;
        position: absolute;
        pointer-events: none;
        width: 100%;
        z-index: 1;
    }
    .editor-border.is-invalid {
        border-color: #dc3545;
    }
</style>