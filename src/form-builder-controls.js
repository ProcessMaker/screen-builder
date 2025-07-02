import FormText from './components/renderer/form-text';
import FormButton from './components/renderer/form-button';
import FormMultiColumn from './components/renderer/form-multi-column';
import FormLoop from './components/renderer/form-loop';
import FormRecordList from './components/renderer/form-record-list';
import FormImage from './components/renderer/form-image';
import FormMaskedInput from './components/renderer/form-masked-input';
import FormNestedScreen from './components/renderer/form-nested-screen';
import FileUpload from './components/renderer/file-upload';
import FileDownload from './components/renderer/file-download';
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
  defaultValueProperty,
  buttonTypeEvent,
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
        renderVarHtml: null,
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
        {
          type: 'FormCheckbox',
          field: 'renderVarHtml',
          config: {
            label: 'Render HTML from a Variable',
            helper: '',
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
        labelProperty,
        DataTypeProperty,
        DataFormatProperty,
        validationRulesProperty,
        placeholderProperty,
        helperTextProperty,
        readonlyProperty,
        colorProperty,
        bgcolorProperty,
        defaultValueProperty,
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
        keyNameProperty,
        labelProperty,
        placeholderProperty,
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
        defaultValueProperty,
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
        dataSourceUrl:'',
        dataSourceEndpoint:'',
        rootElement:'response',
        options: {
          showRenderAs: true,
          dataSource: dataSourceValues.provideData,
          jsonData: '',
          pmqlQuery: '',
          dataName: 'response',
          renderAs: 'dropdown',
          allowMultiSelect: false,
          selectedOptions: [],
          optionsList: [],
          key:'value',
          value:'content',
          valueTypeReturned: 'single',
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
        readonlyProperty,
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
        minDate: '',
        maxDate: '',
      },
      inspector: [
        {
          type: 'FormInput',
          field: 'minDate',
          config: {
            label: 'Minimum Date',
            validation: 'date_or_mustache',
          },
        },
        {
          type: 'FormInput',
          field: 'maxDate',
          config: {
            label: 'Maximum Date',
            validation: 'date_or_mustache',
          },
        },
        keyNameProperty,
        labelProperty,
        DataTypeDateTimeProperty,
        validationRulesProperty,
        placeholderProperty,
        helperTextProperty,
        colorProperty,
        bgcolorProperty,
        disabledProperty,
        defaultValueProperty,
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
            validation: 'columns-adds-to-12',
          },
        },
        colorProperty,
        bgcolorProperty,
      ],
    },
  },
  {
    editorComponent: FormLoop,
    editorBinding: 'FormLoop',
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
        name: '',
        icon: 'fas fa-redo',
        settings: {
          type: 'new',
          varname: 'loop',
          times: '3',
          add: false,
        },
      },
      inspector: [
        {
          type: 'LoopInspector',
          field: 'settings',
          config: {
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
      'editor-control': 'FormRecordList',
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
        renderImage: false,
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
      {
        type: 'ImageVariable',
        field: 'imageName',
        config: {
          label: 'Render from a variable name',
          helper: null,
        },
      },
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
    editorBinding: 'FormSubmit',
    rendererComponent: FormButton,
    rendererBinding: 'FormButton',
    control: {
      label: 'Submit Button',
      component: 'FormButton',
      'editor-component': 'FormButton',
      'editor-control': 'FormSubmit',
      config: {
        icon: 'fas fa-share-square',
        label: 'New Submit',
        variant: 'primary',
        event: 'submit',
        defaultSubmit: true,
        name: null,
        fieldValue: null,
      },
      inspector: [
        {
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
        buttonTypeEvent,
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
  {
    editorComponent: FormNestedScreen,
    editorBinding: 'FormNestedScreen',
    rendererComponent: FormNestedScreen,
    rendererBinding: 'FormNestedScreen',
    control: {
      label: 'Nested Screen',
      component: 'FormNestedScreen',
      'editor-component': 'FormNestedScreen',
      'editor-control': 'FormNestedScreen',
      config: {
        label: 'Nested Screen',
        icon: 'fas fa-file-invoice',
        variant: 'primary',
        name: 'Nested Screen',
        value: null,
      },
      inspector: [
        {
          type: 'ScreenSelector',
          field: 'screen',
          config: {
            label: 'Screen',
            name: 'SelectScreen',
            'validate-nested': false,
            helper: 'Select a screen',
          },
        },
      ],
    },
  },
  {
    rendererComponent: FileUpload,
    rendererBinding: 'FileUpload',
    builderComponent: FileUpload,
    builderBinding: 'FileUpload',
    control: {
      label: 'File Upload',
      component: 'FileUpload',
      'editor-component': 'FileUpload',
      'editor-control': 'FileUpload',
      config: {
        label: 'New File Upload',
        icon: 'fas fa-file-upload',
      },
      inspector: [
        keyNameProperty,
        {
          type: 'FormInput',
          field: 'label',
          config: {
            label: 'Label',
            helper: 'The label describes the field\'s name',
          },
        },
        {
          type: 'FormInput',
          field: 'accept',
          config: {
            label: 'File Accepted',
            helper: 'Common file types: application/msword, image/gif, image/jpeg, application/pdf, application/vnd.ms-powerpoint, application/vnd.ms-excel, text/plain',
          },
        },
        {
          type: 'RequiredCheckbox',
          field: 'validation',
          config: {
            label: 'Required',
            helper: 'Prevent form from being submitted unless a file is uploaded',
          },
        },
      ],
    },
  },
  {
    rendererComponent: FormText,
    rendererBinding: 'FormText',
    builderComponent: FileDownload,
    builderBinding: 'FileDownload',
    control: {
      label: 'File Download',
      component: 'FileDownload',
      'editor-component': 'FormText',
      'editor-control': 'FileDownload',
      config: {
        label: 'New File Download',
        icon: 'fas fa-file-download',
      },
      inspector: [{
        type: 'FormInput',
        field: 'label',
        config: {
          label: 'Label',
          helper: 'The text to display',
        },
      },
      {
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Name',
          helper: 'The name of the Download',
        },
      },
      ],
    },
  },
];
