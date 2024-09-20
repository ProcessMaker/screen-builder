<template>
    <div>
      <div>
        <label for="collectionsource">{{ $t("Source of Record List") }}</label>
        <b-form-select
          id="collectionsource"
          v-model="sourceOptions"
          :options="sourceDisplayOptions"
          data-cy="inspector-collection-data-source"
        />
      </div>
      <div class="mt-2" v-if="sourceOptions === 'Collection'">

         <CollectionRecordsList 
         v-model="collectionFields"
         :record-pmql="pmql"
         @change="collectionChanged"/>

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
        <label for="collectionsource">{{ $t("Data Selection") }}</label>

        <b-form-select
          id="dataselectionsource"
          v-model="dataSelectionOptions"
          :options="dataSelectionDisplayOptions"
          data-cy="inspector-collection-data-selection"
        />
        <small class="form-text text-muted">{{
        $t("The user can select specific data to be stored into a variable")
      }}</small>

        <label>{{ $t("Variable to store selection") }}</label>
        <b-input id="storeSelection" name="storeSelection" aria-placeholder="Variable name"></b-input>

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
    "sourceOptions"

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
      ]
      };
    },
    mounted() {
      this.$root.$on("collection-columns", (optionList) => {
        this.collectionFieldsColumns = _.cloneDeep(this.collectionFields);
          this.changeCollectionColumns(optionList);
      });
    },
    methods: {
      collectionChanged(data) {
        if (Array.isArray(data)) {
            const [firstItem] = data;
            const collectionId = firstItem?.collection_id;
            if(collectionId !== this.collectionFields.collectionId) {
              this.$root.$emit("collection-changed", true);
            }
        }
      },
      changeCollectionColumns(columnsSelected) {
        let selectedKeys = columnsSelected.map(column => column.content);
        let dataObject = {};

        this.collectionFieldsColumns.dataRecordList.forEach(record => {
          dataObject = record.data;

          Object.keys(dataObject).forEach(key => {
            if (!selectedKeys.includes(key)) {
              delete dataObject[key];
            } else {
              const matchingColumn = columnsSelected.find(column => column.content === key);
              
              // Rename header from collection columns whit new labels(only for display)
              if (matchingColumn && matchingColumn.key !== key) {
                dataObject[matchingColumn.key] = dataObject[key];
                delete dataObject[key];
              }
            }
          });
        });
      }
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
           this.$root.$emit("record-list-collection", collectionFieldsData);
        }
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
      }
    },
  };
  </script>
