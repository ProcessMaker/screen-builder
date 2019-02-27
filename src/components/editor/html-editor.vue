<template>
  <div class="highlight form-group" @click.stop="$emit('inspect')">
    <div class="draggable-handle">
      <i class="fas fa-arrows-alt"></i>
    </div>
    <form-html-editor name="htmlEditor" @onFocus="$emit('inspect')" label="Html Editor" v-model="content" />
  </div>
</template>

<script>
import { FormHtmlEditor } from "@processmaker/vue-form-elements/src/components";

export default {
  data() {
    return {
      content: '',
    }
  },
  components: { FormHtmlEditor },
  props: [
    "label",
  ],
  computed: {
  },
  watch: {
    content() {
      this.$emit('labelUpdated', this.content);
    },
    label() {
      this.content = this.label;
    }
  },
  mounted() {
    this.content = this.label;
  }
};
</script>

<style lang="scss" scoped>
.draggable-handle {
  cursor: grab;
  text-align: center;
  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
}

</style>


