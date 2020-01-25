<template>
  <div class="form-group">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <label class="m-0">{{ label }}</label>
      <b-button class="" variant="secondary" size="sm" @click="showAddCard">{{ $t('Add Rule') }}</b-button>
    </div>
    <div v-if="showCard" class="card mb-2">
      <div class="card-body p-2">
        <!-- <b-form-select v-model="selected" :options="options"></b-form-select> -->
        <!-- TODO: USE MULITSELECT instead of a basic form select -->
        <multiselect
          label="content"
          track-by="value"
          v-model="selectedOption"
          :placeholder="$t('Select...')"
          :show-labels="false"
          :options="options"
        >
          <template slot="noResult">
            {{ $t('No elements found. Consider changing the search query.') }}
          </template>
          <template slot="noOptions">
            {{ $t('No Data Available') }}
          </template>
        </multiselect>
      </div>
      <div class="card-footer text-right p-2">
        <b-button @click="hideCard">{{ $t('Cancel') }}</b-button>
        <b-button @click="saveRule">{{ $t('Save') }}</b-button>
      </div>
    </div>
    <p v-if="!rules.length && !showCard">{{ $t('No validation rule(s)') }}</p>
    <div v-if="rules.length">
      <div role="tablist">
        <b-card v-for="(rule, index) in rules" class="mb-2" :key="index">
          <b-card-header header-tag="header" class="p-0" role="tab">
            <div class="p-1 d-flex justify-content-between align-items-center">
              {{ rule.content }}
              <div class="actions">
                <b-button variant="link" class="p-0 mr-1" v-if="rule.configs.length" v-b-toggle="rule.content"><i class="fas fa-cogs fa-fw"/></b-button>
                <b-button variant="link" class="p-0" @click="deleteRule(index)"><i class="fas fa-trash-alt fa-fw"/></b-button>
              </div>
            </div>
          </b-card-header>
          <b-collapse :id="rule.content" :accordion="rule.content" role="tabpanel">
            <b-card-body class="p-2"> 
              <div v-for="(config, index) in rule.configs" :key="index" class="mb-2">
                <div v-if="config.type === 'FormInput'">
                  <label>
                    {{ config.label }} 
                  </label>
                  <!-- TODO: Setup a way to configure validations that needs additional inputs. Currently trying to import vue-form-elements -->
                  <form-input v-model="config.value" class="form-control" :validation="config.validation"/>
                  <small class="form-text text-muted">{{ config.helper }}</small>
                </div>
                <label v-if="config.type === 'FormCheckBox'">
                  <b-form-checkbox   
                    :id="config.field" 
                    :name="config.field" 
                    v-model="config.value"
                  >
                    {{ config.label }} 
                  </b-form-checkbox>
                </label>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <small class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';

export default {
  props: ['label', 'value', 'helper', 'options', 'name'],
  components: {
    Multiselect,
  },
  data() {
    return {
      rules: [],
      showCard: false,
      selectedOption: '',
    };
  },
  computed: {
  },
  watch: {
    rules: {
      deep: true,
      handler(rules) {
        rules.forEach(rule => {
          console.log('rule', rule);
          // TODO: Setup a way to allow additional configurations for validartions
          if (rule.configs && rule.configs.length) {
            console.log('has config', rule.configs);
          }
        });
        
        // TODO: EMIT the rules
        // this.$emit('input', this.rules);
      }
    },
    value() {
      if (typeof this.value === 'string') {
        this.value = [];
      }
      this.rules = this.value;
    }
  },
  methods: {
    showAddCard() {
      this.showCard = true;
    },
    hideCard() {
      this.showCard = false;
    },
    saveRule() {
      this.rules.push(this.selectedOption);
      this.hideCard();
      this.selectedOption = '';
    },
    deleteRule(index) {
      this.rules.splice(index, 1);
    },
  },
  mounted() {
    if (typeof this.value === 'string') {
      this.value = [];
    }
    this.rules = this.value;
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  padding: 0;
}
</style>
