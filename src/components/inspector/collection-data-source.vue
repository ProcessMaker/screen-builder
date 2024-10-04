<template>
    <div>
      <div>
        <label for="collectionsource">{{ $t("Source of Record List") }}</label>
        <b-form-select
          id="collectionsource"
          v-model="sourceOptions"
          :options="sourceDisplayOptions"
          data-cy="inspector-collection-data-source"
          @change="displayOptionChange"
        />
        <small class="mt-3 form-text text-muted">{{
        $t("A record list can display the data of a defined variable or a collection")
      }}</small>
      </div>
      <div class="mt-2" v-if="sourceOptions === 'Collection'">

         <CollectionRecordsList 
         v-model="collectionFields"
         :record-pmql="pmql"
         @change="collectionChanged"/>

         <pmql-input
        v-model="pmql"
        :search-type="'collections_w_mustaches'"
        class="mt-3 mb-1"
        data-cy="inspector-collection-pmql"
        :input-label="'PMQL'"
        :condensed="true"
        :ai-enabled="true"
        :placeholder="$t('PMQL')"
      >
      </pmql-input>
      <small class="mt-3 form-text text-muted">{{
        $t("Leave this field empty to show all the records of the collection")
      }}</small>
        <label class="mt-3" id="data-selection">{{ $t("Data Selection") }}</label>

        <b-form-select
          id="data-selection"
          v-model="dataSelectionOptions"
          :options="dataSelectionDisplayOptions"
          data-cy="inspector-collection-data-selection"
        />
        <small class="mt-3 form-text text-muted">{{
        $t("The user can select specific data to be stored into a variable")
      }}</small>

        <div class="mt-3" v-if="dataSelectionOptions === 'single-field'">
          <label id="single-columns">{{ $t('Column') }}</label>
          <b-form-select
          id="single-columns"
          v-model="singleField"
          :options="singleFieldOptions"
          data-cy="inspector-collection-single-field"
        >
        <option disabled value="">{{ $t("Select a column") }}</option>
          </b-form-select>
        </div>
      </div>
    </div>
  </template>
  <script>

  import CollectionRecordsList from "./collection-records-list.vue"
  import { cloneDeep } from "lodash";

  const CONFIG_FIELDS = [
    "collectionFields",
    "collectionFieldsColumns",
    "pmql",
    "sourceOptions",
    "variableStore",
    "dataSelectionOptions",
    "singleField"

  ];
  export default {
    components: {
      CollectionRecordsList
    },
    props: ["value", "screenType"],
    data() {
      return {
        fields: [],
        sourceOptions: "Variable",
        submitCollectionCheck: true,
        sourceDisplayOptions: [],
        collectionFields: [],
        collectionFieldsColumns: [],
        variableStore: null,
        pmql: null,
        sourceDisplayOptions: [
        {
          text: this.$t('Variable'),
          value: 'Variable',
        },
        {
          text: this.$t('Collection'),
          value: 'Collection',
        },
      ],
      dataSelectionDisplayOptions: [
        {
          text: this.$t('Do not allow selection'),
          value: 'no-selection',
        },
        {
          text: this.$t('Single field of record'),
          value: 'single-field',
        },
        {
          text: this.$t('Single record'),
          value: 'single-record',
        },
        {
          text: this.$t('Multiple records'),
          value: 'multiple-records',
        },
      ],
      dataSelectionOptions: "no-selection", 
      collectionColumns: [],
      singleFieldOptions: [],
      singleField: null
      };
    },
    methods: {
      displayOptionChange() {
        this.collectionFields = [];
        this.collectionFieldsColumns = [];
        this.pmql = null;
        this.$root.$emit("collection-changed", true);
      },
      collectionChanged(data) {
        if (Array.isArray(data)) {
            const [firstItem] = data;
            const collectionId = firstItem?.collection_id;
            if(collectionId !== this.collectionFields.collectionId) {
              this.$root.$emit("collection-changed", true);
            }
        }
      },
      getCollectionColumns(records) {
        const [firstRecord] = records?.dataRecordList || [];

        if (firstRecord?.data) {
          const dataObject = firstRecord.data;

          for (const [key, value] of Object.entries(dataObject)) {
            this.singleFieldOptions.push({ text: key, value: key });
          }
        }
      },
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
      sourceOptions: {
        handler(changeOption) {
           this.$root.$emit("record-list-option", changeOption);
        }
      },
      collectionFields: {
        handler(collectionFieldsData) {
           this.getCollectionColumns(collectionFieldsData);
           this.$root.$emit("record-list-collection", collectionFieldsData);
        },
        deep: true
      },
      pmql: {
        handler(newPmql) {
            this.$root.$emit("change-pmql", newPmql);
        }
      },
      submitCollectionCheck(newValue) {
        this.submitCollectionCheck = newValue;
      },
      options: {
        handler() {
          this.$emit("input", this.options);
        },
        deep: true
      },
    },
  };
  </script>
