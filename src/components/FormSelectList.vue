<template>
  <div class="form-group">
    <required-asterisk /><label v-uni-for="name">{{ label }}</label>
    <multi-select-view
      v-if="options.renderAs === 'dropdown'"
      :option-value="optionsKey"
      :option-content="optionsValue"
      v-uni-id="name"
      v-model="valueProxy"
      :placeholder="placeholder ? placeholder : $t('Select...')"
      :show-labels="false"
      :options="selectListOptionsWithSelected"
      :react-options="reactOptions"
      :class="classList"
      :emit-objects="options.valueTypeReturned === 'object'"
      :emit-array="options.allowMultiSelect"
      v-bind="$attrs"
      @search-change="searchChange"
      :loading="loading"
    >
    </multi-select-view>

    <div v-if="options.renderAs === 'checkbox' && options.allowMultiSelect">
      <checkbox-view
        v-model="valueProxy"
        :name="name"
        :option-value="optionsKey"
        :option-content="optionsValue"
        :options="selectListOptionsWithSelected"
        :react-options="reactOptions"
        :emit-objects="options.valueTypeReturned === 'object'"
        v-bind="$attrs"
      />
    </div>

    <div v-if="options.renderAs === 'checkbox' && !options.allowMultiSelect">
      <optionbox-view
        v-model="valueProxy"
        :name="name"
        :option-value="optionsKey"
        :option-content="optionsValue"
        :options="selectListOptionsWithSelected"
        :react-options="reactOptions"
        :emit-objects="options.valueTypeReturned === 'object'"
        v-bind="$attrs"
      />
    </div>

    <div
      v-if="(validator && validator.errorCount) || error"
      class="invalid-feedback d-block"
    >
      <div v-for="(error, index) in validatorErrors" :key="index">
        {{ error }}
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import Mustache from "mustache";
import { isEqual, cloneDeep, get, set, debounce } from "lodash";
import ValidationMixin from "../mixins/validation";
import MultiSelectView from "./FormSelectList/MultiSelectView";
import CheckboxView from "./FormSelectList/CheckboxView";
import OptionboxView from "./FormSelectList/OptionboxView";
import RequiredAsterisk from './common/RequiredAsterisk';

const uniqIdsMixin = createUniqIdsMixin();

const MAX_COLLECTION_RECORDS = 100;

export default {
  name: 'FormSelectList',
  components: {
    OptionboxView,
    MultiSelectView,
    CheckboxView,
    RequiredAsterisk
  },
  mixins: [uniqIdsMixin, ValidationMixin],
  inheritAttrs: false,
  props: [
    "label",
    "error",
    "value",
    "options",
    "helper",
    "name",
    "controlClass",
    "validationData",
    "placeholder",
    "multiple"
  ],
  data() {
    return {
      lastRequest: {},
      previousSourceConfig: null,
      previousValidationData: null,
      previousValidationDataParent: null,
      selectListOptions: [],
      selectedOption: null,
      loading: false,
      loaded: false,
      previousDependentValue: null,
      filter: "",
      countWithoutFilter: null,
    };
  },
  computed: {
    selectListOptionsWithSelected() {
      if (this.selectedOption && !this.selectListOptions.some(o => o.value === this.selectedOption.value)) {
        return [this.selectedOption, ...this.selectListOptions];
      }
      return this.selectListOptions;
    },
    collectionOptions() {
      return get(this.options, 'collectionOptions');
    },
    isCollection() {
      return get(this.options, 'dataSource') === "collection"
    },
    mode() {
      return this.$root.$children[0].mode;
    },
    validatorErrors() {
      return (this.validator && this.validator.errors.get(this.name)) || [];
    },
    divClass() {
      return this.toggle ? "custom-control custom-radio" : "form-check";
    },
    reactOptions() {
      const isString = typeof this.value === "string";
      let resetValueIfNotInOptions = true;

      // If is the first time is loaded and the type of the value is string,
      // should not reset the dependent select ..
      if (!this.loaded && isString) {
        resetValueIfNotInOptions = false;
      }

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.loaded = true;
      this.fillSelectListOptions(resetValueIfNotInOptions);

      return undefined;
    },
    sourceConfig() {
      return {
        dataSource: this.options.dataSource,
        collectionOptions: this.options.collectionOptions,
        selectedEndPoint: this.options.selectedEndPoint,
        selectedDataSource: this.options.selectedDataSource,
        valueTypeReturned: this.options.valueTypeReturned,
        dataName: this.options.dataName,
        value: this.options.value,
        key: this.options.key
      };
    },
    valueProxy: {
      get() {
        if (this.options.renderAs === "dropdown") {
          let newValue = this.value;
          if (this.options.valueTypeReturned === "object" && this.value) {
            if (!Array.isArray(this.value)) {
              newValue = [this.value];
            }
            newValue.forEach((item) => {
              this.addObjectContentProp(item);
            });
          }
          return this.areItemsInSelectListOptions(newValue) ? this.value : [];
        }
        return this.value;
      },
      set(val) {
        this.selectedOption = val ? this.selectListOptions.find(o => o.value === val) : null;
        return this.$emit("input", val);
      }
    },
    optionsKey() {
      if (
        this.options.dataSource &&
        this.options.dataSource === "provideData"
      ) {
        return "value";
      }

      if (
        this.options.dataSource &&
        this.options.dataSource === "dataConnector" &&
        this.options.valueTypeReturned === "object"
      ) {
        return this.optionsValue;
      }

      const fieldName = this.options.key || "value";

      return this.stripMustache(fieldName);
    },
    optionsValue() {
      if (
        this.options.dataSource &&
        (this.options.dataSource === "provideData" ||
          this.isCollection)
      ) {
        return "content";
      }
      return "__content__";
    },
    classList() {
      return {
        "has-errors":
          (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      };
    }
  },
  watch: {
    selectListOptions: {
      handler() {
        if (this.isCollection) {
          if (this.value && !this.selectListOptions.some(o => o.value === this.value)) {
            this.loadIndividualRecord();
          }
        }
      }
    },
  },
  methods: {
    renderPmql(pmql) {
      if (typeof pmql !== "undefined" && pmql !== "" && pmql !== null) {
        const data = this.makeProxyData();
        return Mustache.render(pmql, data);
      }
      return "";
    },
    /**
     * Load select list options from a data connector
     *
     * @param {object} options
     * @returns {boolean}
     */
    async loadOptionsFromDataConnector(options) {
      const { selectedEndPoint, selectedDataSource, dataName } = options;

      // If no data source has been specified, do not make the api call
      if (
        selectedDataSource === null ||
        typeof selectedDataSource === "undefined" ||
        selectedDataSource.toString().trim().length === 0
      ) {
        return false;
      }

      // Do not run in standalone mode
      if (!this.$dataProvider) {
        return false;
      }

      // If no endpoint has been specified, do not make the api call
      if (
        selectedEndPoint === null ||
        typeof selectedEndPoint === "undefined" ||
        selectedEndPoint.toString().trim().length === 0
      ) {
        return false;
      }

      const params = {
        config: {
          endpoint: selectedEndPoint
        }
      };

      if (
        typeof this.options.pmqlQuery !== "undefined" &&
        this.options.pmqlQuery !== "" &&
        this.options.pmqlQuery !== null
      ) {
        const data = this.makeProxyData();
        const pmql = Mustache.render(this.options.pmqlQuery, { data });
        params.config.outboundConfig = [
          { type: "PARAM", key: "pmql", value: pmql }
        ];
      }
      const request = { selectedDataSource, params };
      if (isEqual(this.lastRequest, request)) {
        return false;
      }
      this.lastRequest = cloneDeep(request);

      try {
        const response = await this.$dataProvider.getDataSource(
          selectedDataSource,
          params
        );
        const list = dataName ? get(response.data, dataName) : response.data;
        const transformedList = this.transformOptions(list);
        this.$root.$emit("selectListOptionsUpdated", transformedList);
        this.selectListOptions = transformedList;
        return true;
      } catch (err) {
        /* Ignore error */
        console.warn(err);
        return false;
      }
    },
    async loadOptionsFromCollection() {
      if (this.mode === "editor") {
        return false;
      }

      if (
        !this.collectionOptions ||
        !this.collectionOptions.collectionId ||
        !this.collectionOptions.labelField ||
        !this.collectionOptions.valueField
      ) {
        return false;
      }
      
      const options = {
        params: { per_page: MAX_COLLECTION_RECORDS }
      };

      let pmql = this.renderPmql(this.collectionOptions.pmql);

      pmql = this.includeFilterInPmql(pmql);

      if (pmql) {
        options.params.pmql = pmql;
      }

      if (this.collectionOptions.unique) {
        options.params.groupBy = this.collectionOptions.labelField;
      }

      await this.getCollectionRecords(options);

      return true;
    },
    formatCollectionRecordResults(record) {
      let content = get(record, this.collectionOptions.labelField);
      let value = get(record, this.collectionOptions.valueField);

      // Special handler for file uploads
      if (typeof content === 'object' && ('name' in content)) {
        content = content.name;
      }
      if (typeof value === 'object' && ('id' in value)) {
        value = value.id;
      }

      return {
        value: String(value),
        content: String(content)
      };
    },
    includeFilterInPmql(pmql) {
      if (this.filter) {
        const filterPmql = `${this.collectionOptions.labelField} like "%${this.filter}%"`;
        if (pmql) {
          pmql = `(${pmql}) AND ${filterPmql}`;
        } else {
          pmql = filterPmql;
        }
      }
      return pmql;
    },
    async loadIndividualRecord() {
      let pmql = this.renderPmql(this.collectionOptions.pmql);
      const recordPmql = `${this.collectionOptions.valueField} = "${this.value}"`;
      if (pmql) {
        pmql += ` AND ${recordPmql}`;
      } else {
        pmql = recordPmql;
      }
      
      this.loading = true;
      const [data] = await this.$dataProvider.getCollectionRecords(
        this.collectionOptions.collectionId,
        { params: { pmql } }
      );
      this.loading = false;

      if (data.data && data.data.length > 0) {
        this.selectedOption = this.formatCollectionRecordResults(data.data[0]);
      } else {
        this.selectedOption = null;
        this.updateWatcherDependentFieldValue(true);
      }
    },
    async getCollectionRecords(options) {
      let data = { data : [] };
      let resolvedNonce = null;
            
      // Nonce ensures we only use results from the latest request
      this.nonce = Math.random();

      this.loading = true;
      [data, resolvedNonce] = await this.$dataProvider.getCollectionRecords(
        this.collectionOptions.collectionId,
        options,
        this.nonce
      );
      this.loading = false;

      if (resolvedNonce !== this.nonce) {
        return;
      }

      this.nonce = null;
      
      if (!this.filter) {
        this.countWithoutFilter = data.meta ? data.meta.total : null;
      }
      
      this.selectListOptions = data.data.map(this.formatCollectionRecordResults);
    },
    debouncedSetFilter: debounce(function(value) {
      this.filter = value;
    }, 300),
    searchChange(value) {
      if (this.isCollection) {
        if (this.countWithoutFilter && this.countWithoutFilter < MAX_COLLECTION_RECORDS) {
          // No need to backend filter since all items were returned
          return;
        }
        this.loading = true;
        this.debouncedSetFilter(value);
      }
    },
    /**
     * Transform the options to the format expected by the select list.
     *
     * @param {Boolean} resetValueIfNotInOptions
     */
    async fillSelectListOptions(resetValueIfNotInOptions) {
      let wasUpdated = false;
      if (
        this.options.dataSource &&
        this.options.dataSource === "provideData"
      ) {
        if (
          this.options &&
          this.options.optionsList &&
          !isEqual(this.selectListOptions, this.options.optionsList)
        ) {
          this.selectListOptions = this.options.optionsList;
        }
        this.selectListOptions = this.selectListOptions || [];
        wasUpdated = true;
      }

      if (this.options.dataSource && this.options.dataSource === "dataObject") {
        let requestOptions = [];
        try {
          const data = this.makeProxyData();
          requestOptions = get(data, this.options.dataName);
        } catch (e) {
          requestOptions = [];
        }

        const list = requestOptions || [];
        this.selectListOptions = this.transformOptions(list);
        wasUpdated = true;
      }

      if (
        this.options.dataSource &&
        this.options.dataSource === "dataConnector"
      ) {
        wasUpdated = await this.loadOptionsFromDataConnector(this.sourceConfig);
      }

      if (this.isCollection) {
        await this.loadOptionsFromCollection();
        wasUpdated = false; // we call updateWatcherDependentFieldValue later
      }

      if (wasUpdated) {
        this.$nextTick(() => {
          this.updateWatcherDependentFieldValue(resetValueIfNotInOptions);
        });
      }
    },

    /**
     * @param {*|*[]} list, array of objects
     */
    transformOptions(list) {
      const suffix = this.attributeParent(this.options.value);
      const resultList = [];

      if (!Array.isArray(list)) {
        console.warn('The retrieved data is not an array. Please check the data sources options of the select list `' + this.name + '`')
        return resultList;
      }

      list.forEach((item) => {
        // if the content has a mustache expression
        const { escape } = Mustache;
        Mustache.escape = (t) => t; // Do not escape mustache content

        let parsedOption = {};
        if (this.options.key) {
          const itemValue =
            this.options.key.indexOf("{{") >= 0
              ? Mustache.render(this.options.key, item)
              : Mustache.render(`{{${this.options.key || "value"}}}`, item);
          parsedOption[this.optionsKey] = itemValue;
        }
        const itemContent =
          this.options.value.indexOf("{{") >= 0
            ? Mustache.render(this.options.value, item)
            : Mustache.render(`{{${this.options.value || "content"}}}`, item);

        Mustache.escape = escape; // Reset mustache to original escape function

        parsedOption[this.optionsValue] = itemContent;
        if (this.options.valueTypeReturned === "object") {
          parsedOption = suffix.length > 0 ? get(item, suffix) : item;
          if (!parsedOption.hasOwnProperty(this.optionsValue)) {
            Object.defineProperty(parsedOption, this.optionsValue, {
              get() {
                return itemContent;
              }
            });
          }
        }
        resultList.push(parsedOption);
      });
      return resultList;
    },
    addObjectContentProp(parsedOption) {
      if (!(parsedOption instanceof Object)) {
        return parsedOption;
      }
      const suffix = this.attributeParent(this.options.value);
      let contentProperty = this.options.value;
      if (contentProperty.indexOf("{{") === -1) {
        contentProperty = `{{ ${contentProperty} }}`;
      }
      if (!parsedOption.hasOwnProperty(this.optionsValue)) {
        Object.defineProperty(parsedOption, this.optionsValue, {
          get() {
            // note this = parsedOption
            let data = {};
            if (suffix) {
              set(data, suffix, this);
            } else {
              data = this;
            }
            return Mustache.render(contentProperty, data);
          }
        });
      }
      return parsedOption;
    },
    stripMustache(str) {
      const removed = str
        .replace(/{{/g, "")
        .replace(/}}/g, "")
        .split(".")
        .pop();

      return removed || str;
    },
    attributeParent(str) {
      // Check if the value has a mustache expression
      const isMustache = str.indexOf("{{") >= 0;
      // If mustache is present, find variables inside mustache
      if (isMustache) {
        const mustacheVariables = str.match(/{{[^}]+}}/g);
        if (mustacheVariables) {
          let result;
          mustacheVariables.forEach((variable) => {
            // Get owner variable. Ex. for `data.name.first` owner is `data.name`
            const stripped = variable.substr(2, variable.length - 4).trim();
            const splitted = stripped.split(".");
            splitted.pop();
            const owner = splitted.join(".");
            // Select the smallest owner
            if (!result || result.length > owner.length) {
              result = owner;
            }
          });
          return result;
        }
      } else {
        const splitted = str.trim().split(".");
        splitted.pop();
        const owner = splitted.join(".");
        return owner;
      }
    },
    /**
     * If the options list changes due to a dependant field change, we need to check if
     * the selected value still exists in the new set of options. If it's gone now, then
     * set this control's value to null.
     * @param {boolean} resetValueIfNotInOptions
     */
    updateWatcherDependentFieldValue(resetValueIfNotInOptions) {
      let hasKeyInOptions = true;

      if (Array.isArray(this.value)) {
        hasKeyInOptions = true;
        this.value.forEach((item) => {
          const hasItemInOption = this.selectListOptionsWithSelected.find((option) => {
            if (this.options.valueTypeReturned === "object") {
              return isEqual(option, item);
            }
            return get(option, this.optionsKey) === item;
          });

          hasKeyInOptions = hasKeyInOptions && hasItemInOption;
        });
      } else {
        hasKeyInOptions = this.selectListOptionsWithSelected.find((option) => {
          if (this.options.valueTypeReturned === "object") {
            return isEqual(option, this.value);
          }
          return get(option, this.optionsKey) === this.value;
        });
      }

      if (!hasKeyInOptions && resetValueIfNotInOptions) {
        this.$emit("reset", this.name);
      }
    },
    /**
     * Returns true if one or more items in list (an array) are in Select List's options
     * @param {array} list
     * @returns {boolean}
     */
    areItemsInSelectListOptions(list) {
      if (!Array.isArray(list)) {
        return true;
      }

      const itemsInOptionsList = list.filter((item) => {
        const hasItemInOption = this.selectListOptions.find((option) => {
          if (this.options.valueTypeReturned === "object") {
            return isEqual(option, item);
          }
          return get(option, this.optionsKey) === item;
        });
        return hasItemInOption !== undefined;
      });

      return itemsInOptionsList.length > 0;
    }
  }
};
</script>
