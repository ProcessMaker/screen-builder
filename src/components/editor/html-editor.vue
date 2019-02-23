<template>
  <div class="wrapper">
    <div class="draggable-handle" @click.stop="$emit('inspect')">
      <i class="fas fa-arrows-alt"></i>
    </div>
    <form-html-editor @onFocus="onFocus" @onBlur="onBlur" label="Html Editor" v-model="content" validation="required|max:300" />
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
    "validationData",
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
  },
  methods: {
    onFocus() {
      this.$emit('inspect');
    },
    onBlur() {
    }
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

.wrapper {
  border: 1px solid transparent;
  &:hover {
    border: 1px solid red;
  }
}
</style>


