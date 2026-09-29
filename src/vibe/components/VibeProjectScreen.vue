<template>
  <div class="vibe-project-screen">
    <component :is="resolvedComponent" v-if="resolvedComponent" />
    <div v-else-if="error" class="vibe-project-screen__error">
      {{ error }}
    </div>
    <div v-else-if="loading" class="vibe-project-screen__loading">
      Loading Vibe screen...
    </div>
  </div>
</template>

<script>
import {
  getCachedVibeScreenComponent,
  resolveVibeScreenComponent,
} from "../services/vibeProjectScreenLoader";
import { injectPreviewStyles } from "../services/vibeSfcRuntime";

export default {
  name: "VibeProjectScreen",
  props: {
    screenPath: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      resolvedComponent: null,
      error: null,
      loading: false,
      loadToken: 0,
      removeStyles: null,
    };
  },
  watch: {
    screenPath: {
      immediate: true,
      handler: "loadScreen",
    },
  },
  mounted() {
    this.onCacheInvalidated = (event) => {
      const path = String(event?.detail?.screenPath || "").replace(/^\.\//, "");
      if (path && path === this.styleScopeId().replace(/^classic-/, "")) {
        this.loadScreen();
      }
    };
    window.addEventListener("vibe-screen-cache-invalidated", this.onCacheInvalidated);
  },
  beforeDestroy() {
    window.removeEventListener("vibe-screen-cache-invalidated", this.onCacheInvalidated);
    this.clearStyles();
  },
  methods: {
    styleScopeId() {
      const path = String(this.screenPath || "").replace(/^\.\//, "");
      return `classic-${path}`;
    },
    clearStyles() {
      if (this.removeStyles) {
        this.removeStyles();
        this.removeStyles = null;
      }
    },
    applyStyles(component) {
      this.clearStyles();
      if (!component) return;
      this.removeStyles = injectPreviewStyles(component, this.styleScopeId());
    },
    async loadScreen() {
      const token = ++this.loadToken;

      if (!this.screenPath) {
        this.resolvedComponent = null;
        this.error = "No screen path configured";
        this.loading = false;
        this.clearStyles();
        return;
      }

      const cached = getCachedVibeScreenComponent(this.screenPath);
      if (cached) {
        if (token !== this.loadToken) return;
        this.resolvedComponent = cached;
        this.applyStyles(cached);
        this.error = null;
        this.loading = false;
        return;
      }

      this.resolvedComponent = null;
      this.error = null;
      this.loading = true;

      try {
        const { component, error } = await resolveVibeScreenComponent(this.screenPath);
        if (token !== this.loadToken) return;

        if (error || !component) {
          this.error = error || "Failed to load Vibe screen";
          this.resolvedComponent = null;
          this.clearStyles();
          return;
        }

        this.resolvedComponent = component;
        this.applyStyles(component);
      } catch (err) {
        if (token !== this.loadToken) return;
        this.error = err.message || String(err);
        this.resolvedComponent = null;
        this.clearStyles();
      } finally {
        if (token === this.loadToken) {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.vibe-project-screen__error {
  padding: 12px;
  color: #b42318;
  background: #fef3f2;
  border: 1px solid #fecdca;
  border-radius: 6px;
  font-size: 13px;
}

.vibe-project-screen__loading {
  padding: 12px;
  color: #667085;
  font-size: 13px;
}
</style>
