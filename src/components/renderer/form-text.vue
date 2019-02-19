<template>
  <div>
    <div v-if="mode == 'editor'" class="editor">
      <editor @onFocus="onFocus" @onBlur="onBlur" v-model="content" :init="editorSettings" v-bind:disabled="disabled"></editor>
    </div>
    <div v-else class="form-group">
        <div v-html="rendered"></div>
    </div>
  </div>
</template>

<script>
import Mustache from "mustache";
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/tinymce';
import 'tinymce/themes/silver';

import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';

export default {
  components: {
    Editor,
  },
  props: [
    "label",
    "validationData",
    "mode",
    "editable",
    "name"
  ],
  data() {
    return {
      editorSettings: {
        menubar: false,
        plugins: [ 'link', 'lists' ],
        toolbar: "undo redo | link | styleselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
        skin: "oxide",
        skin_url: '/tinymce/skins/ui/oxide',
        content_css : '/tinymce/skins/content/default/content.min.css'
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

