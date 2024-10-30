<template>
    <div>
      <div>
        <label for="collectiondesigner">{{ $t("Table Style") }}</label>
        <b-form-select
          id="collectiondesigner"
          v-model="designerOptions"
          :options="designerListOptions"
          data-cy="inspector-collection-designer-model"
        />
      </div>
    </div>
  </template>
  <script>

  import { cloneDeep } from "lodash";

  const CONFIG_FIELDS = [
    "designerOptions"
  ];
  export default {
    props: ["value", "screenType"],
    data() {
      return {
        fields: [],
        designerOptions: "Classic",
        designerListOptions: [
        {
          text: this.$t('Classic'),
          value: 'Classic',
        },
        {
          text: this.$t('Modern'),
          value: 'Modern',
        },
      ],
      };
    },
    mounted () {
      this.callBuilder(this.designerOptions);
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
      options: {
        handler() {
          this.$emit("input", this.options);
          this.callBuilder(this.options.designerOptions);
        },
        deep: true
      },
    },
    methods: {
      callBuilder(option) {
        this.$root.$emit("style-mode", option);
      }
    }
  };
  </script>
