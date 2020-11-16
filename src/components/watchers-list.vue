<template>
  <div>
    <b-row class="mb-3">
      <b-col>
        <basic-search v-model="filter" @submit="search">
          <template slot="buttons">
            <b-btn class="text-nowrap" variant="secondary" @click.stop="displayFormProperty" data-cy="watchers-add-watcher">
              <i class="fas fa-plus" />
              {{ $t('Watcher') }}
            </b-btn>
          </template>
        </basic-search>
      </b-col>
    </b-row>

    <div class="card card-body table-card">
      <b-table
        :items="filtered"
        :fields="fields"
        :empty-text="$t('No Data Available')"
        data-cy="watchers-table"
      >
        <template #cell(actions)="{item}">
          <div class="actions">
            <div class="popout">
              <b-btn
                variant="link"
                @click="editProperty(item.rowData)"
                v-b-tooltip.hover
                :title="$t('Edit')"
                data-cy="watchers-table-edit"
              >
                <i class="fas fa-edit fa-lg fa-fw"/>
              </b-btn>
              <b-btn
                variant="link"
                @click="deleteProperty(item.rowData)"
                v-b-tooltip.hover
                :title="$t('Delete')"
                data-cy="watchers-table-remove"
              >
                <i class="fas fa-trash-alt fa-lg fa-fw"/>
              </b-btn>
            </div>
          </div>
        </template>
      </b-table>
    </div>
    <template slot="modal-footer">
      <span />
    </template>
  </div>
</template>

<script>
import BasicSearch from './basic-search';
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';

export default {
  components: {
    BasicSearch,
    FormInput,
    FormTextArea,
  },
  props: {
    value: {
      type: Array,
      /* istanbul ignore next */
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      filter: '',
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
          label: this.$t('Name'),
          key: 'name',
        },
        {
          label: this.$t('Watching Variable'),
          key: 'watching',
        },
        {
          label: this.$t('Output Variable'),
          key: 'output_variable',
        },
        {
          label: this.$t('Source'),
          key: 'script.title',
        },
        {
          key: 'actions',
          label: '',
        },
      ],
    };
  },
  computed: {
    filtered() {
      if (!this.filter) {
        return this.value;
      }
      const filtered = [];
      this.value.forEach(item => {
        if (Object.keys(item).find(key => typeof item[key] === 'string' ? item[key].indexOf(this.filter)>=0 : false)) {
          filtered.push(item);
        }
      });
      return filtered;
    },
  },
  methods: {
    search() {

    },
    displayFormProperty() {
      this.$emit('display-form');
    },
    editProperty(item) {
      this.$emit('edit-form', item);
    },
    deleteProperty(item) {
      this.$emit('delete-form', item);
    },
  },
};
</script>
