<template>
  <div class="vibe-code-editor">
    <div v-if="showTab && filePath" class="vibe-code-editor__tab">
      <span class="vibe-code-editor__filename">{{ fileName }}</span>
      <span v-if="dirty" class="vibe-code-editor__dirty">●</span>
    </div>
    <div v-if="!filePath" class="vibe-empty-state">
      <div class="vibe-empty-state__title">No file selected</div>
      <div class="vibe-empty-state__hint">
        Select a file from the project tree to edit. Press <kbd>⌘S</kbd> to save.
      </div>
    </div>
    <monaco-editor
      v-else
      :key="filePath"
      v-model="localContent"
      class="vibe-code-editor__monaco"
      :language="language"
      :options="monacoOptions"
      @change="onChange"
    />
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import { getLanguageForPath } from "../services/vibeProjectApi";

export default {
  name: "VibeCodeEditor",
  components: { MonacoEditor },
  props: {
    filePath: { type: String, default: "" },
    content: { type: String, default: "" },
    dirty: { type: Boolean, default: false },
    showTab: { type: Boolean, default: true },
  },
  data() {
    return {
      localContent: this.content,
      monacoOptions: {
        lineNumbers: "on",
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 13,
        fontFamily: "Menlo, Monaco, 'Courier New', monospace",
        scrollBeyondLastLine: false,
        renderLineHighlight: "line",
        padding: { top: 8 },
        tabSize: 2,
      },
    };
  },
  computed: {
    fileName() {
      return this.filePath ? this.filePath.split("/").pop() : "";
    },
    language() {
      return getLanguageForPath(this.filePath);
    },
  },
  watch: {
    content(val) {
      this.localContent = val;
    },
    filePath() {
      this.localContent = this.content;
    },
  },
  methods: {
    onChange() {
      this.$emit("change", this.localContent);
    },
  },
};
</script>

<style scoped>
.vibe-code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.vibe-code-editor__tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  flex-shrink: 0;
}

.vibe-code-editor__filename {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: var(--vibe-radius-pill);
  background: var(--vibe-accent-muted);
  font-size: 12px;
  font-weight: 600;
  color: var(--vibe-accent);
}

.vibe-code-editor__dirty {
  color: var(--vibe-accent-secondary);
  font-size: 10px;
}

.vibe-code-editor__monaco {
  flex: 1;
  min-height: 0;
  margin: 0 12px 12px;
  border-radius: var(--vibe-radius-lg);
  overflow: hidden;
  background: var(--vibe-bg-soft);
}
</style>
