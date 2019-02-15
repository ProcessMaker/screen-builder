<template>
  <div>
    <div v-if="mode == 'preview'" class="form-group">
        <div :style="styles" v-html="rendered"></div>
    </div>
    <div v-if="mode == 'editor'" class="editor">
      <editor @onFocus="onFocus" @onBlur="onBlur" v-model="content" :init="editorSettings" v-bind:disabled="disabled"></editor>
    </div>
  </div>
</template>

<script>
import Mustache from "mustache";
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';

export default {
  components: {
    Editor,
  },
  props: [
    "label",
    "fontSize",
    "fontWeight",
    "textAlign",
    "validationData",
    "color",
    "mode",
    "editable",
  ],
  data() {
    return {
      editorSettings: {
        menubar: false,
        plugins: [ 'link', 'lists' ],
        toolbar: "undo redo | link | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
      },
      content: '',
      disabled: false,
    };
  },
  mounted() {
    this.content = this.label;
  },
  methods: {
    onFocus() {
      // trigger inspector
      this.$emit('focused', true)
    },
    onBlur() {
    },
  },
  watch: {
    label() {
      this.content = this.label;
    },
    editable() {
      if (this.editable) {
        this.disabled = false;
        this.content = this.label;
      } else {
        this.disabled = true;
      }
    },
    content() {
      this.$emit('onUpdate', this.content)
    }
  },
  computed: {
    styles() {
      return {
        fontSize: this.fontSize,
        fontWeight: this.fontWeight,
        textAlign: this.textAlign,
        color: this.color
      };
    },
    rendered() {
      try {
        return Mustache.render(this.label, this.validationData);
      } catch (e) {
        return this.label;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


