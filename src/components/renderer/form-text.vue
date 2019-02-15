<template>
  <div>
    <div v-if="mode == 'preview'" class="form-group">
        <div :style="styles" v-html="rendered"></div>
    </div>
    <div v-if="mode == 'editor'" class="editor">
      <editor-menu-bar :editor="editor" ref="menuBar">
        <div class="menubar" slot-scope="{ commands, isActive }">

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <icon name="bold" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <icon name="italic" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <icon name="underline" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
          >
            <icon name="paragraph" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <icon name="ul" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <icon name="ol" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <icon name="quote" />
          </button>

          <button
            class="menubar__button"
            @click="commands.horizontal_rule"
          >
            <icon name="hr" />
          </button>

          <button
            class="menubar__button"
            @click="commands.undo"
          >
            <icon name="undo" />
          </button>

          <button
            class="menubar__button"
            @click="commands.redo"
          >
            <icon name="redo" />
          </button>

        </div>
      </editor-menu-bar>

      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script>
import Mustache from "mustache";
import Icon from './Icon'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
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
    var that = this;
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Italic(),
          new Link(),
          new Underline(),
          new History(),
        ],
        content: '',
        onUpdate(editor) {
          that.$emit('onUpdate', editor.getHTML());
        },
        onFocus() {
          that.isEditing = true;
        },
        onBlur() {
          that.isEditing = false;
        },
      }),
      isEditing: false,
    };
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  mounted() {
      this.editor.setContent(this.label)
  },
  watch: {
    label() {
      // Only set the content if we are editing from the inspector
      if (!this.isEditing) {
        this.editor.setContent(this.label)
      }
    },
    editable() {
      this.editor.setOptions({editable: this.editable})
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


