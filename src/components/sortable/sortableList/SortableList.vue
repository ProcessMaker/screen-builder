<template>
  <div class="row mt-3">
    <div class="col p-0 border rounded-lg sortable-list">
      <div class="sortable-list-header">
        <div class="sortable-item-icon"></div>
        <div class="sortable-list-title">PAGE NAME</div>
      </div>
      <div v-for="todo in todos" :key="todo.id" class="sortable-item">
        <div class="sortable-item-icon">
          <i class="fas fa-bars"></i>
        </div>
        <div class="sortable-item-name">{{ todo.text }}</div>
        <div class="border rounded-lg sortable-item-action">
          <button class="btn">
            <i class="fas fa-edit"></i>
          </button>
          <div class="sortable-item-vr"></div>
          <button class="btn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SortableList',
  data() {
    return {
      todos: [
        { id: 1, text: 'Learn JavaScript' },
        { id: 2, text: 'Learn Vue' },
        { id: 3, text: 'Build something awesome' },
      ],
    };
  },
}
</script>

<style lang="scss" scoped src="./sortableList.scss"></style>
