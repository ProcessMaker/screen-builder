<template>
  <button
    :type="nativeType"
    class="vibe-button"
    :class="[
      `vibe-button--${variant}`,
      `vibe-button--${size}`,
      { 'vibe-button--block': block, 'vibe-button--disabled': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="icon" class="vibe-button__icon" aria-hidden="true">{{ icon }}</span>
    <span class="vibe-button__label">{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: "VibeButton",
  props: {
    label: { type: String, default: "Button" },
    variant: {
      type: String,
      default: "primary",
      validator: (v) => ["primary", "secondary", "ghost", "danger"].includes(v),
    },
    size: {
      type: String,
      default: "md",
      validator: (v) => ["sm", "md", "lg"].includes(v),
    },
    nativeType: { type: String, default: "button" },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    icon: { type: String, default: "" },
  },
};
</script>

<style scoped>
.vibe-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  font-family: Inter, system-ui, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.vibe-button--sm {
  padding: 8px 14px;
  font-size: 12px;
}

.vibe-button--md {
  padding: 11px 18px;
  font-size: 14px;
}

.vibe-button--lg {
  padding: 14px 22px;
  font-size: 15px;
}

.vibe-button--primary {
  background: linear-gradient(135deg, #1a3a6b 0%, #0f264a 100%);
  color: #fff;
  box-shadow: 0 10px 28px rgba(15, 38, 74, 0.22);
}

.vibe-button--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(15, 38, 74, 0.28);
}

.vibe-button--secondary {
  background: #b7f06b;
  color: #0f264a;
  box-shadow: 0 8px 20px rgba(183, 240, 107, 0.35);
}

.vibe-button--secondary:hover:not(:disabled) {
  transform: translateY(-1px);
}

.vibe-button--ghost {
  background: rgba(15, 38, 74, 0.06);
  color: #0f264a;
}

.vibe-button--ghost:hover:not(:disabled) {
  background: rgba(15, 38, 74, 0.1);
}

.vibe-button--danger {
  background: #c53030;
  color: #fff;
}

.vibe-button--block {
  width: 100%;
}

.vibe-button--disabled,
.vibe-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.vibe-button__icon {
  font-size: 1.1em;
  line-height: 1;
}
</style>
