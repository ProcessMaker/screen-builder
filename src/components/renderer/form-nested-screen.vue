<template>
  <vue-form-renderer
    class="form-nested-screen"
    :placeholder="placeholder"
    v-model="data"
    :config="validatedConfig"
    mode="preview"
    :computed="computed"
    :custom-css="customCSS"
    :watchers="watchers"
    @css-errors="cssErrors = $event"
  />
</template>

<script>
const defaultConfig = [
  {
    name: 'empty',
    items: [],
  },
];
export default {
  props: ['name', 'screen', 'value', 'validationData'],
  data() {
    return {
      api: 'screens',
      localData: {},
      config: defaultConfig,
      computed: [],
      customCSS: null,
      watchers: [],
    };
  },
  computed: {
    validatedConfig() {
      return this.config && this.config[0] ? this.config : defaultConfig;
    },
    data: {
      get() {
        const data = !this.validationData || this.name ? this.localData : this.validationData;
        // Add magic _ variables to nested screens
        if (this.validationData && this.name) {
          Object.keys(this.validationData).forEach(key => {
            if (key.substr(0, 1) === '_') {
              data[key] = this.validationData[key];
            }
          });
        }
        return data;
      },
      set(data) {
        if (this.name) {
          this.$emit('input', data);
        } else {
          Object.keys(data).forEach((variable) => {
            this.$set(this.validationData, variable, data[variable]);
          });
        }
      },
    },
    placeholder() {
      return this.screen ? '' : this.$t('Select a screen to nest');
    },
  },
  methods: {
    loadScreen(id) {
      if (id) {
        window.ProcessMaker.apiClient
          .get(this.api + '/' + id)
          .then(response => {
            this.config = response.data.config;
            this.computed = response.data.computed;
            this.customCSS = response.data.custom_css;
            this.watchers = response.data.watchers;
          });
      } else {
        this.config = defaultConfig;
        this.computed = [];
        this.customCSS = null;
        this.watchers = [];
      }
    },
  },
  watch: {
    screen(screen) {
      this.loadScreen(screen);
    },
    value: {
      deep: true,
      handler() {
        if (this.name) {
          this.$set(this, 'localData', this.value || {});
        }
      },
    },
  },
  mounted() {
    this.loadScreen(this.screen);
    this.name ? this.$set(this, 'localData', this.value || {}) : null;
  },
};
</script>

<style lang="scss">
  .prevent-interaction.form-nested-screen::after {
    content: attr(placeholder);
  }
</style>
