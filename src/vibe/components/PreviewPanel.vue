<template>
  <div class="preview-panel">
    <div class="preview-panel__header vibe-panel-header">
      <div class="vibe-panel-title-row">
        <span class="preview-panel__title vibe-panel-title">Preview</span>
        <span
          v-if="runState === 'compiling'"
          class="vibe-inline-spinner"
          role="status"
          aria-label="Compiling preview"
        />
      </div>
      <div class="preview-panel__controls">
        <button
          class="vibe-btn ghost preview-panel__device-btn"
          :class="{ active: device === 'desktop' }"
          title="Desktop"
          aria-label="Desktop preview"
          @click="device = 'desktop'"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect
              x="1.75"
              y="2.5"
              width="12.5"
              height="8.5"
              rx="1.25"
              stroke="currentColor"
              stroke-width="1.25"
            />
            <path
              d="M6 13.5h4"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
            />
            <path
              d="M8 11v2.5"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <button
          class="vibe-btn ghost preview-panel__device-btn"
          :class="{ active: device === 'mobile' }"
          title="Mobile"
          aria-label="Mobile preview"
          @click="device = 'mobile'"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect
              x="4.75"
              y="1.75"
              width="6.5"
              height="12.5"
              rx="1.25"
              stroke="currentColor"
              stroke-width="1.25"
            />
            <circle cx="8" cy="12.25" r="0.75" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <div class="preview-panel__body">
      <div v-if="showIdleState" class="vibe-empty-state">
        <div class="vibe-empty-state__title">No preview yet</div>
        <div class="vibe-empty-state__hint">
          Select a <strong>.vue</strong> file or click <strong>Run</strong> to preview.
        </div>
      </div>

      <div v-else-if="showErrorOnly" class="preview-panel__error">
        <div class="preview-panel__error-title">Compilation error</div>
        <pre class="preview-panel__error-message">{{ error }}</pre>
      </div>

      <div
        v-else
        class="preview-panel__frame"
        :class="[
          `preview-panel__frame--${device}`,
          { 'preview-panel__frame--compiling': runState === 'compiling' },
        ]"
      >
        <div ref="previewMount" class="preview-panel__mount" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { injectPreviewStyles } from "../services/vibeSfcRuntime";

export default {
  name: "PreviewPanel",
  props: {
    component: { type: [Object, Function], default: null },
    error: { type: String, default: null },
    runState: { type: String, default: "idle" },
    previewKey: { type: Number, default: 0 },
  },
  data() {
    return {
      device: "desktop",
      previewInstance: null,
      removeStyles: null,
    };
  },
  computed: {
    showIdleState() {
      return this.runState === "idle" && !this.component;
    },
    showErrorOnly() {
      return !!this.error && !this.component;
    },
  },
  watch: {
    component() {
      this.scheduleMount();
    },
    previewKey() {
      this.scheduleMount();
    },
    runState(val) {
      if (val === "success") {
        this.scheduleMount();
      }
    },
    error(val) {
      if (val) this.destroyPreview();
    },
  },
  beforeDestroy() {
    this.destroyPreview();
  },
  methods: {
    scheduleMount() {
      this.$nextTick(() => this.mountPreview());
    },
    mountPreview() {
      this.destroyPreview();
      if (!this.component || this.error) return;

      const mountEl = this.$refs.previewMount;
      if (!mountEl) return;

      const Component = this.component;
      const scopeId = `preview-${this.previewKey}-${Date.now()}`;
      this.removeStyles = injectPreviewStyles(Component, scopeId);

      this.previewInstance = new Vue({
        render(h) {
          return h(Component);
        },
      });
      this.previewInstance.$mount();
      mountEl.appendChild(this.previewInstance.$el);
    },
    destroyPreview() {
      if (this.removeStyles) {
        this.removeStyles();
        this.removeStyles = null;
      }
      if (this.previewInstance) {
        this.previewInstance.$destroy();
        if (this.previewInstance.$el?.parentNode) {
          this.previewInstance.$el.parentNode.removeChild(this.previewInstance.$el);
        }
        this.previewInstance = null;
      }
    },
    getPreviewRoot() {
      return this.previewInstance?.$el || null;
    },
    getPreviewVm() {
      return this.previewInstance?.$children?.[0] || null;
    },
  },
};
</script>

<style scoped>
.preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.preview-panel__header {
  flex-shrink: 0;
}

.preview-panel__title {
  /* uses vibe-panel-title */
}

.preview-panel__controls {
  display: flex;
  gap: 4px;
}

.preview-panel__device-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
}

.preview-panel__device-btn svg {
  width: 16px;
  height: 16px;
  display: block;
}

.preview-panel__body {
  flex: 1;
  overflow: auto;
  background: var(--vibe-bg-soft);
  margin: 0 12px 12px;
  border-radius: var(--vibe-radius-lg);
}

.preview-panel__error {
  padding: 16px;
}

.preview-panel__error-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--vibe-error);
  margin-bottom: 8px;
}

.preview-panel__error-message {
  font-size: 11px;
  font-family: Menlo, Monaco, monospace;
  color: var(--vibe-text);
  background: var(--vibe-error-bg);
  border: none;
  border-radius: var(--vibe-radius);
  padding: 14px;
  overflow: auto;
  white-space: pre-wrap;
  margin: 0;
}

.preview-panel__frame {
  padding: 16px;
  min-height: 100%;
}

.preview-panel__frame--mobile .preview-panel__mount {
  max-width: 375px;
  margin: 0 auto;
  border: none;
  border-radius: var(--vibe-radius-xl);
  overflow: hidden;
  background: #fff;
  box-shadow: var(--vibe-shadow-sm);
}

.preview-panel__frame--compiling .preview-panel__mount {
  opacity: 0.72;
  pointer-events: none;
}

.preview-panel__mount {
  background: #fff;
  min-height: 200px;
  border-radius: var(--vibe-radius-lg);
}
</style>
