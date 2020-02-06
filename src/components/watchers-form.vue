<template>
  <div>
    
    
    
    <div class="accordion" id="watcherAccordion">
        <div class="card card-overflow">
            <div class="card-header p-0">
                <div class="mb-0">
                    <button class="p-3 btn btn-link d-flex w-100 text-capitalize text-reset justify-content-between" type="button" data-toggle="collapse" data-target="#watcherConfig">
                        <div><i class="fas fa-fw fa-cog"></i> Configuration</div>
                        <div><i class="fas fa-angle-down arrow-open mr-2"></i> <i class="fas fa-angle-right arrow-closed mr-2"></i></div>  
                    </button>
                </div>
            </div>
            <div id="watcherConfig" class="collapse show" data-parent="#watcherAccordion">
                <div class="card-body pt-3 px-3 pb-0">
                  <form-input
                    ref="name"
                    v-model="config.name"
                    :label="$t('Watcher Name')"
                    :name="$t('Watcher Name')"
                    :validation="ruleWatcherName"
                    :helper="$t('A name to describe this Watcher')"
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
                    :helper="$t('The variable to watch on this screen')"
                    @open="loadVariables"
                  />
                  <div v-if="ruleWatcherVariable && !config.watching" class="mt-n2 mb-3 invalid-feedback d-block">
                    <div>{{ $t('The Variable to Watch field is required') }}</div>
                  </div>
                  
                  <form-checkbox
                    :name="$t('Run Synchronously')"
                    :label="$t('Run Synchronously')"
                    v-model="config.synchronous"
                    :toggle="true"
                    :helper="$t('Wait for the Watcher to run before accepting more input')"
                  />
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header p-0">
                <div class="mb-0">
                    <button class="p-3 btn btn-link collapsed d-flex w-100 text-capitalize text-reset justify-content-between" type="button" data-toggle="collapse" data-target="#watcherSource">
                        <div><i class="fas fa-fw fa-file-upload"></i> Source</div>
                        <div><i class="fas fa-angle-down arrow-open mr-2"></i> <i class="fas fa-angle-right arrow-closed mr-2"></i></div>  
                    </button>
                </div>
            </div>
            <div id="watcherSource" class="collapse" data-parent="#watcherAccordion">
                <div class="card-body pt-3 px-3 pb-0">
                  <form-multi-select
                    :name="$t('Source')"
                    :label="$t('Source')"
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
                    :helper="$t('The source to access when this Watcher runs')"
                  />
                  <div v-if="ruleWatcherScript && !config.script" class="invalid-feedback d-block mt-n2 mb-3">
                    <div>{{ $t('The Source field is required') }}</div>
                  </div>

                  <div v-if="isScript">
                    <div class="form-group">
                      <label>{{ $t('Input Data') }}</label>
                      <div class="editor-border" :class="{'is-invalid':inputDataInvalid}"/>
                      <monaco-editor
                        :options="monacoOptions"
                        class="editor"
                        v-model="config.input_data"
                        language="json"
                      />
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
                      <div class="editor-border" :class="{'is-invalid':scriptConfigurationInvalid}"/>
                      <monaco-editor
                        :options="monacoOptions"
                        class="editor"
                        v-model="config.script_configuration"
                        language="json"
                      />
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
                      :helper="$t('The Data Connector endpoint to access when this Watcher runs')"
                    />
                    <div class="form-group">
                      <label>{{ $t('Input Data') }}</label>
                      <div class="editor-border" :class="{'is-invalid':inputDataInvalid}"/>
                      <monaco-editor
                        :options="monacoOptions"
                        class="editor"
                        v-model="config.input_data"
                        language="json"
                      />
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
        <div class="card">
            <div class="card-header p-0">
                <div class="mb-0">
                    <button class="p-3 btn btn-link collapsed d-flex w-100 text-capitalize text-reset justify-content-between" type="button" data-toggle="collapse" data-target="#watcherOutput">
                        <div><i class="fas fa-fw fa-file-download"></i> Output</div>
                        <div><i class="fas fa-angle-down arrow-open mr-2"></i> <i class="fas fa-angle-right arrow-closed mr-2"></i></div>  
                    </button>
                </div>
            </div>
            <div id="watcherOutput" class="collapse" data-parent="#watcherAccordion">
                <div class="card-body pt-3 px-3 pb-0">
                  <form-input
                    ref="propOutputVariableName"
                    v-model="config.output_variable"
                    :label="$t('Output Variable')"
                    :name="$t('Output Variable')"
                    :helper="$t('The variable that will store the output of the Watcher')"
                    :validation="ruleWatcherOutputVariable"
                  />
                  <data-mapping v-if="isDatasource" v-model="config.script_configuration" />
                </div>                
            </div>
        </div>        
    </div>

    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-outline-secondary" @click.stop="displayTableList">{{ $t('Cancel') }}</button>
      <button
        class="btn btn-secondary ml-3"
        @click="validateDataAndSave"
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

const globalObject = typeof window === 'undefined'
  ? global
  : window;

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
    jsonIsValid(item) {
      try {
        JSON.parse(this.config[item]);
      } catch (e) {
        return false;
      }
      return true;
    },
    isFormValid() {
      this.setValidations();
      for (let item in this.$refs) {
        if (this.$refs[item].name && this.$refs[item].validator && this.$refs[item].validator.errorCount !== 0) {
          return false;
        }
      }

      return !(!this.config.watching ||
        !this.config.script ||
        !this.jsonIsValid('input_data') ||
        !this.jsonIsValid('script_configuration'));
    },
    validateDataAndSave() {
      if (!this.isFormValid()) {
        if (globalObject.ProcessMaker && globalObject.ProcessMaker.alert) {
          globalObject.ProcessMaker.alert(this.$t('An error occurred. Check the form for errors in red text.'), 'danger');
        }
        return;
      }

      if (!this.config.uid) {
        this.config.uid = _.uniqueId(new Date().getTime());
      }

      this.save();
    },
    save() {
      this.$emit('save-form');
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
