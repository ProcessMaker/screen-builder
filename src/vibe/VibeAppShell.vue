<template>
  <vibe-screen-builder
    :used-screen-paths="usedScreenPaths"
    @switch-mode="$emit('switch-mode', $event)"
    @use-screen="$emit('use-screen', $event)"
  />
</template>

<script>
import VibeScreenBuilder from "./VibeScreenBuilder.vue";

export default {
  name: "VibeAppShell",
  components: { VibeScreenBuilder },
  props: {
    usedScreenPaths: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
