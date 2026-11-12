<template>
  <div>
    <div class="d-flex align-items-center justify-content-between inspector-label-row">
      <label :for="'inspector-defaultValue-jsValue'">{{ $t(label) }}</label>
      <button
        v-if="enablePopup"
        type="button"
        class="btn btn-light btn-sm"
        :title="$t(resolvedOpenPopupLabel)"
        data-test="tce-control-expand-button"
        :aria-label="resolvedOpenPopupLabel"
        @click="openCodePopup"
      >
        <i class="fas fa-expand" />
      </button>
    </div>
    <MonacoEditor
      v-model="jsValue"
      :options="monacoOptions"
      class="editor"
      :language="language"
      data-cy="inspector-defaultValue-jsValue"
    />
    <b-modal
      v-if="enablePopup"
      v-model="isPopupOpen"
      :title="$t(resolvedPopupTitle)"
      size="xl"
      dialog-class="editor-dialog-large"
      header-close-content="&times;"
      no-close-on-backdrop
      @hidden="onCodePopupHidden"
    >
      <div
        class="tce-p-4"
        data-test="tce-control-code-input"
      >
        <MonacoEditor
          v-model="popupCode"
          :options="popupMonacoOptions"
          class="popup-editor"
          :language="language"
        />
      </div>
      <template #modal-footer>
        <div class="tce-flex tce-justify-end tce-gap-2 w-100">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-test="tce-control-close-button"
            @click="closeCodePopup"
          >
            {{ $t(resolvedCancelPopupLabel) }}
          </button>
          <button
            type="button"
            class="btn btn-primary ml-2"
            data-test="tce-control-save-button"
            @click="saveCodePopup"
          >
            {{ $t(resolvedSavePopupLabel) }}
          </button>
        </div>
      </template>
    </b-modal>
    <small
      v-if="helper"
      class="form-text text-muted mt-2"
    >{{ $t(helper) }}</small>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';

const _ = window._ || {
  isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
};

export default {
  components: {
    MonacoEditor,
  },
  props: {
    value: {
      type: [String, Number, Object],
      default: '',
    },
    helper: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'javascript',
    },
    label: {
      type: String,
      default: '',
    },
    enablePopup: {
      type: Boolean,
      default: true,
    },
    openPopupLabel: {
      type: String,
      default: 'Open in popup',
    },
    cancelPopupLabel: {
      type: String,
      default: 'Cancel',
    },
    savePopupLabel: {
      type: String,
      default: 'Save',
    },
    popupTitle: {
      type: String,
      default: 'Edit source code',
    },
  },
  emits: ['input'],
  data() {
    return {
      mode: 'basic',
      jsValue: '',
      basicValue: '',
      popupCode: '',
      isPopupOpen: false,
      monacoOptions: {
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        minimap: { enabled: false },
        fixedOverflowWidgets: true,
        automaticLayout: true,
      },
    };
  },
  computed: {
    popupMonacoOptions() {
      return {
        ...this.monacoOptions,
        lineNumbers: 'on',
        minimap: { enabled: true },
      };
    },
    resolvedOpenPopupLabel() {
      return this.openPopupLabel || 'Open in popup';
    },
    resolvedPopupTitle() {
      return this.popupTitle || 'Edit source code';
    },
    resolvedCancelPopupLabel() {
      return this.cancelPopupLabel || 'Cancel';
    },
    resolvedSavePopupLabel() {
      return this.savePopupLabel || 'Save';
    },
  },
  watch: {
    enablePopup(value) {
      if (!value) {
        this.isPopupOpen = false;
      }
    },
    value: {
      handler() {
        if (_.isEqual(this.jsValue, this.value)) {
          return;
        }

        this.mode = 'basic';
        this.basicValue = '';
        this.jsValue = '';

        if (!this.value) {
          return;
        }

        this.jsValue = this.value;
      },
      immediate: true,
    },
    mode() {
      this.emit();
    },
    jsValue() {
      this.emit();
    },
    basicValue() {
      this.emit();
    },
  },
  methods: {
    emit() {
      this.$emit('input', this.jsValue);
    },
    openCodePopup() {
      this.popupCode = this.jsValue || '';
      this.isPopupOpen = true;
    },
    closeCodePopup() {
      this.isPopupOpen = false;
    },
    onCodePopupHidden() {
      this.popupCode = '';
    },
    saveCodePopup() {
      this.jsValue = this.popupCode;
      this.isPopupOpen = false;
    },
  },
};
</script>

<style scoped>
.buttons button {
  min-width: 2.2em;
  margin-left: 0.5em;
  margin-bottom: 0.5em;
}

.editor {
  width: 100%;
  height: 10em;
}

.popup-editor {
  width: 100%;
  height: 60vh;
}

.inspector-label-row {
  width: 100%;
}
</style>
