<template>
  <div class="data-table">
    <div class="row mb-2">
      <div class="col">
        <h4>{{ label }}</h4>
      </div>
      <div class="col text-right">
        <button class="btn btn-primary" v-if="editable && !selfReferenced" @click="showAddForm">
          {{ $t('Add') }}
        </button>
      </div>
    </div>
    <div v-if="!value">
      {{ $t('This record list is empty or contains no data.') }}
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
        <template slot="filedownload" slot-scope="{rowData, rowField, rowIndex}">
          <span @click="downloadFile(rowData, rowField, rowIndex)" href="#">{{ mustache(rowField, rowData) }}</span>
        </template>
      </vuetable>
      <pagination @vuetable-pagination:change-page="onChangePage" ref="pagination"/>
    </template>

    <b-modal
      :static="true"
      @ok="handleOk"
      @hidden="addItem = initFormValues"
      size="lg"
      v-if="editable && !selfReferenced"
      ref="addModal"
      :ok-title="$t('Ok')"
      :cancel-title="$t('Cancel')"
      :title="$t('Add')"
      header-close-content="&times;"
    >
      <vue-form-renderer
        :page="0"
        ref="addRenderer"
        v-model="addItemWithParent"
        :config="[formConfig[form]]"
        debug-context="Record List Add"
        :key="Array.isArray(value) ? value.length : 0"
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
      header-close-content="&times;"
    >
     <vue-form-renderer
        :page="0"
        ref="editRenderer"
        v-model="editItemWithParent"
        :config="[formConfig[form]]"
        debug-context="Record List Edit"
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
      header-close-content="&times;"
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
      header-close-content="&times;"
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
  props: ['name', 'label', 'fields', 'value', 'editable', '_config', 'form', 'validationData', 'formConfig'],
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
        tableClass: 'table table-hover table-responsive text-break mb-0 d-table',
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
      initFormValues: {},
      parentReference: null,
      formConfigParent: null,
    };
  },
  computed: {
    addItemWithParent: {
      get() {
        let item = _.cloneDeep(this.addItem);
        if (this.parentReference) {
          item._parent = _.cloneDeep(this.parentReference.transientData);
        }
        return item
      },
      set(val) {
        let { _parent, ...item } = val;
        if (this.parentReference && _parent) {
          this.$set(this.parentReference, 'transientData', _parent);
        }
        this.addItem = item;
      }
    },
    editItemWithParent: {
      get() {
        let item = _.cloneDeep(this.editItem);
        if (this.parentReference) {
          item._parent = _.cloneDeep(this.parentReference.transientData);
        }
        return item;
      },
      set(val) {
        let { _parent, ...item } = val;
        if (this.parentReference && _parent) {
          this.$set(this.parentReference, 'transientData', _parent);
        }
        this.editItem = item;
      }
    },
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
        if (this.$refs.vuetable) {
          this.$refs.vuetable.normalizeFields();
        }
      });
    },
    formConfig: {
      immediate: true,
      handler(value) {
        let value2 = null
        if (this.$parent && this.$parent.$parent) {
          value2 = this.getParentFormConfig(this.$parent.$parent);
        }
        this.formConfigParent = value2 || value;
      }
    }
  },
  methods: {
    getParentFormConfig(parent) {
      if (!parent) {
        return null;
      }
      if (parent.$attrs && parent.$attrs.formConfig) {
        return parent.$attrs.formConfig;
      }

      return this.getParentFormConfig(parent.$parent);
    },
    setUploadDataNamePrefix(index = null) {
      let  rowId = null;
      if (index !== null  && this.editItem) {
        rowId = this.editItem.row_id;
      }
      else {
          if (this.addItem) {
              rowId = this.addItem.row_id;
          }
      }

      this.$root.$emit('set-upload-data-name', this, index, rowId);
    },
    getTableFieldsFromDataSource() {
      const {jsonData, key, value, dataName} = this.fields;

      const convertToVuetableFormat = (option) => {
        let slot = '__slot:filedownload';
        return {
          name: slot,
          sortField: option[key || 'value'],
          title: option[value || 'content'],
        };
      }

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
    showEditForm(index) {
      let pageIndex = ((this.paginatorPage-1) * this.perPage) + index;
      // Reset edit to be a copy of our data model item
      this.editItem = JSON.parse(JSON.stringify(this.value[pageIndex]));
      this.editIndex = pageIndex;
      this.setUploadDataNamePrefix(pageIndex);
      this.$refs.editModal.show();
    },
    edit(event) {
      const validate = ValidatorFactory(this.formConfigParent[this.form].items, this.editItem);
      this.errors = validate.getErrors();
      if (_.size(this.errors) > 0) {
        event.preventDefault();
        return;
      }

      // Edit the item in our model and emit change
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      data[this.editIndex] = JSON.parse(JSON.stringify(this.editItem));

      // Remove the parent object
      delete data[this.editIndex]._parent;

      // Emit the newly updated data model
      this.$emit('input', data);
    },
    showAddForm() {
      const uniqueId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      this.$set(this.addItem, 'row_id', uniqueId);
      this.setUploadDataNamePrefix();

      if (!this.form) {
        this.$refs.infoModal.show();
        return;
      }

      // Open form
      this.$refs.addModal.show();

      let {_parent, ...result} = this.addItem;
      this.initFormValues = _.cloneDeep(result);
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

      const item = JSON.parse(JSON.stringify(this.addItem));
      delete item._parent;
      data[data.length] = item;

      // Emit the newly updated data model
      this.$emit('input', data);

      // Reset our add item
      this.addItem = {};

      this.$nextTick(() => {
        this.$refs.addModal.hide();
      });
    },
    showDeleteConfirmation(index) {
      let pageIndex = ((this.paginatorPage-1) * this.perPage) + index;
      this.deleteIndex = pageIndex;
      this.$refs.deleteModal.show();
    },
    downloadFile(rowData, rowField, rowIndex) {
      let requestId = this.$root.task.request_data._request.id;
      let name = this.name + "." + rowIndex + "." + rowField;

      ProcessMaker.apiClient
              .get("requests/" + requestId + "/files?name=" + name)
              .then(response => {
                let respData = response.data;
                if (respData && respData.data && respData.data.length) {
                  let file = respData.data[0];
                  this.downloadRecordListFile(file, requestId);
                }
              });
    },
    downloadRecordListFile(file, requestId) {
      ProcessMaker.apiClient({
        baseURL: "/",
        url: "/request/" + requestId + "/files/" + file.id,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        //axios needs to be told to open the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.file_name);
        document.body.appendChild(link);
        link.click();
      });
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
    isValid() {
      const validate = ValidatorFactory(this.formConfigParent[this.form].items, this.$refs.addRenderer.transientData);
      this.errors = validate.getErrors();
      return _.size(this.errors) === 0;
    },
    parentObj() {
      let parent = this.$parent;
      while ('transientData' in parent.$props) {
        parent = parent.$parent;
      }
      return parent;
    },
  },
  mounted() {
    this.parentReference = this.parentObj();
  }
};
</script>
