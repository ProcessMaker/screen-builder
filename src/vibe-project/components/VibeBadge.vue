<template>
  <span class="vibe-badge" :class="`vibe-badge--${variant}`">
    {{ label }}
  </span>
</template>

<script>
export default {
  name: "VibeBadge",
  props: {
    label: { type: String, default: "Badge" },
    variant: {
      type: String,
      default: "neutral",
      validator: (v) => ["neutral", "success", "warning", "danger", "accent"].includes(v),
    },
  },
};
</script>

<style scoped>
.vibe-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.vibe-badge--neutral {
  background: rgba(15, 38, 74, 0.08);
  color: #4a5f78;
}

.vibe-badge--success {
  background: #ecfdf5;
  color: #059669;
}

.vibe-badge--warning {
  background: #fffbeb;
  color: #d97706;
}

.vibe-badge--danger {
  background: rgba(197, 48, 48, 0.1);
  color: #c53030;
}

.vibe-badge--accent {
  background: rgba(183, 240, 107, 0.35);
  color: #0f264a;
}
</style>
