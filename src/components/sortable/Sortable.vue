<template>
  <div class="container .sortable-box">
    <div class="row">
      <div class="col-sm border rounded-lg p-0 mr-3 sortable-search-box">
        <i class="fa fa-search sortable-search-icon"></i>
        <input id="search" class="form-control border-0 shadow-none px-0" :placeholder="$t('Search here')" />
      </div>
      <div>
        <button type="button" class="btn sortable-btn-new">
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sortable',
  data() {
    return {
      msg: 'Sortable'
    }
  }
}
</script>

<style lang="scss" scoped src="./sortable.scss"></style>
