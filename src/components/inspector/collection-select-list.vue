<template>
  <div>
    <div>
      <label for="collection">{{ $t("Collection") }}</label>
      <b-form-select
        id="collection"
        v-model="collectionId"
        @change="resetFields"
        :options="collections"
        data-cy="inspector-collection"
      />
    </div>

    <div class="mt-3" v-if="fields.length > 1">
      <label for="label">{{ $t("Label") }}</label>
      <b-form-select
        id="label"
        v-model="labelField"
        :options="fields"
        data-cy="inspector-collection-label"
      />
    </div>

    <div class="mt-3" v-if="fields.length > 1">
      <label for="value">{{ $t("Value") }}</label>
      <b-form-select
        id="value"
        v-model="valueField"
        :options="fields"
        data-cy="inspector-collection-value"
      />
    </div>

    <div class="mt-3" v-if="fields.length > 1">
      <label for="pmql">{{ $t("PMQL") }}</label>
      <mustache-helper />
      <b-form-textarea
        id="pmql"
        rows="4"
        v-model="pmql"
        data-cy="inspector-collection-pmql"
      />
      <small class="form-text text-muted">{{
        $t("Add a PMQL query to filter the result list. Use `data` as prefix")
      }}</small>
    </div>

    <div class="mt-3" v-if="fields.length > 1">
      <form-checkbox
        :label="$t('Remove duplicate labels')"
        v-model="unique"
        helper=""
        data-cy="inspector-collection-isDependent"
      />
    </div>

  </div>
</template>

<script>
import _ from "lodash";
import MustacheHelper from "./mustache-helper";
import ScreenVariableSelector from '../screen-variable-selector.vue';

const CONFIG_FIELDS = [
  "collectionId",
  "labelField",
  "valueField",
  "pmql",
  "unique",
];

export default {
  props: ["value"],
  components: {
    MustacheHelper,
    ScreenVariableSelector,
  },
  data() {
    return {
      collections: [],
      fields: [],
      collectionId: null,
      labelField: null,
      valueField: null,
      pmql: "",
      unique: false,
    };
  },
  watch: {
    value: {
      handler(value) {
        if (!value) {
          return;
        }
        CONFIG_FIELDS.forEach(field => this[field] = value[field]);
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
  computed: {
    options() {
      return Object.fromEntries(CONFIG_FIELDS.map(field => [field, this[field]]));
    }
  },
  methods: {
    resetFields() {
      this.labelField = null;
      this.valueField = null;
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
        });
    }
  },
  mounted() {
    this.getCollections();
    if (this.collectionId) {
      this.getFields();
    }
  }
};
</script>