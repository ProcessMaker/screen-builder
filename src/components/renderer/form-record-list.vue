<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <h4>{{label}}</h4>
            </div>
            <div class="col text-right">
                <button class="btn btn-primary" v-if="editable && !selfReferenced" @click="showAddForm">Add Record</button>
            </div>
        </div>
        <div class="alert alert-danger" v-if="!value">
            There is no records in this list or the data is invalid.
        </div>
        <template v-else>
            <vuetable :per-page="perPage" ref="vuetable" :data-manager="dataManager" :fields="tableFields" :data="tableData" :api-mode="false" pagination-path="" @vuetable:pagination-data="onPaginationData">
                <template slot="actions" slot-scope="props">
                    <div class="actions">
                        <div class="btn-group" role="group" aria-label="Actions">
                            <button @click="showEditForm(props.rowIndex)" class="btn btn-primary">Edit</button>
                            <button @click="showDeleteConfirmation(props.rowIndex)" class="btn btn-primary">Delete</button>
                        </div>
                    </div>
                </template>
            </vuetable>
            <vuetable-pagination @vuetable-pagination:change-page="onChangePage" ref="pagination"></vuetable-pagination>
        </template>
        <b-modal @ok="add" size="lg" v-if="editable && !selfReferenced" ref="addModal" title="Add Record">
            <vue-form-renderer :page="form" ref="addRenderer" v-model="addItem" :config="fetchFormConfig()"></vue-form-renderer>
        </b-modal>
        <b-modal @ok="edit" size="lg" v-if="editable && !selfReferenced" ref="editModal" title="Edit Record">
            <vue-form-renderer :page="form" ref="editRenderer" v-model="editItem" :config="fetchFormConfig()"></vue-form-renderer>
        </b-modal>
        <b-modal @ok="remove" size="lg" v-if="editable && !selfReferenced" ref="deleteModal" title="Delete Record">
            <p>Are you sure you want to remove this record?</p>
        </b-modal>
        <div v-if="editable && selfReferenced" class="alert alert-danger">
            The add/edit form referencing our own form which is not allowed
        </div>
    </div>
</template>


<script>
import bModal from "bootstrap-vue/es/components/modal/modal";
import VueFormRenderer from "../vue-form-renderer";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePagination from "vuetable-2/src/components/VuetablePagination";

export default {
  name: "FormRecordList",
  components: {
    bModal,
    VueFormRenderer,
    Vuetable,
    VuetablePagination
  },
  props: ["label", "fields", "value", "editable", "_config", "form"],
  data() {
    return {
      addItem: {},
      editItem: {},
      editIndex: null,
      currentPage: 0,
      perPage: 50
    };
  },
  computed: {
    // The fields used for our vue table
    tableData() {
      let data = {
        total: this.value.length,
        per_page: this.perPage,
        current_page: 1,
        last_page: Math.floor(this.value.length / this.perPage),
        next_page_url: null,
        prev_page_url: null,
        from: 1,
        to: this.value.length,
        data: this.value.slice(0, this.perPage)
      };
      return data;
    },
    tableFields() {
      let fields = [];
      for (var field of this.fields) {
        fields[fields.length] = {
          name: field.value,
          title: field.content
        };
      }
      // Add special actions slot if we're editable and non selfReferencing
      if (this.editable && !this.selfReferenced) {
        fields[fields.length] = {
          name: "__slot:actions",
          title: "Actions",
          titleClass: "text-right",
          dataClass: "text-right"
        };
      }
      return fields;
    },
    // Determines if the form used for add/edit is self referencing. If so, we should not show it
    selfReferenced() {
      if (this.form == this.$parent.currentPage) {
        return true;
      }
      return false;
    }
  },
  methods: {
    dataManager() {
      let pagination = this.$refs.vuetable.makePagination(this.value.length)
      return {
          pagination: pagination,
          data: this.value.slice(pagination.from - 1, pagination.to)
      }

    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    fetchFormConfig() {
      return JSON.parse(JSON.stringify(this.$parent.config));
    },
    showEditForm(index) {
      // Reset edit to be a copy of our data model item
      this.editItem = JSON.parse(JSON.stringify(this.value[index]));
      this.editIndex = index;
      this.$refs.editRenderer.currentPage = this.form;
      this.$refs.editModal.show();
    },
    edit() {
      // Edit the item in our model and emit change
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      data[this.editIndex] = JSON.parse(JSON.stringify(this.editItem));
      // Emit the newly updated data model
      this.$emit("input", data);
    },
    showAddForm() {
      // Reset our add item
      this.addItem = {};
      // We switch our renderer to the form specified
      // This form is a numerical index to the form we want to show
      this.$refs.addRenderer.currentPage = this.form;
      // Open form
      this.$refs.addModal.show();
    },
    add() {
      // Add the item to our model and emit change
      // @todo Also check that value is an array type, if not, reset it to an array
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      data[data.length] = JSON.parse(JSON.stringify(this.addItem));
      // Emit the newly updated data model
      this.$emit("input", data);
    },
    showDeleteConfirmation(index) {
      this.deleteIndex = index;
      this.$refs.deleteModal.show();
    },
    remove() {
      // Add the item to our model and emit change
      // @todo Also check that value is an array type, if not, reset it to an array
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      // Remove item from data array
      data.splice(this.deleteIndex, 1);
      // Emit the newly updated data model
      this.$emit("input", data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


