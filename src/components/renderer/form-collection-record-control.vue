<template>
  <vue-form-renderer
    ref="collectionRecordControl"
    class="form-collection-record-control"
    :placeholder="placeholder"
    v-model="data"
    mode="preview"
    :config="validatedConfig"
    :computed="computed"
    :custom-css="customCss"
    :watchers="watchers"
    :_parent="_parent"
  />
</template>

<script>
import VueFormRenderer from "../vue-form-renderer.vue";

const globalObject = typeof window === "undefined" ? global : window;

const defaultConfig = [
  {
    name: "empty",
    items: []
  }
];

export default {
  components: {
    VueFormRenderer,
  },
  props: {
    name: String,
    validationData: null,
    _parent: null,
    record: null,
    displayMode: {
      type: String,
      default: ""
    },
    collection: {
      type: Object
    },
  },
  data() {
    return {
      localData: {},
      config: defaultConfig,
      computed: [],
      customCSS: null,
      watchers: [],
      screenTitle: null,
      //collectionMode: "Edit",
      selCollectionId: Number,
      selRecordId: Number,
      screenCollectionId: null,
      placeholder: "Select a collection",
      screenType: null,
      lastDisplayMode: null,
    };
  },
  computed: {
    validatedConfig() {
      return this.config && this.config[0] ? this.config : defaultConfig;
    },
    data: {
      get() {
        return this.localData;
      },
      set(data) {
        Object.keys(data).forEach((variable) => {
          this.validationData && this.$set(this.validationData, variable, data[variable]);
        });
      },
    },
  },
  methods: {
    isSubmitButton(item) {
      return (
        item.config &&
        item.component === "FormButton" &&
        item.config.event === "submit"
      );
    },
    hideSubmitButtons(config) {
      config.forEach((item) => {
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
      config.forEach((item) => {
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
        this.$dataProvider.getScreen(id).then((response) => {
          this.config = response.data.config;
          this.hideSubmitButtons(this.config);
          this.computed = response.data.computed;
          this.customCSS = response.data.custom_css;
          this.watchers = response.data.watchers;
          this.screenTitle = response.data.title;

          if (this.$attrs["disabled"]) {
            this.disableForm(this.config);
          }
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

      this.$dataProvider
        .getCollectionRecordsView(collectionId, recordId)
        .then((response) => {
          this.placeholder = "";
          const respData = response.data;
          const viewScreen = response.collection.read_screen_id;
          const editScreen = response.collection.update_screen_id;
          if(this.screenType === "display") {
            this.screenCollectionId = viewScreen;
          } else {
            this.screenCollectionId =
              this.displayMode === "View" ? viewScreen : editScreen;
          }
          console.log("carga Screen: ", this.displayMode);

          this.loadScreen(this.screenCollectionId);
          this.localData = respData;
        })
        .catch(() => {
          this.localData = {};
          globalObject.ProcessMaker.alert(this.$t('This content does not exist. We could not locate indicated data'), "danger");
        });;
    },
  },
  watch: {
    collection(collection) {
      if(collection) {
        this.selCollectionId = collection.collectionId;
      }
    },
    record(record) {
      if (record && !isNaN(record) && record > 0 && this.collection) {
        this.selRecordId = record;
        this.loadRecordCollection(this.selCollectionId, record);
      } else {
        this.localData = {};
      }
    },
    displayMode(val) {
      console.log("watcher en collection record displayMode: ", val);
      
      this.lastDisplayMode = val;
      //this.displayMode = val
      if (this.collection && this.record) {
        this.loadRecordCollection(this.selCollectionId, this.selRecordId);
      }
      
    },
  },
  mounted() {
    console.log("carga mounted: ", this.displayMode);
    this.$root.$emit("display-mode-changed", this.displayMode);
    this.$root.$on("collection-mode", (mode) => {
      this.screenType = mode;
      console.log("mounted: ", mode);
    });
    if (this.collection && this.record) {
      this.loadRecordCollection(this.collection.collectionId, this.record);
    }
  },
};
</script>

<style lang="scss">
.prevent-interaction.form-collection-record-control::after {
  content: attr(placeholder);
}
</style>
