<template>
  <div v-if="event === 'submit'" class="variables-to-submit-wrapper">
    <!-- Warning for missing required fields (outside card) -->
    <b-alert 
      v-if="isEnabled && missingRequiredVariables.length > 0"
      show 
      variant="warning"
      class="warning-alert"
      data-cy="missing-required-warning"
    >
      <i class="fas fa-bolt warning-icon"></i>
      <span class="warning-text">
        {{ $t('The following required fields are not included') }} "<strong>{{ missingRequiredVariables.join('", "') }}</strong>".
        {{ $t('This may cause validation errors during submission.') }}
      </span>
    </b-alert>

    <!-- Card Container -->
    <div class="variables-to-submit-card">
      <!-- Header Section -->
      <div class="header-section">
        <h6 class="header-title">{{ $t('Submit Information') }}</h6>
        <b-form-checkbox
          v-model="isEnabled"
          switch
          size="lg"
          class="toggle-switch"
          data-cy="variables-to-submit-toggle"
        >
        </b-form-checkbox>
      </div>
      
      <div class="description-text">
        <p>{{ $t('Select variables to submit, otherwise all variables will be submitted by default.') }}</p>
      </div>
      
      <div v-if="isEnabled && availableVariables.length === 0" class="alert alert-info">
        <small>{{ $t('No variables available. Variables will be available after you add form fields to your screen.') }}</small>
      </div>
      
      <div v-else-if="isEnabled">
        <div class="divider"></div>
        
        <!-- Select All and Search Section -->
        <div class="controls-section">
          <b-form-checkbox
            :checked="allSelected"
            :indeterminate="someSelected"
            @change="toggleSelectAll"
            :disabled="filteredVariables.length === 0"
            class="select-all-checkbox"
            data-cy="variables-to-submit-select-all"
          >
            {{ $t('Select All') }}
          </b-form-checkbox>
          <button
            type="button"
            class="search-button"
            @click="toggleSearch"
            data-cy="variables-to-submit-search-toggle"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <!-- Search Input (shown when search is active) -->
        <div v-if="showSearch" class="search-container">
          <b-input-group>
            <b-form-input
              v-model="searchQuery"
              :placeholder="$t('Search variables...')"
              data-cy="variables-to-submit-search"
              class="search-input"
            />
            <b-input-group-append>
              <b-button 
                @click="searchQuery = ''" 
                :disabled="!searchQuery" 
                data-cy="variables-to-submit-clear-search" 
                variant="outline-secondary"
                class="clear-search-button"
              >
                <i class="fas fa-times"></i>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="divider"></div>
        <!-- Variables List -->
        <div class="variables-list">
          <div
            v-for="variable in filteredVariables"
            :key="variable"
            class="variable-item"
            :data-cy="`variable-item-${variable}`"
          >
            <b-form-checkbox
              v-model="selectedVariables"
              :value="variable"
              class="variable-checkbox"
              :data-cy="`variable-checkbox-${variable}`"
            >
              <span class="variable-name">{{ variable }}</span>
            </b-form-checkbox>
          </div>
          <div v-if="filteredVariables.length === 0" class="no-results">
            <small>{{ $t('No variables match your search.') }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VariablesToSubmit',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    builder: {
      type: Object,
      required: true
    },
    formConfig: {
      type: Array,
      required: true
    },
    selectedControl: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedVariables: this.value || [],
      event: '',
      isEnabled: (this.value && this.value.length > 0) || false,
      showSearch: false
    };
  },
  computed: {
    /**
     * Get all available variables from form config, variables tree, and computed properties
     * Excludes only _parent variables, includes all others (root level and nested)
     */
    availableVariables() {
      const variables = {};
      
      // Extract from form config
      const config = this.formConfig || this.builder?.config || this.$root?.$children[0]?.config || [];
      if (Array.isArray(config) && config.length > 0) {
        Object.assign(variables, this.extractVariablesFromConfig(config));
      }
      
      // Extract from variables tree
      const tree = this.builder?.variablesTree || this.$root?.$children[0]?.variablesTree || [];
      if (Array.isArray(tree) && tree.length > 0) {
        const result = this.loadVariables(tree);
        Object.assign(variables, result.variables || {});
      }
      
      // Extract calculated variables (computed properties)
      Object.assign(variables, this.extractCalculatedVariables());

      // Extract watcher output variables
      Object.assign(variables, this.extractWatcherVariables());
      
      // Filter: exclude _parent variables and invalid variable names
      return Object.keys(variables)
        .filter(variable => this.isValidVariableName(variable))
        .sort();
    },
    
    filteredVariables() {
      if (!this.searchQuery) {
        return this.availableVariables;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.availableVariables.filter(variable =>
        variable.toLowerCase().includes(query)
      );
    },
    
    /**
     * Get list of required variables from form config
     */
    requiredVariables() {
      const required = [];
      const config = this.formConfig || this.builder?.config || this.$root?.$children[0]?.config || [];
      
      if (Array.isArray(config) && config.length > 0) {
        config.forEach(page => {
          if (Array.isArray(page.items)) {
            this.findRequiredFields(page.items, required);
          }
        });
      }
      
      return required;
    },
    
    /**
     * Get list of required variables that are not in selectedVariables
     */
    missingRequiredVariables() {
      if (!this.isEnabled) {
        return [];
      }
      
      return this.requiredVariables.filter(
        variable => !this.selectedVariables.includes(variable)
      );
    },
    
    /**
     * Check if all filtered variables are selected
     */
    allSelected() {
      return this.filteredVariables.length > 0 && 
        this.filteredVariables.every(v => this.selectedVariables.includes(v));
    },
    
    /**
     * Check if some (but not all) filtered variables are selected
     */
    someSelected() {
      const selectedCount = this.filteredVariables.filter(v => this.selectedVariables.includes(v)).length;
      return selectedCount > 0 && selectedCount < this.filteredVariables.length;
    },
    
    /**
     * Source for computed properties to watch for changes
     */
    computedPropertiesSource() {
      return this.getComputedProperties() || [];
    },
    
    /**
     * Source for watchers to watch for changes
     */
    watchersSource() {
      return this.getWatchers() || [];
    }
  },
  watch: {
    value(newValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(this.selectedVariables)) {
        this.selectedVariables = newValue || [];
        this.isEnabled = (newValue && newValue.length > 0) || false;
      }
    },
    selectedVariables(newValue) {
      // Emit the selected variables array
      if (this.isEnabled) {
        this.$emit('input', newValue);
        this.$emit('change', newValue);
      } else {
        // If disabled, emit empty array to submit all variables
        this.$emit('input', []);
        this.$emit('change', []);
      }
    },
    isEnabled(newValue, oldValue) {
      if (newValue && !oldValue) {
        // When enabled for the first time, select all variables
        this.selectedVariables = [...this.availableVariables];
        this.$emit('input', this.selectedVariables);
        this.$emit('change', this.selectedVariables);
      } else if (!newValue) {
        // When disabled, clear selection to submit all variables
        this.selectedVariables = [];
        this.$emit('input', []);
        this.$emit('change', []);
      }
    },
    'selectedControl.config.event'(newVal) {
      this.event = newVal;
    },
    formConfig: {
      handler() {
        this.$nextTick(() => {
          this.cleanupInvalidSelections();
        });
      },
      deep: true,
      immediate: true
    },
    // Watch for computed properties changes
    computedPropertiesSource: {
      handler() {
        this.$nextTick(() => {
          this.cleanupInvalidSelections();
        });
      },
      deep: true
    },
    // Watch for watchers changes
    watchersSource: {
      handler() {
        this.$nextTick(() => {
          this.cleanupInvalidSelections();
        });
      },
      deep: true
    }
  },
  methods: {
    /**
     * Remove selected variables that no longer exist in availableVariables
     */
    cleanupInvalidSelections() {
      const available = this.availableVariables;
      const validSelected = this.selectedVariables.filter(v => available.includes(v));
      if (validSelected.length !== this.selectedVariables.length) {
        this.selectedVariables = validSelected;
        // Turn off toggle if no variables remain selected
        if (validSelected.length === 0) {
          this.isEnabled = false;
        }
      }
    },
    /**
     * Load variables from the variables tree
     * Only includes root-level variables (no prefix, no dots in name)
     */
    loadVariables(def, prefix = '', variables = {}) {
      if (!Array.isArray(def)) {
        return { variables, prefix };
      }
      
      def.forEach(item => {
        // Include root-level variables only
        if (item.name && !item.prefix && !prefix) {
          const variableName = item.name;
          if (!variableName.includes('.') && !variableName.startsWith('_parent.')) {
            variables[variableName] = null;
          }
        }
        
        // Skip nested container items
        if (item.items && Array.isArray(item.items) && item.prefix) {
          return;
        }
      });
      
      return { variables, prefix };
    },
    
    selectAll() {
      this.selectedVariables = [...new Set([...this.selectedVariables, ...this.filteredVariables])];
    },
    
    deselectAll() {
      const filteredSet = new Set(this.filteredVariables);
      this.selectedVariables = this.selectedVariables.filter(v => !filteredSet.has(v));
    },
    
    toggleSelectAll(checked) {
      if (checked) {
        this.selectAll();
      } else {
        this.deselectAll();
      }
    },
    
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.searchQuery = '';
      }
    },
    
    /**
     * Check if a variable name is valid
     * Uses same logic as dot_notation validation rule
     */
    isValidVariableName(name) {
      if (!name || typeof name !== 'string') {
        return false;
      }
      if (name.startsWith('_parent.')) {
        return false;
      }
      // Same regex as dot_notation: starts with letter, followed by letters, numbers, or underscores
      const validPartRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      const parts = name.split('.');
      return parts.every(part => validPartRegex.test(part));
    },
    
    /**
     * Extract calculated variables (computed properties) from the screen
     * Searches in multiple locations: App.vue, builder, or parent components
     */
    extractCalculatedVariables() {
      const calculatedVars = {};
      const computed = this.getComputedProperties();
      
      if (Array.isArray(computed) && computed.length > 0) {
        computed.forEach(calc => {
          if (calc.property && !calc.byPass && !calc.property.startsWith('_parent.')) {
            calculatedVars[calc.property] = null;
          }
        });
      }
      
      return calculatedVars;
    },
    
    /**
     * Get computed properties from various sources
     */
    getComputedProperties() {
      // Try App.vue (root component)
      if (this.$root?.$data?.computed) {
        return this.$root.$data.computed;
      }
      
      // Try $root.$children[0] (App.vue pattern)
      if (this.$root?.$children?.[0]?.computed && Array.isArray(this.$root.$children[0].computed)) {
        return this.$root.$children[0].computed;
      }
      
      // Try builder sources
      if (this.builder?.screen?.computed) {
        return this.builder.screen.computed;
      }
      if (this.builder?.computed) {
        return this.builder.computed;
      }
      
      // Try parent components
      if (this.$root?.$parent?.computed) {
        return this.$root.$parent.computed;
      }
      
      // Search in parent chain
      let parent = this.$parent;
      for (let depth = 0; depth < 10 && parent; depth++) {
        if (parent.$data?.computed) {
          return parent.$data.computed;
        }
        parent = parent.$parent;
      }
      
      return [];
    },

    /**
     * Extract watcher output variables from the screen
     */
    extractWatcherVariables() {
      const watcherVars = {};
      const watchers = this.getWatchers() || [];
      
      watchers.forEach(watcher => {
        if (watcher.byPass) return;
        
        // Output variable (for scripts)
        if (watcher.output_variable) {
          watcherVars[watcher.output_variable] = null;
        }
        
        // Data mapping variables (for data sources)
        try {
          const config = typeof watcher.script_configuration === 'string'
            ? JSON.parse(watcher.script_configuration)
            : watcher.script_configuration;
          (config?.dataMapping || []).forEach(m => {
            if (m.key) watcherVars[m.key] = null;
          });
        } catch {
          console.error('Invalid JSON in script_configuration for watcher:', watcher.name);
        }
      });
      
      return watcherVars;
    },
    
    /**
     * Get watchers from various sources
     */
    getWatchers() {
      return this.$root?.$data?.watchers 
        || this.$root?.$children?.[0]?.watchers 
        || this.$root?.$children?.[0]?.$data?.watchers 
        || [];
    },
    
    /**
     * Extract variables from form config
     * Recursively searches through all pages and items
     */
    extractVariablesFromConfig(config, prefix = '', variables = {}) {
      if (!Array.isArray(config)) {
        return variables;
      }
      
      config.forEach(page => {
        if (Array.isArray(page.items)) {
          this.extractVariablesFromConfigItems(page.items, prefix, variables);
        }
      });
      
      return variables;
    },
    
    /**
     * Recursively extract variables from config items
     */
    extractVariablesFromConfigItems(items, prefix = '', variables = {}, depth = 0) {
      if (!Array.isArray(items)) {
        return;
      }
      
      items.forEach(item => {
        // Extract variable from current item
        this.extractVariableFromItem(item, variables);
        
        // Handle special component types (Open/Closed Principle)
        this.processSpecialComponents(item, prefix, variables, depth);
        
        // Process nested items in containers
        this.processNestedItems(item, prefix, variables, depth);
      });
    },
    
    /**
     * Extract variable name from a single item
     * Single Responsibility: Only handles variable name extraction
     */
    extractVariableFromItem(item, variables) {
      // Components that don't have submittable variables
      const displayOnlyComponents = [
        'FormNestedScreen',
        'FormHtmlViewer',
        'FormMultiColumn',
        'FormCollectionRecordControl',
        'FormCollectionViewControl',
        'FormAvatar',
        'FormListTable',
        'FormAnalyticsChart',
        'CaseProgressBar',
        'FileDownload',
      ];
      // Skip display-only and container components that don't have submittable variables
      if (displayOnlyComponents.includes(item.component)) {
        return;
      }
      const variableName = item.config?.name;
      if (variableName && !variableName.startsWith('_parent.')) {
        variables[variableName] = null;
      }
    },
    
    /**
     * Process special component types
     */
    processSpecialComponents(item, prefix, variables, depth) {
      const componentHandlers = {
        'FormNestedScreen': () => this.extractFromNestedScreen(item, prefix, variables, depth),
        // Add more special component handlers here in the future
      };
      
      const handler = componentHandlers[item.component];
      if (handler) {
        handler();
      }
    },
    
    /**
     * Extract variables from FormNestedScreen
     */
    extractFromNestedScreen(item, prefix, variables, depth) {
      if (!item.config?.screen) {
        return;
      }
      
      const nestedScreenPages = this.getNestedScreenPages(item.config.screen);
      if (!nestedScreenPages) {
        return;
      }
      
      nestedScreenPages.forEach(page => {
        if (Array.isArray(page.items)) {
          this.extractVariablesFromConfigItems(page.items, prefix, variables, depth + 1);
        }
      });
    },
    
    /**
     * Get nested screen pages from global store
     */
    getNestedScreenPages(screenId) {
      const globalObject = typeof window === 'undefined' ? global : window;
      
      if (!globalObject.nestedScreens) {
        return null;
      }
      
      const nestedScreenData = globalObject.nestedScreens[`id_${screenId}`];
      return Array.isArray(nestedScreenData) ? nestedScreenData : null;
    },
    
    /**
     * Process nested items in containers
     */
    processNestedItems(item, prefix, variables, depth) {
      if (!Array.isArray(item.items) || item.items.length === 0) {
        return;
      }
      
      if (this.isMultiColumn(item)) {
        this.processMultiColumnItems(item.items, prefix, variables, depth);
      } else {
        this.processRegularContainerItems(item.items, prefix, variables, depth);
      }
    },
    
    /**
     * Process FormMultiColumn items
     */
    processMultiColumnItems(items, prefix, variables, depth) {
      items.forEach(columnItems => {
        if (Array.isArray(columnItems) && columnItems.length > 0) {
          this.extractVariablesFromConfigItems(columnItems, prefix, variables, depth + 1);
        }
      });
    },
    
    /**
     * Process regular container items
     */
    processRegularContainerItems(items, prefix, variables, depth) {
      this.extractVariablesFromConfigItems(items, prefix, variables, depth + 1);
    },

    /**
     * Check if an item is a FormMultiColumn
     */
    isMultiColumn(item) {
      return item.component === 'FormMultiColumn';
    },
    
    /**
     * Check if a validation item indicates required field
     */
    isRequiredValidation(validation) {
      if (typeof validation === 'string') {
        return validation.includes('required');
      }
      if (Array.isArray(validation)) {
        return validation.some(v => {
          if (typeof v === 'string') return v.includes('required');
          if (v?.value && typeof v.value === 'string') return v.value.includes('required');
          if (v?.rule && typeof v.rule === 'string') return v.rule.includes('required');
          return false;
        });
      }
      return false;
    },
    
    /**
     * Recursively find required fields in form config
     */
    findRequiredFields(items, required) {
      if (!Array.isArray(items)) return;
      
      items.forEach(item => {
        const { validation, name } = item.config || {};
        
        // Add to required list if has required validation
        if (name && !name.startsWith('_parent.') && this.isRequiredValidation(validation)) {
          required.push(name);
        }
        
        // Handle FormNestedScreen components
        if (item.component === 'FormNestedScreen' && item.config?.screen) {
          const nestedScreenPages = this.getNestedScreenPages(item.config.screen);
          if (nestedScreenPages) {
            nestedScreenPages.forEach(page => {
              if (Array.isArray(page.items)) {
                this.findRequiredFields(page.items, required);
              }
            });
          }
        }
        
        // Recurse into nested items
        if (Array.isArray(item.items)) {
          if (this.isMultiColumn(item)) {
            item.items.forEach(columnItems => {
              if (Array.isArray(columnItems)) {
                this.findRequiredFields(columnItems, required);
              }
            });
          } else {
            this.findRequiredFields(item.items, required);
          }
        }
      });
    }
  },
  mounted() {
    this.event = this.selectedControl?.config?.event || '';
    this.selectedVariables = this.value || [];
    
    // Force update to ensure variables tree is loaded
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }
};
</script>

<style scoped>
/* Wrapper Container */
.variables-to-submit-wrapper {
  padding: 0;
}

/* Card Container with Border */
.variables-to-submit-card {
  background-color: #ffffff;
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 0 0 12px 0;
}

.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.toggle-switch {
  margin: 0;
}

/* Description Text */
.description-text {
  margin-top: 8px;
  margin-bottom: 0;
  padding: 0;
}

.description-text p {
  margin: 0;
  font-size: 13px;
  color: #6c757d;
  line-height: 1.5;
}

/* Controls Section (Select All + Search) */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 0;
}

.select-all-checkbox {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.select-all-checkbox >>> .custom-control-label {
  cursor: pointer;
  user-select: none;
}

.search-button {
  background: #fff;
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 6px 12px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.search-button i {
  font-size: 14px;
}

/* Search Container */
.search-container {
  margin-bottom: 12px;
}

.search-input {
  border-radius: 6px;
  font-size: 14px;
}

.clear-search-button {
  border-radius: 0 6px 6px 0;
}

/* Divider */
.divider {
  height: 1px;
  background-color: #e3e8ef;
  margin: 16px 0 12px 0;
}

/* Variables List */
.variables-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 0;
  margin-top: 12px;
  background-color: transparent;
}

.variables-list::-webkit-scrollbar {
  width: 8px;
}

.variables-list::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
}

.variables-list::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 4px;
}

.variables-list::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Variable Item */
.variable-item {
  padding: 12px 0;
  border-bottom: 1px solid #e3e8ef;
  transition: background-color 0.15s ease;
}

.variable-item:hover {
  background-color: transparent;
}

.variable-item:last-child {
  border-bottom: none;
}

.variable-checkbox {
  margin: 0;
  width: 100%;
}

.variable-checkbox >>> .custom-control-label {
  cursor: pointer;
  user-select: none;
  width: 100%;
}

.variable-name {
  color: #212529;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
}

/* No Results */
.no-results {
  padding: 32px 16px;
  text-align: center;
  color: #6c757d;
}

.no-results small {
  font-size: 14px;
}

/* Warning Alert (outside card) */
.warning-alert {
  display: flex;
  align-items: flex-start;
  margin: 0 0 12px 0;
  padding: 12px 16px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.warning-icon {
  color: #ffc107;
  margin-right: 10px;
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 16px;
}

.warning-text {
  color: #856404;
  flex: 1;
}

.warning-text strong {
  color: #664d03;
  font-weight: 600;
}
</style>
