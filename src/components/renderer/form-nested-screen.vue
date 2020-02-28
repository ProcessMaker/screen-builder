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
  props: ['screen', 'value', 'validationData'],
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
        return this.validationData || this.localData;
      },
      set(data) {
        Object.keys(data).forEach((variable) => {
          this.$set(this.validationData, variable, data[variable]);
        });
      },
    },
    placeholder() {
      return this.screen ? '' : this.$t('Select a screen to nest');
    },
  },
  methods: {
    isSubmitButton(item) {
      return item.config && item.component === 'FormButton' && item.config.event === 'submit';
    },
    hideSubmitButtons(config) {
      config.forEach(item => {

        //If the element has containers
        if (Array.isArray(item)) {
          this.hideSubmitButtons(item);
        }

        //If the element has items
        if (item.items) {
          this.hideSubmitButtons(item.items);
        }

        //hidden buttons
        if (this.isSubmitButton(item)) {
          item.config.hidden = true;
        }

      });
    },
    loadScreen(id) {
      this.config = defaultConfig;
      this.computed = [];
      this.customCSS = null;
      this.watchers = [];
      if (id) {
        window.ProcessMaker.apiClient
          .get(this.api + '/' + id)
          .then(response => {
            this.config = response.data.config;
            this.hideSubmitButtons(this.config);
            this.computed = response.data.computed;
            this.customCSS = response.data.custom_css;
            this.watchers = response.data.watchers;
          });
      }
    },
  },
  watch: {
    screen(screen) {
      this.loadScreen(screen);
    },
  },
  mounted() {
    this.loadScreen(this.screen);
  },
};
</script>

<style lang="scss">
  .prevent-interaction.form-nested-screen::after {
    content: attr(placeholder);
  }
</style>
