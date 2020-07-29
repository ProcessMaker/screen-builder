<template>
  <div class="basic-search">
    <div class="d-flex">
      <div class="flex-grow-1">
        <div class="search-bar-basic d-flex w-100">
          <div class="search-bar-inputs flex-grow w-100">
            <input ref="search_input" type="text" class="search-bar-manual-input form-control" :placeholder="placeholder ? placeholder : $t('Search')" v-model="query" @keyup.enter="runSearch" data-cy="watchers-table-search">
          </div>
          <div class="search-bar-actions d-flex flex-shrink">
            <b-btn class="btn-search-run" variant="primary" @click="runSearch" v-b-tooltip.hover :title="$t('Search')"><i class="fas fa-search" data-cy="watchers-table-search-button"/></b-btn>
          </div>
        </div>
      </div>
      <div class="search-bar-buttons">
        <slot name="buttons"/> 
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    placeholder: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  data() {
    return {
      query: '',
    };
  },
  watch: {
    query(value) {
      this.$emit('input', value);
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    runSearch(advanced) {
      this.$emit('submit', this.query);
    },
  },
  mounted() {
    this.query = this.value;
  },
};
</script>

<style lang="scss" scoped>
.basic-search {
  width: 100%;
  
  .btn {
    height: 40px;
  }
  
  .search-bar-buttons > * {
    margin-left: 8px;
  }
}

.search-bar-basic {
  .form-control,
  .form-control:active,
  .form-control:focus {
    border-bottom-right-radius: 0;
    border-right-width: 0;
    border-top-right-radius: 0;
    color: gray;
    height: 40px;
  }
  
  .btn:active,
  .btn:focus {
    box-shadow: none !important;
    outline: 0 !important;
  }
  
  .btn-search-run {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 2px;
    border-top-left-radius: 0;
    border-top-right-radius: 2px;
  }
}
</style>
