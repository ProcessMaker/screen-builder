<template>
  <vue-form-renderer
    v-if="!ancestorScreens.includes(screenTitle)"
    ref="nestedScreen"
    class="form-nested-screen"
    :placeholder="placeholder"
    v-model="data"
    :config="validatedConfig"
    :ancestor-screens="[...ancestorScreens, screenTitle]"
    mode="preview"
    :computed="computed"
    :custom-css="customCSS"
    :watchers="watchers"
    debug-context="Nested Screen"
    @css-errors="cssErrors = $event"
    :_parent="getParent()"
  />
</template>

<script>
const globalObject = typeof window === 'undefined'
  ? global
  : window;

const defaultConfig = [
  {
    name: 'empty',
    items: [],
  },
];

export default {
  props: {
    name: String,
    screen: Number,
    value: null,
    validationData: null,
    ancestorScreens: {type: Array, default: () => []},
  },
  data() {
    return {
      localData: {},
      config: defaultConfig,
      computed: [],
      customCSS: null,
      watchers: [],
      screenTitle: null,
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
          this.validationData && this.$set(this.validationData, variable, data[variable]);
        });
      },
    },
    placeholder() {
      return this.screen ? '' : this.$t('Select a screen to nest');
    },
  },
  methods: {
    getParent() {
      return (this.validationData && this.validationData._parent) || {};
    },
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
      this.screenTitle = null;

      if (id) {
        this.$dataProvider.getScreen(id)
          .then(response => {
            this.config = response.data.config;
            this.hideSubmitButtons(this.config);
            this.computed = response.data.computed;
            this.customCSS = response.data.custom_css;
            this.watchers = response.data.watchers;
            this.screenTitle = response.data.title;

            if (this.ancestorScreens.includes(this.screenTitle)) {
              globalObject.ProcessMaker.alert(`Rendering of nested "${this.screenTitle}" screen was disallowed to prevent loop.`, 'warning');
            } else {
              if (!globalObject['nestedScreens']) {
                globalObject['nestedScreens'] = {};
              }
              globalObject.nestedScreens['id_' + id] = this.config;
            }
          });
      }
    },
    errors() {
      this.$refs.nestedScreen.isValid();
      return this.$refs.nestedScreen.errors;
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
