<template>
  <aside class="screen-properties-panel">
    <div class="screen-properties-panel__header vibe-panel-header">
      <span class="vibe-panel-title">Properties</span>
      <div v-if="node" class="screen-properties-panel__tabs">
        <button
          class="vibe-btn ghost"
          :class="{ active: mode === 'visual' }"
          @click="mode = 'visual'"
        >
          Visual
        </button>
        <button
          class="vibe-btn ghost"
          :class="{ active: mode === 'code' }"
          @click="mode = 'code'"
        >
          Code
        </button>
      </div>
    </div>

    <div v-if="!node" class="screen-properties-panel__empty">
      {{
        isComponentSheet
          ? "Seleccioná el componente o un nodo hijo para editar sus propiedades."
          : "Seleccioná un nodo del screen para editar sus propiedades."
      }}
    </div>

    <div v-else class="screen-properties-panel__body">
      <div class="screen-properties-panel__meta">
        <div>
          <strong>{{ nodeTitle }}</strong>
          <span v-if="node.type === 'component'" class="screen-properties-panel__path">
            {{ node.componentPath }}
          </span>
        </div>
        <button
          v-if="!node.isComponentRoot"
          class="vibe-btn ghost"
          title="Remove node"
          @click="$emit('remove')"
        >
          Remove
        </button>
      </div>

      <template v-if="node.type === 'component'">
        <template v-if="mode === 'visual'">
          <div v-if="schemaLoading" class="screen-properties-panel__loading">
            Cargando props...
          </div>
          <div v-else-if="propFields.length === 0" class="screen-properties-panel__empty-inline">
            No se encontraron props en este componente.
          </div>
          <div
            v-for="field in propFields"
            :key="field.name"
            class="screen-properties-panel__field"
          >
            <label :for="fieldInputId(field.name)">
              {{ formatPropLabel(field.name) }}
              <span class="screen-properties-panel__type">{{ field.type }}</span>
            </label>

            <select
              v-if="field.options && field.options.length"
              :id="fieldInputId(field.name)"
              v-model="field.value"
              @change="emitPropsFromFields"
            >
              <option v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>

            <label
              v-else-if="field.type === 'Boolean'"
              class="screen-properties-panel__checkbox"
            >
              <input
                :id="fieldInputId(field.name)"
                v-model="field.value"
                type="checkbox"
                @change="emitPropsFromFields"
              />
              <span>{{ field.value ? "true" : "false" }}</span>
            </label>

            <input
              v-else-if="field.type === 'Number'"
              :id="fieldInputId(field.name)"
              v-model.number="field.value"
              type="number"
              @change="emitPropsFromFields"
            />

            <input
              v-else
              :id="fieldInputId(field.name)"
              v-model="field.value"
              type="text"
              :placeholder="defaultPlaceholder(field)"
              @change="emitPropsFromFields"
            />
          </div>
        </template>
        <textarea
          v-else
          v-model="propsJson"
          class="screen-properties-panel__code"
          @blur="applyPropsJson"
        />
      </template>

      <template v-else>
        <template v-if="mode === 'visual'">
          <div class="screen-properties-panel__field">
            <label>HTML tag</label>
            <input :value="node.tag" disabled />
          </div>
          <div
            v-for="(entry, index) in attrEntries"
            :key="index"
            class="screen-properties-panel__field"
          >
            <label>Attribute</label>
            <input v-model="entry.key" @change="emitAttrs" />
            <label>Value</label>
            <input v-model="entry.value" @change="emitAttrs" />
          </div>
          <button class="vibe-btn" @click="addAttr">+ Add attribute</button>
        </template>
        <textarea
          v-else
          v-model="attrsJson"
          class="screen-properties-panel__code"
          @blur="applyAttrsJson"
        />
      </template>
    </div>
  </aside>
</template>

<script>
import {
  fetchComponentPropSchema,
  mergePropValues,
  fieldsToPropsObject,
  formatPropLabel,
} from "../services/vibeComponentProps";

export default {
  name: "ScreenPropertiesPanel",
  props: {
    node: { type: Object, default: null },
    isComponentSheet: { type: Boolean, default: false },
  },
  data() {
    return {
      mode: "visual",
      propFields: [],
      propSchema: [],
      schemaLoading: false,
      attrEntries: [],
      propsJson: "{}",
      attrsJson: "{}",
      fieldIdCounter: 0,
    };
  },
  computed: {
    nodeTitle() {
      if (!this.node) return "";
      if (this.node.type === "component") return this.node.componentName;
      return `<${this.node.tag}>`;
    },
  },
  watch: {
    node: {
      immediate: true,
      handler(val) {
        this.syncFromNode(val);
      },
    },
  },
  methods: {
    formatPropLabel,
    fieldInputId(name) {
      return `prop-field-${this.fieldIdCounter}-${name}`;
    },
    defaultPlaceholder(field) {
      if (field.default === undefined || field.default === "") return "";
      return String(field.default);
    },
    async syncFromNode(node) {
      if (!node) return;

      if (node.type === "component") {
        this.fieldIdCounter += 1;
        await this.loadPropSchema(node.componentPath);
        this.propFields = mergePropValues(this.propSchema, node.props || {});
        this.propsJson = JSON.stringify(node.props || {}, null, 2);
        return;
      }

      this.propFields = [];
      this.propSchema = [];
      this.attrEntries = Object.entries(node.attrs || {}).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      this.attrsJson = JSON.stringify(node.attrs || {}, null, 2);
    },
    async loadPropSchema(componentPath) {
      this.schemaLoading = true;
      try {
        this.propSchema = await fetchComponentPropSchema(componentPath);
      } catch {
        this.propSchema = [];
      } finally {
        this.schemaLoading = false;
      }
    },
    emitPropsFromFields() {
      const props = fieldsToPropsObject(this.propFields);
      this.$emit("update-props", props);
      this.propsJson = JSON.stringify(props, null, 2);
    },
    emitAttrs() {
      const attrs = {};
      this.attrEntries.forEach(({ key, value }) => {
        if (key) attrs[key] = value;
      });
      this.$emit("update-attrs", attrs);
      this.attrsJson = JSON.stringify(attrs, null, 2);
    },
    applyPropsJson() {
      try {
        const props = JSON.parse(this.propsJson);
        this.$emit("update-props", props);
        this.propFields = mergePropValues(this.propSchema, props);
      } catch {
        // keep invalid json until user fixes
      }
    },
    applyAttrsJson() {
      try {
        const attrs = JSON.parse(this.attrsJson);
        this.$emit("update-attrs", attrs);
        this.attrEntries = Object.entries(attrs).map(([key, value]) => ({
          key,
          value: String(value),
        }));
      } catch {
        // keep invalid json
      }
    },
    addAttr() {
      this.attrEntries.push({ key: "class", value: "" });
    },
  },
};
</script>

<style scoped>
.screen-properties-panel {
  width: 260px;
  flex-shrink: 0;
  border-left: 1px solid var(--vibe-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--vibe-bg-soft);
}

.screen-properties-panel__header {
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;
}

.screen-properties-panel__tabs {
  display: flex;
  gap: 4px;
}

.screen-properties-panel__empty,
.screen-properties-panel__empty-inline,
.screen-properties-panel__loading {
  padding: 20px 14px;
  font-size: 12px;
  color: var(--vibe-text-muted);
  line-height: 1.5;
}

.screen-properties-panel__empty-inline,
.screen-properties-panel__loading {
  padding: 0 0 12px;
}

.screen-properties-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
}

.screen-properties-panel__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 12px;
  color: var(--vibe-text);
}

.screen-properties-panel__path {
  display: block;
  margin-top: 4px;
  font-size: 10px;
  color: var(--vibe-text-subtle);
  word-break: break-all;
}

.screen-properties-panel__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.screen-properties-panel__field label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  color: var(--vibe-text-subtle);
  text-transform: uppercase;
}

.screen-properties-panel__type {
  font-weight: 500;
  text-transform: none;
  color: var(--vibe-accent-soft);
  background: var(--vibe-accent-muted);
  padding: 1px 6px;
  border-radius: 999px;
}

.screen-properties-panel__field input,
.screen-properties-panel__field select {
  padding: 8px 10px;
  border: 1px solid var(--vibe-border);
  border-radius: var(--vibe-radius-sm);
  font-size: 12px;
  background: var(--vibe-panel-bg);
}

.screen-properties-panel__checkbox {
  flex-direction: row !important;
  text-transform: none !important;
  font-size: 12px !important;
  color: var(--vibe-text) !important;
  gap: 8px !important;
}

.screen-properties-panel__checkbox input {
  width: auto;
}

.screen-properties-panel__code {
  width: 100%;
  min-height: 160px;
  padding: 10px;
  border: 1px solid var(--vibe-border);
  border-radius: var(--vibe-radius-sm);
  font-family: Menlo, Monaco, monospace;
  font-size: 11px;
  resize: vertical;
  background: var(--vibe-panel-bg);
}
</style>
