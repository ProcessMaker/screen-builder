<template>
  <div
    class="vibe-screen-builder vibe-shell"
    :class="resizeShellClass"
  >
    <div ref="workspace" class="vibe-workspace">
      <vibe-toolbar
        class="vibe-float-panel"
        :run-state="runState"
        :can-save="dirty && !!activeFile"
        :can-use-screen="canUseScreen"
        :show-preview="showPreview"
        :show-sidebar="showSidebar"
        :show-editor="showEditor"
        :show-tests="!testsCollapsed"
        @run="handleRun"
        @save="handleSave"
        @import="openImport"
        @export="openExport"
        @toggle-preview="showPreview = !showPreview"
        @toggle-sidebar="showSidebar = !showSidebar"
        @toggle-editor="showEditor = !showEditor"
        @toggle-tests="testsCollapsed = !testsCollapsed"
        @switch-mode="$emit('switch-mode', $event)"
        @use-screen="handleUseScreen"
      />

      <div ref="mainRow" class="vibe-main">
        <aside
          v-show="showSidebar"
          class="vibe-sidebar vibe-float-panel"
          :style="{ width: `${sidebarWidth}px` }"
        >
          <file-tree-panel
            ref="fileTree"
            :selected-path="activeFile"
            :sheet-drag-enabled="sheetDragEnabled"
            :used-screen-paths="usedScreenPaths"
            @select="onProjectFileSelect"
            @path-changed="onProjectPathChanged"
          />
        </aside>

        <panel-resize-handle
          v-if="showSidebar && (showEditor || showPreview)"
          direction="horizontal"
          :active="activeResize === 'sidebar'"
          @resize-start="startResize('sidebar', $event)"
        />

        <div v-show="showEditor" class="vibe-editor-column">
          <div class="vibe-editor-column__workspace vibe-float-panel">
            <editor-workspace
              :file-path="activeFile"
              :content="fileContent"
              :dirty="dirty"
              :preview-error="previewError"
              :mode.sync="editorMode"
              :screen-model="screenModel"
              :selected-node-id="selectedNodeId"
              :selected-scenario-file="scenarioFilePath"
              @change="onContentChange"
              @select-node="selectedNodeId = $event"
              @drop-node="onSheetDrop"
              @update-props="onSheetUpdateProps"
              @update-attrs="onSheetUpdateAttrs"
              @remove-node="onSheetRemoveNode"
              @duplicate-node="onSheetDuplicateNode"
              :on-apply-edits="handleAiEdits"
            />
          </div>
        </div>

        <panel-resize-handle
          v-if="showPreview && (showEditor || showSidebar)"
          direction="horizontal"
          :active="activeResize === 'preview'"
          @resize-start="startResize('preview', $event)"
        />

        <aside
          v-show="showPreview"
          class="vibe-preview vibe-float-panel"
          :class="{ 'vibe-preview--full': previewFullWidth }"
          :style="previewPanelStyle"
        >
          <preview-panel
            ref="previewPanel"
            :component="previewComponent"
            :error="previewError"
            :run-state="runState"
            :preview-key="previewRunKey"
          />
        </aside>
      </div>

      <panel-resize-handle
        v-if="!testsCollapsed"
        direction="vertical"
        :active="activeResize === 'tests'"
        @resize-start="startResize('tests', $event)"
      />

      <div
        class="vibe-tests-drawer vibe-float-panel"
        :class="{ 'vibe-tests-drawer--collapsed': testsCollapsed }"
        :style="testsDrawerStyle"
      >
        <test-scenarios-panel
          :scenarios="testScenarios"
          :scenario-file-path="scenarioFilePath"
          :scenario-files="scenarioFiles"
          :collapsed="testsCollapsed"
          :has-preview="!!previewComponent && !previewError"
          :get-preview-root="getPreviewRoot"
          :get-preview-vm="getPreviewVm"
          @toggle-collapse="testsCollapsed = !testsCollapsed"
          @select-scenario-file="setScenarioFile"
          @edit-scenario-file="openScenarioFile"
        />
      </div>
    </div>

    <import-export-modal
      :visible="modalVisible"
      :mode="modalMode"
      @close="modalVisible = false"
      @imported="onImported"
    />
  </div>
</template>

<script>
import VibeToolbar from "./components/VibeToolbar.vue";
import FileTreePanel from "./components/FileTreePanel.vue";
import EditorWorkspace from "./components/EditorWorkspace.vue";
import PreviewPanel from "./components/PreviewPanel.vue";
import TestScenariosPanel from "./components/TestScenariosPanel.vue";
import ImportExportModal from "./components/ImportExportModal.vue";
import PanelResizeHandle from "./components/PanelResizeHandle.vue";
import { fetchFile, saveFile, fetchTree, cacheFileContent, invalidateFileContentCache } from "./services/vibeProjectApi";
import { ensureVueFileContent } from "./services/vibeProjectCreate";
import { invalidateVibeScreenRuntimeCache, cacheVibeScreenComponent } from "./services/vibeProjectScreenLoader";
import { invalidateComponentPropSchema } from "./services/vibeComponentProps";
import { applyAiEdits } from "./services/vibeAiService";
import { compileEntry, compileVueFile } from "./services/vibeCompiler";
import { parseScenarios } from "./services/vibeTestRunner";
import { generateVueSfc, patchComponentPropsInSource } from "./services/vibeScreenCodegen";
import {
  patchComponentUsageProps,
  patchContainerTagAttrs,
  extractPreservedBlocks,
  syncImportedVueComponentsInSource,
} from "./services/vibeSfcPatch";
import { parseVueToScreenModel, isScreenFile, isSheetFile } from "./services/vibeScreenParser";
import { pickPrimaryEditPath } from "./services/vibeAiPrompt";
import {
  DEFAULT_SCENARIO_PATH,
  isScenarioFilePath,
  listScenarioFilesFromTree,
  loadScenarioPreferences,
  saveScenarioPreferences,
} from "./services/vibeScenarioPreferences";
import {
  addNode,
  createNodeFromPayload,
  duplicateNode,
  findNode,
  insertNode,
  moveNode,
  removeNode,
  updateNodeAttrs,
  updateNodeProps,
} from "./services/vibeScreenModel";
import {
  clamp,
  loadPanelSizes,
  savePanelSizes,
  PANEL_LIMITS,
} from "./services/panelSizes";
import "./styles/vibe-layout.scss";

const DEFAULT_SCENARIOS_PATH = DEFAULT_SCENARIO_PATH;
const PREVIEW_CACHE_LIMIT = 40;

export default {
  name: "VibeScreenBuilder",
  components: {
    VibeToolbar,
    FileTreePanel,
    EditorWorkspace,
    PreviewPanel,
    TestScenariosPanel,
    ImportExportModal,
    PanelResizeHandle,
  },
  props: {
    usedScreenPaths: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const sizes = loadPanelSizes();
    const scenarioPrefs = loadScenarioPreferences();
    return {
      activeFile: "",
      fileContent: "",
      savedContent: "",
      showPreview: true,
      showSidebar: true,
      showEditor: true,
      testsCollapsed: true,
      editorMode: "code",
      screenModel: null,
      selectedNodeId: "",
      previewTimer: null,
      lastPreviewCompileKey: "",
      runState: "idle",
      previewComponent: null,
      previewError: null,
      previewRunKey: 0,
      testScenarios: [],
      scenarioFilePath: scenarioPrefs.scenarioFilePath,
      scenarioFiles: [DEFAULT_SCENARIOS_PATH],
      modalVisible: false,
      modalMode: "import",
      sidebarWidth: sizes.sidebarWidth,
      previewWidth: sizes.previewWidth,
      testsHeight: sizes.testsHeight,
      activeResize: null,
      resizeStart: null,
    };
  },
  computed: {
    dirty() {
      return this.fileContent !== this.savedContent;
    },
    resizeShellClass() {
      return {
        "vibe-shell--resizing": !!this.activeResize,
        "vibe-shell--resizing-vertical": this.activeResize === "tests",
      };
    },
    testsDrawerStyle() {
      if (this.testsCollapsed) return {};
      return { height: `${this.testsHeight}px` };
    },
    sheetDragEnabled() {
      return this.editorMode === "sheet" && isSheetFile(this.activeFile);
    },
    previewFullWidth() {
      return this.showPreview && !this.showEditor && !this.showSidebar;
    },
    previewPanelStyle() {
      if (!this.showPreview || this.previewFullWidth) return {};
      return { width: `${this.previewWidth}px` };
    },
    canUseScreen() {
      return isScreenFile(this.activeFile);
    },
  },
  watch: {
    editorMode(mode) {
      this.$refs.fileTree?.refresh();
      if (mode === "sheet" && isSheetFile(this.activeFile)) {
        this.initScreenModel();
        this.requestPreview(this.activeFile, this.fileContent);
      }
    },
  },
  created() {
    this.previewCompileCache = new Map();
  },
  mounted() {
    invalidateFileContentCache();
    this.refreshScenarioFiles().then(() => this.loadScenarios());
    document.addEventListener("keydown", this.handleKeydown);
    this.openFile("screens/MainScreen.vue");
    this.$nextTick(() => this.$refs.fileTree?.refresh());
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeydown);
    this.stopResize();
    if (this.previewTimer) clearTimeout(this.previewTimer);
  },
  methods: {
    handleKeydown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        this.handleSave();
      }
    },
    startResize(panel, { clientX, clientY }) {
      this.activeResize = panel;
      this.resizeStart = {
        clientX,
        clientY,
        sidebarWidth: this.sidebarWidth,
        previewWidth: this.previewWidth,
        testsHeight: this.testsHeight,
      };
      document.addEventListener("mousemove", this.onResizeMove);
      document.addEventListener("mouseup", this.stopResize);
      document.body.style.userSelect = "none";
      document.body.style.cursor =
        panel === "tests" ? "row-resize" : "col-resize";
    },
    onResizeMove(event) {
      if (!this.resizeStart) return;

      const dx = event.clientX - this.resizeStart.clientX;
      const dy = event.clientY - this.resizeStart.clientY;
      const mainWidth = this.$refs.mainRow?.clientWidth || window.innerWidth;
      const maxPreview = Math.max(
        PANEL_LIMITS.preview.min,
        Math.floor(mainWidth * 0.65)
      );

      if (this.activeResize === "sidebar") {
        this.sidebarWidth = clamp(
          this.resizeStart.sidebarWidth + dx,
          PANEL_LIMITS.sidebar.min,
          PANEL_LIMITS.sidebar.max
        );
      } else if (this.activeResize === "preview") {
        this.previewWidth = clamp(
          this.resizeStart.previewWidth - dx,
          PANEL_LIMITS.preview.min,
          maxPreview
        );
      } else if (this.activeResize === "tests") {
        this.testsHeight = clamp(
          this.resizeStart.testsHeight - dy,
          PANEL_LIMITS.tests.min,
          PANEL_LIMITS.tests.max
        );
      }
    },
    stopResize() {
      if (!this.activeResize) return;

      document.removeEventListener("mousemove", this.onResizeMove);
      document.removeEventListener("mouseup", this.stopResize);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      savePanelSizes({
        sidebarWidth: this.sidebarWidth,
        previewWidth: this.previewWidth,
        testsHeight: this.testsHeight,
      });

      this.activeResize = null;
      this.resizeStart = null;
    },
    handleUseScreen() {
      if (!this.canUseScreen) return;
      this.prepareScreenForClassicUse().then((ready) => {
        if (ready) {
          this.$emit("use-screen", this.activeFile);
        }
      });
    },
    async prepareScreenForClassicUse() {
      if (this.dirty) {
        await this.handleSave();
      }

      const compileKey = this.buildPreviewCompileKey(this.activeFile, this.fileContent);
      let component = this.previewComponent;

      if (!component || this.lastPreviewCompileKey !== compileKey || this.runState !== "success") {
        await this.previewVueFile(this.activeFile, this.fileContent);
        component = this.previewComponent;
      }

      if (!component) {
        window.alert("No se pudo compilar el screen para usar en Classic Builder.");
        return false;
      }

      cacheVibeScreenComponent(this.activeFile, this.fileContent, component);
      return true;
    },
    onProjectFileSelect(target) {
      if (!target) {
        this.openFile("");
        return;
      }
      if (typeof target === "string") {
        this.openFile(target);
        return;
      }
      this.openFile(target.path, { initialContent: target.initialContent });
    },
    onProjectPathChanged({ from, to, action }) {
      if (!from) return;

      invalidateFileContentCache(from);
      if (to) invalidateFileContentCache(to);
      invalidateComponentPropSchema(from);
      if (to) invalidateComponentPropSchema(to);

      if (from.startsWith("screens/") && from.endsWith(".vue")) {
        invalidateVibeScreenRuntimeCache(from);
      }
      if (to?.startsWith("screens/") && to.endsWith(".vue")) {
        invalidateVibeScreenRuntimeCache(to);
      }

      if (!this.activeFile) return;

      if (action === "delete") {
        if (this.activeFile === from || this.activeFile.startsWith(`${from}/`)) {
          this.openFile("", { skipDirtyCheck: true });
        }
        return;
      }

      if (this.activeFile === from) {
        this.activeFile = to;
        if (this.screenModel) {
          this.screenModel.screenPath = to;
        }
        return;
      }

      if (this.activeFile.startsWith(`${from}/`) && to) {
        this.activeFile = this.activeFile.replace(`${from}/`, `${to}/`);
        if (this.screenModel && this.screenModel.screenPath?.startsWith(`${from}/`)) {
          this.screenModel.screenPath = this.screenModel.screenPath.replace(
            `${from}/`,
            `${to}/`
          );
        }
      }
    },
    async openFile(path, { skipDirtyCheck = false, initialContent = null } = {}) {
      if (!path) {
        this.activeFile = "";
        this.fileContent = "";
        this.savedContent = "";
        this.screenModel = null;
        return;
      }

      if (path === this.activeFile && !this.dirty && initialContent === null) {
        return;
      }

      if (!skipDirtyCheck && this.dirty && this.activeFile) {
        const save = window.confirm("Save changes before switching files?");
        if (save) await this.handleSave();
      }

      try {
        let fetchedContent = initialContent;
        if (fetchedContent === null) {
          const { content } = await fetchFile(path);
          fetchedContent = content;
        }

        const content = ensureVueFileContent(path, fetchedContent);
        const scaffolded = content !== fetchedContent;

        if (scaffolded) {
          await saveFile(path, content);
          invalidateComponentPropSchema(path);
        }

        this.activeFile = path;
        this.fileContent = content;
        this.savedContent = content;

        if (this.editorMode === "sheet" && !isSheetFile(path)) {
          this.editorMode = "code";
        }

        if (isSheetFile(path)) {
          this.initScreenModel();
        } else {
          this.screenModel = null;
          this.selectedNodeId = "";
        }

        if (path.toLowerCase().endsWith(".vue")) {
          await this.requestPreview(path, content, { force: true });
        }

        if (isScenarioFilePath(path)) {
          this.setScenarioFile(path, { reload: true });
        }
      } catch (err) {
        window.alert(err.message);
      }
    },
    buildPreviewCompileKey(filePath, sourceContent = null) {
      const content =
        sourceContent !== null
          ? sourceContent
          : filePath === this.activeFile
            ? this.fileContent
            : "";
      return `${filePath}\0${content}`;
    },
    getCachedPreview(compileKey) {
      return this.previewCompileCache.get(compileKey) || null;
    },
    storePreviewCache(compileKey, result) {
      if (!this.previewCompileCache.has(compileKey) && this.previewCompileCache.size >= PREVIEW_CACHE_LIMIT) {
        const oldestKey = this.previewCompileCache.keys().next().value;
        this.previewCompileCache.delete(oldestKey);
      }
      this.previewCompileCache.set(compileKey, result);
    },
    clearPreviewCache() {
      this.previewCompileCache.clear();
      this.lastPreviewCompileKey = "";
    },
    applyPreviewResult(compileKey, { component, error }, { remount = true } = {}) {
      if (error) {
        this.previewError = error;
        this.previewComponent = null;
        this.runState = "error";
      } else {
        this.previewError = null;
        this.previewComponent = component;
        this.runState = "success";
        if (remount) {
          this.previewRunKey += 1;
        }
        if (component && isScreenFile(this.activeFile)) {
          const separatorIndex = compileKey.indexOf("\0");
          const content =
            separatorIndex === -1 ? this.fileContent : compileKey.slice(separatorIndex + 1);
          cacheVibeScreenComponent(this.activeFile, content, component);
        }
      }
      this.lastPreviewCompileKey = compileKey;
    },
    requestPreview(filePath, sourceContent = null, { debounce = 0, force = false } = {}) {
      if (this.previewTimer) {
        clearTimeout(this.previewTimer);
        this.previewTimer = null;
      }

      const run = () => {
        this.previewTimer = null;
        this.previewVueFile(filePath, sourceContent, { force });
      };

      if (debounce > 0) {
        this.previewTimer = setTimeout(run, debounce);
        return;
      }

      return run();
    },
    onContentChange(content) {
      this.fileContent = content;
      if (this.activeFile) {
        cacheFileContent(this.activeFile, content);
      }
      if (
        this.editorMode === "code" &&
        this.activeFile?.toLowerCase().endsWith(".vue")
      ) {
        this.requestPreview(this.activeFile, content, { debounce: 350 });
      }
    },
    initScreenModel() {
      if (!isSheetFile(this.activeFile)) {
        this.screenModel = null;
        this.selectedNodeId = "";
        return;
      }
      this.screenModel = parseVueToScreenModel(this.activeFile, this.fileContent);
      this.selectedNodeId = this.screenModel.root.id;
    },
    syncSheetToCode({ preview = false, mode = "full" } = {}) {
      if (!this.screenModel) return;

      if (mode === "component-props-root" && this.screenModel.isComponentSheet) {
        this.fileContent = patchComponentPropsInSource(
          this.fileContent,
          this.screenModel.componentProps,
          this.screenModel.script?.props
        );
      } else if (mode === "structural") {
        this.fileContent = generateVueSfc(this.screenModel, { structural: true });
        this.refreshPreservedBlocks();
      } else if (this.screenModel.preservedTemplate) {
        // Non-structural edits keep the original template/script/styles intact.
        return;
      } else {
        this.fileContent = generateVueSfc(this.screenModel);
      }

      if (this.activeFile) {
        cacheFileContent(this.activeFile, this.fileContent);
      }

      if (preview) {
        this.requestPreview(this.activeFile, this.fileContent, { debounce: 350 });
      }
    },
    refreshPreservedBlocks() {
      const preserved = extractPreservedBlocks(this.fileContent);
      if (!this.screenModel) return;
      this.screenModel.preservedTemplate = preserved.template;
      this.screenModel.preservedScript = preserved.script;
      this.screenModel.preservedStyles = preserved.styles;
    },
    patchSheetNodeProps(nodeId, props) {
      const found = findNode(this.screenModel.root, nodeId);
      const node = found?.node;
      if (!node) return false;

      if (node.type === "component") {
        this.fileContent = patchComponentUsageProps(
          this.fileContent,
          node.componentName,
          node.templateTagIndex || 0,
          props
        );
      }
      updateNodeProps(this.screenModel, nodeId, props);
      this.refreshPreservedBlocks();
      return true;
    },
    patchSheetNodeAttrs(nodeId, attrs) {
      const found = findNode(this.screenModel.root, nodeId);
      const node = found?.node;
      if (!node || node.type !== "container") return false;

      if (nodeId === this.screenModel.root.id) {
        this.screenModel.root.attrs = { ...attrs };
      } else {
        updateNodeAttrs(this.screenModel, nodeId, attrs);
      }

      this.fileContent = patchContainerTagAttrs(
        this.fileContent,
        node.tag,
        node.templateTagIndex || 0,
        attrs
      );
      this.refreshPreservedBlocks();
      return true;
    },
    onSheetDrop({ parentId, payload, index = null }) {
      if (payload?.kind === "move" && payload.nodeId) {
        this.onSheetMove({ nodeId: payload.nodeId, parentId, index });
        return;
      }

      this.ensureComponentFileReady(payload).then(() => {
        const node = createNodeFromPayload(payload);
        if (!node || !this.screenModel) return;

        if (index === null || index === undefined) {
          addNode(this.screenModel, parentId, node);
        } else {
          insertNode(this.screenModel, parentId, node, index);
        }

        this.selectedNodeId = node.id;
        this.syncSheetToCode({ preview: true, mode: "structural" });
      });
    },
    onSheetMove({ nodeId, parentId, index = null }) {
      if (!this.screenModel || !nodeId || nodeId === parentId) return;
      if (moveNode(this.screenModel, nodeId, parentId, index)) {
        this.selectedNodeId = nodeId;
        this.syncSheetToCode({ preview: true, mode: "structural" });
      }
    },
    async ensureComponentFileReady(payload) {
      if (payload?.kind !== "component" || !payload.path) return;

      try {
        let content = "";
        try {
          const result = await fetchFile(payload.path);
          content = result.content;
        } catch (err) {
          if (!/not found/i.test(err.message)) {
            throw err;
          }
        }

        const scaffoldedContent = ensureVueFileContent(payload.path, content);
        cacheFileContent(payload.path, scaffoldedContent);

        if (!content || scaffoldedContent !== content) {
          await saveFile(payload.path, scaffoldedContent);
          invalidateComponentPropSchema(payload.path);
          await this.$refs.fileTree?.refresh();
        }
      } catch (err) {
        window.alert(err.message);
      }
    },
    onSheetUpdateProps({ nodeId, props }) {
      if (!this.screenModel) return;
      if (this.screenModel.isComponentSheet && nodeId === this.screenModel.root.id) {
        this.screenModel.componentProps = { ...props };
        this.syncSheetToCode({ preview: true, mode: "component-props-root" });
        return;
      }

      if (this.patchSheetNodeProps(nodeId, props)) {
        this.requestPreview(this.activeFile, this.fileContent, { debounce: 350 });
        return;
      }

      updateNodeProps(this.screenModel, nodeId, props);
      this.syncSheetToCode({ preview: true, mode: "structural" });
    },
    onSheetUpdateAttrs({ nodeId, attrs }) {
      if (!this.screenModel) return;

      if (this.patchSheetNodeAttrs(nodeId, attrs)) {
        this.requestPreview(this.activeFile, this.fileContent, { debounce: 350 });
        return;
      }

      updateNodeAttrs(this.screenModel, nodeId, attrs);
      this.syncSheetToCode({ preview: true, mode: "structural" });
    },
    onSheetRemoveNode(nodeId) {
      if (!this.screenModel) return;
      if (removeNode(this.screenModel, nodeId)) {
        this.selectedNodeId = this.screenModel.root.id;
        this.syncSheetToCode({ preview: true, mode: "structural" });
      }
    },
    onSheetDuplicateNode(nodeId) {
      if (!this.screenModel) return;
      const clone = duplicateNode(this.screenModel, nodeId);
      if (clone) {
        this.selectedNodeId = clone.id;
        this.syncSheetToCode({ preview: true, mode: "structural" });
      }
    },
    async handleSave() {
      if (!this.activeFile) return;

      if (this.editorMode === "sheet" && this.screenModel && isSheetFile(this.activeFile)) {
        this.syncSheetToCode({ preview: false, mode: "structural" });
      }

      if (!this.dirty) return;

      try {
        let contentToSave = this.fileContent;
        if (this.activeFile.toLowerCase().endsWith(".vue")) {
          const synced = syncImportedVueComponentsInSource(contentToSave);
          if (synced !== contentToSave) {
            contentToSave = synced;
            this.fileContent = synced;
            cacheFileContent(this.activeFile, synced);
          }
        }

        await saveFile(this.activeFile, contentToSave);
        this.savedContent = contentToSave;
        if (this.activeFile.startsWith("screens/") && this.activeFile.endsWith(".vue")) {
          invalidateVibeScreenRuntimeCache(this.activeFile);
        }
        if (isScenarioFilePath(this.activeFile)) {
          this.loadScenariosFromContent(contentToSave);
        }
      } catch (err) {
        window.alert(err.message);
      }
    },
    async previewVueFile(filePath, sourceContent = null, { force = false } = {}) {
      const compileKey = this.buildPreviewCompileKey(filePath, sourceContent);

      if (
        !force &&
        compileKey === this.lastPreviewCompileKey &&
        this.runState === "success" &&
        this.previewComponent
      ) {
        return;
      }

      const cached = !force ? this.getCachedPreview(compileKey) : null;
      if (cached) {
        this.applyPreviewResult(compileKey, cached);
        return;
      }

      this.runState = "compiling";
      this.previewError = null;

      const result = await compileVueFile(filePath, sourceContent);
      this.storePreviewCache(compileKey, result);
      this.applyPreviewResult(compileKey, result);
    },
    async handleRun() {
      if (this.dirty && this.activeFile) {
        await this.handleSave();
      }

      if (this.activeFile?.toLowerCase().endsWith(".vue")) {
        const source =
          this.editorMode === "sheet" && isSheetFile(this.activeFile)
            ? this.fileContent
            : null;
        await this.previewVueFile(this.activeFile, source, { force: true });
      } else {
        this.runState = "compiling";
        this.previewError = null;
        this.lastPreviewCompileKey = "";

        const { component, error } = await compileEntry();

        if (error) {
          this.previewError = error;
          this.runState = "error";
        } else {
          this.previewComponent = component;
          this.previewRunKey += 1;
          this.runState = "success";
        }
      }

      await this.loadScenarios();
    },
    async refreshScenarioFiles() {
      try {
        const { tree } = await fetchTree();
        this.scenarioFiles = listScenarioFilesFromTree(tree);
      } catch {
        this.scenarioFiles = [DEFAULT_SCENARIOS_PATH];
      }

      if (!this.scenarioFiles.includes(this.scenarioFilePath)) {
        this.scenarioFilePath =
          this.scenarioFiles.find((path) => path === DEFAULT_SCENARIOS_PATH) ||
          this.scenarioFiles[0] ||
          DEFAULT_SCENARIOS_PATH;
        saveScenarioPreferences({ scenarioFilePath: this.scenarioFilePath });
      }
    },
    async setScenarioFile(path, { reload = true } = {}) {
      if (!isScenarioFilePath(path)) return;
      this.scenarioFilePath = path;
      saveScenarioPreferences({ scenarioFilePath: path });
      if (reload) {
        await this.loadScenarios();
      }
    },
    openScenarioFile(path) {
      if (!isScenarioFilePath(path)) return;
      this.openFile(path);
    },
    async loadScenarios() {
      try {
        const { content } = await fetchFile(this.scenarioFilePath);
        this.loadScenariosFromContent(content);
      } catch {
        this.testScenarios = [];
      }
    },
    loadScenariosFromContent(content) {
      try {
        this.testScenarios = parseScenarios(content);
      } catch {
        this.testScenarios = [];
      }
    },
    openImport() {
      this.modalMode = "import";
      this.modalVisible = true;
    },
    openExport() {
      this.modalMode = "export";
      this.modalVisible = true;
    },
    async onImported() {
      this.clearPreviewCache();
      await this.$refs.fileTree.refresh();
      await this.refreshScenarioFiles();
      await this.loadScenarios();
      await this.handleRun();
    },
    getPreviewRoot() {
      return this.$refs.previewPanel?.getPreviewRoot();
    },
    getPreviewVm() {
      return this.$refs.previewPanel?.getPreviewVm();
    },
    async handleAiEdits(edits, { switchToCode = true } = {}) {
      if (!edits?.length) return;

      try {
        this.clearPreviewCache();
        await applyAiEdits(edits, saveFile);

        const openPath = pickPrimaryEditPath(edits, this.activeFile);
        const openEdit = edits.find((e) => e.path === openPath);

        if (openPath) {
          this.activeFile = openPath;
          if (openEdit) {
            this.fileContent = openEdit.content;
            this.savedContent = openEdit.content;
          } else {
            const { content } = await fetchFile(openPath);
            this.fileContent = content;
            this.savedContent = content;
          }
        } else if (this.activeFile) {
          const activeEdit = edits.find((e) => e.path === this.activeFile);
          if (activeEdit) {
            this.fileContent = activeEdit.content;
            this.savedContent = activeEdit.content;
          } else {
            const { content } = await fetchFile(this.activeFile);
            this.fileContent = content;
            this.savedContent = content;
          }
        }

        edits.forEach((edit) => {
          if (isSheetFile(edit.path) && edit.path === this.activeFile) {
            this.initScreenModel();
          }
          if (edit.path.startsWith("components/") && edit.path.endsWith(".vue")) {
            invalidateComponentPropSchema(edit.path);
          }
        });

        await this.$refs.fileTree?.refresh();

        const scenarioEdits = edits.filter((e) => isScenarioFilePath(e.path));
        if (scenarioEdits.length) {
          scenarioEdits.forEach((edit) => {
            if (!this.scenarioFiles.includes(edit.path)) {
              this.scenarioFiles.push(edit.path);
            }
          });
          this.scenarioFiles.sort((a, b) => a.localeCompare(b));
          await this.refreshScenarioFiles();
          const primaryScenario = scenarioEdits[scenarioEdits.length - 1].path;
          await this.setScenarioFile(primaryScenario);
          this.testsCollapsed = false;
        } else {
          const activeScenarioEdit = edits.find((e) => e.path === this.scenarioFilePath);
          if (activeScenarioEdit) {
            this.loadScenariosFromContent(activeScenarioEdit.content);
          }
        }

        if (switchToCode) {
          this.editorMode = "code";
        } else if (isSheetFile(this.activeFile)) {
          this.initScreenModel();
        }

        if (this.activeFile?.toLowerCase().endsWith(".vue")) {
          await this.previewVueFile(this.activeFile, this.fileContent, { force: true });
        } else {
          await this.handleRun();
        }
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.vibe-screen-builder {
  height: 100%;
}
</style>
