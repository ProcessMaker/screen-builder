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
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  props: ['value'],
  data() {
    return {
      collections: [],
      fields: [],
      collectionId: null,
      labelField: null,
      valueField: null,
    };
  },
  watch: {
    value:{
      handler(value) {

        if (!value) {
          return;
        }

        this.collectionId = value.collectionId;
        this.labelField = value.labelField;
        this.valueField = value.valueField;
      },
      immediate: true,
    },
    collectionId: {
      handler() {
        this.getFields();
      }
    },
    options: {
      handler() {
        console.log("options changed", this.options);
        this.$emit('input', this.options);
      },
      deep: true,
    },
  },
  computed: {
    options() {
      return {
        collectionId: this.collectionId,
        labelField: this.labelField,
        valueField: this.valueField,
      };
    }
  },
  methods: {
    resetFields() {
      this.labelField = null;
      this.valueField = null;
    },
    getCollections() {
      this.$dataProvider
        .getCollections()
        .then((response) => {
          console.log(response);
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
            { value: 'id', text: this.$t("Collection Record ID") },
            ...response.data.data.map((field) => {
              return {
                text: field.label,
                value: field.field
              };
            })
          ];
        });
    },
  },
  mounted() {
    this.getCollections();
    if (this.collectionId) {
      this.getFields();
    }
  }
};
</script>