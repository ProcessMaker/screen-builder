<template>
  <div class="vibe-input">
    <label v-if="label" :for="inputId" class="vibe-input__label">{{ label }}</label>
    <input
      :id="inputId"
      class="vibe-input__field"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :data-cy="dataCy"
      @input="$emit('input', $event.target.value)"
    />
    <p v-if="hint" class="vibe-input__hint">{{ hint }}</p>
  </div>
</template>

<script>
let inputCounter = 0;

export default {
  name: "VibeInput",
  props: {
    label: { type: String, default: "Label" },
    value: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    type: { type: String, default: "text" },
    hint: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    dataCy: { type: String, default: "" },
  },
  data() {
    inputCounter += 1;
    return { inputId: `vibe-input-${inputCounter}` };
  },
};
</script>

<style scoped>
.vibe-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vibe-input__label {
  font-size: 13px;
  font-weight: 600;
  color: #0f264a;
}

.vibe-input__field {
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  color: #0f264a;
  background: #f4f7fa;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
}

.vibe-input__field:focus {
  background: #fff;
  box-shadow: 0 0 0 3px rgba(15, 38, 74, 0.12);
}

.vibe-input__field::placeholder {
  color: #9ca3af;
}

.vibe-input__field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vibe-input__hint {
  margin: 0;
  font-size: 12px;
  color: #7a8fa8;
}
</style>
