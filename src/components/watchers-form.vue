<template>
  <div class="form-group">
    <form-input
      ref="name"
      v-model="config.name"
      :label="$t('Watcher Name')"
      :name="$t('Watcher Name')"
      :validation="ruleWatcherName"
    />

    <form-multi-select
      :name="$t('Variable to Watch')"
      :label="$t('Variable to Watch')"
      :options="variables"
      v-model="config.watching"
      :placeholder="$t('None')"
      :multiple="false"
      :show-labels="false"
      :internal-search="true"
      :validation="ruleWatcherVariable"
      @open="loadVariables"
    />

    <form-multi-select
      :name="$t('Script Source')"
      :label="$t('Script Source')"
      :options="scripts"
      v-model="config.script"
      :placeholder="$t('None')"
      :multiple="false"
      :show-labels="false"
      :searchable="true"
      :internal-search="false"
      optionValue="id"
      optionContent="title"
      group-values="items"
      group-label="type"
      :validation="ruleWatcherScript"
      @open="loadSources"
      @search-change="loadSources"
    />

    <div v-show="isScript">
      <div class="form-group" style='position: relative;'>
        <label>{{ $t('Input Data') }}</label>
        <div class="editor-border" :class="{'is-invalid':inputDataInvalid}"/>
        <monaco-editor
          :options="monacoOptions"
          class="editor"
          v-model="config.input_data"
          language="json"
        />
        <small class="form-text text-muted">{{ $t('Valid JSON Object, Variables Supported') }}</small>
        <div v-if="inputDataInvalid" class="invalid-feedback d-block">
          <div>{{ $t('The Input Data field is required.') }}</div>
        </div>
      </div>

      <div class="form-group" style='position: relative;'>
        <label>{{ $t('Script Configuration') }}</label>
        <div class="editor-border" :class="{'is-invalid':scriptConfigurationInvalid}"/>
        <monaco-editor
          :options="monacoOptions"
          class="editor"
          v-model="config.script_configuration"
          language="json"
        />
        <small class="form-text text-muted">{{ $t('Valid JSON Object, Variables Supported') }}</small>
        <div v-if="scriptConfigurationInvalid" class="invalid-feedback d-block">
          <div>{{ $t('The Script Configuration field is required.') }}</div>
        </div>
      </div>

      <form-input
        ref="propOutputVariableName"
        v-model="config.output_variable"
        :label="$t('Output Variable Name')"
        :name="$t('Output Variable Name')"
        :helper="$t('Name of Variable to store the output')"
        :validation="ruleWatcherOutputVariable"
      />
    </div>
    <div v-show="isDatasource">
      <form-multi-select
        :name="$t('Endpoint')"
        :label="$t('Endpoint')"
        :options="endpoints"
        v-model="endpoint"
        :placeholder="$t('Select an endpoint')"
        :multiple="false"
        :show-labels="false"
        :searchable="true"
        :internal-search="false"
        @search-change="loadEndpoints"
        @open="loadEndpoints"
      />
      <div class="form-group" style='position: relative;'>
        <label>{{ $t('Input Data') }}</label>
        <div class="editor-border" :class="{'is-invalid':inputDataInvalid}"/>
        <monaco-editor
          :options="monacoOptions"
          class="editor"
          v-model="config.input_data"
          language="json"
        />
        <small class="form-text text-muted">{{ $t('Valid JSON Object, Variables Supported') }}</small>
        <div v-if="inputDataInvalid" class="invalid-feedback d-block">
          <div>{{ $t('The Input Data field is required.') }}</div>
        </div>
      </div>
      <data-mapping v-model="config.script_configuration" />

      <form-input
        ref="propOutputVariableName"
        v-model="config.output_variable"
        :label="$t('Output Variable Name')"
        :name="$t('Output Variable Name')"
        :helper="$t('Name of Variable to store the output')"
        :validation="ruleWatcherOutputVariable"
      />
    </div>

    <form-checkbox
      :name="$t('Run Synchronously')"
      :label="$t('Run Synchronously')"
      v-model="config.synchronous"
    />
    <div class="float-right mb-3">
      <button class="btn btn-outline-secondary" @click.stop="displayTableList">{{ $t('Cancel') }}</button>
      <button
        class="btn btn-secondary ml-2"
        @click="validateData"
      >
        {{ $t('Save') }}
      </button>
    </div>

  </div>

</template>

<script>
import {
  FormInput,
  FormTextArea,
  FormMultiSelect,
  FormCheckbox,
} from '@processmaker/vue-form-elements';
import MonacoEditor from 'vue-monaco';
import DataMapping from './inspector/data-mapping';
import _ from 'lodash';

export default {
  components: {
    FormInput,
    FormTextArea,
    FormMultiSelect,
    FormCheckbox,
    MonacoEditor,
    DataMapping,
  },
  props: {
    config: {
      type: Object,
      default() {
        return {
          name:'',
          watching:'',
          script:'',
          script_id:'',
          script_key:'',
          input_data:'{}',
          script_configuration:'{}',
          output_variable:'',
          synchronous:false,
        };
      },
    },
  },
  data() {
    return {
      endpoint: null,
      endpoints: [],
      ruleWatcherName: '',
      ruleWatcherVariable: '',
      ruleWatcherScript: '',
      ruleWatcherOutputVariable: '',
      required: true,
      inputDataInvalid: false,
      scriptConfigurationInvalid: false,
      variables:[],
      scripts:[],
      script: null,
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: 'on',
        minimap: { enabled: false },
      },
    };
  },
  watch: {
    endpoint(endpoint) {
      this.setConfig('endpoint', endpoint);
    },
    config: {
      deep: true,
      immediate: true,
      handler(value) {
        this.setValidations();
        if (!value.input_data) {
          value.input_data = '{}';
        }
        if (!value.script_configuration) {
          value.script_configuration = '{}';
        }
        this.endpoint = this.getConfig().endpoint;
      },
    },
    'config.script': {
      handler(value) {
        if (!value) {
          this.config.script_id = '';
          this.config.script_key = '';
          this.config.datasource_script_id = '';
        } else if (typeof value === 'object') {
          let id = value.id.split('-');
          this.config.script_id = id[1];
          this.config.script_key = value.key;
          if (id[0] === 'data_source') {
            this.setConfig('dataSource', this.config.script_id);
          }
          this.config.datasource_script_id = value.dataSourceScriptId;
        }
        return value;
      },
    },
    'config.name': {
      handler() {
        this.setValidations();
      },
    },
  },
  computed: {
    isDatasource() {
      return this.config.script && this.config.script.id.substr(0, 11) === 'data_source';
    },
    isScript() {
      return !this.config.script || this.config.script.id.substr(0, 6) === 'script';
    },
  },
  methods: {
    setValidations() {
      this.ruleWatcherName = 'required';
      this.ruleWatcherVariable = 'required';
      this.ruleWatcherScript = 'required';
      this.ruleWatcherOutputVariable = 'required';
    },
    getConfig() {
      try {
        return JSON.parse(this.config.script_configuration);
      } catch (e) {
        return {};
      }
    },
    setConfig(name, value) {
      const config = this.getConfig();
      if (JSON.stringify(config[name]) !== JSON.stringify(value)) {
        config[name] = value;
        this.config.script_configuration = JSON.stringify(config);
      }
    },
    loadEndpoints() {
      const datasourceId = this.config.script.id.substr(0, 11) === 'data_source'
        ? this.config.script.id.substr(12) : null;
      this.endpoints.splice(0);
      if (datasourceId  && window.ProcessMaker && window.ProcessMaker.apiClient) {
        window.ProcessMaker.apiClient.get(`/data_sources/${datasourceId}`).then((response) => {
          for (let name in response.data.endpoints) {
            this.endpoints.push(name);
          }
        });
      }
    },
    loadVariables() {
      this.variables = [];
      //Search in all config screen
      this.findElements(this.$root.$children[0].config);
    },
    findElements(items) {
      items.forEach(item => {
        //If the element has containers
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
      });
    },
    loadSources(filter) {
      this.scripts =  [];

      //call load data
      this.$root.$children[0].watchers_config.api.scripts.forEach( callback => {
        callback(this.scripts, filter);
      });
    },
    displayTableList() {
      this.$emit('display-list');
    },
    validateData() {
      this.setValidations();

      if (!this.config.uid) {
        this.config.uid = _.uniqueId(new Date().getTime());
      }

      let valid = true;
      for (let item in this.$refs) {
        if (this.$refs[item].name && this.$refs[item].validator && this.$refs[item].validator.errorCount !== 0) {
          valid = false;
        }
      }

      if (valid ) {
        this.save();
      }
    },
    save() {
      this.$emit('save-form');
    },
  },
};
</script>

<style lang="scss" scoped>
  .editor {
    height: 8.5em;
    z-index: 0;
  }

  .editor-border {
    border: 1px solid #ced4da;
    border-radius: 4px;
    overflow: hidden;
    height: 8.5em;
    position: absolute;
    pointer-events: none;
    width: 100%;
    z-index: 1;
  }

  .editor-border.is-invalid {
    border-color: #dc3545;
  }
</style>
