<template>
  <div v-if="visible" class="import-export-modal">
    <div class="import-export-modal__backdrop" @click="$emit('close')" />
    <div class="import-export-modal__dialog">
      <div class="import-export-modal__header">
        <h3>{{ mode === "import" ? "Import Project" : "Export Project" }}</h3>
        <button class="vibe-btn ghost" @click="$emit('close')">✕</button>
      </div>

      <div class="import-export-modal__body">
        <template v-if="mode === 'import'">
          <p class="import-export-modal__hint">
            Upload a ZIP file containing your vibe-project files (screens/, components/, index.js).
          </p>
          <input
            ref="fileInput"
            type="file"
            accept=".zip"
            @change="onFileSelected"
          />
          <p v-if="error" class="import-export-modal__error">{{ error }}</p>
          <p v-if="success" class="import-export-modal__success">{{ success }}</p>
        </template>

        <template v-else>
          <p class="import-export-modal__hint">
            Export all files from vibe-project/ as a ZIP archive.
          </p>
          <p v-if="error" class="import-export-modal__error">{{ error }}</p>
        </template>
      </div>

      <div class="import-export-modal__footer">
        <button class="vibe-btn" @click="$emit('close')">Cancel</button>
        <button
          v-if="mode === 'export'"
          class="vibe-btn primary"
          :disabled="loading"
          @click="doExport"
        >
          {{ loading ? "Exporting..." : "Download ZIP" }}
        </button>
        <button
          v-if="mode === 'import'"
          class="vibe-btn primary"
          :disabled="loading || !selectedFile"
          @click="doImport"
        >
          {{ loading ? "Importing..." : "Import" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { exportProjectAsZip, importProjectFromZip } from "../services/vibeImportExport";

export default {
  name: "ImportExportModal",
  props: {
    visible: { type: Boolean, default: false },
    mode: { type: String, default: "import" },
  },
  data() {
    return {
      selectedFile: null,
      loading: false,
      error: null,
      success: null,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.selectedFile = null;
        this.error = null;
        this.success = null;
      }
    },
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0] || null;
      this.error = null;
    },
    async doExport() {
      this.loading = true;
      this.error = null;
      try {
        await exportProjectAsZip();
        this.$emit("close");
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async doImport() {
      if (!this.selectedFile) return;
      this.loading = true;
      this.error = null;
      try {
        const count = await importProjectFromZip(this.selectedFile);
        this.success = `Imported ${count} files successfully.`;
        this.$emit("imported");
        setTimeout(() => this.$emit("close"), 800);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.import-export-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.import-export-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(30, 27, 75, 0.35);
  backdrop-filter: blur(6px);
}

.import-export-modal__dialog {
  position: relative;
  width: 440px;
  max-width: 90vw;
  background: var(--vibe-panel-bg);
  border: 1px solid var(--vibe-border);
  border-radius: var(--vibe-radius-xl);
  box-shadow: var(--vibe-shadow-lg);
  font-family: var(--vibe-font);
  overflow: hidden;
}

.import-export-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 12px;
}

.import-export-modal__header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vibe-text);
}

.import-export-modal__body {
  padding: 8px 22px 20px;
}

.import-export-modal__hint {
  font-size: 13px;
  color: var(--vibe-text-muted);
  margin: 0 0 16px;
  line-height: 1.5;
}

.import-export-modal__error {
  color: var(--vibe-error);
  font-size: 12px;
  margin-top: 8px;
}

.import-export-modal__success {
  color: var(--vibe-success);
  font-size: 12px;
  margin-top: 8px;
}

.import-export-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 22px 20px;
}
</style>
