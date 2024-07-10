<template>
  <div class="row mt-3">
    <div
      class="p-0 border rounded-lg sortable-list"
      v-bind="dataTestActions.tableBox"
      @dragover="dragOver"
    >
      <div class="sortable-list-tr">
        <div class="sortable-list-td"></div>
        <div
          v-for="field in fields"
          :key="field.key"
          class="sortable-list-td sortable-list-header"
        >
          {{ field.label }}
        </div>
        <div class="sortable-list-td"></div>
      </div>
      <div
        v-for="(item, index) in sortedItems"
        :key="`item-${index}`"
        :data-order="item.order"
        :data-test="`item-${item.order}`"
        :title="item.name"
        :class="[
          'sortable-list-tr',
          'sortable-item',
          { 'sortable-item-disabled': isDisabled(item) },
        ]"
        draggable="true"
        @dragstart="(event) => dragStart(event, item.order)"
        @dragenter="(event) => dragEnter(event, item.order)"
        @dragend="dragEnd"
      >
        <div class="sortable-list-td">
          <div class="sortable-item-icon">
            <i class="fas fa-bars"></i>
          </div>
        </div>
        <div
          v-for="field in fields"
          :key="field.key"
          class="sortable-list-td sortable-item-prop"
        >
          <b-form-input
            v-if="editRowIndex === index"
            v-model="newName"
            type="text"
            autofocus
            required
            :state="validateState(newName, item)"
            :error="validateError(newName, item)"
            @blur.stop="onBlur(newName, item)"
            @keydown.enter.stop="onBlur(newName, item)"
            @keydown.esc.stop="onCancel(item)"
            @focus="onFocus(item)"
          />
          <span v-else>{{ getItemValue(item, field.key, field.cb) }}</span>
        </div>

        <div class="sortable-list-td">
          <div class="border rounded-lg sortable-item-action">
            <button v-if="editRowIndex === index" class="btn">
              <i class="fas fa-check"></i>
            </button>
            <button
              v-else
              class="btn"
              title="Edit"
              v-bind="dataTestActions.btnEdit"
              @click.stop="onClick(item, index)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <div class="sortable-item-vr"></div>
            <slot name="options" :item="item"></slot>
            <button
              class="btn"
              title="Delete"
              v-bind="dataTestActions.btnDelete"
              @click="$emit('item-delete', item)"
            >
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
    fields: { type: Array, required: true },
    items: { type: Array, required: true },
    filteredItems: { type: Array, required: true },
    inlineEdit: { type: Boolean, default: true },
    disableKey: { type: String, default: null },
    dataTestActions: { type: Object, required: true },
  },
  data() {
    return {
      refreshSort: 1,
      newName: '',
      draggedItem: 0,
      draggedOverItem: 0,
      editRowIndex: null,
    };
  },
  computed: {
    sortedItems() {
      const sortedItems =
        this.refreshSort &&
        [...this.filteredItems].sort((a, b) => a.order - b.order);
      return sortedItems;
    },
  },
  methods: {
    /** Get the value of a nested field in an object
     * @param {Object} item - The object to get the value from
     * @param {String} fieldKey - The key of the field to get the value from
     * @param {Function} cb - Callback function to apply to the value
     *
     * @returns {String} The value of the field
     */
    getItemValue(item, fieldKey, cb = null) {
      return fieldKey.split('.').reduce((obj, key) => {
        if (!obj[key]) return '';
        return cb instanceof Function ? cb(obj[key]) : obj[key];
      }, item);
    },
    validateState(name, item) {
      const isEmpty = !name?.trim();
      const isDuplicated = this.items
        .filter((i) => i !== item)
        .find((i) => i.name === name);
      return isEmpty || isDuplicated ? false : null;
    },
    validateError(name, item) {
      const isEmpty = !name?.trim();
      if (!isEmpty) {
        return this.$t("The Page Name field is required.");
      }
      const isDuplicated = this.items
        .filter((i) => i !== item)
        .find((i) => i.name === name);
      if (isDuplicated) {
        return this.$t('Must be unique.');
      }
      return '';
    },
    onFocus(item) {
      this.newName = item.name;
    },
    async onBlur(name, item) {
      if (this.validateState(name, item) === false) {
        this.newName = item.name;
      } else {
        // eslint-disable-next-line no-param-reassign
        item.name = name;
      }
      await this.$nextTick();
      setTimeout(() => {
        this.editRowIndex = null;
      }, 250);
    },
    async onCancel(item) {
      this.newName = item.name;
      this.editRowIndex = null;
    },
    onClick(item, index) {
      if (!this.inlineEdit) {
        this.$emit("item-edit", item);
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

        // Update order of the items
        const clone = [...itemsSortedClone];
        clone.sort((a, b) => a.order - b.order);
        clone.forEach((item, index) => {
          // eslint-disable-next-line no-param-reassign
          item.order = index + 1;
        });
      }
      this.refreshSort++;
      this.$emit('ordered', itemsSortedClone);
    },
    dragOver(event) {
      event.preventDefault();
    },
    isDisabled(item) {
      return this.disableKey ? item[this.disableKey] : false;
    },
  },
};
</script>

<style lang="scss" scoped src="./sortableList.scss"></style>
