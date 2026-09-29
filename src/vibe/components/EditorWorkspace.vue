<template>
  <div class="editor-workspace">
    <div class="editor-workspace__header vibe-panel-header">
      <div class="editor-workspace__meta">
        <span v-if="filePath" class="editor-workspace__file">{{ fileName }}</span>
        <span v-if="dirty" class="editor-workspace__dirty" title="Unsaved changes">●</span>
      </div>

      <div class="editor-workspace__toggle">
        <button
          class="vibe-btn ghost"
          :class="{ active: mode === 'code' }"
          @click="$emit('update:mode', 'code')"
        >
          Code
        </button>
        <button
          v-if="canUseSheet"
          class="vibe-btn ghost"
          :class="{ active: mode === 'sheet' }"
          @click="$emit('update:mode', 'sheet')"
        >
          Hoja
        </button>
        <button
          class="vibe-btn ghost editor-workspace__tab editor-workspace__tab--ai"
          :class="{ active: mode === 'ai' }"
          title="AI Assistant"
          @click="$emit('update:mode', 'ai')"
        >
          <svg
            class="editor-workspace__tab-icon"
            viewBox="0 0 132 132"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M64.2526 56.8326L60.1595 60.9257L18.7605 102.325C15.7465 105.339 15.7465 110.226 18.7605 113.24C21.7746 116.254 26.6613 116.254 29.6754 113.24L71.0743 71.8405M60.1595 60.9257L71.0743 71.8405M71.0743 71.8405L75.1674 67.7474M64.2526 56.8326L64.4864 56.5983C66.6182 54.4672 70.0733 54.4672 72.2045 56.5983L75.4017 59.7955C77.5329 61.9267 77.5329 65.3818 75.4017 67.5131L75.1674 67.7474M64.2526 56.8326L75.1674 67.7474"
              stroke="currentColor"
              stroke-width="8.25"
              stroke-linejoin="round"
            />
            <path
              d="M100.307 17.4189C100.879 16.1937 102.621 16.1937 103.193 17.4189L105.348 22.0356C106.296 24.069 107.931 25.7035 109.964 26.6525L114.581 28.8071C115.806 29.3789 115.806 31.1211 114.581 31.6929L109.964 33.8475C107.931 34.7965 106.296 36.431 105.348 38.4644L103.193 43.0811C102.621 44.3063 100.879 44.3063 100.307 43.0811L98.1524 38.4644C97.2037 36.431 95.5691 34.7965 93.5357 33.8475L88.919 31.6929C87.6936 31.1211 87.6936 29.3789 88.919 28.8071L93.5357 26.6525C95.5691 25.7035 97.2037 24.069 98.1524 22.0356L100.307 17.4189Z"
              stroke="currentColor"
              stroke-width="8.25"
              stroke-linejoin="round"
            />
            <path
              d="M100.307 77.919C100.879 76.6936 102.621 76.6936 103.193 77.919L105.348 82.5358C106.296 84.5691 107.931 86.2037 109.964 87.1524L114.581 89.3073C115.806 89.8788 115.806 91.6212 114.581 92.1927L109.964 94.3476C107.931 95.2963 106.296 96.9309 105.348 98.9642L103.193 103.581C102.621 104.806 100.879 104.806 100.307 103.581L98.1524 98.9642C97.2037 96.9309 95.5691 95.2963 93.5357 94.3476L88.919 92.1927C87.6936 91.6212 87.6936 89.8788 88.919 89.3073L93.5357 87.1524C95.5691 86.2037 97.2037 84.5691 98.1524 82.5358L100.307 77.919Z"
              stroke="currentColor"
              stroke-width="8.25"
              stroke-linejoin="round"
            />
            <path
              d="M39.8071 17.4189C40.3789 16.1937 42.1211 16.1937 42.6929 17.4189L44.8475 22.0356C45.7965 24.069 47.431 25.7035 49.4644 26.6525L54.0811 28.8071C55.3063 29.3789 55.3063 31.1211 54.0811 31.6929L49.4644 33.8475C47.431 34.7965 45.7965 36.431 44.8475 38.4644L42.6929 43.0811C42.1211 44.3063 40.3789 44.3063 39.8071 43.0811L37.6525 38.4644C36.7035 36.431 35.069 34.7965 33.0356 33.8475L28.4189 31.6929C27.1937 31.1211 27.1937 29.3789 28.4189 28.8071L33.0356 26.6525C35.069 25.7035 36.7035 24.069 37.6525 22.0356L39.8071 17.4189Z"
              stroke="currentColor"
              stroke-width="8.25"
              stroke-linejoin="round"
            />
          </svg>
          <span>AI</span>
        </button>
      </div>
    </div>

    <div class="editor-workspace__body">
      <vibe-code-editor
        v-if="mode === 'code' || (mode === 'sheet' && !canUseSheet)"
        :file-path="filePath"
        :content="content"
        :dirty="dirty"
        :show-tab="false"
        @change="$emit('change', $event)"
      />
      <screen-sheet-editor
        v-else-if="mode === 'sheet' && screenModel"
        :model="screenModel"
        :selected-node-id="selectedNodeId"
        @select-node="$emit('select-node', $event)"
        @drop-node="$emit('drop-node', $event)"
        @update-props="$emit('update-props', $event)"
        @update-attrs="$emit('update-attrs', $event)"
        @remove-node="$emit('remove-node', $event)"
        @duplicate-node="$emit('duplicate-node', $event)"
      />
      <div
        v-else-if="mode === 'sheet' && canUseSheet"
        class="editor-workspace__sheet-loading vibe-empty-state"
      >
        <div class="vibe-empty-state__title">Preparing sheet editor...</div>
      </div>
      <vibe-ai-panel
        v-else-if="mode === 'ai'"
        embedded
        :active-file="filePath"
        :active-file-content="content"
        :editor-mode="aiContextMode"
        :preview-error="previewError"
        :selected-scenario-file="selectedScenarioFile"
        :on-apply-edits="onApplyEdits"
      />
    </div>
  </div>
</template>

<script>
import VibeCodeEditor from "./VibeCodeEditor.vue";
import ScreenSheetEditor from "./ScreenSheetEditor.vue";
import VibeAiPanel from "./VibeAiPanel.vue";
import { isSheetFile } from "../services/vibeScreenParser";

export default {
  name: "EditorWorkspace",
  components: { VibeCodeEditor, ScreenSheetEditor, VibeAiPanel },
  props: {
    filePath: { type: String, default: "" },
    content: { type: String, default: "" },
    dirty: { type: Boolean, default: false },
    previewError: { type: String, default: null },
    mode: {
      type: String,
      default: "code",
      validator: (v) => ["code", "sheet", "ai"].includes(v),
    },
    screenModel: { type: Object, default: null },
    selectedNodeId: { type: String, default: "" },
    selectedScenarioFile: { type: String, default: "tests/scenarios.yaml" },
    onApplyEdits: { type: Function, default: null },
  },
  computed: {
    fileName() {
      return this.filePath ? this.filePath.split("/").pop() : "";
    },
    canUseSheet() {
      return isSheetFile(this.filePath);
    },
    aiContextMode() {
      if (this.canUseSheet && this.screenModel) return "sheet";
      return "code";
    },
  },
};
</script>

<style scoped>
.editor-workspace {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.editor-workspace__header {
  gap: 12px;
}

.editor-workspace__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.editor-workspace__file {
  font-size: 12px;
  font-weight: 600;
  color: var(--vibe-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editor-workspace__dirty {
  color: var(--vibe-accent-secondary);
  font-size: 10px;
  flex-shrink: 0;
}

.editor-workspace__toggle {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.editor-workspace__tab {
  gap: 6px;
}

.editor-workspace__tab-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.editor-workspace__tab--ai {
  color: var(--vibe-accent);
  background: var(--vibe-accent-muted);
  border-color: transparent;
  font-weight: 600;
}

.editor-workspace__tab--ai:hover:not(:disabled) {
  background: rgba(15, 38, 74, 0.12);
  transform: none;
}

.editor-workspace__tab--ai.active {
  background: var(--vibe-accent);
  border-color: transparent;
  color: var(--vibe-accent-on);
  box-shadow: 0 4px 14px rgba(15, 38, 74, 0.18);
}

.editor-workspace__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.editor-workspace__sheet-loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
