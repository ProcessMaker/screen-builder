<template>
  <div class="row mt-3">
    <div class="col p-0 border rounded-lg sortable-list">
      <div class="sortable-list-header">
        <div class="sortable-item-icon"></div>
        <div class="sortable-list-title">PAGE NAME</div>
      </div>
      <div class="sortable-container">
        <div
          v-for="(item, index) in items"
          :key="index"
          :data-index="index"
          draggable="true"
          class="sortable-item sortable-draggable"
        >
          <div class="sortable-item-icon">
            <i class="fas fa-bars"></i>
          </div>
          <div class="sortable-item-name">{{ item.name }} {{ index }}</div>
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
  </div>
</template>

<script>
export default {
  name: 'SortableList',
  props: {
    items: { type: Array },
  },
  methods: {
    initDraggable() {
      // get all draggable elements and the container
      const draggables = document.querySelectorAll('.sortable-draggable');
      const container = document.querySelector('.sortable-container');

      // add event listeners to the draggable elements
      draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', this.dragStart);
        draggable.addEventListener('dragend', this.dragEnd);
      });

      // add event listeners to the container
      container.addEventListener('dragover', this.dragOver);
    },
    dragStart(event) {
      // add dragging class to the element
      event.target.classList.add('dragging');
    },
    dragEnd(event) {
      // remove dragging class from the element
      event.target.classList.remove('dragging');
    },
    dragOver(event) {
      event.preventDefault();

      // get the draggable element
      const draggable = document.querySelector('.dragging');
      // get the element above the draggable
      const afterElement = this.getDragAfterElement(event.currentTarget, event.clientY);

      if (afterElement === null) {
        // append the draggable to the end of the container
        event.currentTarget.appendChild(draggable);
      } else {
        // insert the draggable above the element
        event.currentTarget.insertBefore(draggable, afterElement);
      }
    },
    getDragAfterElement(container, y) {
      // get all draggable elements except the one being dragged
      const draggableElements = [...container.querySelectorAll('.sortable-draggable:not(.dragging)')];

      return draggableElements.reduce((closest, child) => {
        // get the position of the element
        const box = child.getBoundingClientRect();
        // get the offset from the center of the element
        const offset = y - box.top - box.height / 2;

        // find the closest element to the current dragging position
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    },
  },
  mounted() {
    this.initDraggable();
  },
}
</script>

<style lang="scss" scoped src="./sortableList.scss"></style>
