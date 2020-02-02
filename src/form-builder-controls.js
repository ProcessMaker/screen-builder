import FormText from './components/renderer/form-text';
import FormButton from './components/renderer/form-button';
import FormMultiColumn from './components/renderer/form-multi-column';
import FormRecordList from './components/renderer/form-record-list';
import FormImage from './components/renderer/form-image';
import FormMaskedInput from './components/renderer/form-masked-input';
import {DataTypeProperty, DataFormatProperty, DataTypeDateTimeProperty} from './VariableDataTypeProperties';
import {
  FormInput,
  FormTextArea,
  FormSelectList,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
} from '@processmaker/vue-form-elements';
import { dataSourceValues } from '@/components/inspector/data-source-types';

import Loop from  './components/editor/loop'
import FormLoop from  './components/renderer/form-loop'

import {
  bgcolorProperty,
  colorProperty,
  keyNameProperty,
  labelProperty,
  buttonLabelProperty,
  placeholderProperty,
  helperTextProperty,
  readonlyProperty,
  validationRulesProperty,
  toggleStyleProperty,
  buttonVariantStyleProperty,
  disabledProperty,
} from './form-control-common-properties';

export default [
  {
    editorComponent: FormHtmlEditor,
    editorBinding: 'FormHtmlEditor',
    rendererComponent: FormHtmlEditor,
    rendererBinding: 'FormHtmlEditor',
    control: {
      label: 'Rich Text',
      component: 'FormHtmlViewer',
      'editor-component': 'FormHtmlEditor',
      'editor-control': 'FormHtmlEditor',
      config: {
        icon: 'fas fa-pencil-ruler',
        interactive: true,
        content: '<p>Rich text editor</p>',
      },
      inspector: [
        {
          type: 'FormTextArea',
          field: 'content',
          config: {
            rows: 5,
            label: 'Content',
            helper: 'The HTML text to display',
            value: '',
          },
        },
      ],
    },
  },
  {
    builderComponent: FormInput,
    builderBinding: 'FormInput',
    rendererComponent: FormMaskedInput,
    rendererBinding: 'FormMaskedInput',
    control: {
      label: 'Line Input',
      component: 'FormInput',
      'editor-component': 'FormInput',
      'editor-control': 'FormInput',
      config: {
        icon: 'far fa-square',
        label: 'New Input',
        name: '',
        placeholder: '',
        validation: '',
        helper: null,
        type: 'text',
        dataFormat: 'string',
      },
      inspector: [
        keyNameProperty,
        DataTypeProperty,
        DataFormatProperty,
        labelProperty,
        validationRulesProperty,
        placeholderProperty,
        helperTextProperty,
        readonlyProperty,
        colorProperty,
        bgcolorProperty,
      ],
    },
  },
  {
    editorComponent: FormTextArea,
    editorBinding: 'FormTextArea',
    rendererComponent: FormTextArea,
    rendererBinding: 'FormTextArea',
    control: {
      label: 'Textarea',
      component: 'FormTextArea',
      'editor-component': 'FormTextArea',
      'editor-control': 'FormTextArea',
      'fa-icon': 'fas fa-paragraph',
      config: {
        icon: 'fas fa-paragraph',
        label: 'New Textarea',
        placeholder: '',
        helper: null,
        rows: 2,
        richtext: false,
        currency: {
          code: 'USD',
          name: 'US Dollar',
          format: '#,###.##',
          symbol: '$',
        },
      },
      inspector: [
        labelProperty,
        placeholderProperty,
        keyNameProperty,
        helperTextProperty,
        {
          type: 'FormCheckbox',
          field: 'richtext',
          config: {
            label: 'Rich Text',
            helper: '',
          },
        },
        validationRulesProperty,
        {
          type: 'FormInput',
          field: 'rows',
          config: {
            label: 'Rows',
            helper: 'The number of rows to provide for input',
            validation: 'integer',
          },
        },
        readonlyProperty,
        colorProperty,
        bgcolorProperty,
      ],
    },
  },
  {
    editorComponent: FormSelectList,
    editorBinding: 'FormSelectList',
    rendererComponent: FormSelectList,
    rendererBinding: 'FormSelectList',
    control: {
      label: 'Select List',
      component: 'FormSelectList',
      'editor-component': 'FormSelectList',
      'editor-control': 'FormSelectList',
      config: {
        icon: 'fas fa-angle-double-down',
        label: 'New Select List',
        placeholder: '',
        validation: '',
        dataFormat: 'array',
        dataSourceUrl:'',
        dataSourceEndpoint:'',
        rootElement:'response',
        options: {
          showRenderAs: true,
          dataSource: dataSourceValues.provideData,
          jsonData: '',
          dataName: 'response',
          renderAs: 'dropdown',
          allowMultiSelect: false,
          selectedOptions: [],
          optionsList: [],
          key:'value',
          value:'content',
        },
        helper: null,
      },
      inspector: [
        keyNameProperty,
        labelProperty,
        placeholderProperty,
        validationRulesProperty,
        helperTextProperty,
        {
          type: 'OptionsList',
          field: 'options',
          config: {},
        },
        colorProperty,
        bgcolorProperty,
      ],
    },
  },
  {
    editorComponent: FormCheckbox,
    editorBinding: 'FormCheckbox',
    rendererComponent: FormCheckbox,
    rendererBinding: 'FormCheckbox',
    control: {
      label: 'Checkbox',
      component: 'FormCheckbox',
      'editor-component': 'FormCheckbox',
      'editor-control': 'FormCheckbox',
      config: {
        icon: 'fas fa-check-square',
        label: 'New Checkbox',
        helper: null,
        name: null,
        initiallyChecked: false,
        validation: '',
        toggle: false,
      },
      inspector: [
        keyNameProperty,
        labelProperty,
        helperTextProperty,
        validationRulesProperty,
        {
          type: 'FormCheckbox',
          field: 'initiallyChecked',
          config: {
            label: 'Checked by default',
            helper: 'Should the checkbox be checked by default',
          },
        },
        colorProperty,
        bgcolorProperty,
        toggleStyleProperty,
        disabledProperty,
      ],
    },
  },
  {
    editorComponent: FormDatePicker,
    editorBinding: 'FormDatePicker',
    rendererComponent: FormDatePicker,
    rendererBinding: 'FormDatePicker',
    control: {
      label: 'Date Picker',
      component: 'FormDatePicker',
      'editor-component': 'FormDatePicker',
      'editor-control': 'FormDatePicker',
      config: {
        icon: 'far fa-calendar-alt',
        label: 'New Date Picker',
        type: 'datetime',
        name: '',
        placeholder: '',
      },
      inspector: [
        keyNameProperty,
        DataTypeDateTimeProperty,
        validationRulesProperty,
        labelProperty,
        placeholderProperty,
        helperTextProperty,
        colorProperty,
        bgcolorProperty,
        disabledProperty,
      ],
    },
  },
  {

    editorComponent: FormButton,
    editorBinding: 'FormButton',
    rendererComponent: FormButton,
    rendererBinding: 'FormButton',
    control: {
      label: 'Page Navigation',
      component: 'FormButton',
      'editor-component': 'FormButton',
      'editor-control': 'PageNavigation',
      config: {
        icon: 'far fa-compass',
        label: 'Page Navigation',
        variant: 'primary',
        event: 'pageNavigate',
        eventData: null,

      },
      inspector: [
        {
          type: 'PageSelect',
          field: 'eventData',
          config: {
            label: 'Destination Screen',
            helper: 'The destination page to navigate to',
          },
        },
        buttonLabelProperty,
        buttonVariantStyleProperty,
      ],
    },
  },
  {
    editorComponent: FormMultiColumn,
    editorBinding: 'FormMultiColumn',
    rendererComponent: FormMultiColumn,
    rendererBinding: 'FormMultiColumn',
    control: {
      label: 'Multicolumn / Table',
      component: 'FormMultiColumn',
      'editor-component': 'MultiColumn',
      'editor-control': 'MultiColumn',
      container: true,
      // Default items container
      items: [
        [],
        [],
      ],
      config: {
        icon: 'fas fa-table',
        options: [{
          value: '1',
          content: '6',
        },
        {
          value: '2',
          content: '6',
        },
        ],
      },
      inspector: [
        {
          type: 'ContainerColumns',
          field: 'options',
          config: {
            label: 'Column Width',
          },
        },
        colorProperty,
        bgcolorProperty,
      ],
    },
  },
  {
    editorComponent: Loop,
    editorBinding: 'Loop',
    rendererComponent: FormLoop,
    rendererBinding: 'FormLoop',
    control: {
      label: 'Loop',
      component: 'FormLoop',
      'editor-component': 'Loop',
      'editor-control': 'Loop',
      container: true,
      // Default items container
      items: [],
      config: {
        icon: 'fas fa-redo',
        times: "2",
      },
      inspector: [
        keyNameProperty,
        {
          type: 'FormInput',
          field: 'times',
          config: {
            label: 'Number of times',
            helper: 'Enter the number of times to repeat the element(s)',
          },
        },
      ],
    },
  },
  {
    editorComponent: FormText,
    editorBinding: 'FormText',
    rendererComponent: FormRecordList,
    rendererBinding: 'FormRecordList',
    control: {
      label: 'Record List',
      component: 'FormRecordList',
      'editor-component': 'FormText',
      'editor-control': 'FormText',
      config: {
        name: '',
        icon: 'fas fa-th-list',
        label: 'New Record List',
        editable: false,
        fields: {
          dataSource: dataSourceValues.provideData,
          jsonData: '',
        },
        form: '',
      },
      inspector: [
        keyNameProperty,
        {
          type: 'FormInput',
          field: 'label',
          config: {
            label: 'List Label',
            helper: 'The label describes this record list',
          },
        },
        {
          type: 'FormCheckbox',
          field: 'editable',
          config: {
            label: 'Editable?',
            helper: 'Should records be editable/removable and can new records be added',
          },
        },
        {
          type: 'ColumnSetup',
          field: 'fields',
          config: {
            label: 'Columns',
            helper: 'List of columns to display in the record list',
          },
        },
        {
          type: 'PageSelect',
          field: 'form',
          config: {
            label: 'Record Form',
            helper: 'The form to use for adding/editing records',
          },
        },
        colorProperty,
        bgcolorProperty,
      ],
    },
  },
  {
    editorComponent: FormImage,
    editorBinding: 'FormImage',
    rendererComponent: FormImage,
    rendererBinding: 'FormImage',
    control: {
      label: 'Image',
      component: 'FormImage',
      'editor-component': 'FormImage',
      'editor-control': 'FormImage',
      config: {
        label: 'Image',
        icon: 'fas fa-image',
        variant: 'primary',
        event: 'submit',
        name: null,
        value: null,
      },
      inspector: [{
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Name',
          helper: 'Image name',
        },
      },
      {
        type: 'ImageUpload',
        field: 'image',
        config: {
          label: 'Upload',
          helper: 'Upload image',
        },
      },
      helperTextProperty,
      {
        type: 'FormInput',
        field: 'height',
        config: {
          label: 'Height',
          helper: 'Image height',
          type: 'number',
        },
      },
      {
        type: 'FormInput',
        field: 'width',
        config: {
          label: 'Width',
          helper: 'image width',
          type: 'number',
        },
      },
      ],
    },
  },
  {
    editorComponent: FormButton,
    editorBinding: 'FormButton',
    rendererComponent: FormButton,
    rendererBinding: 'FormButton',
    control: {
      label: 'Submit Button',
      component: 'FormButton',
      'editor-component': 'FormButton',
      'editor-control': 'FormButton',
      config: {
        icon: 'fas fa-share-square',
        label: 'New Submit',
        variant: 'primary',
        event: 'submit',
        name: null,
        fieldValue: null,
      },
      inspector: [{
        type: 'FormInput',
        field: 'label',
        config: {
          label: 'Label',
          helper: 'The label describes the button\'s text',
        },
      },
      {
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Variable Name',
          name: 'Variable Name',
          helper: 'A variable name is a symbolic name to reference information.',
        },
      },
      {
        type: 'FormInput',
        field: 'fieldValue',
        config: {
          label: 'Value',
          helper: 'The value being submitted',
        },
      },
      buttonVariantStyleProperty,
      ],
    },
  },
];
