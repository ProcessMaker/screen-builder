<template>
  <vue-form-renderer
    ref="collectionRecordControl"
    v-model="data"
    class="form-collection-record-control"
    :placeholder="placeholder"
    mode="preview"
    :config="validatedConfig"
    :computed="computed"
    :custom-css="customCss"
    :watchers="watchers"
    :_parent="_parent"
    :read-only="isDisabled"
  />
</template>

<script>
import _ from "lodash";
import VueFormRenderer from "../vue-form-renderer.vue";
import CollectionRecordsList from "../inspector/collection-records-list.vue";

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
    CollectionRecordsList
  },
  props: {
    name: String,
    validationData: null,
    _parent: null,
    record: null,
    collection: {
      type: Object
    },
    collectionmode: {
      type: Object
    },
    taskdraft: Object,
    disabled: {
      type: [Boolean, String],
      default: false
    },
    readonly: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      localData: {},
      config: defaultConfig,
      computed: [],
      customCSS: null,
      watchers: [],
      screenTitle: null,
      selCollectionId: Number,
      selRecordId: Number,
      selDisplayMode: "Edit",
      screenCollectionId: null,
      placeholder: "Select a collection",
      screenType: "",
      hasMustache: false,
      flagDraft: {},
      taskDraft: {},
      enableDraft: true,
      defaultColumnsRecordId: 1,
      defaultCollectionMode: 'Edit',
    };
  },
  computed: {
    isDisabled() {
      return Boolean(
        this.disabled === true
        || this.disabled === "true"
        || this.disabled === ""
        || this.readonly === true
        || this.readonly === "true"
        || this.readonly === ""
      );
    },
    validatedConfig() {
      return this.config && this.config[0] ? this.config : defaultConfig;
    },
    data: {
      get() {
        if (this.hasMustache) {
          this.clearDataObject();
        }
        return this.localData;
      },
      set(data) {
        if (this.isDisabled) {
          return;
        }
        Object.keys(data).forEach((variable) => {
          this.validationData &&
            this.$set(this.validationData, variable, data[variable]);
        });
        if (this.collection) {
          this.$set(
            this.collection,
            "data",
            Array.isArray(data) ? data : [data]
          );
          this.$set(this.collection, "screen", this.screenCollectionId);
        }
      }
    }
  },
  watch: {
    collection(collection) {
      if (collection) {
        this.selCollectionId = collection.collectionId;
        const currentData = this.localData;
        this.$set(
          collection,
          "data",
          Array.isArray(currentData) ? currentData : [currentData]
        );
        this.$set(collection, "screen", this.screenCollectionId);
      }
    },
    record(record) {
      this.hasMustache = false;
      this.enableDraft = false;
      if (
        record &&
        !isNaN(record) &&
        record > 0 &&
        this.collection.collectionId
      ) {
        this.selRecordId = record;
        this.loadRecordCollection(
          this.collection.collectionId,
          record,
          this.selDisplayMode
        );
      } else {
        if (this.isMustache(record)) {
          this.callbackRecord();
        }
        this.localData = {};
      }
    },
    collectionmode(collectionmode) {
      if (collectionmode) {
        this.selDisplayMode = collectionmode.modeId;
      }
      this.loadRecordCollection(
        this.selCollectionId,
        this.selRecordId,
        this.selDisplayMode
      );
    },
    isDisabled() {
      if (this.selCollectionId && this.selRecordId) {
        this.loadRecordCollection(
          this.selCollectionId,
          this.selRecordId,
          this.selDisplayMode
        );
      }
    }
  },
  mounted() {
    this.$root.$on("taskdraft-input", (val) => {
      this.taskDraft = val;
    });

    if (this.collection && this.record) {
      const recordId = this.isMustache(this.record)
        ? this.defaultColumnsRecordId
        : this.record;

      if (this.isMustache(this.record)) {
        this.hasMustache = true;
      }

      const collectionMode = this.collectionmode?.modeId ?? this.defaultCollectionMode;

      this.loadRecordCollection(
        this.collection.collectionId,
        recordId,
        collectionMode,
      );
    }
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
        // If the element has containers
        if (Array.isArray(item)) {
          this.hideSubmitButtons(item);
        }

        // If the element has items
        if (item.items) {
          this.hideSubmitButtons(item.items);
        }

        // hidden buttons
        if (this.isSubmitButton(item)) {
          item.config.hidden = true;
        }
      });
    },
    disableForm(config) {
      config.forEach((item) => {
        // If the element has containers
        if (Array.isArray(item)) {
          this.disableForm(item);
        }

        // If the element has items
        if (item.items) {
          this.disableForm(item.items);
        }

        // Disable element
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

          if (this.isDisabled) {
            this.disableForm(this.config);
          }
        });
      }
    },
    callbackRecord() {
      this.hasMustache = true;
      this.loadRecordCollection(this.selCollectionId, 1, this.selDisplayMode);
    },
    errors() {
      this.$refs.nestedScreen.isValid();
      return this.$refs.nestedScreen.errors;
    },
    loadRecordCollection(collectionId, recordId, modeId) {
      this.selCollectionId = collectionId;
      this.selRecordId = recordId;
      this.selDisplayMode = modeId;
      // Completed/closed task previews must not load the editable collection screen.
      const effectiveMode = this.isDisabled ? "View" : modeId;
      this.$dataProvider
        .getCollectionRecordsView(collectionId, recordId)
        .then((response) => {
          this.placeholder = "";
          const respData = response.data;
          const viewScreen = response.collection.read_screen_id;
          const editScreen = response.collection.update_screen_id;
          // Choose screen id regarding of the display Mode
          this.screenCollectionId =
            typeof this.selDisplayMode === "function"
              ? this.collectionmode.modeId === "View" || this.isDisabled
                ? viewScreen
                : editScreen
              : effectiveMode === "View"
              ? viewScreen
              : editScreen;
          this.loadScreen(this.screenCollectionId);

          // This section validates if Collection has draft data
          if (
            this.taskDraft?.draft?.data == null ||
            this.taskDraft.draft.data === "" ||
            !this.enableDraft
            || this.isDisabled
          ) {
            this.localData = respData;
          } else {
            this.localData = _.merge({}, respData, this.taskDraft.draft.data);
          }
        })
        .catch(() => {
          this.localData = {};
          globalObject.ProcessMaker.alert(
            this.$t(
              "This content does not exist. We could not locate indicated data"
            ),
            "danger"
          );
          this.placeholder = "Select a collection";
        });
    },
    isMustache(record) {
      return /\{\{.*\}\}/.test(record);
    },
    clearDataObject() {
      Object.keys(this.localData).forEach((key) => {
        if (key !== "id") {
          this.localData[key] = "";
        }
      });
    }
  }
};
</script>

<style lang="scss">
.prevent-interaction.form-collection-record-control::after {
  content: attr(placeholder);
}
</style>
