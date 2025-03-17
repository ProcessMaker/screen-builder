<template>
  <div>
    <div>
      <label for="collection">{{ $t("Collection Name") }}</label>
      <b-form-group>
        <b-form-select
          id="collection"
          v-model="collectionId"
          :options="collections"
          data-cy="inspector-collection"
        />
        <b-form-text class="mt-2">
        {{ $t("Collection Record Control is not available for Anonymous Web Entry") }}
        </b-form-text>
    </b-form-group>
    </div>
    <div v-if="collectionId > 0" class="screen-link mt-2">
      <a
        :href="`/designer/screen-builder/${
          screenMode === 'display' ? idCollectionScreenView : idCollectionScreenEdit
          }/edit`"
          target="_blank">
        {{ $t(screenMode === 'display' ? "Open View Screen" : "Open Edit Screen") }}
        <i class="ml-1 fas fa-external-link-alt" />
      </a>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import MustacheHelper from "./mustache-helper.vue";
import ScreenVariableSelector from "../screen-variable-selector.vue";

const CONFIG_FIELDS = [
  "collectionId",
  "pmql",
  "dataRecordList"
];

export default {
  components: {
    MustacheHelper,
    ScreenVariableSelector
  },
  props: ["value"],
  data() {
    return {
      collections: [],
      fields: [],
      collectionId: null,
      pmql: "",
      unique: false,
      dataRecordList: [],
      idCollectionScreenView: null,
      idCollectionScreenEdit: null,
      screenMode: null,
      collectionsMap: {}
    };
  },
  computed: {
    options() {
      return Object.fromEntries(
        CONFIG_FIELDS.map((field) => [field, this[field]])
      );
    }
  },
  watch: {
    value: {
      handler(newValue) {
        if (!newValue) {
          // Clear collection id
          this.collectionId = null;

          return;
        }

        CONFIG_FIELDS.forEach((field) => (this[field] = newValue[field]));
      },
      immediate: true
    },
    collectionId: {
      handler() {
        this.updateScreenIds();
        this.getFields();
      }
    },
    options: {
      handler() {
        this.$emit("input", this.options);
      },
      deep: true
    }
  },
  created() {
    this.onDebouncedPmqlChange = debounce((pmql) => {
      this.onPmqlChange(pmql);
    }, 1000);
  },
  mounted() {
    this.$root.$on("change-pmql", (val) => {
      this.pmql = val;
    });
    this.getCollections();
    if (this.collectionId) {
      this.getFields();
    }
    this.$root.$on("collection-screen-mode", (mode) => {
      this.screenMode = mode;
    });
  },
  methods: {
    onCollectionChange() {
      this.$dataProvider
        .getCollectionRecordsList(this.collectionId)
        .then((response) => {
          this.dataRecordList = response.data;
        });
      this.$emit('change', this.dataRecordList);
    },
    getCollections() {
      this.$dataProvider.getCollections().then((response) => {
        this.collectionsMap = response.data.data.reduce((acc, collection) => {
          acc[collection.id] = {
            read_screen_id: collection.read_screen_id,
            create_screen_id: collection.create_screen_id
          };
          return acc;
        }, {});

        this.collections = [
          { value: null, text: this.$t("Select a collection") },
          ...response.data.data
              .filter((collection) => collection.type !== 'RAG')
              .map((collection) => ({
                text: collection.name,
                value: collection.id
              }))
        ];
      });
    },
    getFields() {
      if (!this.collectionId) {
        return;
      }

      this.$dataProvider
        .getCollectionFields(this.collectionId)
        .then((response) => {
          this.fields = [
            { value: null, text: this.$t("Select a field") },
            { value: "id", text: this.$t("Collection Record ID") },
            ...response.data.data.map((field) => {
              return {
                text: field.label,
                value: field.field
              };
            })
          ];

          this.onCollectionChange();
        });
    },
    onNLQConversion(pmql) {
      this.pmql = pmql;
    },
    onPmqlChange(pmql) {
      this.pmql = pmql;
    },
    updateScreenIds() {
      if (this.collectionId && this.collectionsMap[this.collectionId]) {
        const selectedCollection = this.collectionsMap[this.collectionId];
        this.idCollectionScreenView = selectedCollection.read_screen_id;
        this.idCollectionScreenEdit = selectedCollection.create_screen_id;
      } else {
        this.idCollectionScreenView = null;
        this.idCollectionScreenEdit = null;
      }
    }
  }
};
</script>
