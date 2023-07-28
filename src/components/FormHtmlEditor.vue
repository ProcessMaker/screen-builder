<template>
  <div class="form-group">
    <div :class="classList">
      <editor
        v-if="!$attrs.disabled"
        :value="rendered"
        :init="editorSettings"
        v-bind="$attrs"
        v-on="$listeners"
      />
      <div v-else v-html="rendered"></div>
    </div>
    <div
      v-if="(validator && validator.errorCount) || error"
      class="invalid-feedback"
    >
      <div
        v-for="(error, index) in validator.errors.get(this.name)"
        :key="index"
      >
        {{ error }}
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import Mustache from "mustache";
import ValidationMixin from "../mixins/validation";
import Editor from "./Editor";
import { formatIfDate } from "../dateUtils";

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin();

export default {
  name: 'FormHtmlEditor',
  components: {
    Editor
  },
  mixins: [uniqIdsMixin, ValidationMixin],
  inheritAttrs: false,
  props: [
    "error",
    "name",
    "helper",
    "controlClass",
    "content",
    "validationData",
    "label",
    "renderVarHtml"
  ],
  data() {
    return {
      originalEscapeFn: null,
      customFunctions: {},
      editorSettings: {
        inline: true,
        menubar: false,
        plugins: ["link", "lists"],
        toolbar: `undo redo | link | styleselect | bold italic forecolor |
           alignleft aligncenter alignright alignjustify | bullist numlist outdent indent`,
        skin: false,
        relative_urls: false,
        remove_script_host: false
      }
    };
  },
  computed: {
    classList() {
      const classList = {
        "is-invalid":
          (this.validator && this.validator.errorCount) || this.error
      };
      if (this.controlClass) {
        classList[this.controlClass] = true;
      }
      return classList;
    },
    rendered() {
      // If we have't validationData, we can't evaluate the mustache variables
      // Used by ScreenBuilder in Design Mode
      if (!this.validationData) {
        return this.content;
      }
      const data = this.makeProxyData(); // Gets the data
      this.overwriteMustacheEscape();
      try {
        if (this.renderVarHtml) {
          return Mustache.render(this.content, data);
        }
        return Mustache.render(this.content, data);
      } catch (error) {
        if (this.renderVarHtml) {
          return this.renderVarName;
        }
        return this.content;
      } finally {
        Mustache.escape = this.originalEscapeFn;
      }
    }
  },
  methods: {
    /**
     * Backup and overwrite the original mustache escaped property
     */
    overwriteMustacheEscape() {
      this.originalEscapeFn = Mustache.escape;
      Mustache.escape = this.mustacheEscapeFn;
    },
    /**
     * Register custom functions to be included
     * @param {string} name
     * @param {object} implementation
     */
    registerCustomFunction(name, implementation) {
      this.customFunctions[name] = implementation;
    },
    /**
     * Escape the mustache code, added in the tinyMCE editor
     * @param {string} text
     * @return {object}
     */
    mustacheEscapeFn(text) {
      const formatedText = formatIfDate(text);
      if (this.renderVarHtml) {
        return formatedText;
      }
      return this.originalEscapeFn(formatedText);
    }
  }
};
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

.is-invalid {
  border: 1px solid #dc3545;
  border-radius: 0.25rem;
}
</style>
