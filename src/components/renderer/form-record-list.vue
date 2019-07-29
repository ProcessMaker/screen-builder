<template>
  <div>
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
        :api-mode="false"
        pagination-path=""
        :noDataTemplate="$t('No Data Available')"
        @vuetable:pagination-data="onPaginationData"
      >
        <template slot="actions" slot-scope="props">
          <div class="actions">
            {{ $t('Json Options') }}
            <div class="btn-group" role="group" aria-label="Actions">
              <button @click="showEditForm(props.rowIndex)" class="btn btn-primary">
                {{ $t('Edit') }}
              </button>
              <button @click="showDeleteConfirmation(props.rowIndex)" class="btn btn-primary">
                {{ $t('Delete') }}
              </button>
            </div>
          </div>
        </template>
      </vuetable>
      <vuetable-pagination @vuetable-pagination:change-page="onChangePage" ref="pagination"/>
    </template>

    <b-modal
      @ok="add"
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
        :config="fetchFormConfig()"
      />
    </b-modal>
    <b-modal
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
        :config="fetchFormConfig()"
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
      :ok-title="$t('Save')"
      :title="$t('Information form')"
      ok-only
    >
      <p>{{ $t('The form to be displayed is not assigned..') }}</p>
    </b-modal>
    <div v-if="editable && selfReferenced" class="alert alert-danger">
      {{ $t('The Record List control is not allowed to reference other controls on its own page to add or edit records. Specify a secondary page with controls to enter records.') }}
    </div>
  </div>
</template>


<script>
import Vuetable from 'vuetable-2/src/components/Vuetable';
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination';
import VueFormRenderer from '@/components/vue-form-renderer';

const jsonOptionsActionsColumn = {
  name: '__slot:actions',
  title: 'Actions',
  titleClass: 'text-right',
  dataClass: 'text-right',
};

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VueFormRenderer,
  },
  props: ['label', 'fields', 'value', 'editable', '_config', 'form', 'validationData'],
  data() {
    return {
      addItem: {},
      editItem: {},
      editIndex: null,
      currentPage: 0,
      perPage: 50,
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
        data: this.value.slice(0, this.perPage),
      };
      return data;
    },
    tableFields() {
      const fields = this.getFieldsFromDataSource();

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
  methods: {
    getFieldsFromDataSource() {
      const { jsonData, key, value, dataName } = this.fields;

      const convertToTableOptions = option => ({
        name: option[key || 'value'],
        title: option[value || 'content'],
      });

      if (jsonData) {
        try {
          return JSON.parse(jsonData)
            .map(convertToTableOptions);
        } catch (error) {
          /* Ignore error */
        }
      }

      if (dataName) {
        try {
          return this.validationData[dataName]
            .map(convertToTableOptions);
        } catch (error) {
          /* Ignore error */
        }
      }

      return [];
    },
    hideInformation() {
      this.$refs.infoModal.hide();
    },
    dataManager() {
      let pagination = this.$refs.vuetable.makePagination(this.value.length);
      return {
        pagination,
        data: this.value.slice(pagination.from - 1, pagination.to),
      };
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
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
      this.$refs.addModal.show();
    },
    add() {
      // Add the item to our model and emit change
      // @todo Also check that value is an array type, if not, reset it to an array
      let data = this.value ? JSON.parse(JSON.stringify(this.value)) : [];
      data[data.length] = JSON.parse(JSON.stringify(this.addItem));
      // Emit the newly updated data model
      this.$emit('input', data);
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
      this.$emit('input', data);
    },
  },
};
</script>
