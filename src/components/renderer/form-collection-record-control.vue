<template>
    <!-- <vue-form-renderer
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
      :_parent="_parent"
    /> -->
    <vue-form-renderer
                class="form-collection-record-control"
                :placeholder="'aqui placeholder'"
                v-model="data" 
                :config="validatedConfig" 
                :computed="computed" 
                :custom-css="customCss" 
                :watchers="watchers"/>
  </template>
  
  <script>
  import VueFormRenderer from '../vue-form-renderer.vue';
  
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
    components:{
      VueFormRenderer
    },
    props: {
      name: String,
      screen: Number,
      validationData: null,
      _parent: null,
      ancestorScreens: {type: Array, default: () => []},
      record: null,
    },
    data() {
      return {
        // localData: {form_input_1: "jajaja", form_input_2: "lalala"},
        localData: {},
        config: defaultConfig,
        computed: [],
        customCSS: null,
        watchers: [],
        screenTitle: null,
        collection: null,
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
      disableForm(config) {
        config.forEach(item => {
  
          //If the element has containers
          if (Array.isArray(item)) {
            this.disableForm(item);
          }
  
          //If the element has items
          if (item.items) {
            this.disableForm(item.items);
          }
  
          //Disable element
          if (item && item.config) {
            item.config.disabled = true;
            item.config.readonly = true;
            item.config.editable = false;
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
  
              if (this.$attrs['disabled']) {
                this.disableForm(this.config);
              }
  
              if (this.ancestorScreens.includes(this.screenTitle)) {
                globalObject.ProcessMaker.alert(`Rendering of nested "${this.screenTitle}" screen was disallowed to prevent loop.`, 'warning');
              } else {
                if (!globalObject['nestedScreens']) {
                  globalObject['nestedScreens'] = {};
                }
                globalObject.nestedScreens['id_' + id] = this.config;
                this.$root.$emit('nested-screen-updated');
              }
            });
        }
      },
      errors() {
        this.$refs.nestedScreen.isValid();
        return this.$refs.nestedScreen.errors;
      },
      loadRecordCollection(collectionId, recordId) {
        // window.ProcessMaker.apiClient
        // // .get(`collections/${screen.collectionId}/records/6/edit`)
        // .get(`collections/2/records/6/edit`)
        // .then((response) => {
        //   const respData = response.data;
        //   this.validationData = respData;
        //   console.log("RESPONSE COLLECTION API: ", this.validationData);
        // });
        // this.$dataProvider.getCollections().then((response) => {
        //     console.log("del provider: ", response.data);
        //     // this.collections = [
        //     //   { value: null, text: this.$t("Select a collection") },
        //     //   ...response.data.data.map((collection) => {
        //     //     return {
        //     //       text: collection.name,
        //     //       value: collection.id
        //     //     };
        //     //   })
        //     // ];
        // });

        this.$dataProvider.getCollectionRecordsView(collectionId, recordId).then((response) => {
            console.log("del provider: ", response.data);
            const respData = response.data;
            this.localData = respData;

        });
      }
    },
    watch: {
      screen(screen) {
        console.log("watch screen: ", this.screen);
        // console.log("screenTitle: ", this.screenTitle);
        // console.log("data:", this.data);
        // console.log("validatedConfig:", this.validatedConfig);
        // console.log("ancestorScreens: ", this.ancestorScreens);
        // console.log("computed: ", this.computed);
        // console.log("customCSS: ", this.customCSS);
        // console.log("watchers: ", this.watchers);
        // console.log("cssErrors: ", this.cssErrors);
        // console.log("_parent: ", this._parent);
        // console.log("placeholder: ", this.placeholder);

        //this.loadScreen(screen.collectionId);
        //this.loadRecordCollection(screen.collectionId);
        this.collection = screen.collectionId;
      },
      record(record) {
        console.log("collection", this.collection,"record id: ", record);
        //this.loadScreen(screen.collectionId);
        this.loadRecordCollection(this.collection, record);
      }
    },
    mounted() {
      console.log("screen: ", this.screen);
      this.loadScreen(90);
      //this.loadRecordCollection();
    },
  };
  </script>
  
  <style lang="scss">
    .prevent-interaction.form-collection-record-control::after {
      content: attr(placeholder);
    }
  </style>
  