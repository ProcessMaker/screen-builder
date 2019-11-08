<template>
  <div class="form-group">
    <form-input
      ref="name"
      v-model="config.name"
      :label="$t('Watcher Name')"
      :name="$t('Watcher Name')"
    />

    <form-multi-select
      :name="$t('Variable to Watch')"
      :label="$t('Variable to Watch')"
      :options="variables"
      v-model="config.variable"
      :placeholder="$t('None')"
      :multiple="false"
      :show-labels="false"
      :internal-search="true"
      @open="loadVariables"
    />

    <form-multi-select
      :name="$t('Script Source')"
      :label="$t('Script Source')"
      :options="scripts"
      v-model="config.script_id"
      :placeholder="$t('None')"
      :multiple="false"
      :show-labels="false"
      :searchable="true"
      :internal-search="false"
      optionValue="id"
      optionContent="title"
      group-values="items"
      group-label="type"
      @open="loadSources"
      @search-change="loadSources"
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
    />

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

export default {
  components: {
    FormInput,
    FormTextArea,
    FormMultiSelect,
    FormCheckbox,
    MonacoEditor,
  },
  props: {
    config: {
      type: Object,
      default() {
        return {
          name:'',
          variable:'',
          script_id:'',
          script_key:'',
          input_data:'',
          script_configuration:'',
          synchronous:false,
        };
      },
    },
  },
  data() {
    return {
      required: true,
      inputDataInvalid: false,
      scriptConfigurationInvalid: false,
      variables:[],
      scripts:[],
      monacoOptions: {
        automaticLayout: true,
        lineNumbers: 'on',
        minimap: { enabled: false },
      },
    };
  },
  watch: {
    config: {
      immediate:true,
      handler(value) {
        console.log('watch value...');
        console.log(value);
      },
    },
  },
  computed: {

  },
  methods: {
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
      if (!this.config.uid) {
        this.config.uid = _.uniqueId('watcher_');
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

