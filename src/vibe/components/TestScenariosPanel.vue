<template>
  <div class="test-scenarios-panel">
    <div class="test-scenarios-panel__header" @click="$emit('toggle-collapse')">
      <span class="test-scenarios-panel__title">
        Test Scenarios
        <span v-if="scenarios.length" class="test-scenarios-panel__count">
          {{ scenarios.length }}
        </span>
      </span>
      <div class="test-scenarios-panel__actions" @click.stop>
        <button
          class="vibe-btn"
          :disabled="running || !hasPreview"
          @click="runAll"
        >
          {{ running ? "Running..." : "Run All" }}
        </button>
        <button class="vibe-btn ghost" @click="$emit('toggle-collapse')">
          {{ collapsed ? "▲" : "▼" }}
        </button>
      </div>
    </div>

    <div v-if="!collapsed" class="test-scenarios-panel__body">
      <div class="test-scenarios-panel__toolbar">
        <label class="test-scenarios-panel__file-label">
          <span>Scenario file</span>
          <select
            class="test-scenarios-panel__file-select"
            :value="scenarioFilePath"
            @change="onSelectFile"
          >
            <option v-for="filePath in scenarioFiles" :key="filePath" :value="filePath">
              {{ filePath }}
            </option>
          </select>
        </label>
        <button
          class="vibe-btn ghost"
          :disabled="!scenarioFilePath"
          @click="$emit('edit-scenario-file', scenarioFilePath)"
        >
          Edit YAML
        </button>
      </div>

      <div v-if="scenarios.length === 0" class="test-scenarios-panel__empty">
        No scenarios in {{ scenarioFilePath || "tests/scenarios.yaml" }}.
        Ask the AI assistant to create test scenarios, or edit the YAML file.
      </div>

      <div v-else class="test-scenarios-panel__list">
        <div
          v-for="(scenario, index) in scenarios"
          :key="index"
          class="test-scenario-card"
          :class="resultClass(index)"
        >
          <div class="test-scenario-card__header">
            <span class="test-scenario-card__name">{{ scenario.name }}</span>
            <button
              class="vibe-btn ghost"
              :disabled="running || !hasPreview"
              @click="runOne(index)"
            >
              Run
            </button>
          </div>
          <p v-if="scenario.description" class="test-scenario-card__desc">
            {{ scenario.description }}
          </p>
          <p v-if="results[index]?.error" class="test-scenario-card__error">
            {{ results[index].error }}
          </p>
          <p v-else-if="results[index]?.passed" class="test-scenario-card__pass">
            Passed
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { runAllScenarios, runScenario } from "../services/vibeTestRunner";

export default {
  name: "TestScenariosPanel",
  props: {
    scenarios: { type: Array, default: () => [] },
    scenarioFilePath: { type: String, default: "tests/scenarios.yaml" },
    scenarioFiles: { type: Array, default: () => [] },
    collapsed: { type: Boolean, default: true },
    hasPreview: { type: Boolean, default: false },
    getPreviewRoot: { type: Function, default: null },
    getPreviewVm: { type: Function, default: null },
  },
  data() {
    return {
      running: false,
      results: [],
    };
  },
  watch: {
    scenarioFilePath() {
      this.results = [];
    },
    scenarios() {
      this.results = [];
    },
  },
  methods: {
    onSelectFile(event) {
      const path = event.target.value;
      if (path && path !== this.scenarioFilePath) {
        this.$emit("select-scenario-file", path);
      }
    },
    resultClass(index) {
      const r = this.results[index];
      if (!r) return "";
      return r.passed ? "passed" : "failed";
    },
    async runAll() {
      this.running = true;
      this.results = [];
      try {
        const root = this.getPreviewRoot?.();
        const vm = this.getPreviewVm?.();
        this.results = await runAllScenarios(this.scenarios, root, vm);
      } finally {
        this.running = false;
      }
    },
    async runOne(index) {
      this.running = true;
      try {
        const root = this.getPreviewRoot?.();
        const vm = this.getPreviewVm?.();
        const result = await runScenario(this.scenarios[index], root, vm);
        this.$set(this.results, index, result);
      } finally {
        this.running = false;
      }
    },
  },
};
</script>

<style scoped>
.test-scenarios-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.test-scenarios-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.test-scenarios-panel__title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vibe-accent-soft);
  display: flex;
  align-items: center;
  gap: 8px;
}

.test-scenarios-panel__count {
  background: var(--vibe-accent-gradient);
  color: var(--vibe-accent-on);
  padding: 2px 8px;
  border-radius: var(--vibe-radius-pill);
  font-size: 10px;
  font-weight: 700;
}

.test-scenarios-panel__actions {
  display: flex;
  gap: 4px;
}

.test-scenarios-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 14px 14px;
}

.test-scenarios-panel__toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.test-scenarios-panel__file-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.test-scenarios-panel__file-label span {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vibe-text-muted);
}

.test-scenarios-panel__file-select {
  width: 100%;
  max-width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: var(--vibe-radius-md);
  background: var(--vibe-bg-soft);
  color: var(--vibe-text);
  font-size: 12px;
  box-shadow: var(--vibe-shadow-sm);
}

.test-scenarios-panel__empty {
  font-size: 12px;
  color: var(--vibe-text-muted);
  padding: 8px 0;
}

.test-scenarios-panel__list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.test-scenario-card {
  flex-shrink: 0;
  width: 260px;
  padding: 14px 16px;
  border: none;
  border-radius: var(--vibe-radius-lg);
  background: var(--vibe-bg-soft);
  box-shadow: var(--vibe-shadow-sm);
}

.test-scenario-card.passed {
  background: var(--vibe-success-bg);
}

.test-scenario-card.failed {
  background: var(--vibe-error-bg);
}

.test-scenario-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.test-scenario-card__name {
  font-size: 12px;
  font-weight: 500;
  color: var(--vibe-text);
}

.test-scenario-card__desc {
  font-size: 11px;
  color: var(--vibe-text-muted);
  margin: 0 0 4px;
  line-height: 1.4;
}

.test-scenario-card__error {
  font-size: 11px;
  color: var(--vibe-error);
  margin: 4px 0 0;
}

.test-scenario-card__pass {
  font-size: 11px;
  color: var(--vibe-success);
  margin: 4px 0 0;
  font-weight: 500;
}
</style>
