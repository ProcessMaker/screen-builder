<template>
  <div>
    <label :for="`${dataFeature}-code-input`">{{ $t(label) }} </label>
    <div class="float-right buttons">
      <b-button
        :title="$t('Expand')"
        variant="light"
        size="sm"
        :data-test="`${dataFeature}-expand-button`"
        @click="expand"
      ><i class="fas fa-expand"></i></b-button>
    </div>
    <MonacoEditor
      :id="`${dataFeature}-code-input`"
      v-model="configValue"
      :options="smallMonacoOptions"
      class="editor"
      language="javascript"
      :data-test="`${dataFeature}-code-input`"
      @change="updateValue"
    />
    <small v-if="helper" class="form-text text-muted mt-2">{{ $t(helper) }}</small>
    <b-modal
      ref="codeEditorModal"
      :title="$t(label)"
      size="xl"
      dialog-class="modal-dialog-fullscreen"
    >
      <MonacoEditor
        v-model="configValue"
        :options="largeMonacoOptions"
        class="editor large-editor"
        language="javascript"
        :data-test="`${dataFeature}-code-input`"
        @change="updateValue"
      />
      <template #modal-footer="{ ok }">
        <b-button @click="ok" class="btn btn-secondary text-uppercase">
          {{ $t('Close') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';

export default {
  name: 'CodeEditor',
  props: {
    value: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      default: '',
    },
    helper: {
      type: String,
      required: false,
    },
    dataFeature: {
      type: String,
      required: true,
    },
  },
  components: {
    MonacoEditor,
  },
  data() {
    return {
      configValue: this.value || '',
      smallMonacoOptions: {
        lineNumbers: 'off',
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        minimap: { enabled: false },
        fixedOverflowWidgets: true,
        automaticLayout: true,
        renderLineHighlight: 'none',
        overviewRulerLanes: 0,
      },
      largeMonacoOptions: {
        lineNumbers: 'on',
        lineDecorationsWidth: 0,
        minimap: { enabled: false },
        automaticLayout: true,
        overviewRulerLanes: 0,
      },
    };
  },
  methods: {
    updateValue() {
      this.$emit('input', this.configValue);
    },
    expand() {
      this.$refs.codeEditorModal.show();
    },
  },
  watch: {
    value(newVal) {
      this.configValue = newVal;
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
    border: 1px solid var(--gray);
    overflow: hidden;
}

.large-editor {
    height: 25em;
}
</style>