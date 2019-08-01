import FormText from './components/renderer/form-text';
import FormButton from './components/renderer/form-button';
import FormMultiColumn from './components/renderer/form-multi-column';
import FormRecordList from './components/renderer/form-record-list';
import FormImage from './components/renderer/form-image';
import {DataTypeProperty, DataTypeWithoutDateProperty, DataTypeBooleanProperty, DataTypeDateTimeProperty} from './VariableDataTypeProperties';
import {
  FormInput,
  FormTextArea,
  FormSelect,
  FormCheckbox,
  FormRadioButtonGroup,
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
} from './form-control-common-properties';

export default [
  {
    editorComponent: FormHtmlEditor,
    editorBinding: 'FormHtmlEditor',
    rendererComponent: FormHtmlEditor,
    rendererBinding: 'FormHtmlEditor',
    control: {
      label: 'Rich Text',
      component: 'FormHtmlEditor',
      'editor-component': 'FormHtmlEditor',
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
            label: 'Rich Text Content',
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
    rendererComponent: FormInput,
    rendererBinding: 'FormInput',
    control: {
      label: 'Line Input',
      component: 'FormInput',
      'editor-component': 'FormInput',
      config: {
        icon: 'far fa-square',
        label: 'New Input',
        name: '',
        placeholder: '',
        validation: '',
        helper: null,
        type: 'text',
      },
      inspector: [
        keyNameProperty,
        DataTypeProperty,
        labelProperty,
        {
          type: 'FormMultiselect',
          field: 'type',
          config: {
            label: 'Type',
            name: 'Type',
            helper: 'The type for this field',
            options: [{
              value: 'text',
              content: 'Text',
            },
            {
              value: 'password',
              content: 'Password',
            },
            ],
          },
        },
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
      'fa-icon': 'fas fa-paragraph',
      config: {
        icon: 'fas fa-paragraph',
        label: 'New Textarea',
        placeholder: '',
        helper: null,
        rows: 2,
        richtext: false,
      },
      inspector: [
        labelProperty,
        placeholderProperty,
        keyNameProperty,
        DataTypeProperty,
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
          },
        },
        readonlyProperty,
        colorProperty,
        bgcolorProperty,
      ],
    },
  },
  {
    editorComponent: FormSelect,
    editorBinding: 'FormSelect',
    rendererComponent: FormSelect,
    rendererBinding: 'FormSelect',
    control: {
      label: 'Select',
      component: 'FormSelect',
      'editor-component': 'FormSelect',
      config: {
        icon: 'fas fa-chevron-circle-down',
        label: 'New Select',
        placeholder: '',
        validation: '',
        options: {
          dataSource: dataSourceValues.provideData,
          jsonData: '',
        },
        helper: null,
      },
      inspector: [
        keyNameProperty,
        DataTypeWithoutDateProperty,
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
    editorComponent: FormRadioButtonGroup,
    editorBinding: 'FormRadioButtonGroup',
    rendererComponent: FormRadioButtonGroup,
    rendererBinding: 'FormRadioButtonGroup',
    control: {
      label: 'Radio Button Group',
      component: 'FormRadioButtonGroup',
      'editor-component': 'FormRadioButtonGroup',
      config: {
        icon: 'fas fa-list-ul',
        label: 'New Radio Button Group',
        options: {
          dataSource: dataSourceValues.provideData,
          jsonData: '[{ "value": "new", "content": "New Option" }]',
        },
        toggle: false,
        helper: null,
      },
      inspector: [
        keyNameProperty,
        DataTypeWithoutDateProperty,
        validationRulesProperty,
        labelProperty,
        helperTextProperty,
        {
          type: 'OptionsList',
          field: 'options',
          config: {},
        },
        colorProperty,
        bgcolorProperty,
        toggleStyleProperty,
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
        DataTypeBooleanProperty,
        labelProperty,
        helperTextProperty,
        {
          type: 'FormCheckbox',
          field: 'initiallyChecked',
          config: {
            label: 'Initially Checked?',
            helper: 'Should the checkbox be checked by default',
          },
        },
        colorProperty,
        bgcolorProperty,
        toggleStyleProperty,
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
    editorComponent: FormText,
    editorBinding: 'FormText',
    rendererComponent: FormRecordList,
    rendererBinding: 'FormRecordList',
    control: {
      label: 'Record List',
      component: 'FormRecordList',
      'editor-component': 'FormText',
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
          type: 'OptionsList',
          field: 'fields',
          config: {
            label: 'Fields List',
            helper: 'List of fields to display in the record list',
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
      keyNameProperty,
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
