<template>
  <div class="container sortable-box">
    <div class="row">
      <div class="col-sm border rounded-lg p-0 mr-3 sortable-search-box">
        <i class="fa fa-search sortable-search-icon"></i>
        <input
          id="search"
          v-model="search"
          class="form-control border-0 shadow-none px-0"
          :placeholder="$t('Search here')"
          data-test="search"
        />
      </div>
      <div>
        <button
          type="button"
          class="btn sortable-btn-new"
          v-bind="dataTestActions.btnNew"
          @click="$emit('add-page', $event)"
        >
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>

    <SortableList
      :fields="fields"
      :items="items"
      :filtered-items="filteredItems"
      :inline-edit="inlineEdit"
      :disable-key="disableKey"
      :data-test-actions="dataTestActions"
      @ordered="$emit('ordered', $event)"
      @item-edit="$emit('item-edit', $event)"
      @item-delete="$emit('item-delete', $event)"
    >
      <template #options="{ item }">
        <slot name="options" :item="item"></slot>
      </template>
    </SortableList>
  </div>
</template>

<script>
import SortableList from './sortableList/SortableList.vue';

export default {
  name: 'Sortable',
  components: {
    SortableList,
  },
  props: {
    fields: { type: Array, required: true },
    items: { type: Array, required: true },
    filterKey: { type: String, required: true },
    disableKey: { type: String, default: null },
    inlineEdit: { type: Boolean, default: true },
    dataTestActions: {
      type: Object,
      default: () => ({
        tableBox: { 'data-test': 'sortable-table-box' },
        btnNew: { 'data-test': 'sortable-btn-new' },
        btnEdit: { 'data-test': 'sortable-btn-edit' },
        btnDelete: { 'data-test': 'sortable-btn-remove' },
      }),
    },
  },
  data() {
    return {
      search: "",
      filteredItems: [...this.items].map((item, index) => {
        // Add the order property to the items if it doesn't exist
        if (item.order === undefined) {
          // eslint-disable-next-line no-param-reassign
          this.$set(item, "order", index + 1);
        }
        return item;
      }),
    };
  },
  watch: {
    search(value) {
      this.filteredItems = this.filterItems(value, this.items);
    },
    items: {
      handler(newItems) {
        this.filteredItems = [...newItems];

        if (this.search.length > 0) {
          this.filteredItems = this.filterItems(this.search, newItems);
        }
      },
      deep: true,
    },
  },
  methods: {
    clearSearch(value) {
      return value.trim().toLowerCase();
    },
    filterItems(searchValue, items) {
      const cleanSearch = this.clearSearch(searchValue);
      const filterKeys = this.filterKey.split(',');

      return items.filter((item) =>
        filterKeys.some((key) => {
          const keyParts = key.split('.');

          return keyParts.length > 1
            ? keyParts
                .reduce((obj, keyPart) => obj[keyPart], item)
                ?.toLowerCase()
                .includes(cleanSearch)
            : item[key]?.toLowerCase().includes(cleanSearch);
        }),
      );
    },
  },
};
</script>

<style lang="scss" scoped src="./sortable.scss"></style>
