<template>
  <div>
    <div>
      <label for="collection">{{ $t("Collection") }}</label>
      <b-form-select
        id="collection"
        v-model="collectionId"
        :options="collections"
        data-cy="inspector-collection"
        @change="resetFields"
      />
    </div>

    <div v-if="fields.length > 1" class="mt-3">
      <label for="label">{{ $t("Label") }}</label>
      <b-form-select
        id="label"
        v-model="labelField"
        :options="fields"
        data-cy="inspector-collection-label"
      />
    </div>

    <div v-if="fields.length > 1" class="mt-3">
      <label for="value">{{ $t("Value") }}</label>
      <b-form-select
        id="value"
        v-model="valueField"
        :options="fields"
        data-cy="inspector-collection-value"
      />
    </div>

    <div v-if="fields.length > 1 && renderAs === 'checkbox'" class="mt-3">
      <label for="aria-label">{{ $t("Aria Label") }}</label>
      <b-form-select
        id="aria-label"
        v-model="ariaLabelField"
        :options="fields"
        data-cy="inspector-collection-aria-label"
      />
    </div>

    <div v-if="fields.length > 1" class="mt-3">
      <pmql-input
        v-model="pmql"
        :search-type="'collections_w_mustaches'"
        class="mb-1"
        data-cy="inspector-collection-pmql"
        :input-label="'PMQL'"
        :condensed="true"
        :ai-enabled="true"
        :placeholder="$t('PMQL')"
      >
      </pmql-input>
      <small class="form-text text-muted">{{
        $t("Advanced data search")
      }}</small>
    </div>

    <div v-if="fields.length > 1" class="mt-3">
      <form-checkbox
        v-model="unique"
        :label="$t('Ignore duplicates in list')"
        :helper="
          $t(
            'Select to show only distinct list entries if labels are repeated. Only the first value will be used if duplicate labels have different values.'
          )
        "
        data-cy="inspector-collection-isDependent"
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
  "labelField",
  "valueField",
  "ariaLabelField",
  "pmql",
  "unique"
];

export default {
  components: {
    MustacheHelper,
    ScreenVariableSelector
  },
  props: {
    value: Object,
    renderAs: String,
    excludeCollectionType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      collections: [],
      fields: [],
      collectionId: null,
      labelField: null,
      valueField: null,
      ariaLabelField: null,
      pmql: "",
      unique: false
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
    }
  },
  created() {
    this.onDebouncedPmqlChange = debounce((pmql) => {
      this.onPmqlChange(pmql);
    }, 1000);
  },
  mounted() {
    this.getCollections();
    if (this.collectionId) {
      this.getFields();
    }
  },
  methods: {
    resetFields() {
      this.labelField = null;
      this.valueField = null;
      this.ariaLabelField = null;
    },
    getCollections() {
      this.$dataProvider.getCollections().then((response) => {
        let collections = response.data.data;

        // Apply filter if collectionType is set
        if (this.excludeCollectionType) {
          collections = collections.filter(
            (collection) => collection.type !== this.excludeCollectionType
          );
        }

        this.collections = [
          { value: null, text: this.$t("Select a collection") },
          ...collections.map((collection) => {
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
