<template>
  <div class="vibe-alert" :class="`vibe-alert--${variant}`" role="alert">
    <div class="vibe-alert__content">
      <strong v-if="title" class="vibe-alert__title">{{ title }}</strong>
      <p class="vibe-alert__message">{{ message }}</p>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="vibe-alert__close"
      aria-label="Dismiss"
      @click="$emit('dismiss')"
    >
      ×
    </button>
  </div>
</template>

<script>
export default {
  name: "VibeAlert",
  props: {
    title: { type: String, default: "" },
    message: { type: String, default: "Something happened." },
    variant: {
      type: String,
      default: "info",
      validator: (v) => ["info", "success", "warning", "error"].includes(v),
    },
    dismissible: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.vibe-alert {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.5;
}

.vibe-alert--info {
  background: rgba(15, 38, 74, 0.06);
  color: #0f264a;
}

.vibe-alert--success {
  background: #ecfdf5;
  color: #065f46;
}

.vibe-alert--warning {
  background: #fffbeb;
  color: #92400e;
}

.vibe-alert--error {
  background: rgba(197, 48, 48, 0.08);
  color: #9b2c2c;
}

.vibe-alert__title {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
}

.vibe-alert__message {
  margin: 0;
}

.vibe-alert__close {
  border: none;
  background: none;
  font-size: 20px;
  line-height: 1;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  padding: 0 4px;
}

.vibe-alert__close:hover {
  opacity: 1;
}
</style>
