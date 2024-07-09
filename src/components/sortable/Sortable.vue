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
          v-bind="testActions.btnNew"
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
      :data-test-actions="testActions"
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
      default: () => ({}),
    },
    searchProperties: {
      type: Array,
      required: false,
      default: function() {
        return []; // Return a new instance of the array
      }
    }
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
      defaultTestActions: {
        tableBox: { 'data-test': 'sortable-table-box' },
        btnNew: { 'data-test': 'sortable-btn-new' },
        btnEdit: { 'data-test': 'sortable-btn-edit' },
        btnDelete: { 'data-test': 'sortable-btn-remove' },
      },
    };
  },
  computed: {
    testActions() {
      return { ...this.defaultTestActions, ...this.dataTestActions };
    },
  },
  watch: {
    search(value) {
      this.filteredItems = this.filterItems(value, this.items, this.searchProperties);
    },
    items: {
      handler(newItems) {
        this.filteredItems = [...newItems];

        if (this.search.length > 0) {
          this.filteredItems = this.filterItems(this.search, newItems, this.searchProperties);
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Filters items by searching within specified properties, including nested properties, considering substrings.
     *
     * @param {string} searchValue - The value to search for within item properties.
     * @param {Array} items - The collection of items to filter.
     * @param {Array} searchProperties - The properties to search within each item.
     * @returns {Array} - The filtered items.
     */
    filterItems(searchValue, items, searchProperties) {
      const cleanSearch = this.clearSearch(searchValue).toLowerCase();

      return items.filter((item) => {
        return this.propertyMatchesSearch(item, searchProperties, cleanSearch);
      });
    },

    /**
     * Checks if any of the specified properties of an item match the cleaned search value as a substring.
     *
     * @param {Object} item - The item object to check.
     * @param {Array} properties - The properties to search within each item.
     * @param {string} cleanSearch - The cleaned and lowercase search value.
     * @returns {boolean} - True if any property matches the search value, otherwise false.
     */
    propertyMatchesSearch(item, properties, cleanSearch) {
      return properties.some((property) => {
        const value = this.getPropertyValue(item, property);
        if (value && typeof value === 'string') {
          const normalizedValue = value.toLowerCase();
          return normalizedValue.includes(cleanSearch);
        }
        return false;
      });
    },

    /**
     * Retrieves the value of a nested property within an object.
     *
     * @param {Object} obj - The object from which to retrieve the property value.
     * @param {string} path - The path to the nested property, e.g., "item.title".
     * @returns {*} - The value of the nested property if found, otherwise undefined.
     */
    getPropertyValue(obj, path) {
      const parts = path.split('.');
      return parts.reduce((acc, curr) => acc && acc[curr], obj);
    },

    /**
     * Cleans the search value by removing unwanted characters and trimming spaces.
     *
     * @param {string} searchValue - The value to be cleaned.
     * @returns {string} - The cleaned search value.
     */
    clearSearch(searchValue) {
      return searchValue.trim();
    },
  },
};
</script>

<style lang="scss" scoped src="./sortable.scss"></style>
