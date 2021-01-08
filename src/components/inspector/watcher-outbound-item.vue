<template>
  <div class="card mb-2" v-if="showOptionCard">

    <div class="card-header"> {{ $t('Add Option') }} </div>

    <div class="card-body p-2">
      <label for="option-param">{{ $t('Type') }}</label>
      <multiselect
        data-cy="inspector-connector-property-type"
        v-model="type"
        :placeholder="$t('Select a parameter type')"
        :options="typeOptions"
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

      <label for="option-property">{{ $t('Property') }}</label>
      <multiselect
        data-cy="inspector-connector-property"
        v-model="connectorProperty"
        :placeholder="$t('Select a connector property')"
        :options="connectorProperties"
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

      <label class="mt-3" for="option-value">{{ $t('Request Variable') }}</label>
      <b-form-input id="option-value" v-model="requestVariable" data-cy="inspector-request-variable" />
      <div v-if="optionError" class="invalid-feedback d-block text-right">
        <div>{{ optionError }}</div>
      </div>

    </div>

    <div class="card-footer text-right p-2">
      <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="showOptionCard=false" data-cy="inspector-option-cancel">
        {{ $t('Cancel') }}
      </button>
      <button type="button" class="btn btn-sm btn-secondary" @click="addOption()" data-cy="inspector-option-save">
        {{ $t('Save') }}
      </button>
    </div>
  </div>
</template>


<script>

export default {
  mixins: [],
  props: {
    value: String,
  },
  data() {
    return {
      field: '',
      outboundConfig: [],
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
      this.outboundConfig.push({key: '', value: ''});
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
