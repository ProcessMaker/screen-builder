<template>
  <div class="data-table overflow-auto">
    <div class="row mb-2 ml-0 mr-0">
      <div class="col">
        <h4>{{ label }}</h4>
      </div>
      <div class="col text-right">
        <button
          v-if="editable && !selfReferenced"
          class="btn btn-primary"
          data-cy="add-row"
          @click="showAddForm"
        >
          {{ $t("Add") }}
        </button>
      </div>
    </div>
    <div v-if="!value && !tableData.data">
      {{ $t("This record list is empty or contains no data.") }}
    </div>
    <template v-else>
        <b-table
          ref="vuetable"
          :per-page="perPage"
          :data-manager="dataManager"
          :fields="tableFields"
          :items="tableData.data"
          :sort-compare-options="{ numeric: false }"
          :sort-null-last="true"
          sort-icon-left
          :css="css"
          :empty-text="$t('No Data Available')"
          :current-page="currentPage"
          data-cy="table"
        >
          <template #cell()="{ index, field, item }">
            <template v-if="isFiledownload(field, item)">
              <span href="#" @click="downloadFile(item, field.key, index)">{{
                mustache(field.key, item)
              }}</span>
            </template>
            <template v-else-if="isImage(field, item)">
              <img :src="mustache(field.key, item)" style="record-list-image" />
            </template>
            <template v-else-if="isWebEntryFile(field, item)">
              {{ formatIfWebEntryFile(field, item) }}
            </template>
            <template v-else>
              {{ formatIfDate(mustache(field.key, item)) }}
            </template>
  
          </template>
          <template #cell(__actions)="{ index, item }">
            <div class="actions">
              <div
                class="btn-group btn-group-sm"
                role="group"
                aria-label="Actions"
              >
                <button
                  class="btn btn-primary"
                  :title="$t('Edit')"
                  data-cy="edit-row"
                  @click="showEditForm(index, item.row_id)"
                >
                  <i class="fas fa-edit" />
                </button>
                <button
                  class="btn btn-danger"
                  :title="$t('Delete')"
                  data-cy="remove-row"
                  @click="showDeleteConfirmation(index, item.row_id)"
                >
                  <i class="fas fa-trash-alt" />
                </button>
              </div>
            </div>
          </template>
        </b-table>
      <b-pagination
        v-if="tableData.total > perPage && (perPage !== 0)"
        v-model="currentPage"
        data-cy="table-pagination"
        :total-rows="tableData.total"
        :per-page="perPage"
        :aria-label="$t('Pagination')"
        aria-controls="vuetable"
        @change="onChangePage"
      />
    </template>

    <b-modal
      v-if="editable && !selfReferenced"
      ref="addModal"
      :static="true"
      size="lg"
      :ok-title="$t('Ok')"
      :cancel-title="$t('Cancel')"
      :title="$t('Add')"
      header-close-content="&times;"
      data-cy="modal-add"
      @ok="handleOk"
      @hidden="handleHideAddModal"
      @shown="emitShownEvent"
    >
      <vue-form-renderer
        ref="addRenderer"
        :key="Array.isArray(value) ? value.length : 0"
        v-model="addItem"
        :page="0"
        :config="popupConfig"
        :current-page="form"
        :computed="formComputed"
        :watchers="formWatchers"
        debug-context="Record List Add"
        :_parent="validationData"
        @update="updateRowDataNamePrefix"
      />
    </b-modal>
    <b-modal
      v-if="editable && !selfReferenced"
      ref="editModal"
      :static="true"
      size="lg"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      :title="$t('Edit Record')"
      header-close-content="&times;"
      data-cy="modal-edit"
      @ok="edit"
      @hidden="$refs.addRenderer.hasSubmitted(false)"
      @shown="emitShownEvent"
    >
      <vue-form-renderer
        ref="editRenderer"
        :key="editFormVersion"
        v-model="editItem"
        :page="0"
        :config="popupConfig"
        :current-page="form"
        :computed="formComputed"
        :watchers="formWatchers"
        debug-context="Record List Edit"
        :_parent="validationData"
        @update="updateRowDataNamePrefix"
      />
    </b-modal>
    <b-modal
      v-if="editable && !selfReferenced"
      ref="deleteModal"
      size="lg"
      :ok-title="$t('Delete')"
      :cancel-title="$t('Cancel')"
      :title="$t('Delete Record')"
      header-close-content="&times;"
      data-cy="modal-remove"
      @ok="remove"
    >
      <p>{{ $t("Are you sure you want to remove this record?") }}</p>
    </b-modal>
    <b-modal
      v-if="editable && !selfReferenced"
      ref="infoModal"
      size="sm"
      :ok-title="$t('OK')"
      :title="$t('Information form')"
      header-close-content="&times;"
      ok-only
      data-cy="modal-not-assigned"
      @ok="hideInformation"
    >
      <p>{{ $t("The form to be displayed is not assigned.") }}</p>
    </b-modal>
    <div v-if="editable && selfReferenced" class="alert alert-danger">
      {{
        $t(
          "The Record List control is not allowed to reference other controls on its own page to add or edit records. Specify a secondary page with controls to enter records."
        )
      }}
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { dateUtils } from "@processmaker/vue-form-elements";
import VueFormRenderer from "@/components/vue-form-renderer.vue";
import mustacheEvaluation from "../../mixins/mustacheEvaluation";

const jsonOptionsActionsColumn = {
  key: "__actions",
  label: "Actions",
  thClass: "text-right",
  tdClass: "text-right"
};

export default {
  components: {
    VueFormRenderer
  },
  mixins: [mustacheEvaluation],
  props: [
    "name",
    "label",
    "fields",
    "value",
    "editable",
    "_config",
    "form",
    "validationData",
    "formConfig",
    "formComputed",
    "formWatchers",
    "_perPage",
    "source",
    "paginationOption"
  ],
  data() {
    return {
      editFormVersion: 0,
      single: "",
      plural: "",
      addItem: {},
      editItem: {},
      editIndex: null,
      currentPage: 1,
      paginatorPage: 1,
      perPageSelectEnabled: false,
      perPage: 5,
      lastPage: 1,
      css: {
        tableClass:
          "table table-hover table-responsive text-break mb-0 d-table",
        loadingClass: "loading",
        detailRowClass: "vuetable-detail-row",
        handleIcon: "grey sidebar icon",
        sortableIcon: "fas fa-sort",
        ascendingIcon: "fas fa-sort-up",
        descendingIcon: "fas fa-sort-down",
        ascendingClass: "ascending",
        descendingClass: "descending",
        renderIcon(classes) {
          return `<i class="${classes.join(" ")}"></i>`;
        }
      },
      initFormValues: {},
      currentRowIndex: null,
      collectionData: {}
    };
  },
  computed: {
    popupConfig() {
      const config = [];
      config[this.form] = this.formConfig[this.form];
      return config;
    },
    debug() {
      return {
        perPageSelectEnabled: this.perPageSelectEnabled,
        perPageSelectEnabled2:
          this.$refs.pagination && this.$refs.pagination.perPageSelectEnabled
      };
    },
    parentObj() {
      let parent = this.$parent;
      while ("transientData" in parent.$props) {
        parent = parent.$parent;
      }
      return parent;
    },
    dataManager() {
      if (this.$refs.vuetable) {
        const pagination = this.$refs.vuetable.makePagination(
          this.value.length
        );
        return {
          pagination,
          data: this.value.slice(pagination.from - 1, pagination.to)
        };
      }
      // eslint-disable-next-line no-console
      console.log("refs vuetable not exists");
    },
    tableData() {
      const value = Object.keys(this.collectionData).length !== 0 ? this.collectionData : (this.value || []);
      const from = this.paginatorPage - 1;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.lastPage = Math.ceil(value.length / this.perPage);
      const data = {
        total: value.length,
        per_page: this.perPage,
        current_page: this.paginatorPage,
        last_page: this.lastPage,
        next_page_url: null,
        prev_page_url: null,
        from,
        to: value.length,
        data: value,
        lastSortConfig: false
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
    }
  },
  watch: {
    "tableData.total": {
      deep: true,
      handler(total) {
        const totalPages = Math.ceil(total / this.perPage);
        this.currentPage =
          this.currentPage > totalPages ? totalPages : this.currentPage;
        this.currentPage = this.currentPage == 0 ? 1 : this.currentPage;
      }
    },
  },
  mounted() {
    if (this._perPage) {
      this.perPage = this._perPage;
    }
    this.updateRowDataNamePrefix = _.debounce(
      this.updateRowDataNamePrefix,
      100
    );

    if (this.paginationOption != null) {
      this.perPage = this.paginationOption;
    }

    if(this.source?.sourceOptions === "Collection") {
      this.onCollectionChange(this.source?.collectionFields?.collectionId, this.source?.collectionFields?.pmql);
    }
    
    this.$root.$emit("record-list-option", this.source?.sourceOptions);
  },
  methods: {
    onCollectionChange(collectionId,pmql) {
      let param = {params:{pmql:pmql}};
      let rowsCollection = [];

      this.$dataProvider
        .getCollectionRecordsList(collectionId, param)
        .then((response) => {
          rowsCollection = response.data;

          this.changeCollectionColumns(rowsCollection,this.fields);
        });

      this.$emit('change', this.field);
    },
    changeCollectionColumns(collectionFieldsColumns,columnsSelected) {
      
      const optionsList = columnsSelected.optionsList;

      collectionFieldsColumns.forEach(column => {
        let dataObject = column.data;
        let newDataObject = {};

        Object.keys(dataObject).forEach(dataKey => {
          const matchingOption = optionsList.find(option => option.content === dataKey);

          if (matchingOption) {
            newDataObject[matchingOption.key] = dataObject[dataKey];
          }
        });

        column.data = newDataObject;
      });

       this.setCollectionIntoList(collectionFieldsColumns);
        
    },
    setCollectionIntoList(arrayCollection) {
      const result = [];
      arrayCollection.forEach((row) => {
        if (row.hasOwnProperty('data')) {
          const dataObject = row.data;
          const extracted = {};

          for (const [key, value] of Object.entries(dataObject)) {
            extracted[key] = value;
          }

          result.push(extracted);
        }
      });
      //sets Collection result(columns and rows) into this.collectionData
      this.collectionData = result;
    },
    updateRowDataNamePrefix() {
      this.setUploadDataNamePrefix(this.currentRowIndex);
    },
    emitShownEvent() {
      window.ProcessMaker.EventBus.$emit("modal-shown");
    },
    formatIfDate(string) {
      return dateUtils.formatIfDate(string);
    },
    isImage(field, item) {
      const content = _.get(item, field.key);
      return (
        typeof content === "string" && content.substr(0, 11) === "data:image/"
      );
    },
    isWebEntryFile(field, item) {
      const content = _.get(item, field.key);
      const regex = /^webentry_.*:*$/;
      let checkWebEntryValue = content;

      if (Array.isArray(content)) {
        checkWebEntryValue = content[0].file;
      }

      return regex.test(checkWebEntryValue);
    },
    formatIfWebEntryFile(field, item) {
      const requestFiles = _.get(window, "PM4ConfigOverrides.requestFiles", {});
      const fileInfo = requestFiles[`${field.key}.${item.row_id}`];

      return fileInfo.map((file) => file.file_name).join(", ");
    },
    isFiledownload(field) {
      return field.key === "__filedownload";
    },
    setUploadDataNamePrefix(index = null) {
      this.currentRowIndex = index;
      let rowId = null;
      if (index !== null && this.editItem) {
        rowId = this.editItem.row_id;
      } else if (this.addItem) {
        rowId = this.addItem.row_id;
      }
      this.$root.$emit("set-upload-data-name", this, index, rowId);
    },
    getTableFieldsFromDataSource() {
      const { jsonData, key, value, dataName } = this.fields;

      let convertToVuetableFormat = {};
      if(this.source?.sourceOptions === "Collection") {
          convertToVuetableFormat = (option) => {
          return {
            key: option[key || "key"],
            sortable: true,
            label: option[key || "key"],
            tdClass: "table-column"
          };
        };
      } else {
          convertToVuetableFormat = (option) => {
          return {
            key: option[key || "value"],
            sortable: true,
            label: option[value || "content"],
            tdClass: "table-column"
          };
        };
      }

      return this.getValidFieldData(jsonData, dataName).map(
        convertToVuetableFormat
      );
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

      return Array.isArray(validationData) ? validationData : [];
    },
    hideInformation() {
      this.$refs.infoModal.hide();
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePerPage(perPage) {
      this.perPage = parseInt(perPage);
    },
    onChangePage(page) {
      if (page == "next") {
        this.paginatorPage += 1;
      } else if (page == "prev") {
        this.paginatorPage -= 1;
      } else {
        this.paginatorPage = page;
      }
      if (this.paginatorPage <= 0) {
        this.paginatorPage = 1;
      }
      if (this.paginatorPage > this.lastPage) {
        this.paginatorPage = this.lastPage;
      }
    },
    showEditForm(index, rowId) {
      const pageIndex = (this.currentPage - 1) * this.perPage + index;
      // Reset edit to be a copy of our data model item
      this.editItem = JSON.parse(
        JSON.stringify(_.find(this.tableData.data, { row_id: rowId }))
      );
      this.editIndex = pageIndex;
      // rebuild the edit screen to avoid
      this.editFormVersion++;
      this.$nextTick(() => {
        this.setUploadDataNamePrefix(pageIndex);
        this.$refs.editModal.show();
      });
    },
    edit(event) {
      this.$refs.addRenderer.hasSubmitted(true);
      if (
        this.$refs.editRenderer.$refs.renderer.$refs.component.$v.vdata.$invalid
      ) {
        event.preventDefault();
        return;
      }

      // Edit the item in our model and emit change
      const data = this.tableData.data
        ? JSON.parse(JSON.stringify(this.tableData.data))
        : [];
      const index = _.findIndex(data, { row_id: this.editItem.row_id });
      data[index] = JSON.parse(JSON.stringify(this.editItem));

      // Remove the parent object
      delete data[index]._parent;

      // Emit the newly updated data model
      this.$emit("input", data);
    },
    showAddForm() {
      const uniqueId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      this.$set(this.addItem, "row_id", uniqueId);
      this.setUploadDataNamePrefix();
      if (!this.form) {
        this.$refs.infoModal.show();
        return;
      }
      // Open form
      this.$refs.addModal.show();

      // eslint-disable-next-line no-unused-vars
      const { _parent, ...result } = this.addItem;
      this.initFormValues = _.cloneDeep(result);
    },
    handleHideAddModal() {
      this.addItem = this.initFormValues;
      this.$refs.addRenderer.hasSubmitted(false);
    },
    async handleOk(bvModalEvt) {
      this.$refs.addRenderer.hasSubmitted(true);
      bvModalEvt.preventDefault();

      if (
        this.$refs.addRenderer.$refs.renderer.$refs.component.$v.vdata.$invalid
      ) {
        return;
      }

      // Add the item to our model and emit change
      // @todo Also check that value is an array type, if not, reset it to an array
      const data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      const item = JSON.parse(
        JSON.stringify({ ...this.addItem, _parent: undefined })
      );
      delete item._parent;
      data[data.length] = item;

      // Emit the newly updated data model
      this.$emit("input", data);

      // Reset our add item
      this.addItem = {};

      this.$nextTick(() => {
        this.$refs.addModal.hide();
      });
    },
    showDeleteConfirmation(index, rowId) {
      this.deleteIndex = _.find(this.tableData.data, { row_id: rowId });
      this.$refs.deleteModal.show();
    },
    downloadFile(rowData, rowField, rowIndex) {
      const requestId = this.$root.task.request_data._request.id;
      const name = `${this.name}.${rowIndex}.${rowField}`;

      window.ProcessMaker.apiClient
        .get(`requests/${requestId}/files?name=${name}`)
        .then((response) => {
          const respData = response.data;
          if (respData && respData.data && respData.data.length) {
            const file = respData.data[0];
            this.downloadRecordListFile(file, requestId);
          }
        });
    },
    downloadRecordListFile(file, requestId) {
      window.ProcessMaker.apiClient({
        baseURL: "/",
        url: `/request/${requestId}/files/${file.id}`,
        method: "GET",
        responseType: "blob" // important
      }).then((response) => {
        // axios needs to be told to open the file
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
      const data = this.tableData.data
        ? JSON.parse(JSON.stringify(this.tableData.data))
        : [];
      const recordData = this.deleteIndex;
      // Remove item from data array
      _.remove(data, {
        row_id: this.deleteIndex.row_id
      });
      // Emit the newly updated data model
      this.$emit("input", data);
      this.$root.$emit("removed-record", this, recordData);
    }
  }
};
</script>

<style>
.table td.table-column {
  max-width: 300px;
}
</style>
