<template>
  <div class="data-table">
    <div class="row mb-2">
      <div class="col">
        <h4>{{ label }}</h4>
      </div>
      <div class="col text-right">
        <button class="btn btn-primary" v-if="editable && !selfReferenced" @click="showAddForm">
          {{ $t('Add Record') }}
        </button>
      </div>
    </div>
    <div class="alert alert-danger" v-if="!value">
      {{ $t('There is no records in this list or the data is invalid.') }}
    </div>
    <template v-else>
      <vuetable
        :per-page="perPage"
        ref="vuetable"
        :data-manager="dataManager"
        :fields="tableFields"
        :data="tableData"
        :css="css"
        :api-mode="false"
        pagination-path=""
        :noDataTemplate="$t('No Data Available')"
        @vuetable:pagination-data="onPaginationData"
      >
        <template slot="actions" slot-scope="props">
          <div class="actions">
            <div class="btn-group btn-group-sm" role="group" aria-label="Actions">
              <button @click="showEditForm(props.rowIndex)" class="btn btn-primary" :title="$t('Edit')">
                <i class="fas fa-edit"/>
              </button>
              <button @click="showDeleteConfirmation(props.rowIndex)" class="btn btn-danger" :title="$t('Delete')">
                <i class="fas fa-trash-alt"/>
              </button>
            </div>
          </div>
        </template>
        <template slot="mustache" slot-scope="{rowData, rowField}">
          {{ mustache(rowField, rowData) }}
        </template>
      </vuetable>
      <pagination @vuetable-pagination:change-page="onChangePage" ref="pagination"/>
    </template>

    <b-modal
      :static="true"
      @ok="handleOk"
      size="lg"
      v-if="editable && !selfReferenced"
      ref="addModal"
      :ok-title="$t('Ok')"
      :cancel-title="$t('Cancel')"
      :title="$t('Add Record')"
    >
      <vue-form-renderer
        :page="form"
        ref="addRenderer"
        v-model="addItem"
        :config="formConfig"
      />
    </b-modal>
    <b-modal
      :static="true"
      @ok="edit"
      size="lg"
      v-if="editable && !selfReferenced"
      ref="editModal"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      :title="$t('Edit Record')"
    >
      <vue-form-renderer
        :page="form"
        ref="editRenderer"
        v-model="editItem"
        :config="formConfig"
      />
    </b-modal>
    <b-modal
      @ok="remove"
      size="lg"
      v-if="editable && !selfReferenced"
      ref="deleteModal"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      :title="$t('Delete Record')"
    >
      <p>{{ $t('Are you sure you want to remove this record?') }}</p>
    </b-modal>
    <b-modal
      @ok="hideInformation"
      size="sm"
      v-if="editable && !selfReferenced"
      ref="infoModal"
      :ok-title="$t('OK')"
      :title="$t('Information form')"
      ok-only
    >
      <p>{{ $t('The form to be displayed is not assigned.') }}</p>
    </b-modal>
    <div v-if="editable && selfReferenced" class="alert alert-danger">
      {{ $t('The Record List control is not allowed to reference other controls on its own page to add or edit records. Specify a secondary page with controls to enter records.') }}
    </div>
  </div>
</template>


<script>
import Vuetable from 'vuetable-2/src/components/Vuetable';
import Pagination from '@/components/Pagination';
import mustacheEvaluation from '../../mixins/mustacheEvaluation';
import {ValidatorFactory} from '../../factories/ValidatorFactory';

const jsonOptionsActionsColumn = {
  name: '__slot:actions',
  title: 'Actions',
  titleClass: 'text-right',
  dataClass: 'text-right',
};

export default {
  components: {
    Vuetable,
    Pagination,
  },
  mixins: [mustacheEvaluation],
  props: ['name', 'label', 'fields', 'value', 'editable', '_config', 'form', 'validationData'],
  data() {
    return {
      addItem: {},
      editItem: {},
      editIndex: null,
      currentPage: 0,
      paginatorPage: 1,
      perPage: 50,
      lastPage: 1,
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
        renderIcon(classes, options) {
          return `<i class="${classes.join(' ')}"></i>`;
        },
      },
    };
  },
  computed: {
    dataManager() {
      if (this.$refs.vuetable) {
        let pagination = this.$refs.vuetable.makePagination(this.value.length);
        return {
          pagination,
          data: this.value.slice(pagination.from - 1, pagination.to),
        };
      } else {
        console.log('refs vuetable not exists');
      }

    },
    formConfig() {
      return this.fetchFormConfig();
    },
    tableData() {
      const value = this.value || [];
      let from = this.paginatorPage - 1;
      this.lastPage = Math.ceil(value.length / this.perPage);

      let data = {
        total: value.length,
        per_page: this.perPage,
        current_page: this.paginatorPage,
        last_page: this.lastPage,
        next_page_url: null,
        prev_page_url: null,
        from: from,
        to: value.length,
        data: value.slice(from * this.perPage, (from * this.perPage) + this.perPage),
      };
      return data;
    },
    // The fields used for our vue table
    tableFields() {
      const fields = this.getTableFieldsFromDataSource();

      if (this.editable && !this.selfReferenced) {
        fields.push(jsonOptionsActionsColumn);
      }

      return fields;
    },
    // Determines if the form used for add/edit is self referencing. If so, we should not show it
    selfReferenced() {
      return this.form && this.form === this.$parent.currentPage;
    },
  },
  watch: {
    tableFields() {
      this.$nextTick(() => {
        this.$refs.vuetable.normalizeFields();
      });
    },
  },
  methods: {
    setUploadDataNamePrefix(index = null) {
      this.$root.$emit('set-upload-data-name', this, index);
    },
    getTableFieldsFromDataSource() {
      const {jsonData, key, value, dataName} = this.fields;

      const convertToVuetableFormat = option => ({
        //name: '__component:mustache',
        name: '__slot:mustache',
        sortField: option[key || 'value'],
        title: option[value || 'content'],
      });

      this.reinitializeFields();

      return this.getValidFieldData(jsonData, dataName).map(convertToVuetableFormat);
    },
    getValidFieldData(jsonData, dataName) {
      let validationData = this.validationData[dataName];

      if (jsonData) {
        try {
          validationData = JSON.parse(jsonData);
        } catch (error) {
          validationData = [];
        }
      }

      return Array.isArray(validationData)
        ? validationData
        : [];
    },
    hideInformation() {
      this.$refs.infoModal.hide();
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      if (page == 'next') {
        this.paginatorPage = this.paginatorPage + 1;
      } else if (page == 'prev') {
        this.paginatorPage = this.paginatorPage - 1;
      } else {
        this.paginatorPage = page;
      }
      if (this.paginatorPage <= 0) {
        this.paginatorPage = 1;
      }
      if (this.paginatorPage > this.lastPage) {
        this.paginatorPage = this.lastPage;
      }
      this.$refs.vuetable.changePage(page);
    },
    fetchFormConfig() {
      if (this.form === '') {
        // User has not chosen an add/edit page yet
        return [{items: []}];
      }
      let config = JSON.parse(JSON.stringify(this.$parent.config));
      for (let index = 0; index < config.length; index++) {
        if (index != this.form) {
          config[index].items = [];
        }
      }
      return config;
    },
    showEditForm(index) {
      let pageIndex = ((this.paginatorPage-1) * this.perPage) + index;
      // Reset edit to be a copy of our data model item
      this.editItem = JSON.parse(JSON.stringify(this.value[pageIndex]));
      this.editIndex = pageIndex;
      this.$refs.editRenderer.currentPage = this.form;
      this.setUploadDataNamePrefix(pageIndex);
      this.$refs.editModal.show();
    },
    edit() {
      // Edit the item in our model and emit change
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      data[this.editIndex] = JSON.parse(JSON.stringify(this.editItem));
      // Emit the newly updated data model
      this.$emit('input', data);
    },
    showAddForm() {
      if (!this.form) {
        this.$refs.infoModal.show();
        return;
      }
      // Reset our add item
      this.addItem = {};
      // We switch our renderer to the form specified
      // This form is a numerical index to the form we want to show
      this.$refs.addRenderer.currentPage = this.form;
      // Open form
      this.setUploadDataNamePrefix();
      this.$refs.addModal.show();
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();

      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.isValid()) {
        return;
      }

      // Add the item to our model and emit change
      // @todo Also check that value is an array type, if not, reset it to an array
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      data[data.length] = JSON.parse(JSON.stringify(this.addItem));
      // Emit the newly updated data model
      this.$emit('input', data);

      this.$nextTick(() => {
        this.$refs.addModal.hide();
      });
    },
    showDeleteConfirmation(index) {
      let pageIndex = ((this.paginatorPage-1) * this.perPage) + index;
      this.deleteIndex = pageIndex;
      this.$refs.deleteModal.show();
    },
    remove() {
      // Add the item to our model and emit change
      // @todo Also check that value is an array type, if not, reset it to an array
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      // Remove item from data array
      data.splice(this.deleteIndex, 1);
      // Emit the newly updated data model
      this.$emit('input', data);
    },
    reinitializeFields() {
      this.$nextTick(() => {
        this.$refs.vuetable.normalizeFields();
      });
    },
    isValid() {
      const validate = ValidatorFactory(this.$refs.addRenderer.config[this.form].items, this.$refs.addRenderer.transientData);
      this.errors = validate.getErrors();
      return _.size(this.errors) === 0;
    },
  },
};
</script>
