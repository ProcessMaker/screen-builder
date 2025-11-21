<template>
  <div v-if="event === 'submit'">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0 text-dark font-weight-bold">{{ $t('Submit Information') }}</h6>
      <b-form-checkbox
        v-model="isEnabled"
        switch
        size="lg"
        class="mb-0"
        data-cy="variables-to-submit-toggle"
      >
      </b-form-checkbox>
    </div>
    
    <hr class="my-3 border-light" />
    
    <div v-if="!isEnabled" class="text-muted text-center py-3">
      <small>{{ $t('Select variables to submit, otherwise all variables will be submitted by default.') }}</small>
    </div>
    
    <div v-else-if="availableVariables.length === 0" class="alert alert-info">
      <small>{{ $t('No variables available. Variables will be available after you add form fields to your screen.') }}</small>
    </div>
    
    <div v-else>
      <!-- Select All and Search Section -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button
          type="button"
          class="btn btn-link p-0 text-primary font-weight-bold select-all-btn"
          @click="selectAll"
          :disabled="filteredVariables.length === 0 || selectedVariables.length === filteredVariables.length"
          data-cy="variables-to-submit-select-all"
        >
          {{ $t('Select All') }}
        </button>
        <b-button
          variant="outline-secondary"
          size="sm"
          @click="toggleSearch"
          data-cy="variables-to-submit-search-toggle"
        >
          <i class="fas fa-search"></i>
        </b-button>
      </div>
      
      <!-- Search Input (shown when search is active) -->
      <div v-if="showSearch" class="mb-3">
        <b-input-group>
          <b-form-input
            v-model="searchQuery"
            :placeholder="$t('Search variables...')"
            data-cy="variables-to-submit-search"
          />
          <b-input-group-append>
            <b-button @click="searchQuery = ''" :disabled="!searchQuery" data-cy="variables-to-submit-clear-search" variant="outline-secondary">
              <i class="fas fa-times"></i>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      
      <hr class="my-3 border-light" />
      
      <!-- Variables List -->
      <div class="variables-list">
        <div
          v-for="variable in filteredVariables"
          :key="variable"
          class="variable-item d-flex align-items-center px-3 py-2"
          :data-cy="`variable-item-${variable}`"
        >
          <b-form-checkbox
            v-model="selectedVariables"
            :value="variable"
            class="mb-0 mr-2"
            :data-cy="`variable-checkbox-${variable}`"
          >
          </b-form-checkbox>
          <span class="variable-name">{{ variable }}</span>
        </div>
        <div v-if="filteredVariables.length === 0" class="text-muted text-center py-4">
          <small>{{ $t('No variables match your search.') }}</small>
        </div>
      </div>
      
      <!-- Warning for missing required fields -->
      <b-alert 
        v-if="isEnabled && missingRequiredVariables.length > 0"
        show 
        variant="warning"
        class="mt-3 mb-0 d-flex align-items-start"
        data-cy="missing-required-warning"
      >
        <i class="fas fa-bolt warning-icon"></i>
        <span>
          {{ $t('The following required fields are not included') }} "<strong>{{ missingRequiredVariables.join('", "') }}</strong>".
          {{ $t('This may cause validation errors during submission.') }}
        </span>
      </b-alert>
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
      
      // Filter: exclude _parent variables, include all others
      return Object.keys(variables)
        .filter(variable => !variable.startsWith('_parent.'))
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
    isEnabled(newValue) {
      if (!newValue) {
        // When disabled, clear selection to submit all variables
        this.selectedVariables = [];
        this.$emit('input', []);
        this.$emit('change', []);
      }
    },
    'selectedControl.config.event'(newVal) {
      this.event = newVal;
    },
    'builder.variablesTree'() {
      // Force recomputation when variables tree changes
      this.$forceUpdate();
    },
    // Watch for computed properties changes in App.vue
    '$root.computed'() {
      // Force recomputation when computed properties change
      this.$forceUpdate();
    }
  },
  methods: {
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
    
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.searchQuery = '';
      }
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
.select-all-btn {
  text-decoration: none;
  font-size: 0.95rem;
}

.variables-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0;
  background-color: #fff;
}

.variable-item {
  border-bottom: 1px solid #f0f0f0;
}

.variable-item:last-child {
  border-bottom: none;
}

.variable-name {
  color: #333;
  font-size: 0.9rem;
}

.warning-icon {
  color: #f39c12;
  margin-right: 0.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}
</style>
