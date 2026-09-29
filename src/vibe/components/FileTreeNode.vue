<template>
  <div class="file-tree-node">
    <div
      v-if="node.type === 'directory'"
      class="file-tree-node__row file-tree-node__row--dir"
      :class="{
        'file-tree-node__row--creatable': creatableKind,
        'file-tree-node__row--drop-target': dropActive,
        'file-tree-node__row--draggable': canManage,
      }"
      :style="{ paddingLeft: `${depth * 12 + 8}px` }"
      :draggable="canManage"
      @click="toggle"
      @contextmenu.prevent="onContextMenu"
      @dragstart.stop="onFileMoveDragStart"
      @dragend.stop="onFileMoveDragEnd"
      @dragenter.prevent.stop="onFolderDragEnter"
      @dragover.prevent.stop="onFolderDragOver"
      @dragleave.stop="onFolderDragLeave"
      @drop.prevent.stop="onFolderDrop"
    >
      <span class="file-tree-node__chevron" :class="{ open: expanded }">
        <svg viewBox="0 0 12 12" fill="none">
          <path
            d="M4.5 2.5 8 6l-3.5 3.5"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <file-type-icon :icon-type="expanded ? 'folder-open' : 'folder'" />
      <span class="file-tree-node__name">{{ node.name }}</span>
      <div v-if="creatableKind" class="file-tree-node__actions" @click.stop>
        <button
          class="file-tree-node__action"
          :title="createFileLabel"
          @click="createFile"
        >
          +
        </button>
        <button
          class="file-tree-node__action file-tree-node__action--folder"
          title="New folder"
          @click="createFolder"
        >
          dir
        </button>
      </div>
    </div>

    <div
      v-else
      class="file-tree-node__row file-tree-node__row--file"
      :class="{
        active: selectedPath === node.path,
        'file-tree-node__row--draggable': isSheetDraggable || canManage,
      }"
      :style="{ paddingLeft: `${depth * 12 + 8}px` }"
      :draggable="isSheetDraggable || canManage"
      @click="selectFile"
      @contextmenu.prevent="onContextMenu"
      @dragstart="onFileDragStart"
      @dragend="onFileMoveDragEnd"
    >
      <span class="file-tree-node__chevron file-tree-node__chevron--spacer" />
      <file-type-icon :icon-type="fileIconType" />
      <span class="file-tree-node__name">{{ node.name }}</span>
      <span
        v-if="isUsedInClassic"
        class="file-tree-node__used-badge"
        title="Used in Classic Builder"
        aria-label="Used in Classic Builder"
      >
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5.25" fill="currentColor" opacity="0.16" />
          <path
            d="M3.5 6.1 5.2 7.8 8.6 4.4"
            stroke="currentColor"
            stroke-width="1.35"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <template v-if="node.type === 'directory' && expanded">
      <file-tree-node
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
        :selected-path="selectedPath"
        :sheet-drag-enabled="sheetDragEnabled"
        :used-screen-paths="usedScreenPaths"
        :force-expanded="childForceExpanded(child)"
        @select="$emit('select', $event)"
        @context-menu="$emit('context-menu', $event)"
        @create-file="$emit('create-file', $event)"
        @create-folder="$emit('create-folder', $event)"
        @move-node="$emit('move-node', $event)"
      />
    </template>
  </div>
</template>

<script>
import { getFileIcon } from "../services/vibeProjectApi";
import {
  getCreatableDirectoryKind,
  getCreateActionLabel,
} from "../services/vibeProjectCreate";
import {
  buildComponentDragPayload,
  isSheetDraggableComponent,
  setSheetDragData,
} from "../services/vibeSheetDrag";
import {
  buildMovePath,
  canManageNode,
  isDirectoryDropTarget,
} from "../services/vibeProjectFileOps";
import {
  isFileTreeMoveDrag,
  setFileTreeDragData,
} from "../services/vibeFileTreeDrag";
import FileTypeIcon from "./FileTypeIcon.vue";

const EXPANDED_ROOTS = ["components", "screens", "tests"];

export default {
  name: "FileTreeNode",
  components: { FileTypeIcon },
  props: {
    node: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    selectedPath: { type: String, default: "" },
    sheetDragEnabled: { type: Boolean, default: false },
    forceExpanded: { type: Boolean, default: false },
    usedScreenPaths: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expanded: this.forceExpanded || this.depth < 2,
      dropActive: false,
      dropDepth: 0,
    };
  },
  computed: {
    canManage() {
      return canManageNode(this.node);
    },
    fileIconType() {
      return getFileIcon(this.node.path, this.node.type);
    },
    isSheetDraggable() {
      return this.sheetDragEnabled && isSheetDraggableComponent(this.node.path);
    },
    creatableKind() {
      if (this.node.type !== "directory") return null;
      return getCreatableDirectoryKind(this.node.path);
    },
    createFileLabel() {
      return getCreateActionLabel(this.creatableKind);
    },
    isUsedInClassic() {
      if (this.node.type !== "file") return false;
      if (!this.node.path.startsWith("screens/")) return false;
      return this.usedScreenPaths.includes(this.node.path);
    },
  },
  watch: {
    forceExpanded(expanded) {
      if (expanded) this.expanded = true;
    },
    selectedPath(path) {
      if (this.node.type === "directory" && path.startsWith(`${this.node.path}/`)) {
        this.expanded = true;
      }
    },
  },
  methods: {
    childForceExpanded(child) {
      if (child.type !== "directory") return false;
      if (EXPANDED_ROOTS.includes(child.path)) return true;
      if (!this.selectedPath) return false;
      return this.selectedPath.startsWith(`${child.path}/`);
    },
    toggle() {
      this.expanded = !this.expanded;
    },
    selectFile() {
      if (this.selectedPath === this.node.path) return;
      this.$emit("select", this.node.path);
    },
    onContextMenu(event) {
      this.$emit("context-menu", { event, node: this.node });
    },
    onDragStart(event) {
      if (!this.isSheetDraggable) return;
      setSheetDragData(event, buildComponentDragPayload(this.node.path));
    },
    onFileDragStart(event) {
      if (this.isSheetDraggable && !event.shiftKey) {
        this.onDragStart(event);
        return;
      }
      if (!this.canManage) return;
      setFileTreeDragData(event, this.node);
    },
    onFileMoveDragStart(event) {
      if (!this.canManage) return;
      setFileTreeDragData(event, this.node);
    },
    onFileMoveDragEnd() {
      this.dropDepth = 0;
      this.dropActive = false;
    },
    onFolderDragEnter(event) {
      if (!isFileTreeMoveDrag(event)) return;
      this.dropDepth += 1;
      this.dropActive = true;
    },
    onFolderDragOver(event) {
      if (!isFileTreeMoveDrag(event)) return;
      event.dataTransfer.dropEffect = "move";
    },
    onFolderDragLeave() {
      this.dropDepth = Math.max(0, this.dropDepth - 1);
      if (this.dropDepth === 0) this.dropActive = false;
    },
    onFolderDrop(event) {
      this.dropDepth = 0;
      this.dropActive = false;

      const payload = event.dataTransfer?.getData("application/vibe-file-tree");
      if (!payload) return;

      let source;
      try {
        source = JSON.parse(payload);
      } catch {
        return;
      }

      if (!source?.path || !isDirectoryDropTarget(this.node, source.path)) return;

      const destination = buildMovePath(source.path, this.node.path);
      if (!destination || destination === source.path) return;

      this.$emit("move-node", { from: source.path, to: destination });
    },
    createFile() {
      if (!this.creatableKind) return;
      this.$emit("create-file", {
        parentPath: this.node.path,
        kind: this.creatableKind,
      });
    },
    createFolder() {
      if (!this.creatableKind) return;
      this.$emit("create-folder", { parentPath: this.node.path });
    },
  },
};
</script>

<style scoped>
.file-tree-node__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: var(--vibe-text);
  border-radius: var(--vibe-radius-sm);
  margin: 2px 0;
  transition: background 0.15s ease;
}

.file-tree-node__row:hover {
  background: var(--vibe-accent-muted);
}

.file-tree-node__row--creatable:hover .file-tree-node__actions {
  opacity: 1;
}

.file-tree-node__row--file.active {
  background: var(--vibe-accent-muted);
  color: var(--vibe-accent);
  font-weight: 600;
}

.file-tree-node__row--draggable {
  cursor: grab;
}

.file-tree-node__row--draggable:active {
  cursor: grabbing;
}

.file-tree-node__row--drop-target {
  background: var(--vibe-accent-muted);
  box-shadow: inset 0 0 0 2px var(--vibe-accent);
}

.file-tree-node__actions {
  display: flex;
  gap: 2px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.file-tree-node__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: var(--vibe-radius-sm);
  background: var(--vibe-panel-bg);
  color: var(--vibe-text-muted);
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.file-tree-node__action:hover {
  background: var(--vibe-accent-muted);
  color: var(--vibe-accent);
}

.file-tree-node__action--folder {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  width: auto;
  min-width: 22px;
  padding: 0 4px;
}

.file-tree-node__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--vibe-text-subtle);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.file-tree-node__chevron svg {
  width: 12px;
  height: 12px;
}

.file-tree-node__chevron.open {
  transform: rotate(90deg);
}

.file-tree-node__chevron--spacer {
  visibility: hidden;
}

.file-tree-node__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.file-tree-node__used-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--vibe-success);
}

.file-tree-node__used-badge svg {
  width: 14px;
  height: 14px;
  display: block;
}
</style>
