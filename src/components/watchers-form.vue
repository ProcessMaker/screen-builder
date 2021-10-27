<template>
  <div>
    <div class="accordion" id="watcherAccordion">
      <div class="card card-overflow">
        <div class="card-header p-0">
          <div class="mb-0">
            <button class="p-3 btn btn-link d-flex w-100 text-capitalize text-reset justify-content-between" type="button" data-toggle="collapse" data-target="#watcherConfig" ref="watcherConfigButton" data-cy="watchers-accordion-configuration">
              <div><i class="fas fa-fw fa-cog"/> Configuration</div>
              <div><i class="fas fa-angle-down arrow-open mr-2"/> <i class="fas fa-angle-right arrow-closed mr-2"/></div>
            </button>
          </div>
        </div>
        <div id="watcherConfig" class="collapse show" data-parent="#watcherAccordion">
          <div class="card-body pt-3 px-3 pb-0">
            <form-input
              ref="name"
              v-model="config.name"
              :label="$t('Watcher Name') + ' *'"
              :name="$t('Watcher Name')"
              :validation="ruleWatcherName"
              :helper="$t('A name to describe this Watcher')"
              data-cy="watchers-watcher-name"
              required
              aria-required="true"
            />

            <form-multi-select
              :name="$t('Variable to Watch')"
              :label="$t('Variable to Watch') + ' *'"
              :options="variables"
              :taggable="true"
              v-model="config.watching"
              :placeholder="$t('None')"
              :multiple="false"
              :show-labels="false"
              :internal-search="true"
              :validation="ruleWatcherVariable"
              :helper="$t('Select the variable to watch on this screen or type any request variable name')"
              @open="loadVariables"
              @tag="addTag"
              :tag-placeholder="$t('Press enter to use this variable')"
              data-cy="watchers-watcher-variable"
              ref="watching"
            />

            <form-checkbox
              :name="$t('Run Synchronously')"
              :label="$t('Run Synchronously')"
              v-model="config.synchronous"
              :toggle="true"
              :helper="$t('Wait for the Watcher to run before accepting more input')"
              data-cy="watchers-watcher-synchronous"
            />

            <form-checkbox
              v-show="!config.synchronous"
              :name="$t('Show message while loading remote data')"
              :label="$t('Show message while loading remote data')"
              v-model="config.show_async_loading"
              :toggle="true"
              data-cy="watchers-watcher-show-loading"
            />

            <form-checkbox
              :name="$t('Run Watcher on Screen Load')"
              :label="$t('Run watcher on Screen Load')"
              v-model="config.run_onload"
              :toggle="true"
              data-cy="watchers-watcher-run-onload"
            />
          </div>
        </div>
      </div>
      <div class="card" style="overflow:visible">
        <div class="card-header p-0">
          <div class="mb-0">
            <button class="p-3 btn btn-link collapsed d-flex w-100 text-capitalize text-reset justify-content-between" type="button" data-toggle="collapse" data-target="#watcherSource" ref="watcherSourceButton" data-cy="watchers-accordion-source">
              <div><i class="fas fa-fw fa-file-upload"/> Source</div>
              <div><i class="fas fa-angle-down arrow-open mr-2"/> <i class="fas fa-angle-right arrow-closed mr-2"/></div>
            </button>
          </div>
        </div>
        <div id="watcherSource" class="collapse" data-parent="#watcherAccordion">
          <div class="card-body pt-3 px-3 pb-0">
            <form-multi-select
              :name="$t('Source')"
              :label="$t('Source') + ' *'"
              :options="scripts"
              v-model="config.script"
              :placeholder="$t('None')"
              :multiple="false"
              :show-labels="false"
              :searchable="true"
              optionValue="id"
              optionContent="title"
              group-values="items"
              group-label="type"
              :validation="ruleWatcherScript"
              @open="loadSources"
              :helper="$t('The source to access when this Watcher runs')"
              data-cy="watchers-watcher-source"
              ref="script"
            />

            <div v-if="isScript">
              <b-alert v-if="config.script" show variant="warning">
                <i class="fas fa-exclamation-triangle" />
                {{ $t('Using watchers with Scripts can slow the performance of your screen.') }}
              </b-alert>
              <div class="form-group">
                <label>{{ $t('Input Data') }}</label>
                <div class="form-border" :class="{'is-invalid': !jsonIsValid('input_data')}">
                  <monaco-editor
                    :options="monacoOptions"
                    class="editor"
                    v-model="config.input_data"
                    language="json"
                    data-cy="watchers-watcher-input_data"
                    ref="input_data"
                    @editorDidMount="inputDataEditorMounted"
                  />
                </div>
                <small class="form-text text-muted">{{ $t('Data to pass to the script (valid JSON object, variables supported)') }}</small>
                <div v-if="inputDataInvalid" class="invalid-feedback d-block">
                  <div>{{ $t('The Input Data field is required') }}</div>
                </div>
                <div v-if="!jsonIsValid('input_data')" class="invalid-feedback d-block">
                  <div>{{ $t('This must be valid JSON') }}</div>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('Script Configuration') }}</label>
                <div class="form-border" :class="{'is-invalid': !jsonIsValid('script_configuration')}">
                  <monaco-editor
                    :options="monacoOptions"
                    class="editor"
                    v-model="config.script_configuration"
                    language="json"
                    data-cy="watchers-watcher-script_configuration"
                    ref="script_configuration"
                    @editorDidMount="scriptConfigEditorMounted"
                  />
                </div>
                <small class="form-text text-muted">{{ $t('Configuration data for the script (valid JSON object, variables supported)') }}</small>
                <div v-if="scriptConfigurationInvalid" class="invalid-feedback d-block">
                  <div>{{ $t('The Script Configuration field is required') }}</div>
                </div>
                <div v-if="!jsonIsValid('script_configuration')" class="invalid-feedback d-block">
                  <div>{{ $t('This must be valid JSON') }}</div>
                </div>
              </div>
            </div>
            <div v-if="isDatasource">
              <div class="form-group">
                <form-multi-select
                  :name="$t('Resource')"
                  :label="$t('Resource')"
                  :options="endpoints"
                  v-model="endpoint"
                  :placeholder="$t('Select a resource')"
                  :multiple="false"
                  :show-labels="false"
                  :searchable="true"
                  :internal-search="false"
                  @search-change="loadEndpoints"
                  @open="loadEndpoints()"
                  :helper="$t('The Data Connector resource to access when this Watcher runs')"
                  data-cy="watchers-watcher-endpoint"
                  ref="endpoint"
                />
                <div v-if="endpointError" class="invalid-feedback d-block">
                  <div>{{ endpointError }}</div>
                </div>

                <div v-if="dataSourceConfigWarning.length > 0" class="invalid-feedback d-block">
                  <div> {{ dataSourceConfigWarning }}</div>
                </div>

                <a :href="dataSourceLink" v-show="dataSourceLink.length > 0" class="link-primary" target="_blank">
                  {{ $t('Open Data Connector') }} <i class="ml-1 fas fa-external-link-alt"/></a>
              </div>
              <outbound-config v-model="scriptConfig"  v-if="!hasInputData"/>
              <div class="form-group" v-if="hasInputData">
                <div class="row pl-3">
                  <span class="text-danger">
                    * Deprecation Warning: Recreate the watcher to use the new format.
                    Version 4.2 will not support Input Data as a JSON object.
                  </span>
                </div>
                <div class="row pl-3 mt-1">
                  <label>{{ $t('Input Data') }}</label>
                  <div class="form-border" :class="{'is-invalid': !jsonIsValid('input_data')}">
                    <monaco-editor
                      :options="monacoOptions"
                      class="editor"
                      v-model="config.input_data"
                      language="json"
                      data-cy="watchers-watcher-input_data"
                    />
                  </div>
                  <small class="form-text text-muted">{{ $t('Data to pass to the Data Connector (valid JSON object, variables supported)') }}</small>
                  <div v-if="inputDataInvalid" class="invalid-feedback d-block">
                    <div>{{ $t('The Input Data field is required') }}</div>
                  </div>
                  <div v-if="!jsonIsValid('input_data')" class="invalid-feedback d-block">
                    <div>{{ $t('This must be valid JSON') }}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="card" style="overflow:visible">
        <div class="card-header p-0">
          <div class="mb-0">
            <button class="p-3 btn btn-link collapsed d-flex w-100 text-capitalize text-reset justify-content-between" type="button" data-toggle="collapse" data-target="#watcherOutput" ref="watcherOutputButton" data-cy="watchers-accordion-output">
              <div><i class="fas fa-fw fa-file-download"/> Output</div>
              <div><i class="fas fa-angle-down arrow-open mr-2"/> <i class="fas fa-angle-right arrow-closed mr-2"/></div>
            </button>
          </div>
        </div>
        <div id="watcherOutput" class="collapse" data-parent="#watcherAccordion">
          <div class="card-body pt-3 px-3 pb-0">
            <form-input
              ref="propOutputVariableName"
              v-if="hasInputData || isScript"
              v-model="config.output_variable"
              :label="outputVarLabel"
              :name="$t('Output Variable')"
              :helper="$t('The variable that will store the output of the Watcher')"
              :validation="ruleWatcherOutputVariable"
              data-cy="watchers-watcher-output_variable"
              :required="ruleWatcherOutputVariable == 'required' ? true : false"
              :aria-required="ruleWatcherOutputVariable == 'required' ? true : false"
            />
            <data-mapping v-if="isDatasource" v-model="scriptConfig"/>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-outline-secondary" @click.stop="displayTableList" data-cy="watchers-button-cancel">{{ $t('Cancel') }}</button>
      <button
        class="btn btn-secondary ml-3"
        @click="validateDataAndSave"
        data-cy="watchers-button-save"
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
import OutboundConfig from './inspector/outbound-config';
import FocusErrors from '../mixins/focusErrors';

import _ from 'lodash';

const globalObject = typeof window === 'undefined'
  ? global
  : window;

export default {
  mixins: [FocusErrors],
  components: {
    FormInput,
    FormTextArea,
    FormMultiSelect,
    FormCheckbox,
    MonacoEditor,
    DataMapping,
    OutboundConfig,
  },
  props: {
    config: {
      type: Object,
      /* istanbul ignore next */
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
          run_onload:false,
          show_async_loading:false,
        };
      },
    },
  },
  data() {
    return {
      scriptConfig: '',
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
      newTags:[],
      scripts:[],
      script: null,
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: 'on',
        minimap: { enabled: false },
      },
      endpointError: null,
      inputDataEditor: null,
      scriptConfigEditor: null,
    };
  },
  watch: {
    scriptConfig(value) {
      try {
        const currentConf = JSON.parse(this.config.script_configuration);
        const newConf = JSON.parse(value);
        this.config.script_configuration = JSON.stringify({...currentConf, ...newConf});
      } catch {
        // Invalid json will get caught by the validator
      }
    },
    endpoint(endpoint) {
      this.setConfig('endpoint', endpoint);

      //load mappings
      let config = this.scriptConfig ? JSON.parse(this.scriptConfig) : {};
      let currentMappings = config.dataMapping || [];
      const dsList = this.scripts.find(list => list.items
          && list.items.length > 0
          && list.items[0].id
          && list.items[0].id.substr(0, 11) === 'data_source' );

      if (dsList && currentMappings.length === 0) {
        const ds = dsList.items.find(conn => 'data_source-' + config.dataSource === conn.id);
        const dsMappings = (ds.endpoints && ds.endpoints[endpoint] ? ds.endpoints[endpoint].dataMapping : []) || [];
        config.dataMapping = [];
        dsMappings.forEach(mapping => {
          config.dataMapping.push({key: mapping.key, value: mapping.value});
        });
        this.scriptConfig = JSON.stringify(config);
      }
    },
    config: {
      deep: true,
      immediate: true,
      handler(value) {
        if (!value.input_data) {
          value.input_data = '{}';
        }
        if (!value.script_configuration) {
          value.script_configuration = '{}';
        }
        else {
          this.scriptConfig = this.config.script_configuration;
        }
        this.endpoint = this.getConfig().endpoint;
      },
    },
    'config.script': {
      handler(value, oldValue) {
        if (!value) {
          this.config.script_id = '';
          this.config.script_key = '';
          this.config.datasource_script_id = '';
        } else if (typeof value === 'object') {
          let id = value.id.split('-');
          let oldSourceType = (oldValue && oldValue.id && oldValue.id.split('-').length > 0)
            ? oldValue.id.split('-')[0]
            : '';
          this.config.script_id = id[1];
          this.config.script_key = value.key;

          // If the type of the data source has changed (from script to data source or the other way around)
          if (oldSourceType !== id[0]) {
            this.config.script_configuration = '{}';
          }

          if (id[0] === 'data_source') {
            this.setConfig('dataSource', this.config.script_id);
          }
          this.config.datasource_script_id = value.dataSourceScriptId;
        }
        return value;
      },
    },
  },
  computed: {
    dataSourceLink() {
      const dataSourceId = this.selectedDataSourceId();
      const endPointId = this.endpoint;
      if (dataSourceId && endPointId) {
        return `/designer/data-sources/${dataSourceId}/resources/${endPointId}`;
      }
      return '';
    },
    dataSourceConfigWarning() {
      const dataSourceId = this.selectedDataSourceId();
      const connectors = this.scripts.find(connGroup => connGroup.type === 'Data Connectors');
      if (typeof connectors === 'undefined' || connectors === null) {
        return '';
      }
      const selectedDataSource = connectors.items.find(connector => connector.id === 'data_source-' + dataSourceId);
      if (typeof selectedDataSource === 'undefined' || connectors === null) {
        return '';
      }

      if (selectedDataSource.validationStatus.length > 0) {
        return selectedDataSource.validationStatus;
      }
      return '';
    },
    isDatasource() {
      return this.config.script && this.config.script.id.substr(0, 11) === 'data_source';
    },
    isScript() {
      return !this.config.script || this.config.script.id.substr(0, 6) === 'script';
    },
    hasInputData(){
      // just old versions of watchers have input data
      let config;
      try {
        config = JSON.parse(this.config.script_configuration);
      } catch {
        return false;
      }

      if (typeof config.input_data === 'undefined' || config.input_data == null) {
        return false;
      }
      return Object.keys(config.input_data).length === 0 && config.input_data.constructor === Object;
    },
    outputVarLabel() {
      const required = this.ruleWatcherOutputVariable == 'required' ? ' *' : '';
      return this.$t('Output Variable') + required;
    },
  },
  methods: {
    selectedDataSourceId() {
      let dataSourceId = null;
      try {
        dataSourceId = JSON.parse(this.scriptConfig).dataSource;
      } catch (e) {
        dataSourceId = null;
      }
      return dataSourceId;
    },
    setValidations() {
      this.ruleWatcherName = 'required';
      this.ruleWatcherVariable = 'required';
      this.ruleWatcherScript = 'required';
      if (this.hasInputData) {
        this.ruleWatcherOutputVariable = 'required';
      }
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
        this.scriptConfig = this.config.script_configuration;
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
    addTag(tag) {
      this.newTags.push(tag);
      this.config.watching = tag;
      this.variables = this.newTags.concat(this.variables);
    },
    loadVariables() {
      this.variables = [];
      //Search in all config screen
      this.findElements(this.$root.$children[0].config);
      this.variables = this.newTags.concat(this.variables);
      if (this.config.watching && !this.variables.includes(this.config.watching)) {
        this.variables.unshift(this.config.watching);
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
    loadSources() {
      this.scripts =  [];
      //call load data
      this.$root.$children[0].watchers_config.api.scripts.forEach( callback => {
        callback(this.scripts);
      });
    },
    displayTableList() {
      this.$emit('display-list');
    },
    jsonIsValid(item) {
      try {
        JSON.parse(this.config[item]);
      } catch (e) {
        return false;
      }
      return true;
    },
    isFormValid() {

      if (this.isDatasource && !this.endpoint) {
        this.endpointError = this.$t('Endpoint is required');
      } else {
        this.endpointError = null;
      }

      for (let item in this.$refs) {
        if (this.$refs[item] && this.$refs[item].name && this.$refs[item].validator && this.$refs[item].validator.errorCount !== 0) {
          return false;
        }
      }

      return !(!this.config.watching ||
        !this.config.script ||
        this.endpointError ||
        !this.jsonIsValid('input_data') ||
        !this.jsonIsValid('script_configuration'));
    },
    validateDataAndSave() {
      this.setValidations();
      this.$nextTick(() => { // allow validations to do their thing

        if (!this.isFormValid()) {
          globalObject.ProcessMaker.alert(this.$t('An error occurred. Check the form for errors in red text.'), 'danger');
          this.focusFirstWatcherError();
          return;
        }

        if (!this.config.uid) {
          this.config.uid = _.uniqueId(new Date().getTime());
        }

        this.save();
      });
    },
    save() {
      this.$emit('save-form');
    },
    inputDataEditorMounted(editor) {
      this.inputDataEditor = editor;
    },
    scriptConfigEditorMounted(editor) {
      this.scriptConfigEditor = editor;
    },
  },
};
</script>

<style lang="scss" scoped>
  .accordion {
    .card-overflow {
      overflow: visible;
    }

    .card-body label {
      display: block;
    }
    .arrow-open {
      display:inline-block;
    }
    .arrow-closed {
      display:none;
    }
    .collapsed .arrow-open {
      display: none;
    }
    .collapsed .arrow-closed {
      display: inline-block;
    }
  }

  .editor {
    height: 8.5em;
    z-index: 0;
  }

  .form-border {
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .form-border.is-invalid {
    border-color: #dc3545;
  }
</style>
