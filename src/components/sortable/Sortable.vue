<template>
  <div class="container sortable-box">
    <div class="row">
      <div class="col-sm border rounded-lg p-0 mr-3 sortable-search-box">
        <i class="fa fa-search sortable-search-icon"></i>
        <input
          id="search"
          class="form-control border-0 shadow-none px-0"
          v-model="search"
          :placeholder="$t('Search here')"
          data-test="search"
        />
      </div>
      <div>
        <button
          type="button"
          class="btn sortable-btn-new"
          @click="$emit('add-page', $event)"
        >
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>

    <SortableList
      :items="items"
      :filtered-items="filteredItems"
      @ordered="$emit('ordered', $event)"
      @item-edit="$emit('item-edit', $event)"
      @item-delete="$emit('item-delete', $event)"
    />
  </div>
</template>

<script>
import SortableList from './sortableList/SortableList.vue'

export default {
  name: 'Sortable',
  components: {
    SortableList
  },
  props: {
    items: { type: Array, required: true },
    filterKey: { type: String, required: true },
  },
  data() {
    return {
      search: "",
      filteredItems: this.items,
    };
  },
  watch: {
    search(value) {
      const cleanValue = value.trim().toLowerCase();

      this.filteredItems = this.items.filter((item) => item[this.filterKey].toLowerCase().includes(cleanValue));
    },
  }
}
</script>

<style lang="scss" scoped src="./sortable.scss"></style>
