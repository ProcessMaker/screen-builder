<template>
  <div>
    <div class="d-flex mb-1">
      <label class="flex-grow-1 m-0">{{ $t('Output Data Mapping') }}</label>
      <button
        type="button"
        class="btn-special-assignment-action btn btn-secondary btn-sm px-2"
        @click="addMapping"
      >+ {{ $t('Data') }}
      </button>
    </div>
    <table class="table table-striped table-sm border mb-1">
      <thead>
        <tr>
          <th scope="col">{{ $t('Key') }}</th>
          <th scope="col">{{ $t('Value') }}</th>
          <th scope="col">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row,i) in dataMapping" :key="i">
          <td class="p-1">
            <input
              v-model="row.key"
              name="key"
              :placeholder="$t('New Key')"
              type="text"
              class="form-control form-control-sm"
            >
          </td>
          <td class="p-1">
            <input
              v-model="row.value"
              name="value"
              :placeholder="$t('New Value')"
              type="text"
              class="form-control form-control-sm"
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
    <small class="form-text text-muted mb-3">{{ $t('Keys and values to map from the Data Connector into the output variable') }}</small>
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
      dataMapping: [],
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
      this.dataMapping.splice(index, 1);
    },
    addMapping() {
      this.dataMapping.push({key: '', value: ''});
    },
  },
  watch: {
    dataMapping: {
      deep: true,
      immediate: true,
      handler(dataMapping) {
        this.setConfig('dataMapping', dataMapping);
      },
    },
    value: {
      immediate: true,
      handler() {
        const dataMapping = this.getConfig().dataMapping;
        if (dataMapping) {
          this.dataMapping.splice(0);
          dataMapping.forEach(element => {
            this.dataMapping.push(element);
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
