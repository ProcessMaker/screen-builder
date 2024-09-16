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
         <!-- <CollectionRecordsList :value="'abc'"/> -->
         <!-- <CollectionRecordsList 
         v-model="col"
         @collection-change="handleCollectionChange"/> -->
         <CollectionRecordsList 
         v-model="collectionFields"
         :record-pmql="pmql"/>

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
    </div>
  </template>
  <script>
  //import ScreenVariableSelector from "../screen-variable-selector.vue";
  import CollectionRecordsList from "./collection-records-list.vue"
  import CollectionDisplayMode from "./collection-display-mode.vue"
  const CONFIG_FIELDS = [
    "collectionFields",
    "pmql"
  ];
  export default {
    components: {
      //ScreenVariableSelector
      CollectionRecordsList,
      CollectionDisplayMode
    },
    props: ["value", "screenType"],
    data() {
      return {
        fields: [],
        sourceOptions: null,
        submitCollectionCheck: true,
        sourceDisplayOptions: [],
        collectionFields: [],
        pmql: null,
        mod: String,
      };
    },
    mounted() {
      this.getFields();
    },
    computed: {
      options() {
        // console.log("en compute oiptions nuevo data source retorna: ", Object.fromEntries(
        //   CONFIG_FIELDS.map((field) => [field, this[field]])
        // ));
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
          //console.log("en value nuevo data source: ", value);
          CONFIG_FIELDS.forEach((field) => (this[field] = value[field]));
        },
        immediate: true
      },
      sourceOptions: {
        handler() {
          //console.log("En handler sourceOptions")
        }
      },
      collectionFields: {
        handler(newCol) {
            console.log("handler col: ", newCol);
        }
      },
      pmql: {
        handler(newPmql) {
            //console.log("handler pmql: ", newPmql);
            this.$root.$emit("change-pmql", newPmql);
        }
      },
      submitCollectionCheck(newValue) {
        this.submitCollectionCheck = newValue;
      },
      options: {
        handler() {
            //console.log("EMit nuevo data sources: ", this.options);
          this.$emit("input", this.options);
        },
        deep: true
      }
    },
    methods: {
    handleModeChange(value) {
      //console.log('Mode cambió:', value);
      // Aquí puedes manejar el cambio en el componente B
    },
    // handleCollectionChange(value) {
    //   //console.log('Collection cambió:', value);
    //   this.collectionFields = value;
    //   // Aquí puedes manejar el cambio en el componente B
    // },
      getFields() {
        this.sourceDisplayOptions = [
          { value: "Variable", text: "Variable" },
          { value: "Collection", text: "Collection" }
        ];
      }
    }
  };
  </script>
