<template>
  <Sortable
    :fields="fields"
    :items="value"
    filter-key="name,watching,output_variable,script.title"
    disable-key="byPass"
    :inline-edit="false"
    :data-test-actions="{
      tableBox: { 'data-cy': 'watchers-table' },
      btnNew: { 'data-cy': 'watchers-add-watcher' },
      btnEdit: { 'data-cy': 'watchers-table-edit' },
      btnDelete: { 'data-cy': 'watchers-table-remove' },
    }"
    @item-edit="editProperty"
    @item-delete="deleteProperty"
    @add-page="displayFormProperty"
    @ordered="$emit('ordered', $event)"
    :searchProperties= "searchProperties"
  >
    <template #options="{ item }">
      <button
        v-b-tooltip="{ customClass: 'bypass-btn-tooltip' }"
        :title="item.byPass ? $t('Unbypass Watcher') : $t('Bypass Watcher')"
        class="btn"
        data-test="watchers-bypass"
        @click.prevent="$emit('toggle-bypass', item.uid)"
      >
        <img :src="getByPassIcon(item)" alt="Bypass" width="24" />
      </button>
      <div class="sortable-item-vr"></div>
    </template>
  </Sortable>
</template>

<script>
import BasicSearch from './basic-search';
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';
import Sortable from './sortable/Sortable.vue';

export default {
  components: {
    BasicSearch,
    FormInput,
    FormTextArea,
    Sortable,
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
      ],
      searchProperties: ['name', 'output_variable', 'watching', 'script.title'],
    };
  },
  methods: {
    displayFormProperty() {
      this.$emit('display-form');
    },
    editProperty(item) {
      this.$emit('edit-form', item);
    },
    deleteProperty(item) {
      this.$emit('delete-form', item);
    },
    getByPassIcon(item) {
      return new URL(
        `../assets/icons/${item.byPass ? 'Unbypass' : 'Bypass'}.svg`,
        import.meta.url,
      ).href;
    },
  },
};
</script>

<style lang="scss" scoped>
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
