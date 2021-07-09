<template>
  <div>
    <div class="d-flex mb-1">
      <label class="flex-grow-1 m-0">{{ $t('Outbound Configuration') }}</label>
      <button
        type="button"
        class="btn-special-assignment-action btn btn-secondary btn-sm px-2"
        @click="addMapping"
      >+ {{ $t('Property') }}
      </button>
    </div>
    <table class="table table-striped table-sm border mb-1">
      <thead>
        <tr>
          <th scope="col">{{ $t('Type') }}</th>
          <th scope="col">{{ $t('Key') }}</th>
          <th scope="col"><div class="float-left">{{ $t('Value') }}</div> <mustache-helper class="float-left ml-2"/>  </th>
          <th scope="col">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row,i) in outboundConfig" :key="i">
          <td class="p-1">
            <multiselect
              v-model="row.type"
              :placeholder="$t('Select a parameter type')"
              :options="types"
              :multiple="false"
              :show-labels="false"
              :searchable="true"
              :internal-search="false"
            />
          </td>
          <td class="p-1">
            <multiselect
              v-model="row.key"
              :placeholder="$t('Select a connector property')"
              :options="apiProperties"
              :multiple="false"
              :show-labels="false"
              :searchable="true"
              :internal-search="false"
              @search-change="loadOptions(i)"
              @open="loadOptions(i)"
            >
              <template slot="noResult">
                <slot name="noResult">{{ $t('Not found') }}</slot>
              </template>
              <template slot="noOptions">
                <slot name="noOptions">{{ $t('Not available') }}</slot>
              </template>
            </multiselect>
          </td>
          <td class="p-1">
            <input
              v-model="row.value"
              name="value"
              :placeholder="$t('New Value')"
              type="text"
              class="form-control"
            >
          </td>
          <td class="align-middle text-right p-1">
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" @click="removeRowIndex(i)">
              <i class="fa fa-trash-alt" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <small class="form-text text-muted mb-3">
      {{ $t('Properties to map from a request variable to a Data Connector property') }}
      <br>
      {{ $t('The value can be a string or a mustache expression.') }} {{ $t('For example') }} <span v-pre> {{ var1 }} </span> {{ $t('will use the value stored in variable var1') }}
    </small>
  </div>
</template>


<script>

import MustacheHelper from './mustache-helper';
export default {
  components: { MustacheHelper },
  mixins: [],
  props: {
    value: String,
  },
  data() {
    return {
      field: '',
      outboundConfig: [],
      types: ['PARAM', 'HEADER', 'BODY'],
      apiProperties: [],
      type: null,
    };
  },
  methods: {
    getConfig() {
      try {
        return JSON.parse(this.value);
      } catch (e) {
        return {};
      }
    },
    setConfig(name, value) {
      const config = this.getConfig();
      if (JSON.stringify(config[name]) !== JSON.stringify(value)) {
        config[name] = value;
        this.$emit('input', JSON.stringify(config));
      }
    },
    removeRowIndex(index) {
      this.outboundConfig.splice(index, 1);
    },
    addMapping() {
      this.outboundConfig.push({type: 'PARAM', key: '', value: ''});
    },

    loadOptions(index) {
      const config = this.getConfig();
      this.apiProperties = [];
      if (window._.isNil(config.dataSource) || window._.isNil(config.endpoint)) {
        return;
      }

      // Strip GET, POST, etc from endpoint name
      let endpoint = config.endpoint;
      const parts = config.endpoint.split(':');
      if (parts.length > 1) {
        parts.shift();
        endpoint = parts.join('').trim();
      }


      window.ProcessMaker.apiClient.get(`/data_sources/${config.dataSource}`)
        .then(response  =>  {
          const rowType = this.outboundConfig[index].type;
          let endpointData = window._.get(response, `data.endpoints.${endpoint}`, null);
          if (endpointData === null) {
            return;
          }

          this.apiProperties = [];

          if (rowType === 'HEADER') {
            let headerProps = window._.get(endpointData, 'headers', []);

            this.apiProperties = headerProps.reduce((acc, header) => {
              if (window._.findIndex(this.apiProperties, {'key': header.key}) < 0) {
                acc.push(header.key);
              }
              return acc;
            },
            []);
          }

          if (rowType === 'PARAM') {
            let paramProps = window._.get(endpointData, 'params', []);
            this.apiProperties = paramProps.reduce((acc, param) => {
              if (window._.findIndex(this.apiProperties, {'key': param.key}) < 0) {
                acc.push(param.key);
              }
              return acc;
            },
            []);

            //add url parameters:
            const matchedParams = (endpointData.url || '').matchAll(/\{\{(.+?)\}\}/gm);
            for (const match of matchedParams) {
              const urlParam = match[1];
              // Add url param if it is not defined withing the connector's param list
              if (this.apiProperties.every(item => item !== urlParam)) {
                this.apiProperties.push(urlParam);
              }
            }
          }

          if (rowType === 'BODY') {
            const matchedParams = (endpointData.body || '').matchAll(/\{\{(.+?)\}\}/gm);
            for (const match of matchedParams) {
              const urlParam = match[1];
              // Add url param if it is not defined withing the connector's param list
              if (this.apiProperties.every(item => item !== urlParam)) {
                this.apiProperties.push(urlParam);
              }
            }
          }

        });
    },

  },
  watch: {
    outboundConfig: {
      deep: true,
      immediate: true,
      handler(outboundConfig) {
        this.setConfig('outboundConfig', outboundConfig);
      },
    },
    value: {
      immediate: true,
      handler() {
        const outboundConfig = this.getConfig().outboundConfig;
        if (outboundConfig) {
          this.outboundConfig.splice(0);
          outboundConfig.forEach(element => {
            this.outboundConfig.push(element);
          });
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-sm {
  border-radius: 2px;
  font-size: 12px;
  font-weight: bold;
  padding: 0px 3px;
}

.form-control-sm {
  border-radius: 2px;
  font-size: 12px;
  padding: 0px 3px;
}
</style>
