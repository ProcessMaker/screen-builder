<template>
  <div class="card mb-2" v-show="visible">

    <div class="card-header"> {{ title }}</div>

    <div class="card-body p-2">
      <label>{{ $t('Type') }}</label>
      <multiselect
        v-model="type"
        :placeholder="$t('Select a parameter type')"
        :options="types"
        :multiple="false"
        :show-labels="false"
        :searchable="true"
        :internal-search="false"
      >
        <template slot="noResult">
          <slot name="noResult">{{ $t('Not found') }}</slot>
        </template>
        <template slot="noOptions">
          <slot name="noOptions">{{ $t('Not available') }}</slot>
        </template>
      </multiselect>

      <label>{{ $t('Property') }}</label>
      <multiselect
        v-model="key"
        :placeholder="$t('Select a connector property')"
        :options="apiProperties"
        :multiple="false"
        :show-labels="false"
        :searchable="true"
        :internal-search="false"
        @search-change="loadOptions"
        @open="loadOptions"
      >
        <template slot="noResult">
          <slot name="noResult">{{ $t('Not found') }}</slot>
        </template>
        <template slot="noOptions">
          <slot name="noOptions">{{ $t('Not available') }}</slot>
        </template>
      </multiselect>
      <div v-if="optionError" class="invalid-feedback d-block text-right">
        <div>{{ optionError }}</div>
      </div>

      <label class="mt-3">{{ $t('Request Variable') }}</label>
      <b-form-input id="option-value" v-model="requestVariable" data-cy="inspector-request-variable"/>
      <div v-if="optionError" class="invalid-feedback d-block text-right">
        <div>{{ optionError }}</div>
      </div>

    </div>

    <div class="card-footer text-right p-2">
      <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="hideCard()" data-cy="option-cancel">
        {{ $t('Cancel') }}
      </button>
      <button type="button" class="btn btn-sm btn-secondary" @click="updateOption()" data-cy="option-save">
        {{ $t('Save') }}
      </button>
    </div>
  </div>
</template>


<script>
import Multiselect from 'vue-multiselect';

export default {
  components: {Multiselect},
  mixins: [],
  props: ['value', 'title', 'visible', 'action'],
  data() {
    return {
      requestVariable: null,
      optionError: null,
      outboundConfig: [],
      types: [],
      type: null,
      key: null,
      apiProperties: [],
      visibleLoc: this.visible || false,
    };
  },
  methods: {
    loadOptions() {
      return;
      this.connectorProperties = [];
      if (_.isNil(this.config.dataSource) || _.isNil(this.config.endpoint)) {
        return;
      }

      // Strip GET, POST, etc from endpoint name
      let endpoint = this.config.endpoint;
      const parts = this.config.endpoint.split(':');
      if (parts.length > 1) {
        parts.shift();
        endpoint = parts.join('').trim();
      }

      ProcessMaker.apiClient.get(`data_sources/${this.config.dataSource}`)
        .then(response => {
          console.log('xxx response:', response);
          let endpointData = _.get(response, `data.endpoints.${endpoint}`, null);
          if (endpointData === null) {
            return;
          }

          this.connectorProperties = [];

          if (this.connectorPropertyType === 'HEADER') {
            let headerProps = _.get(endpointData, 'headers', []);

            this.connectorProperties = headerProps.reduce((acc, header) => {
              if (_.findIndex(this.connectorProperties, {'key': header.key}) < 0) {
                acc.push(header.key);
              }
              return acc;
            },
            []);
          }

          if (this.connectorPropertyType === 'PARAM') {
            let paramProps = _.get(endpointData, 'params', []);
            this.connectorProperties = paramProps.reduce((acc, param) => {
              if (_.findIndex(this.connectorProperties, {'key': param.key}) < 0) {
                acc.push(param.key);
              }
              return acc;
            },
            []);

            //add url parameters:
            const matchedParams = endpointData.url.matchAll(/\{\{(.+?)\}\}/gm);
            for (const match of matchedParams) {
              const urlParam = match[1];
              // Add url param if it is not defined withing the connector's param list
              if (this.connectorProperties.every(item => item !== urlParam)) {
                this.connectorProperties.push(urlParam);
              }
            }
          }

          if (this.connectorPropertyType === 'BODY') {
            const matchedParams = endpointData.body.matchAll(/\{\{(.+?)\}\}/gm);
            for (const match of matchedParams) {
              const urlParam = match[1];
              // Add url param if it is not defined withing the connector's param list
              if (this.connectorProperties.every(item => item !== urlParam)) {
                this.connectorProperties.push(urlParam);
              }
            }
          }

        })
        .catch(error => {
          // Ingornre error
        });
    },

    hideCard() {
      this.$emit('hide-card-item', false);
    },
    updateOption() {
      this.$emit(`${this.action}-item`, {param: this.type, property: this.key, value: this.requestVariable});
    },
  },
  watch: {
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
