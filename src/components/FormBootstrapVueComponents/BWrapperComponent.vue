<template>
  <div>
    <b-button @click="show = show ? false : true">{{ label }}</b-button>
    <div v-if="form">
      <component v-model:show="show" :is="bootstrapComponent" v-bind="bootstrapConfigObject">
        <vue-form-renderer
          v-model="wrapperModel"
          :page="form"
          :config="wrapperConfig"
          :current-page="form"
        />
      </component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: { type: String, default: ''}, // page #
    formConfig: { type: Array, default: () => [] }, // screen config
    bootstrapComponent: { type: String, default: 'b-modal' },
    bootstrapConfig: { type: String, default: '{}' },
    value: { default: null },
    validationData: { default: null },
    name: { type: String, default: null },
    label: { type: String, default: '' },
  },
  data() {
    return {
      show: false,
    };
  },
  mounted() {
  },
  computed: {
    wrapperConfig() {
      const config = [];
      if(typeof this.form === 'string' && this.form.trim() !== '') {
        config[this.form] = this.formConfig[this.form];
      }
      return config;
    },
    wrapperModel: {
      get() {
        return this.validationData;
      },
      set(data) {
        Object.keys(data).forEach((variable) => {
          this.validationData && this.$set(this.validationData, variable, data[variable]);
        });
      },
    },
    bootstrapConfigObject() {
      let config = {};
      try {
        config = JSON.parse(this.bootstrapConfig);
      } catch (e) {
        config = {}
      }
      return config;
    }
  },
};
</script>