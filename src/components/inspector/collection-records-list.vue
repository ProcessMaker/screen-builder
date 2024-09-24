<template>
  <div>
    <div>
      <label for="collection">{{ $t("Collection") }}</label>
      <b-form-select
        id="collection"
        v-model="collectionId"
        :options="collections"
        data-cy="inspector-collection"
      />
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
      handler(value) {
        if (!value) {
          return;
        }
        CONFIG_FIELDS.forEach((field) => (this[field] = value[field]));
      },
      immediate: true
    },
    collectionId: {
      handler() {
        this.getFields();
      }
    },
    options: {
      handler() {
        this.$emit("input", this.options);
      },
      deep: true
    },
  },
  created() {
    this.onDebouncedPmqlChange = debounce((pmql) => {
      this.onPmqlChange(pmql);
    }, 1000);
  },
  mounted() {
    this.$root.$on("change-pmql", (val) => {
      this.pmql = val;
      this.onCollectionChange();
    });
    this.getCollections();
    if (this.collectionId) {
      this.getFields();
    }
  },
  methods: {
    onCollectionChange() {
      this.$dataProvider
        .getCollectionRecordsList(this.collectionId)
        .then((response) => {
          this.dataRecordList = response.data;
        });
    },
    getCollections() {
      this.$dataProvider.getCollections().then((response) => {
        this.collections = [
          { value: null, text: this.$t("Select a collection") },
          ...response.data.data.map((collection) => {
            return {
              text: collection.name,
              value: collection.id
            };
          })
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
    }
  }
};
</script>
