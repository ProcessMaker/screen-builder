<template>
  <div class="row mt-3">
    <div class="col p-0 border rounded-lg sortable-list">
      <div class="sortable-list-header">
        <div class="sortable-item-icon"></div>
        <div class="sortable-list-title">PAGE NAME</div>
      </div>
      <div class="sortable-container" @dragover="dragOver">
        <div
          v-for="(item, index) in sortedItems"
          :key="index"
          :data-order="item.order"
          :data-test="`item-${item.order}`"
          :title="item.name"
          draggable="true"
          @dragstart="(event) => dragStart(event, item.order)"
          @dragenter="(event) => dragEnter(event, item.order)"
          @dragend="dragEnd"
          class="sortable-item sortable-draggable"
        >
          <div class="sortable-item-icon">
            <i class="fas fa-bars"></i>
          </div>
          <div class="rounded sortable-item-name">
            <b-form-input
              v-if="editRowIndex === index"
              v-model="item.name"
              type="text"
              autofocus
              @blur.stop="onBlur()"
            />
            <span v-else>{{ item.name }}</span>
          </div>
          <div class="border rounded-lg sortable-item-action">
            <button class="btn" @click.stop="onClick(item, index)">
              <i class="fas fa-edit"></i>
            </button>
            <div class="sortable-item-vr"></div>
            <button class="btn" @click="$emit('item-delete', item)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SortableList',
  props: {
    items: { type: Array, required: true },
    filteredItems: { type: Array, required: true },
  },
  data() {
    return {
      draggedItem: 0,
      draggedOverItem: 0,
      editRowIndex: null,
    };
  },
  computed: {
    sortedItems() {
      const sortedItems = [...this.filteredItems].sort(
        (a, b) => a.order - b.order
      );
      return sortedItems;
    }
  },
  methods: {
    onBlur() {
      this.editRowIndex = -1;
    },
    onClick(item, index) {
      if (this.editRowIndex === -1 || this.editRowIndex === index) {
        this.editRowIndex = null;
        return;
      }
      this.editRowIndex = index;
      this.$emit("item-edit", item);
    },
    dragStart(event, order) {
      // disable edit mode
      this.editRowIndex = null;
      this.draggedItem = order;
      // add dragging class to the element
      event.target.classList.add('dragging');
    },
    dragEnter(event, order) {
      this.draggedOverItem = order;
    },
    dragEnd(event) {
      // remove dragging class from the element
      event.target.classList.remove('dragging');

      // get the index of the dragged item and the dragged over item
      const itemsSortedClone = [...this.items].sort(
        (a, b) => a.order - b.order
      );
      const draggedItemIndex = itemsSortedClone.findIndex(
        (item) => item.order === this.draggedItem
      );
      const draggedOverItemIndex = itemsSortedClone.findIndex(
        (item) => item.order === this.draggedOverItem
      );

      if (draggedItemIndex !== draggedOverItemIndex) {
        // get the order of the dragged over item
        const tempOrder = itemsSortedClone[draggedOverItemIndex].order;
        // set the increment
        const increment = this.draggedItem > this.draggedOverItem ? 1 : -1;

        // update the order of the items between the dragged item and the dragged over item
        if (draggedItemIndex < draggedOverItemIndex) {
          for (let i = draggedItemIndex + 1; i <= draggedOverItemIndex; i++) {
            const orderAux = itemsSortedClone[i].order;
            itemsSortedClone[i].order = orderAux + increment;
          }

          itemsSortedClone[draggedItemIndex].order = tempOrder;
        } else if (draggedItemIndex > draggedOverItemIndex) {
          for (let i = draggedOverItemIndex; i <= draggedItemIndex - 1; i++) {
            const orderAux = itemsSortedClone[i].order;
            itemsSortedClone[i].order = orderAux + increment;
          }

          itemsSortedClone[draggedItemIndex].order = tempOrder;
        }
      }

      this.$emit('ordered', itemsSortedClone);
    },
    dragOver(event) {
      event.preventDefault();
    },
  },
}
</script>

<style lang="scss" scoped src="./sortableList.scss"></style>
