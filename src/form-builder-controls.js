import FormText from './components/renderer/form-text';
import FormAvatar from './components/renderer/form-avatar';
import FormButton from './components/renderer/form-button';
import FormMultiColumn from './components/renderer/form-multi-column';
import FormLoop from './components/renderer/form-loop';
import FormRecordList from './components/renderer/form-record-list';
import FormImage from './components/renderer/form-image';
import FormMaskedInput from './components/renderer/form-masked-input';
import FormNestedScreen from './components/renderer/form-nested-screen';
import FileUpload from './components/renderer/file-upload';
import FileDownload from './components/renderer/file-download';
import FormListTable from './components/renderer/form-list-table';
import FormAnalyticsChart from "./components/renderer/form-analytics-chart";
import {DataTypeProperty, DataFormatProperty, DataTypeDateTimeProperty} from './VariableDataTypeProperties';
import {
  FormInput,
  FormTextArea,
  FormSelectList,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormGrid,
  BFormComponent,
  BWrapperComponent,
} from '@processmaker/vue-form-elements';
import { dataSourceValues } from '@/components/inspector/data-source-types';

import {
  bgcolorProperty,
  colorProperty,
  keyNameProperty,
  javascriptReservedKeywords,
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
  tooltipProperty,
  LoadingSubmitButtonProperty,
  LabelSubmitButtonProperty
} from './form-control-common-properties';

export default [
  {
    editorComponent: FormHtmlEditor,
    editorBinding: 'FormHtmlEditor',
    rendererComponent: FormHtmlEditor,
    rendererBinding: 'FormHtmlEditor',
    control: {
      popoverContent: "Use a Rich Text Editor to add HTML-formatted",
      order: 1.0,
      group: 'Content Fields',
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
    builderComponent: FormGrid,
    builderBinding: 'FormGrid',
    rendererComponent: FormGrid,
    rendererBinding: 'FormGrid',
    control: {
      popoverContent: "Collect a string of text and format it as one of several data types",
      order: 1.0,
      group: 'Input Fields',
      label: 'FormGrid',
      component: 'FormGrid',
      'editor-component': 'FormGrid',
      'editor-control': 'FormGrid',
      config: {
        icon: 'fas fa-server',
        label: 'New Input',
        name: '',
        placeholder: '',
        validation: '',
        helper: null,
        type: 'text',
        // dataFormat: 'string',
        // dataSourceUrl:'',
        // dataSourceEndpoint:'',
        // rootElement:'response',
        // dataSourceUrl:'',
        // dataSourceEndpoint:'',
        // options: {
        //   showRenderAs: true,
        //   dataSource: dataSourceValues.provideData,
        //   jsonData: '',
        //   pmqlQuery: '',
        //   dataName: 'response',
        //   renderAs: 'dropdown',
        //   allowMultiSelect: false,
        //   selectedOptions: [],
        //   optionsList: [],
        //   key:'value',
        //   value:'content',
        //   valueTypeReturned: 'single',
        // },
      },
      inspector: [
        // {
        //   type: 'FormTextArea',
        //   field: 'content',
        //   config: {
        //     rows: 5,
        //     label: 'Config And Data',
        //     helper: 'The HTML text to display',
        //     value: '',
        //   },
        // },
        {
          type: 'FormTextArea',
          field: 'column',
          config: {
            rows: 5,
            label: 'Columns',
            helper: 'The HTML text to display',
            value: '',
          },
        },
        {
          type: 'FormCheckbox',
          field: 'isSearchEnable',
          config: {
            label: 'Search Enable',
            helper: '',
            value: true,
          },
        },
        {
          type: 'FormCheckbox',
          field: 'isPaginationEnable',
          config: {
            label: 'Pagination Enable',
            helper: '',
            value: 'true',
          },
        },
        {
          type: 'FormInput',
          field: 'pageSize',
          config: {
            label: 'Page Size',
            helper: '',
            type: 'number',
            value: '20',
          },
        },
        keyNameProperty,
        // labelProperty,
        // // DataTypeProperty,
        // // DataFormatProperty,
        // validationRulesProperty,
        // placeholderProperty,
        // helperTextProperty,
        // readonlyProperty,
        // colorProperty,
        // bgcolorProperty,
        defaultValueProperty,
      ],
    },
  },
  {
    builderComponent: FormInput,
    builderBinding: 'FormInput',
    rendererComponent: FormMaskedInput,
    rendererBinding: 'FormMaskedInput',
    control: {
      popoverContent: "Collect a string of text and format it as one of several data types",
      order: 1.0,
      group: 'Input Fields',
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
      popoverContent: "Collect a multi-line string of text, to allow for extensive, richly formatted responses",
      order: 4.0,
      group: 'Input Fields',
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
      popoverContent: "Collect options from a list, as radio butttons or dropdowns",
      order: 2.0,
      group: 'Input Fields',
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
        defaultValueProperty,
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
      popoverContent: "Add a checkbox or toggle for true/false responses",
      order: 6.0,
      group: 'Input Fields',
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
      popoverContent: "Collect a date or date/time",
      order: 5.0,
      group: 'Input Fields',
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
            name: 'Minimum Date',
            label: 'Minimum Date',
            validation: 'date_or_mustache',
          },
        },
        {
          type: 'FormInput',
          field: 'maxDate',
          config: {
            name: 'Maximum Date',
            label: 'Maximum Date',
            validation: 'after_min_date|date_or_mustache',
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
      popoverContent: "Add special buttons that link between subpages within this Form",
      order: 1.0,
      group: 'Navigation',
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
      popoverContent: "Organize and group your content in columns",
      order: 2.0,
      group: 'Content Fields',
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
      popoverContent: "Add a repeatable section of content",
      order: 5.0,
      group: 'Content Fields',
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
      popoverContent: "Format content in a table structure and allow for adding rows",
      order: 4.0,
      group: 'Content Fields',
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
      popoverContent: "Upload an image to your screen",
      order: 3.0,
      group: 'Content Fields',
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
    editorComponent: FormAvatar,
    editorBinding: 'FormAvatar',
    rendererComponent: FormAvatar,
    rendererBinding: 'FormAvatar',
    control: {
      popoverContent: "User avatar",
      order: 3.0,
      group: 'Dashboards',
      label: 'User Avatar',
      component: 'FormAvatar',
      'editor-component': 'FormAvatar',
      'editor-control': 'FormAvatar',
      config: {
        label: 'User Avatar',
        icon: 'fas fa-user-circle',
        variant: 'primary',
        event: 'submit',
        name: null,
        value: null,
        renderImage: false,
      },
      inspector: [
        {
          type: 'FormInput',
          field: 'height',
          config: {
            label: 'Height',
            helper: 'Avatar height',
            type: 'number',
          },
        },
        {
          type: 'FormInput',
          field: 'width',
          config: {
            label: 'Width',
            helper: 'Avatar width',
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
      popoverContent: "Add an action to submit your form or update a field",
      order: 3.0,
      group: 'Input Fields',
      label: 'Submit Button',
      component: 'FormButton',
      'editor-component': 'FormButton',
      'editor-control': 'FormSubmit',
      config: {
        icon: 'fas fa-share-square',
        label: 'New Submit',
        variant: 'primary',
        event: 'submit',
        loading: false,
        loadingLabel: 'Loading...',
        defaultSubmit: true,
        name: null,
        fieldValue: null,
        tooltip: {},
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
            validation: 'regex:/^(?:[A-Za-z])(?:[0-9A-Z_.a-z])*(?<![.])$/|not_in:' + javascriptReservedKeywords,

          },         
        },
        buttonTypeEvent,
        LoadingSubmitButtonProperty,
        LabelSubmitButtonProperty,
        tooltipProperty,
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
      popoverContent: "Add and reuse another Form within this Form",
      order: 6.0,
      group: 'Content Fields',
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
      group: "Files",
      popoverContent: "Collect files uploaded into the Form",
      order: 1.0,
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
          type: 'MultipleUploadsCheckbox',
          field: 'multipleUpload',
          config: {
            label: 'Upload multiple files',
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
      popoverContent: "Offer a File download",
      order: 2.0,
      group: "Files",
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
  {
    rendererComponent: BFormComponent,
    rendererBinding: 'BFormComponent',
    builderComponent: BFormComponent,
    builderBinding: 'BFormComponent',
    control: {
      popoverContent: "Add one of several Bootstrap Vue components",
      order: 1.0,
      group: 'Advanced',
      label: 'Bootstrap Component',
      component: 'BFormComponent',
      'editor-component': 'BFormComponent',
      'editor-control': 'BFormComponent',
      config: {
        bootstrapComponent: 'b-form-tags',
        bootstrapConfig: '{}',
        label: 'New Bootstrap Component',
        icon: 'fab fa-bootstrap',
      },
      inspector: [
        keyNameProperty,
        labelProperty,
        {
          type: 'FormMultiselect',
          field: 'bootstrapComponent',
          config: {
            icon: 'fas',
            label: 'Bootstrap vue component',
            validation: 'required',
            options: [
              { value: 'b-embed', content: 'Embed' },
              { value: 'b-img', content: 'Image' },
              { value: 'b-form-rating', content: 'Form Rating' },
              { value: 'b-form-spinbutton', content: 'Form Spinbutton' },
              { value: 'b-form-tags', content: 'Form Tags' },
              { value: 'b-form-timepicker', content: 'Form Timepicker' },
              { value: 'b-table', content: 'Table' },
            ],
          },
        },
        {
          type: 'FormTextArea',
          field: 'bootstrapConfig',
          config: {
            rows: 5,
            label: 'Config',
            helper: 'Properties in JSON format. See https://bootstrap-vue.org/docs/components',
            value: '{}',
          },
        },
        validationRulesProperty,
      ],
    },
  },
  {
    rendererComponent: BWrapperComponent,
    rendererBinding: 'BWrapperComponent',
    builderComponent: BWrapperComponent,
    builderBinding: 'BWrapperComponent',
    control: {
      popoverContent: "Wrap an existing subpage within this Form into a Bootstrap Vue component",
      order: 2.0,
      group: 'Advanced',
      label: 'Bootstrap Wrapper',
      component: 'BWrapperComponent',
      'editor-component': 'BWrapperComponent',
      'editor-control': 'BWrapperComponent',
      config: {
        bootstrapComponent: 'b-modal',
        bootstrapConfig: '{}',
        label: 'New Bootstrap Wrapper',
        icon: 'fab fa-bootstrap',
        name: '',
        form: '',
      },
      inspector: [
        keyNameProperty,
        labelProperty,
        {
          type: 'FormMultiselect',
          field: 'bootstrapComponent',
          config: {
            icon: 'fas',
            label: 'Bootstrap vue component',
            validation: 'required',
            options: [
              { value: 'b-alert', content: 'Alert' },
              { value: 'b-card', content: 'Card' },
              { value: 'b-collapse', content: 'Collapse' },
              { value: 'b-jumbotron', content: 'Jumbotron' },
              { value: 'b-modal', content: 'Modal' },
            ],
          },
        },
        {
          type: 'PageSelect',
          field: 'form',
          config: {
            label: 'Page',
            helper: 'The page to use inside the component',
          },
        },
        {
          type: 'FormTextArea',
          field: 'bootstrapConfig',
          config: {
            rows: 5,
            label: 'Config',
            helper: 'Properties in JSON format. See https://bootstrap-vue.org/docs/components',
            value: '{}',
          },
        },
      ],
    },
  },
  {
    editorComponent: FormListTable,
    editorBinding: "FormListTable",
    rendererComponent: FormListTable,
    rendererBinding: "FormListTable",
    control: {
      popoverContent: "Create List Table",
      order: 6.5,
      group: 'Dashboards',
      label: "List Table",
      component: "FormListTable",
      "editor-component": "FormListTable",
      "editor-control": "FormListTable",
      config: {
        label: "List Table",
        icon: "fas fa-list",
        variant: "primary"
      },
      inspector: [
        {
          type: "FormMultiselect",
          field: "listOption",
          config: {
            icon: "fas fa-list",
            label: "List Table",
            options: [
              { value: "My Tasks", content: "My Tasks" },
              { value: "My Requests", content: "My Requests" },
              {
                value: "Start New Request",
                content: "Start New Request"
              }
            ]
          }
        }
      ]
    }
  },
  {
    editorComponent: FormAnalyticsChart,
    editorBinding: "FormAnalyticsChart",
    rendererComponent: FormAnalyticsChart,
    rendererBinding: "FormAnalyticsChart",
    control: {
      popoverContent: "Add a chart from the Analytics Reports",
      order: 6.0,
      group: 'Dashboards',
      label: "Analytics Chart",
      component: "FormAnalyticsChart",
      "editor-component": "FormAnalyticsChart",
      "editor-control": "FormAnalyticsChart",
      config: {
        label: "Analytics Chart",
        icon: "fas fa-chart-area",
        variant: "primary"
      },
      inspector: [
        {
          type: "AnalyticsSelector",
          field: "listChartOption",
          config: {
            label: "Chart"
          }
        }
      ]
    }
  }
];
