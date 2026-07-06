<template>
  <div class="file-tree-panel">
    <div class="file-tree-panel__header vibe-panel-header">
      <div class="vibe-panel-title-row">
        <span class="file-tree-panel__title vibe-panel-title">Project</span>
        <span
          v-if="loading"
          class="vibe-inline-spinner"
          role="status"
          aria-label="Loading project files"
        />
      </div>
      <div class="file-tree-panel__actions">
        <button
          class="vibe-btn ghost"
          title="Refresh"
          :disabled="loading"
          @click="loadTree"
        >
          ↻
        </button>
      </div>
    </div>

    <div v-if="error && !tree.length" class="file-tree-panel__error">{{ error }}</div>
    <div v-else class="file-tree-panel__body">
      <div v-if="sheetDragEnabled" class="file-tree-panel__sheet-palette">
        <span class="file-tree-panel__sheet-label">Layout</span>
        <div
          v-for="item in layoutItems"
          :key="item.id"
          class="file-tree-panel__sheet-item"
          draggable="true"
          @dragstart="onLayoutDragStart($event, item.payload)"
        >
          <file-type-icon icon-type="folder" />
          <span>{{ item.label }}</span>
        </div>
      </div>

      <div v-if="tree.length === 0" class="file-tree-panel__empty">
        No files yet
      </div>
      <div v-else class="file-tree-panel__tree">
        <file-tree-node
          v-for="node in tree"
          :key="node.path"
          :node="node"
          :selected-path="selectedPath"
          :sheet-drag-enabled="sheetDragEnabled"
          :used-screen-paths="usedScreenPaths"
          :force-expanded="isForceExpanded(node)"
          @select="$emit('select', $event)"
          @context-menu="showContextMenu"
          @create-file="createInDirectory"
          @create-folder="createSubfolder"
          @move-node="moveNode"
        />
      </div>
    </div>

    <div
      v-if="contextMenu.visible"
      class="file-tree-panel__context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      @click.stop
    >
      <template v-if="contextMenu.node?.type === 'directory' && contextMenuKind">
        <button @click="createInDirectory({ parentPath: contextMenu.node.path, kind: contextMenuKind })">
          {{ createFileLabel }}
        </button>
        <button @click="createSubfolder({ parentPath: contextMenu.node.path })">
          New folder
        </button>
      </template>
      <template v-if="canManageContextNode">
        <button @click="renameNode">Rename</button>
        <button @click="duplicateNode">Duplicate</button>
        <button @click="moveNodeToFolder">Move to folder...</button>
      </template>
      <button
        v-if="contextMenu.node && !isProtectedNode(contextMenu.node)"
        class="file-tree-panel__context-delete"
        @click="deleteSelected"
      >
        Delete
      </button>
    </div>
    <div class="file-tree-panel__help">
      <template v-if="sheetDragEnabled">
        Arrastrá <strong>Layout</strong> o <strong>components/*.vue</strong> a la Hoja ·
        <strong>Shift+drag</strong> para mover archivos ·
        Click derecho para renombrar/duplicar
      </template>
      <template v-else>
        <kbd>⌘S</kbd> Save · Arrastrá archivos a carpetas · Click derecho para renombrar/duplicar
      </template>
    </div>
  </div>
</template>

<script>
import FileTreeNode from "./FileTreeNode.vue";
import FileTypeIcon from "./FileTypeIcon.vue";
import {
  fetchTree,
  createDirectory,
  deletePath,
  saveFile,
  fetchFile,
  movePath,
  duplicatePath,
} from "../services/vibeProjectApi";
import {
  buildNewFilePath,
  buildNewFolderPath,
  getCreateActionLabel,
  getCreateContentForPath,
  getCreatePrompt,
  getCreatableDirectoryKind,
  isProtectedDirectory,
} from "../services/vibeProjectCreate";
import {
  buildMovePath,
  buildRenamedPath,
  buildUniqueDuplicatePath,
  canManageNode,
  flattenTreePaths,
  getManagedRoot,
  normalizeProjectPath,
  updateVueComponentName,
} from "../services/vibeProjectFileOps";
import { SHEET_LAYOUT_ITEMS, setSheetDragData } from "../services/vibeSheetDrag";

export default {
  name: "FileTreePanel",
  components: { FileTreeNode, FileTypeIcon },
  props: {
    selectedPath: { type: String, default: "" },
    sheetDragEnabled: { type: Boolean, default: false },
    usedScreenPaths: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tree: [],
      loading: false,
      error: null,
      contextMenu: { visible: false, x: 0, y: 0, node: null },
      layoutItems: SHEET_LAYOUT_ITEMS,
    };
  },
  computed: {
    contextMenuKind() {
      const node = this.contextMenu.node;
      if (!node || node.type !== "directory") return null;
      return getCreatableDirectoryKind(node.path);
    },
    createFileLabel() {
      return getCreateActionLabel(this.contextMenuKind);
    },
    canManageContextNode() {
      return canManageNode(this.contextMenu.node);
    },
  },
  mounted() {
    this.loadTree();
    document.addEventListener("click", this.hideContextMenu);
    window.addEventListener("focus", this.loadTree);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.hideContextMenu);
    window.removeEventListener("focus", this.loadTree);
  },
  methods: {
    async loadTree() {
      this.loading = true;
      if (!this.tree.length) {
        this.error = null;
      }
      try {
        const { tree } = await fetchTree();
        this.tree = tree;
        this.error = null;
      } catch (err) {
        if (!this.tree.length) {
          this.error = err.message;
        }
      } finally {
        this.loading = false;
      }
    },
    refresh() {
      return this.loadTree();
    },
    isForceExpanded(node) {
      if (node.type !== "directory") return false;
      if (["components", "screens", "tests"].includes(node.path)) return true;
      if (!this.selectedPath) return false;
      return this.selectedPath.startsWith(`${node.path}/`);
    },
    isProtectedNode(node) {
      return node.type === "directory" && isProtectedDirectory(node.path);
    },
    async createInDirectory({ parentPath, kind }) {
      this.hideContextMenu();
      const name = window.prompt(getCreatePrompt(kind));
      if (!name) return;

      const filePath = buildNewFilePath(parentPath, kind, name);
      if (!filePath) {
        window.alert("Invalid name. Use letters and numbers.");
        return;
      }

      try {
        const content = getCreateContentForPath(filePath, kind);
        await saveFile(filePath, content);
        await this.loadTree();
        this.$emit("select", { path: filePath, initialContent: content });
      } catch (err) {
        window.alert(err.message);
      }
    },
    async createSubfolder({ parentPath }) {
      this.hideContextMenu();
      const name = window.prompt("Folder name:");
      if (!name) return;

      const folderPath = buildNewFolderPath(parentPath, name);
      if (!folderPath) {
        window.alert("Invalid folder name.");
        return;
      }

      try {
        await createDirectory(folderPath);
        await this.loadTree();
      } catch (err) {
        window.alert(err.message);
      }
    },
    showContextMenu({ event, node }) {
      this.contextMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        node,
      };
    },
    hideContextMenu() {
      this.contextMenu.visible = false;
    },
    onLayoutDragStart(event, payload) {
      setSheetDragData(event, payload);
    },
    async deleteSelected() {
      const { node } = this.contextMenu;
      if (!node || this.isProtectedNode(node)) return;
      if (!window.confirm(`Delete ${node.path}?`)) return;
      try {
        await deletePath(node.path);
        this.hideContextMenu();
        await this.loadTree();
        this.emitPathChange(node.path, null, "delete");
        if (this.selectedPath === node.path || this.selectedPath.startsWith(`${node.path}/`)) {
          this.$emit("select", "");
        }
      } catch (err) {
        window.alert(err.message);
      }
    },
    async renameNode() {
      const { node } = this.contextMenu;
      if (!node || !canManageNode(node)) return;

      const newName = window.prompt("New name:", node.name);
      this.hideContextMenu();
      if (!newName || newName.trim() === node.name) return;

      const parent = node.path.split("/").slice(0, -1).join("/");
      const newPath =
        node.type === "directory"
          ? buildNewFolderPath(parent, newName)
          : buildRenamedPath(node.path, newName);

      if (!newPath) {
        window.alert("Invalid name.");
        return;
      }

      await this.moveNode({ from: node.path, to: newPath, select: true });
    },
    async duplicateNode() {
      const { node } = this.contextMenu;
      if (!node || !canManageNode(node)) return;
      this.hideContextMenu();

      try {
        const existingPaths = flattenTreePaths(this.tree);
        const targetPath = buildUniqueDuplicatePath(node.path, existingPaths);
        const result = await duplicatePath(node.path, targetPath);
        await this.patchVueNameIfNeeded(result.path);
        await this.loadTree();
        if (node.type === "file") {
          this.$emit("select", result.path);
        }
        this.emitPathChange(node.path, result.path, "duplicate");
      } catch (err) {
        window.alert(err.message);
      }
    },
    async moveNodeToFolder() {
      const { node } = this.contextMenu;
      if (!node || !canManageNode(node)) return;

      const root = getManagedRoot(node.path);
      const suggestion = root || "screens";
      const targetDir = window.prompt(
        `Move into folder (e.g. ${suggestion}/my-folder):`,
        node.path.split("/").slice(0, -1).join("/")
      );
      this.hideContextMenu();
      if (!targetDir) return;

      const destination = buildMovePath(node.path, targetDir.trim());
      if (!destination) {
        window.alert("Invalid destination folder.");
        return;
      }

      await this.moveNode({ from: node.path, to: destination, select: true });
    },
    async moveNode({ from, to, select = false }) {
      if (!from || !to || from === to) return;

      try {
        await movePath(from, to);
        await this.patchVueNameIfNeeded(to);
        await this.loadTree();
        this.emitPathChange(from, to, "move");
        if (select) {
          this.$emit("select", to);
        } else if (
          this.selectedPath === from ||
          this.selectedPath.startsWith(`${from}/`)
        ) {
          const updated =
            this.selectedPath === from
              ? to
              : this.selectedPath.replace(`${from}/`, `${to}/`);
          this.$emit("select", updated);
        }
      } catch (err) {
        window.alert(err.message);
      }
    },
    async patchVueNameIfNeeded(filePath) {
      if (!/\.vue$/i.test(filePath)) return;

      try {
        const { content } = await fetchFile(filePath);
        const patched = updateVueComponentName(content, filePath);
        if (patched !== content) {
          await saveFile(filePath, patched);
        }
      } catch {
        // non-blocking
      }
    },
    emitPathChange(from, to, action) {
      this.$emit("path-changed", {
        from: normalizeProjectPath(from),
        to: to ? normalizeProjectPath(to) : null,
        action,
      });
    },
  },
};
</script>

<style scoped>
.file-tree-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.file-tree-panel__header {
  flex-shrink: 0;
}

.file-tree-panel__actions {
  display: flex;
  gap: 4px;
}

.file-tree-panel__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-tree-panel__sheet-palette {
  flex-shrink: 0;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--vibe-border);
}

.file-tree-panel__sheet-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vibe-accent-soft);
  margin-bottom: 6px;
  padding: 0 4px;
}

.file-tree-panel__sheet-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  margin: 2px 0;
  border-radius: var(--vibe-radius-sm);
  font-size: 12px;
  color: var(--vibe-text);
  cursor: grab;
  user-select: none;
  transition: background 0.15s ease;
}

.file-tree-panel__sheet-item:hover {
  background: var(--vibe-accent-muted);
}

.file-tree-panel__sheet-item:active {
  cursor: grabbing;
}

.file-tree-panel__tree {
  flex: 1;
  overflow-y: auto;
  padding: 6px 10px 10px;
}

.file-tree-panel__error,
.file-tree-panel__empty {
  padding: 20px 16px;
  font-size: 12px;
  color: var(--vibe-text-muted);
}

.file-tree-panel__error {
  color: var(--vibe-error);
}

.file-tree-panel__context-menu {
  position: fixed;
  z-index: 1000;
  background: var(--vibe-panel-bg);
  border: 1px solid var(--vibe-border);
  border-radius: var(--vibe-radius-lg);
  box-shadow: var(--vibe-shadow-lg);
  padding: 6px;
  min-width: 160px;
}

.file-tree-panel__context-menu button {
  display: block;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: none;
  text-align: left;
  font-size: 12px;
  cursor: pointer;
  border-radius: var(--vibe-radius-sm);
  color: var(--vibe-text);
}

.file-tree-panel__context-menu button:hover {
  background: var(--vibe-accent-muted);
}

.file-tree-panel__context-delete {
  color: var(--vibe-error) !important;
}

.file-tree-panel__context-delete:hover {
  background: var(--vibe-error-bg) !important;
}

.file-tree-panel__help {
  padding: 12px 16px;
  margin: 0 10px 10px;
  border-radius: var(--vibe-radius-lg);
  background: var(--vibe-bg-soft);
  font-size: 10px;
  color: var(--vibe-text-subtle);
  line-height: 1.5;
  flex-shrink: 0;
}

.file-tree-panel__help kbd {
  display: inline-block;
  padding: 2px 7px;
  border: none;
  border-radius: var(--vibe-radius-pill);
  background: var(--vibe-accent-muted);
  color: var(--vibe-accent);
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
}
</style>
