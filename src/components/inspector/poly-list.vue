<template>
<div>
    <div class="row mb-3">
      <div class="col-12">
        <input type="checkbox"  v-model="allowMultiSelect">
        Allow multiple selections
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <label for="render-as">{{ $t('Render Options As') }}</label>
        <b-form-select id="render-as" v-model="renderAs" :options="renderAsOptions"/>
      </div>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import { dataSources, dataSourceValues } from './data-source-types';

export default {
  components: {
    draggable,
  },
  props: ['options'],
  model: {
    prop: 'options',
    event: 'change',
  },
  data() {
    return {
      //jsonError: '',
      //optionError:'',
      //dragging: false,
      //dataSourceValues,
      //dataSources,
      //dataSource: dataSourceValues.provideData,
      //jsonData: '',
      //key: null,
      //value: null,
      //dataName: '',
      //pmqlQuery: '',
      //optionsList: [],
      //showOptionCard: false,
      //showRemoveWarning: false,
      //showJsonEditor: false,
      //optionCardType: '',
      //editIndex: null,
      //removeIndex: null,
      //optionValue: '',
      //optionContent: '',
      renderAs: 'dropdown',
      allowMultiSelect: false,
      //defaultOption: '',
      //selectedOptions: [],
      renderAsOptions: [
        {
          text:'Dropdown/Multiselect' ,
          value: 'dropdown',
        },
        {
          text: 'Radio/Checkbox Group',
          value: 'checkbox',
        },
      ],
    };
  },
  watch: {
    options() {
      //this.dataSource = this.options.dataSource;
      //this.jsonData = this.options.jsonData;
      //this.dataName = this.options.dataName;
      //this.key = this.options.key;
      //this.value = this.options.value;
      //this.pmqlQuery = this.options.pmqlQuery;
      this.renderAs = this.options.renderAs;
      this.allowMultiSelect = this.options.allowMultiSelect;
      //this.defaultOption = this.options.defaultOption;
      //this.selectedOptions = this.options.selectedOptions;
      //this.optionsList = this.options.optionsList;
    },
    dataSource() {
      this.jsonData = '';
      this.dataName = '';
    },
    dataObjectOptions(dataObjectOptions) {
      this.$emit('updateRender', dataObjectOptions);
    },
  },
  computed: {
    //jsonDataClass() {
    //  return this.jsonError ? 'is-invalid' : '';
    //},
    //optionKeyClass() {
    //  return this.optionError ? 'is-invalid' : '';
    //},
    //keyField() {
    //  return this.key || 'key';
    //},
    //valueField() {
    //  return this.value || 'value';
    //},
    //currentItemToDelete() {
    //  if (this.removeIndex !== null
    //      && this.optionsList.length > 0
    //      && this.optionsList[this.removeIndex] !==
    //      undefined) {
    //    let itemName =  this.optionsList[this.removeIndex][this.valueField];
    //    return this.$t('Are you sure you want to delete "{{item}}"?', {item:itemName});
    //  }
    //  return '';
    //},
    dataObjectOptions() {
      console.log('PolyList-emitiendo');
      return {
        //dataSource: this.dataSource,
        //jsonData: this.jsonData,
        //dataName: this.dataName,
        //key: this.key,
        //value: this.value,
        //pmqlQuery: this.pmqlQuery,
        renderAs: this.renderAs,
        allowMultiSelect: this.allowMultiSelect,
        //defaultOption: this.defaultOption,
        //selectedOptions: this.selectedOptions,
        //optionsList: this.optionsList,
      };
    },
  },
  mounted() {
    //this.dataSource = this.options.dataSource;
    //this.jsonData = this.options.jsonData;
    //this.dataName = this.options.dataName;
    //this.key = this.options.key;
    //this.value = this.options.value;
    //this.pmqlQuery = this.options.pmqlQuery;
    this.renderAs = this.options.renderAs;
    this.allowMultiSelect = this.options.allowMultiSelect;
    //this.defaultOption= this.options.defaultOption;
    //this.selectedOptions = this.options.selectedOptions;
    //this.optionsList = this.options.optionsList ? this.options.optionsList : [];
    //this.jsonData = JSON.stringify(this.optionsList);
  },
  methods: {
    //keyChanged() {
    //  this.optionsList = [];
    //},
    //valueChanged() {
    //  this.optionsList = [];
    //},
    //jsonDataChange() {
    //  let jsonList = [];
    //  try {
    //    jsonList = JSON.parse(this.jsonData);
    //    if (jsonList.constructor !== Array && jsonList.constructor !== Object) {
    //      throw Error('String does not represent a valid JSON');
    //    }
    //  }
    //  catch (err) {
    //    this.jsonError = err.message;
    //    return;
    //  }

    //  this.optionsList = [];
    //  const that = this;
    //  jsonList.forEach (item => {
    //    that.optionsList.push({
    //      [that.keyField] : item[that.keyField], 
    //      [that.valueField] : item[that.valueField],
    //    });
    //  });
    //  this.jsonError = '';
    //},
    //updateSort() {
    //  this.jsonData = JSON.stringify(this.optionsList);
    //  this.$emit('change', this.dataObjectOptions);
    //  
    //},
    //editAsJson() {
    //  this.showJsonEditor = true;
    //},
    //editAsOptionList() {
    //  this.showJsonEditor = false;
    //},
    //showEditOption(index) {
    //  this.optionCardType = 'edit';
    //  this.editIndex = index;
    //  this.showOptionCard = true;
    //  this.optionContent = this.optionsList[index][this.valueField];
    //  this.optionValue = this.optionsList[index][this.keyField];
    //  this.optionError = '';
    //},
    //showAddOption() {
    //  this.optionCardType = 'insert';
    //  this.optionContent = '';
    //  this.optionValue = '';
    //  this.showOptionCard = true;
    //  this.optionError = '';
    //},
    //addOption() {
    //  const that = this;

    //  if (this.optionsList.find(item => { return item[that.keyField] === this.optionValue; })) {
    //    this.optionError = 'An item with the same key already exists';
    //    return;
    //  } 

    //  if (this.optionCardType === 'insert') {
    //    this.optionsList.push(
    //      {
    //        [this.valueField]: this.optionContent,
    //        [this.keyField]: this.optionValue,
    //      }
    //    );
    //  }
    //  else {
    //    this.optionsList[this.editIndex][this.keyField] = this.optionValue;
    //    this.optionsList[this.editIndex][this.valueField] = this.optionContent;
    //  }

    //  this.jsonError = '';
    //  this.jsonData = JSON.stringify(this.optionsList);
    //  this.showOptionCard = false;
    //  this.optionError = '';
    //},

    //deleteOption() {
    //  this.optionsList.splice(this.removeIndex, 1);
    //  this.jsonData = JSON.stringify(this.optionsList);
    //  this.showRemoveWarning = false;
    //},

    //removeOption(index) {
    //  this.removeIndex = index;
    //  this.showRemoveWarning = true;
    //},
  },
};
</script>
