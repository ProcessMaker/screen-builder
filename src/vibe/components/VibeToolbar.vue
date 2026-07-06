<template>
  <div class="vibe-toolbar">
    <div class="vibe-toolbar__left">
      <span class="vibe-toolbar__logo">V</span>
      <div class="vibe-toolbar__brand">
        <span class="vibe-toolbar__title">Vibe</span>
        <span class="vibe-toolbar__subtitle">Screen Builder</span>
      </div>
    </div>

    <div class="vibe-toolbar__center">
      <button
        class="vibe-btn primary"
        :disabled="runState === 'compiling'"
        @click="$emit('run')"
      >
        <span v-if="runState === 'compiling'">Compiling...</span>
        <span v-else>▶ Run</span>
      </button>
      <button
        class="vibe-btn"
        :disabled="!canSave"
        title="Save (⌘S)"
        @click="$emit('save')"
      >
        Save
      </button>
      <button
        class="vibe-btn"
        :disabled="!canUseScreen"
        title="Add this screen to Classic Builder as Vue Component Editor control"
        @click="$emit('use-screen')"
      >
        Use screen
      </button>
      <button class="vibe-btn" @click="$emit('import')">Import</button>
      <button class="vibe-btn" @click="$emit('export')">Export</button>
    </div>

    <div class="vibe-toolbar__right">
      <button
        class="vibe-btn ghost"
        :class="{ active: showEditor }"
        title="Toggle editor panel"
        @click="$emit('toggle-editor')"
      >
        Editor
      </button>
      <button
        class="vibe-btn ghost"
        :class="{ active: showTests }"
        title="Toggle tests panel"
        @click="$emit('toggle-tests')"
      >
        Tests
      </button>
      <button
        class="vibe-btn ghost"
        :class="{ active: showPreview }"
        title="Toggle preview panel"
        @click="$emit('toggle-preview')"
      >
        Preview
      </button>
      <button
        class="vibe-btn ghost"
        :class="{ active: showSidebar }"
        title="Toggle sidebar"
        @click="$emit('toggle-sidebar')"
      >
        Files
      </button>
      <div class="vibe-toolbar__divider" />
      <button class="vibe-btn" @click="$emit('switch-mode', 'classic')">
        Classic Builder
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "VibeToolbar",
  props: {
    runState: { type: String, default: "idle" },
    canSave: { type: Boolean, default: false },
    canUseScreen: { type: Boolean, default: false },
    showPreview: { type: Boolean, default: true },
    showSidebar: { type: Boolean, default: true },
    showEditor: { type: Boolean, default: true },
    showTests: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.vibe-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--vibe-toolbar-height);
  padding: 10px 18px;
  flex-shrink: 0;
  gap: 16px;
}

.vibe-toolbar__left,
.vibe-toolbar__center,
.vibe-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vibe-toolbar__left {
  min-width: 180px;
}

.vibe-toolbar__center {
  flex: 1;
  justify-content: center;
}

.vibe-toolbar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--vibe-radius-pill);
  background: var(--vibe-accent-gradient);
  color: var(--vibe-accent-on);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.03em;
  box-shadow: 0 6px 18px rgba(15, 38, 74, 0.14);
}

.vibe-toolbar__brand {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.vibe-toolbar__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vibe-text);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.vibe-toolbar__subtitle {
  font-size: 11px;
  color: var(--vibe-text-subtle);
  line-height: 1.1;
}

.vibe-toolbar__divider {
  width: 1px;
  height: 24px;
  background: var(--vibe-border-strong);
  margin: 0 4px;
}
</style>
