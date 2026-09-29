<template>
  <div class="vibe-ai-panel" :class="{ 'vibe-ai-panel--embedded': embedded }">
    <div
      v-if="!embedded"
      class="vibe-ai-panel__header"
      @click="$emit('toggle-collapse')"
    >
      <span class="vibe-ai-panel__title vibe-panel-title">
        AI Assistant
        <span v-if="aiConfig.provider" class="vibe-ai-panel__badge">
          {{ providerLabel }}
        </span>
      </span>
      <div class="vibe-ai-panel__actions" @click.stop>
        <button class="vibe-btn ghost" @click="$emit('toggle-collapse')">
          {{ collapsed ? "▲" : "▼" }}
        </button>
      </div>
    </div>

    <div v-if="embedded || !collapsed" class="vibe-ai-panel__body">
      <div v-if="embedded && aiConfig.provider" class="vibe-ai-panel__embedded-meta">
        <span class="vibe-ai-panel__badge">{{ providerLabel }}</span>
      </div>

      <div class="vibe-ai-panel__settings">
        <span class="vibe-ai-panel__settings-label">Aplicar cambios</span>
        <div class="vibe-ai-panel__settings-toggle">
          <button
            class="vibe-btn ghost"
            :class="{ active: applyMode === AI_APPLY_ASK }"
            @click="setApplyMode(AI_APPLY_ASK)"
          >
            Preguntar
          </button>
          <button
            class="vibe-btn ghost"
            :class="{ active: applyMode === AI_APPLY_AUTO }"
            @click="setApplyMode(AI_APPLY_AUTO)"
          >
            Automático
          </button>
        </div>
      </div>
      <div v-if="configError" class="vibe-ai-panel__notice vibe-ai-panel__notice--error">
        {{ configError }}
      </div>
      <div v-else-if="!aiConfig.configured && aiConfig.provider !== 'cursor'" class="vibe-ai-panel__notice">
        Set <code>VIBE_AI_API_KEY</code> in .env or run
        <code>npm run vibe:cursor-agent</code> with <code>VIBE_AI_PROVIDER=cursor</code>.
      </div>

      <div ref="messagesEl" class="vibe-ai-panel__messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="vibe-ai-panel__message"
          :class="`vibe-ai-panel__message--${message.role}`"
        >
          <span class="vibe-ai-panel__message-role">
            {{ message.role === "user" ? "You" : "AI" }}
          </span>
          <p class="vibe-ai-panel__message-text">{{ message.text }}</p>
          <div
            v-if="message.edits && message.edits.length"
            class="vibe-ai-panel__edits"
          >
            <span class="vibe-ai-panel__edits-label">
              {{ message.edits.length }} file change(s)
            </span>
            <button
              v-if="!message.applied && applyMode === AI_APPLY_ASK"
              class="vibe-btn primary"
              :disabled="applyingIndex === index"
              @click="applyEdits(message, index)"
            >
              {{ applyingIndex === index ? "Applying..." : "Apply changes" }}
            </button>
            <span v-else-if="message.applyError" class="vibe-ai-panel__apply-error">
              {{ message.applyError }}
            </span>
            <span v-else-if="message.applied" class="vibe-ai-panel__applied">Applied</span>
          </div>
        </div>
        <div v-if="sending" class="vibe-ai-panel__message vibe-ai-panel__message--assistant">
          <span class="vibe-ai-panel__message-role">AI</span>
          <p class="vibe-ai-panel__message-text">Thinking...</p>
        </div>
      </div>

      <form class="vibe-ai-panel__composer" @submit.prevent="sendMessage">
        <textarea
          v-model="draft"
          class="vibe-ai-panel__input"
          rows="2"
          placeholder="Describe los cambios que querés en el screen o en el código..."
          :disabled="sending"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <button
          class="vibe-btn primary"
          type="submit"
          :disabled="!draft.trim() || sending"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { fetchAiConfig, sendAiChat } from "../services/vibeAiService";
import { fetchTree } from "../services/vibeProjectApi";
import { flattenProjectPaths } from "../services/vibeAiPrompt";
import {
  AI_APPLY_ASK,
  AI_APPLY_AUTO,
  loadAiPreferences,
  saveAiPreferences,
} from "../services/vibeAiPreferences";

export default {
  name: "VibeAiPanel",
  props: {
    embedded: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
    activeFile: { type: String, default: "" },
    activeFileContent: { type: String, default: "" },
    editorMode: { type: String, default: "code" },
    previewError: { type: String, default: null },
    selectedScenarioFile: { type: String, default: "tests/scenarios.yaml" },
    onApplyEdits: { type: Function, default: null },
  },
  data() {
    return {
      AI_APPLY_ASK,
      AI_APPLY_AUTO,
      applyMode: AI_APPLY_ASK,
      applyingIndex: null,
      projectFiles: [],
      draft: "",
      sending: false,
      configError: null,
      aiConfig: {
        provider: "openai",
        model: "",
        configured: false,
      },
      messages: [
        {
          role: "assistant",
          text:
            "Contame qué querés cambiar. Puedo crear componentes, screens, escenarios de prueba en tests/*.yaml, o editar archivos existentes.",
        },
      ],
    };
  },
  computed: {
    providerLabel() {
      if (this.aiConfig.provider === "cursor") return "Cursor";
      return this.aiConfig.model || "OpenAI";
    },
  },
  mounted() {
    this.applyMode = loadAiPreferences().applyMode;
    this.loadConfig();
    this.loadProjectFiles();
  },
  methods: {
    async loadProjectFiles() {
      try {
        const { tree } = await fetchTree();
        this.projectFiles = flattenProjectPaths(tree);
      } catch {
        this.projectFiles = [];
      }
    },
    setApplyMode(mode) {
      this.applyMode = mode;
      saveAiPreferences({ applyMode: mode });
    },
    async loadConfig() {
      try {
        this.aiConfig = await fetchAiConfig();
        this.configError = null;
      } catch (err) {
        this.configError = err.message;
      }
    },
    buildContext() {
      return {
        activeFile: this.activeFile,
        activeFileContent: this.activeFileContent,
        editorMode: this.editorMode,
        previewError: this.previewError,
        projectFiles: this.projectFiles,
        selectedScenarioFile: this.selectedScenarioFile,
      };
    },
    async sendMessage() {
      const text = this.draft.trim();
      if (!text || this.sending) return;

      this.messages.push({ role: "user", text });
      this.draft = "";
      this.sending = true;
      this.scrollToBottom();

      try {
        const history = this.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-10)
          .map((m) => ({ role: m.role, text: m.text }));

        const result = await sendAiChat({
          messages: history,
          context: this.buildContext(),
        });

        const newMessage = {
          role: "assistant",
          text: result.message,
          edits: result.edits || [],
          applied: !(result.edits && result.edits.length),
        };
        this.messages.push(newMessage);

        if (this.applyMode === AI_APPLY_AUTO && newMessage.edits.length) {
          await this.applyEdits(newMessage, this.messages.length - 1);
        }

        await this.loadProjectFiles();
      } catch (err) {
        this.messages.push({
          role: "assistant",
          text: err.message,
          edits: [],
          applied: true,
        });
      } finally {
        this.sending = false;
        this.scrollToBottom();
      }
    },
    async applyEdits(message, index) {
      if (!message.edits?.length || message.applied) return;

      this.applyingIndex = index;
      try {
        const switchToCode = this.applyMode === AI_APPLY_ASK;
        if (this.onApplyEdits) {
          await this.onApplyEdits(message.edits, { switchToCode });
        } else {
          this.$emit("apply-edits", message.edits);
        }
        this.$set(this.messages, index, { ...message, applied: true, applyError: "" });
        await this.loadProjectFiles();
      } catch (err) {
        this.$set(this.messages, index, {
          ...message,
          applied: false,
          applyError: err.message || "Failed to apply changes",
        });
      } finally {
        this.applyingIndex = null;
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messagesEl;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.vibe-ai-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.vibe-ai-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}

.vibe-ai-panel__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vibe-ai-panel__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--vibe-radius-pill);
  background: var(--vibe-accent-muted);
  color: var(--vibe-accent);
  text-transform: none;
  letter-spacing: 0;
}

.vibe-ai-panel__actions {
  display: flex;
  gap: 4px;
}

.vibe-ai-panel__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 0 14px 14px;
  gap: 10px;
}

.vibe-ai-panel--embedded .vibe-ai-panel__body {
  padding: 14px;
}

.vibe-ai-panel__embedded-meta {
  flex-shrink: 0;
}

.vibe-ai-panel__settings {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
  padding: 2px 0 4px;
}

.vibe-ai-panel__settings-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vibe-text-subtle);
}

.vibe-ai-panel__settings-toggle {
  display: flex;
  gap: 4px;
}

.vibe-ai-panel__notice {
  font-size: 11px;
  line-height: 1.5;
  padding: 10px 12px;
  border-radius: var(--vibe-radius-sm);
  background: var(--vibe-bg-soft);
  color: var(--vibe-text-muted);
}

.vibe-ai-panel__notice--error {
  background: var(--vibe-error-bg);
  color: var(--vibe-error);
}

.vibe-ai-panel__notice code {
  font-size: 10px;
  background: var(--vibe-accent-muted);
  padding: 1px 5px;
  border-radius: 4px;
}

.vibe-ai-panel__messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 2px;
}

.vibe-ai-panel__message {
  max-width: 92%;
  padding: 10px 12px;
  border-radius: var(--vibe-radius-lg);
  font-size: 12px;
  line-height: 1.5;
}

.vibe-ai-panel__message--user {
  align-self: flex-end;
  background: var(--vibe-accent);
  color: var(--vibe-accent-on);
}

.vibe-ai-panel__message--assistant {
  align-self: flex-start;
  background: var(--vibe-bg-soft);
  color: var(--vibe-text);
  border: 1px solid var(--vibe-border);
}

.vibe-ai-panel__message-role {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
  margin-bottom: 4px;
}

.vibe-ai-panel__message-text {
  margin: 0;
  white-space: pre-wrap;
}

.vibe-ai-panel__edits {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--vibe-border);
}

.vibe-ai-panel__edits-label {
  font-size: 11px;
  color: var(--vibe-text-muted);
}

.vibe-ai-panel__applied {
  font-size: 11px;
  font-weight: 600;
  color: var(--vibe-success);
}

.vibe-ai-panel__apply-error {
  font-size: 11px;
  font-weight: 600;
  color: var(--vibe-error);
}

.vibe-ai-panel__composer {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-shrink: 0;
}

.vibe-ai-panel__input {
  flex: 1;
  resize: none;
  border: 1px solid var(--vibe-border);
  border-radius: var(--vibe-radius-lg);
  padding: 10px 12px;
  font-family: var(--vibe-font);
  font-size: 12px;
  line-height: 1.5;
  color: var(--vibe-text);
  background: var(--vibe-panel-bg);
  outline: none;
}

.vibe-ai-panel__input:focus {
  border-color: var(--vibe-accent-soft);
  box-shadow: 0 0 0 3px var(--vibe-accent-muted);
}

.vibe-ai-panel__input:disabled {
  opacity: 0.6;
}
</style>
