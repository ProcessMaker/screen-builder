<template>
  <div
    class="vibe-resize-handle"
    :class="[
      `vibe-resize-handle--${direction}`,
      { 'vibe-resize-handle--active': active },
    ]"
    :title="title"
    @mousedown.prevent="onMouseDown"
  >
    <span class="vibe-resize-handle__grip" />
  </div>
</template>

<script>
export default {
  name: "PanelResizeHandle",
  props: {
    direction: {
      type: String,
      default: "horizontal",
      validator: (v) => ["horizontal", "vertical"].includes(v),
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      return this.direction === "horizontal"
        ? "Drag to resize width"
        : "Drag to resize height";
    },
  },
  methods: {
    onMouseDown(event) {
      this.$emit("resize-start", {
        direction: this.direction,
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
  },
};
</script>

<style scoped>
.vibe-resize-handle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  touch-action: none;
}

.vibe-resize-handle--horizontal {
  width: 10px;
  margin: 0 -3px;
  cursor: col-resize;
}

.vibe-resize-handle--vertical {
  height: 10px;
  margin: -3px 0;
  cursor: row-resize;
}

.vibe-resize-handle__grip {
  display: block;
  border-radius: var(--vibe-radius-pill);
  background: var(--vibe-border-strong);
  opacity: 0.45;
  transition: background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.vibe-resize-handle--horizontal .vibe-resize-handle__grip {
  width: 4px;
  height: 36px;
}

.vibe-resize-handle--vertical .vibe-resize-handle__grip {
  width: 36px;
  height: 4px;
}

.vibe-resize-handle:hover .vibe-resize-handle__grip,
.vibe-resize-handle--active .vibe-resize-handle__grip {
  opacity: 1;
  background: var(--vibe-accent);
  box-shadow: 0 0 0 3px var(--vibe-accent-muted);
}
</style>
