<template>
  <div class="screen-sheet-editor">
    <section class="screen-sheet-editor__canvas-wrap">
      <div class="screen-sheet-editor__canvas-header">
        <span class="vibe-panel-title">{{ canvasTitle }}</span>
        <span class="screen-sheet-editor__screen-name">{{ screenName }}</span>
      </div>
      <screen-canvas-node
        :node="model.root"
        :selected-id="selectedNodeId"
        :dragging-node-id="draggingNodeId"
        :active-insert="activeInsert"
        :is-root="true"
        :is-component-sheet="isComponentSheet"
        :component-name="screenName"
        @select="$emit('select-node', $event)"
        @drop-node="onDropNode"
        @drag-state="onDragState"
        @remove-node="$emit('remove-node', $event)"
        @duplicate-node="$emit('duplicate-node', $event)"
      />
    </section>

    <screen-properties-panel
      :node="selectedNode"
      :is-component-sheet="isComponentSheet"
      @update-props="onUpdateProps"
      @update-attrs="onUpdateAttrs"
      @remove="onRemoveSelected"
    />
  </div>
</template>

<script>
import ScreenCanvasNode from "./ScreenCanvasNode.vue";
import ScreenPropertiesPanel from "./ScreenPropertiesPanel.vue";

export default {
  name: "ScreenSheetEditor",
  components: { ScreenCanvasNode, ScreenPropertiesPanel },
  props: {
    model: { type: Object, required: true },
    selectedNodeId: { type: String, default: "" },
  },
  data() {
    return {
      draggingNodeId: "",
      activeInsert: "",
    };
  },
  computed: {
    screenName() {
      return this.model.screenName || "Screen";
    },
    canvasTitle() {
      return this.isComponentSheet ? "Component" : "Screen";
    },
    isComponentSheet() {
      return !!this.model.isComponentSheet;
    },
    selectedNode() {
      if (!this.selectedNodeId) return null;
      if (this.isComponentSheet && this.selectedNodeId === this.model.root.id) {
        return {
          id: this.model.root.id,
          type: "component",
          componentPath: this.model.screenPath,
          componentName: this.model.screenName,
          props: { ...(this.model.componentProps || {}) },
          isComponentRoot: true,
        };
      }
      if (this.selectedNodeId === this.model.root.id) return this.model.root;
      return this.findNode(this.model.root, this.selectedNodeId);
    },
  },
  methods: {
    onDragState({ draggingNodeId = "", activeInsert = "" } = {}) {
      if (draggingNodeId !== undefined) {
        this.draggingNodeId = draggingNodeId;
      }
      if (activeInsert !== undefined) {
        this.activeInsert = activeInsert;
      }
    },
    onDropNode(event) {
      this.draggingNodeId = "";
      this.activeInsert = "";
      this.$emit("drop-node", event);
    },
    onUpdateProps(props) {
      this.$emit("update-props", { nodeId: this.selectedNodeId, props });
    },
    onUpdateAttrs(attrs) {
      this.$emit("update-attrs", { nodeId: this.selectedNodeId, attrs });
    },
    onRemoveSelected() {
      this.$emit("remove-node", this.selectedNodeId);
    },
    findNode(node, id) {
      if (node.id === id) return node;
      for (const child of node.children || []) {
        const found = this.findNode(child, id);
        if (found) return found;
      }
      return null;
    },
  },
};
</script>

<style scoped>
.screen-sheet-editor {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.screen-sheet-editor__canvas-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.screen-sheet-editor__canvas-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vibe-border);
  flex-shrink: 0;
}

.screen-sheet-editor__screen-name {
  font-size: 11px;
  color: var(--vibe-text-subtle);
}
</style>
