<template>
  <div>

    <div id="addOption" class="card" v-show="showOptionCard">
      <div class="card-header" v-if="optionCardType == 'insert'">
        {{ $t('Add Option') }}
      </div>
      <div v-else class="card-header">
        {{ $t('Edit Option') }}
      </div>
      <div class="card-body">
        <label for="option-value">{{ $t('Value') }}</label>
        <b-form-input id="option-value" v-model="optionValue"/>
        <label for="option-content">{{ $t('Content') }}</label>
        <b-form-input id="option-content" v-model="optionContent"/>
        <div class="card-footer">
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="showOptionCard=false">
            Cancel
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
            Save
          </button>
        </div>
      </div>
    </div>

    <div id="removeOption" class="card text-white bg-danger mb-3" v-show="showRemoveWarning">

      <div class="card-body">
        {{ $t('Are you sure you want to delete ') }} '{{ this.currentItemToDelete }}' ?
      </div>
      <div class="card-footer">
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="showRemoveWarning=false">
          Cancel
        </button>
        <button type="button" class="btn btn-sm btn-secondary" @click="deleteOption()">
          Yes
        </button>
      </div>
    </div>

    <div class="container" v-if="!showJsonEditor" style="margin-left:-12px;">
      <div class="row">
        <div class="col-10">
          <label for="data-sources">{{ $t('Options') }}</label>
        </div>
        <div class="col-2">
          <a @click="showAddOption" class="fas fa-plus-square"/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <table class="table table-sm">
            <draggable @update="updateSort"
              :element="'tbody'"
              v-model="existingOptions"
              :options="{group:'options'}"
              @start="drag=true"
              @end="drag=false"
            >
              <tr v-for="(option, index) in existingOptions" :key="index">
                <td style="width:10%;">
                  <span class="fas fa-arrows-alt-v"/>
                </td>
                <td style="width:10%;">
                  <input type="radio" class="form-check-input2" id="materialChecked" name="materialExampleRadios">
                </td>
                <td style="width:50%;">
                  {{ option.content }}
                </td>
                <td style="width:10%;">
                  <a @click="showEditOption(index)" class="fas fa-cog"/>
                </td>
                <td style="width:10%;">
                  <a @click="removeOption(index)" class="fas fa-trash-alt"/>
                </td>
              </tr>
            </draggable>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <a @click="editAsJson()" href="#">
            <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> Edit as JSON</small>
          </a>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-1">
          <input type="checkbox" class="form-check-input" id="materialUnchecked">
        </div>
        <div class="col-11">
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

    <b-modal @cancel="resetAdd" @ok="addOption" id="addOptionModal" title="Add New Option">
      <form-input label="Option Value" v-model="addValue" :error="this.addError"/>
      <form-input label="Option Label" v-model="addContent"/>
    </b-modal>

    <label for="data-sources">{{ $t('Source Type') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSources"/>
    <small class="form-text text-muted mb-3">Data source to populate select</small>

    <div v-if="showJsonEditor">
      <div v-if="dataSource === dataSourceValues.provideData">
        <label for="json-data">{{ $t('JSON Data') }}</label>
        <b-form-textarea class="mb-3" id="json-data" rows="8" v-model="jsonData"/>
      </div>

      <label for="key">{{ $t('Key') }}</label>
      <b-form-input id="key" v-model="key"/>
      <small class="form-text text-muted mb-3">Field to save to the data object</small>

      <label for="value">{{ $t('Value') }}</label>
      <b-form-input id="value" v-model="value"/>
      <small class="form-text text-muted mb-3">Field to show in the select box</small>

      <a @click="editAsOptionList()" href="#">
        <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> Edit as Option List</small>
      </a>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="data-name">{{ $t('Data Name') }}</label>
      <b-form-input id="data-name" v-model="dataName"/>
      <small class="form-text text-muted mb-3">Data source to populate select</small>
    </div>


<!--    <label for="pmql-query">{{ $t('PMQL') }}</label>-->
<!--    <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>-->
<!--    <small class="form-text text-muted">Advanced data search</small>-->
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
      dataSourceValues,
      dataSources,
      dataSource: dataSourceValues.provideData,
      jsonData: '',
      key: null,
      value: null,
      dataName: '',
      pmqlQuery: '',
      existingOptions: [{'value': 'key1', 'content': 'Val1'}, {'value': 'key2', 'content': 'Val2'}, {'value': 'key3', 'content': 'Val3'}],
      showOptionCard: false,
      showRemoveWarning: false,
      showJsonEditor: false,
      optionCardType: '',
      editIndex: null,
      removeIndex: null,
      optionValue: '',
      optionContent: '',
      renderAs: 'checkbox',
      selectedOptions: [],
      renderAsOptions: [
        {
          text:'Dropdown' ,
          value: 'dropdown',
        },
        {
          text: 'Checkbox Group',
          value: 'checkbox',
        }
      ],
    };
  },
  watch: {
    dataSource() {
      this.jsonData = '';
      this.dataName = '';
    },
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },
  },
  computed: {
    currentItemToDelete() {
      console.log('currentItemToDelete - removeIndex');
      console.log(this.removeIndex);
      console.log('currentItemToDelete - existingOptions');
      console.log(this.existingOptions);
      if (this.removeIndex !== null
          && this.existingOptions.length > 0
          && this.existingOptions[this.removeIndex] !==
          undefined) {
        return this.existingOptions[this.removeIndex].content;
      }
      return '';
    },
    dataObjectOptions() {
      console.log('Inspector-dataObjectOptions-selected options:');
      console.log(this.selectedOptions);
      console.log('Inspector-dataObjectOptions-render as:');
      console.log(this.renderAs);
      return {
        dataSource: this.dataSource,
        jsonData: this.jsonData,
        dataName: this.dataName,
        key: this.key,
        value: this.value,
        pmqlQuery: this.pmqlQuery,
        renderAs: this.renderAs,
        selectedOptions: this.selectedOptions,
      };
    },
  },
  mounted() {
    this.dataSource = this.options.dataSource;
    this.jsonData = this.options.jsonData;
    this.dataName = this.options.dataName;
    this.key = this.options.key;
    this.value = this.options.value;
    this.pmqlQuery = this.options.pmqlQuery;
    this.renderAs = this.options.renderAs;
    this.selectedOptions = this.options.selectedOptions;
    // console.log('Inspector Options - mounted - json data');
    // console.log(this.jsonData);
    // this.existingOptions = JSON.parse(this.jsonData);
  },
  updateSort() {
    let newOptions = JSON.parse(JSON.stringify(this.existingOptions));
    this.$emit('change', newOptions);
  },
  methods: {
    resetAdd() {
    },
    addError() {
    },
    addValue() {
    },
    addContent() {
    },
    updateSort() {
    },
    editAsJson() {
      this.showJsonEditor = true;
    },
    editAsOptionList() {
      this.showJsonEditor = false;
    },
    showEditOption(index) {
      this.optionCardType = 'edit';
      this.editIndex = index;
      this.showOptionCard = true;
      this.optionContent = this.existingOptions[index].content;
      this.optionValue = this.existingOptions[index].value;
    },
    showAddOption() {
      this.optionCardType = 'insert';
      this.showOptionCard = true;
    },
    addOption() {
      console.log('addOption');
      if (this.optionCardType === 'insert') {
        this.existingOptions.push(
          {
            content: this.optionContent,
            value: this.optionValue,
          }
        );
      }
      else {
        this.existingOptions[this.editIndex].content = this.optionContent;
        this.existingOptions[this.editIndex].value = this.optionValue;
      }

      this.key = 'value';
      this.value = 'content';
      this.jsonData = JSON.stringify(this.existingOptions);
      this.showOptionCard = false;
    },

    deleteOption() {
      this.existingOptions.splice(this.removeIndex, 1);
      this.jsonData = JSON.stringify(this.existingOptions);
      this.showRemoveWarning = false;
    },

    removeOption(index) {
      this.removeIndex = index;
      this.showRemoveWarning = true;
    },
  },
};
</script>
