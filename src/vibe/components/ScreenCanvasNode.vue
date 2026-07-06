<template>
  <div
    class="screen-canvas-node"
    :class="{
      'screen-canvas-node--root': isRoot,
      'screen-canvas-node--selected': selectedId === node.id,
      'screen-canvas-node--dragover': dragOver,
      'screen-canvas-node--dragging': draggingNodeId === node.id,
    }"
    @click.stop="$emit('select', node.id)"
    @dragenter.prevent="onContainerDragEnter"
    @dragover.prevent="onContainerDragOver"
    @dragleave="onContainerDragLeave"
    @drop.prevent="onContainerDrop"
  >
    <div
      class="screen-canvas-node__header"
      :class="{ 'screen-canvas-node__header--draggable': !isRoot }"
      :draggable="!isRoot"
      @dragstart.stop="onDragStart"
      @dragend.stop="onDragEnd"
    >
      <span v-if="!isRoot" class="screen-canvas-node__grip" aria-hidden="true">⋮⋮</span>
      <file-type-icon :icon-type="nodeIcon" />
      <span class="screen-canvas-node__label">{{ nodeLabel }}</span>
      <span v-if="node.type === 'component'" class="screen-canvas-node__path">
        {{ node.componentPath }}
      </span>

      <div v-if="!isRoot" class="screen-canvas-node__actions" @click.stop @mousedown.stop>
        <button
          type="button"
          class="screen-canvas-node__action"
          title="Duplicar"
          aria-label="Duplicar nodo"
          @click="$emit('duplicate-node', node.id)"
        >
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect
              x="4"
              y="4"
              width="6.5"
              height="6.5"
              rx="1"
              stroke="currentColor"
              stroke-width="1.2"
            />
            <path
              d="M2.5 8V3.5A1 1 0 0 1 3.5 2.5H8"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          class="screen-canvas-node__action screen-canvas-node__action--danger"
          title="Eliminar"
          aria-label="Eliminar nodo"
          @click="$emit('remove-node', node.id)"
        >
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2.5 3.5h7M4.5 3.5V2.8a.8.8 0 0 1 .8-.8h1.4a.8.8 0 0 1 .8.8v.7M5 5.8v3.2M7 5.8v3.2M3.8 3.5l.4 6.2a.8.8 0 0 0 .8.8h2a.8.8 0 0 0 .8-.8l.4-6.2"
              stroke="currentColor"
              stroke-width="1.1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="!node.children?.length" class="screen-canvas-node__empty">
      Soltá acá para agregar o reordenar
    </div>

    <div v-else class="screen-canvas-node__children">
      <template v-for="(child, index) in node.children">
        <div
          :key="`before-${child.id}`"
          class="screen-canvas-node__insert-zone"
          :class="{ 'screen-canvas-node__insert-zone--active': isInsertActive(node.id, index) }"
          @dragenter.prevent.stop="setInsertTarget(node.id, index)"
          @dragover.prevent.stop
          @dragleave.stop="clearInsertTarget(node.id, index)"
          @drop.prevent.stop="onInsertDrop(node.id, index, $event)"
        />

        <screen-canvas-node
          :key="child.id"
          :node="child"
          :selected-id="selectedId"
          :dragging-node-id="draggingNodeId"
          :active-insert="activeInsert"
          @select="$emit('select', $event)"
          @drop-node="$emit('drop-node', $event)"
          @drag-state="$emit('drag-state', $event)"
          @remove-node="$emit('remove-node', $event)"
          @duplicate-node="$emit('duplicate-node', $event)"
        />
      </template>

      <div
        class="screen-canvas-node__insert-zone"
        :class="{
          'screen-canvas-node__insert-zone--active': isInsertActive(
            node.id,
            node.children.length
          ),
        }"
        @dragenter.prevent.stop="setInsertTarget(node.id, node.children.length)"
        @dragover.prevent.stop
        @dragleave.stop="clearInsertTarget(node.id, node.children.length)"
        @drop.prevent.stop="onInsertDrop(node.id, node.children.length, $event)"
      />
    </div>
  </div>
</template>

<script>
import {
  VIBE_SHEET_DRAG,
  parseSheetDragPayload,
  setSheetMoveDragData,
} from "../services/vibeSheetDrag";
import FileTypeIcon from "./FileTypeIcon.vue";

export default {
  name: "ScreenCanvasNode",
  components: { FileTypeIcon },
  props: {
    node: { type: Object, required: true },
    selectedId: { type: String, default: "" },
    isRoot: { type: Boolean, default: false },
    isComponentSheet: { type: Boolean, default: false },
    componentName: { type: String, default: "" },
    draggingNodeId: { type: String, default: "" },
    activeInsert: { type: String, default: "" },
  },
  data() {
    return {
      dragOver: false,
      dragDepth: 0,
    };
  },
  computed: {
    nodeIcon() {
      if (this.node.type === "component") return "vue";
      if (this.isRoot && this.isComponentSheet) return "vue";
      return "folder";
    },
    nodeLabel() {
      if (this.node.type === "component") return this.node.componentName;
      if (this.isRoot && this.isComponentSheet) return this.componentName;
      if (this.isRoot) return "Screen root";
      return `<${this.node.tag}>`;
    },
  },
  methods: {
    insertKey(parentId, index) {
      return `${parentId}:${index}`;
    },
    isInsertActive(parentId, index) {
      return this.activeInsert === this.insertKey(parentId, index);
    },
    setInsertTarget(parentId, index) {
      this.$emit("drag-state", { activeInsert: this.insertKey(parentId, index) });
    },
    clearInsertTarget(parentId, index) {
      if (this.activeInsert === this.insertKey(parentId, index)) {
        this.$emit("drag-state", { activeInsert: "" });
      }
    },
    onDragStart(event) {
      if (this.isRoot) return;
      setSheetMoveDragData(event, this.node.id);
      this.$emit("drag-state", { draggingNodeId: this.node.id, activeInsert: "" });
    },
    onDragEnd() {
      this.$emit("drag-state", { draggingNodeId: "", activeInsert: "" });
    },
    onContainerDragEnter() {
      this.dragDepth += 1;
      this.dragOver = true;
    },
    onContainerDragOver(event) {
      event.dataTransfer.dropEffect = this.getDropEffect(event);
    },
    onContainerDragLeave() {
      this.dragDepth = Math.max(0, this.dragDepth - 1);
      if (this.dragDepth === 0) this.dragOver = false;
    },
    getDropEffect(event) {
      const payload = parseSheetDragPayload(event);
      return payload?.kind === "move" ? "move" : "copy";
    },
    emitDrop({ parentId, payload, index = null }) {
      this.$emit("drop-node", { parentId, payload, index });
    },
    onContainerDrop(event) {
      this.dragDepth = 0;
      this.dragOver = false;
      const payload = parseSheetDragPayload(event);
      if (!payload) return;
      this.emitDrop({
        parentId: this.node.id,
        payload,
        index: this.node.children?.length ?? 0,
      });
    },
    onInsertDrop(parentId, index, event) {
      const payload = parseSheetDragPayload(event);
      if (!payload) return;
      this.$emit("drag-state", { draggingNodeId: "", activeInsert: "" });
      this.emitDrop({ parentId, payload, index });
    },
  },
};
</script>

<style scoped>
.screen-canvas-node {
  border: 1px dashed var(--vibe-border-strong);
  border-radius: var(--vibe-radius-lg);
  padding: 10px;
  margin: 8px;
  background: var(--vibe-panel-bg);
  transition: border-color 0.15s ease, background 0.15s ease, opacity 0.15s ease;
  cursor: pointer;
}

.screen-canvas-node--root {
  flex: 1;
  margin: 12px;
  overflow: auto;
  min-height: 120px;
}

.screen-canvas-node--selected {
  border-color: var(--vibe-accent);
  box-shadow: 0 0 0 3px var(--vibe-accent-muted);
}

.screen-canvas-node--dragover {
  background: var(--vibe-accent-muted);
  border-color: var(--vibe-accent);
}

.screen-canvas-node--dragging {
  opacity: 0.45;
}

.screen-canvas-node__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
}

.screen-canvas-node__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.screen-canvas-node:hover .screen-canvas-node__actions,
.screen-canvas-node--selected .screen-canvas-node__actions {
  opacity: 1;
}

.screen-canvas-node__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: var(--vibe-radius-sm);
  background: transparent;
  color: var(--vibe-text-muted);
  cursor: pointer;
  padding: 0;
}

.screen-canvas-node__action svg {
  width: 12px;
  height: 12px;
}

.screen-canvas-node__action:hover {
  background: var(--vibe-accent-muted);
  color: var(--vibe-accent);
}

.screen-canvas-node__action--danger:hover {
  background: rgba(220, 53, 69, 0.12);
  color: #dc3545;
}

.screen-canvas-node__header--draggable {
  cursor: grab;
}

.screen-canvas-node__header--draggable:active {
  cursor: grabbing;
}

.screen-canvas-node__grip {
  color: var(--vibe-text-subtle);
  font-size: 10px;
  letter-spacing: -2px;
  user-select: none;
  flex-shrink: 0;
}

.screen-canvas-node__label {
  font-weight: 600;
  color: var(--vibe-accent);
}

.screen-canvas-node__path {
  font-size: 10px;
  color: var(--vibe-text-subtle);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.screen-canvas-node__empty {
  padding: 16px;
  text-align: center;
  font-size: 11px;
  color: var(--vibe-text-subtle);
  border: 1px dashed var(--vibe-border);
  border-radius: var(--vibe-radius-sm);
}

.screen-canvas-node__children {
  padding-left: 8px;
  border-left: 2px solid var(--vibe-border);
}

.screen-canvas-node__insert-zone {
  height: 6px;
  margin: 2px 0;
  border-radius: 999px;
  transition: height 0.12s ease, background 0.12s ease, margin 0.12s ease;
}

.screen-canvas-node__insert-zone--active {
  height: 10px;
  margin: 6px 0;
  background: var(--vibe-accent);
  box-shadow: 0 0 0 3px var(--vibe-accent-muted);
}
</style>
