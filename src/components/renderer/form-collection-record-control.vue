<template>
    <vue-form-renderer
        ref="collectionRecordControl"
        class="form-collection-record-control"
        :placeholder="placeholder"
        v-model="localData"
        mode="preview" 
        :config="validatedConfig" 
        :computed="computed" 
        :custom-css="customCss" 
        :watchers="watchers"/>
  </template>
  
  <script>
  import VueFormRenderer from '../vue-form-renderer.vue';
  import CollectionRecordsList from '../inspector/collection-records-list.vue'
  
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
      VueFormRenderer,
      CollectionRecordsList
    },
    props: {
      name: String,
    //   screen: {
    //     type: [Number, Object],
    //     },
        
        collection: {
            type: Object,
        },
      validationData: null,
      _parent: null,
      record: null,
      listOption: {
        type: String,
        default: "Edit"
      },
    },
    data() {
      return {
        //localData: {carBrand: "jajaja", year: "123"},
        //localDatax: {carBrand: "jajaja", year: "123"},
        localData: {},
        config: defaultConfig,
        computed: [],
        customCSS: null,
        watchers: [],
        screenTitle: null,
        collectionMode: "Edit",
        selCollectionId: Number,
        selRecordId: Number,
        screenCollectionId: null,
        placeholder: "Select a collection",
      };
    },
    computed: {
      validatedConfig() {
        return this.config && this.config[0] ? this.config : defaultConfig;
      },
    //   data: {
    //     get() {
    //     console.log("En computed get data this.validationData: ", this.validationData, " this.localData: ", this.localData);
    //       return this.validationData || this.localData || this.localDatax;
    //     },
    //     set(data) {
    //         console.log("Esto es data en set computed data: ", data);
    //       Object.keys(data).forEach((variable) => {
    //         this.validationData && this.$set(this.validationData, variable, data[variable]);
    //       });
    //     },
    //   },
    //   placeholder() {
    //     return this.screen ? '' : this.$t('Select a collection');
    //   },
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
  
            //   if (this.ancestorScreens.includes(this.screenTitle)) {
            //     globalObject.ProcessMaker.alert(`Rendering of nested "${this.screenTitle}" screen was disallowed to prevent loop.`, 'warning');
            //   } else {
            //     if (!globalObject['nestedScreens']) {
            //       globalObject['nestedScreens'] = {};
            //     }
            //     globalObject.nestedScreens['id_' + id] = this.config;
            //     this.$root.$emit('nested-screen-updated');
            //   }
            });
        }
      },
      errors() {
        this.$refs.nestedScreen.isValid();
        return this.$refs.nestedScreen.errors;
      },
      loadRecordCollection(collectionId, recordId) {
        this.selCollectionId = collectionId;
        this.selRecordId = recordId;

        this.$dataProvider.getCollectionRecordsView(collectionId, recordId).then((response) => {
            this.placeholder = "";
            const respData = response.data;
            console.log("Response data: ", respData);
            const viewScreen = response.collection.read_screen_id;
            const editScreen = response.collection.update_screen_id;

            this.screenCollectionId = this.collectionMode === 'View' ? viewScreen : editScreen;
   
            console.log("update_or_view_screen_id: ", this.screenCollectionId);
            this.loadScreen(this.screenCollectionId);
            this.localData = respData;
            
        });
      }
    },
    watch: {
    //   screen(screen) {
    //     console.log("watch screen: ", this.screen);

    //     //this.loadScreen(screen.collectionId);
    //     //this.loadRecordCollection(screen.collectionId);
    //     this.collection = screen.collectionId;
    //   },
      collection(collection) {
        console.log("watch collection: ", this.collection);

        //this.loadScreen(screen.collectionId);
        //this.loadRecordCollection(screen.collectionId);
        this.selCollectionId = collection.collectionId;
      },
      record(record) {
        //console.log("collection", this.collection,"record id: ", record);
        //this.loadScreen(screen.collectionId);
        if(record) {
            this.selRecordId = record;
            this.loadRecordCollection(this.selCollectionId, record);
        }
      },
      listOption(val) {
        this.collectionMode = val;
        this.loadRecordCollection(this.selCollectionId, this.selRecordId);
      }
    },
    mounted() {
        if(this.collection && this.record){
            this.loadRecordCollection(this.collection.collectionId, this.record);
        }
      //console.log("screen: ", this.screen);
      //this.loadScreen(90);
      //this.loadRecordCollection();
      //console.log("CARGA MOUNTED colelction: ", this.selCollectionId, " record: ", this.selRecordId);
      
    },
  };
  </script>
  
  <style lang="scss">
    .prevent-interaction.form-collection-record-control::after {
      content: attr(placeholder);
    }
  </style>
  