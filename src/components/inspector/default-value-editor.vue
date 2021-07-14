<template>
  <div>
    <label>{{ $t('Default Value') }} </label>
    <div class="float-right buttons">
      <b-button :title="$t('Basic Mode')" variant="light" size="sm" :class="{ active: mode === 'basic'}" @click="mode = 'basic'" data-cy="inspector-defaultValue-basic"><i class="fas fa-i-cursor"/></b-button>
      <b-button :title="$t('Javascript')" variant="light" size="sm" :class="{ active: mode === 'js'}" @click="mode = 'js'" data-cy="inspector-defaultValue-js"><i class="fab fa-js-square"/></b-button>
    </div>
    <div v-if="mode === 'basic'">
      <b-form-input v-model="basicValue" data-cy="inspector-defaultValue-basicValue"/>
      <small v-if="helper" class="form-text text-muted">{{ $t(helper) }}</small>
    </div>
    <div v-if="mode === 'js'">
      <MonacoEditor
        v-model="jsValue"
        :options="monacoOptions"
        class="editor"
        language="javascript"
        data-cy="inspector-defaultValue-jsValue"
      />
      <small v-if="helper" class="form-text text-muted mt-2">{{ $t(helper) }}</small>
    </div>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';
import _ from 'lodash';

export default {
  props: ['value', 'helper'],
  components: {
    MonacoEditor,
  },    
  data() {
    return {
      mode: 'basic',
      jsValue: '',
      basicValue: '',
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
  watch: {
    value: {
      handler() {
        if (_.isEqual(this.configValue, this.value)) {
          return;
        }
                
        this.mode = 'basic';
        this.basicValue = '';
        this.jsValue    = '';
                
        if (!this.value) {
          return;
        }

        if (typeof this.value === 'string') {
          this.mode = 'basic';
          this.effectiveValue = this.value;
        } else {
          this.mode = this.value.mode;
          this.effectiveValue = this.value.value;
        }
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
  computed: {
    effectiveValue: {
      get() {
        return this.mode === 'js' ? this.jsValue : this.basicValue;
      },
      set(value) {
        if (this.mode === 'js') {
          this.jsValue = value;
        } else {
          this.basicValue = value;
        }
      },
    },
    configValue() {
      return {
        mode: this.mode,
        value: this.effectiveValue,
      };
    },
  },
  methods: {
    emit() {
      this.$emit('input', this.configValue);
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
</style>