<template>
  <form-multi-select
    :name="$t('Variable to Watch')"
    :label="$t('Variable to Watch') + ' *'"
    :options="variables"
    :taggable="true"
    v-model="selectedVariable"
    :placeholder="$t('None')"
    :multiple="false"
    :show-labels="false"
    :internal-search="true"
    :validation="validation"
    :helper="helper"
    @open="loadVariables"
    @tag="addTag"
    :tag-placeholder="$t('Press enter to use this variable')"
    :data-cy="dataCy"
  />
</template>


<script>

import {
  FormMultiSelect,
} from '@processmaker/vue-form-elements';

export default {
  props: ["name", "label", "value", "helper", "validation", "dataCy"],
  components: { FormMultiSelect },
  data() {
    return {
      variables:[],
      newTags:[],
    };
  },
  computed: {
    selectedVariable: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    addTag(tag) {
      this.newTags.push(tag);
      this.selectedVariable = tag;
      this.variables = this.newTags.concat(this.variables);
    },
    loadVariables() {
      this.variables = [];
      //Search in all config screen
      this.findElements(this.$root.$children[0].config);
      this.variables = this.newTags.concat(this.variables);
      if (this.selectedVariable && !this.variables.includes(this.selectedVariable)) {
        this.variables.unshift(this.selectedVariable);
      }
    },
    findElements(items, screens=[]) {
      items.forEach(item => {
        //If the element has containers (Multi-columns)
        if (Array.isArray(item)) {
          this.findElements(item);
        }

        //If the element has items
        if (item.items) {
          this.findElements(item.items);
        }

        //If the element has configuration only
        if (item.config && item.config.name) {
          this.variables.push(item.config.name);
        }

        // Variables from Nested screens
        if (item.component === 'FormNestedScreen') {
          this.loadVariablesFromScreen(item.config.screen, screens);
        }
      });
    },
    loadVariablesFromScreen(id, screens) {
      if (screens.indexOf(id) === -1) {
        screens.push(id);
        if (id) {
          this.$dataProvider.getScreen(id)
            .then(response => {
              this.findElements(response.data.config);
            });
        }
      }
    },
  }
};
</script>
