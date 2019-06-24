import FormText from './components/renderer/form-text';
import FormButton from './components/renderer/form-button';
import FormMultiColumn from './components/renderer/form-multi-column';
import FormRecordList from './components/renderer/form-record-list';
import FormImage from './components/renderer/form-image';

import {
  FormInput,
  FormTextArea,
  FormSelect,
  FormCheckbox,
  FormRadioButtonGroup,
  FormDatePicker,
  FormHtmlEditor,
} from '@processmaker/vue-form-elements';

const bgcolorProperty = {
  type: 'ColorSelect',
  field: 'bgcolor',
  config: {
    label: 'Element Background color',
    helper: 'Set the element\'s background color',
    options: [
      {
        value: 'alert alert-primary',
        content: 'primary',
      },
      {
        value: 'alert alert-secondary',
        content: 'secondary',
      },
      {
        value: 'alert alert-success',
        content: 'success',
      },
      {
        value: 'alert alert-danger',
        content: 'danger',
      },
      {
        value: 'alert alert-warning',
        content: 'warning',
      },
      {
        value: 'alert alert-info',
        content: 'info',
      },
      {
        value: 'alert alert-light',
        content: 'light',
      },
      {
        value: 'alert alert-dark',
        content: 'dark',
      },
    ],
  },
};
const colorProperty = {
  type: 'ColorSelect',
  field: 'color',
  config: {
    label: 'Text color',
    helper: 'Set the element\'s text color',
    options: [
      {
        value: 'text-primary',
        content: 'primary',
      },
      {
        value: 'text-secondary',
        content: 'secondary',
      },
      {
        value: 'text-success',
        content: 'success',
      },
      {
        value: 'text-danger',
        content: 'danger',
      },
      {
        value: 'text-warning',
        content: 'warning',
      },
      {
        value: 'text-info',
        content: 'info',
      },
      {
        value: 'text-light',
        content: 'light',
      },
      {
        value: 'text-dark',
        content: 'dark',
      },
    ],
  },
};
const KeyName = {
  type: 'FormInput',
  field: 'name',
  panel: 'variable',
  config: {
    label: 'Key Name',
    name: 'Key Name',
    validation: 'required',
    helper: 'A variable key name is a symbolic name to reference information.',
  },
};
const DataType = {
  type: 'FormMultiselect',
  field: 'dataFormat',
  panel: 'variable',
  config: {
    label: 'Data Type',
    name: 'Data Type',
    helper: 'The data type specifies what kind of data is stored in the variable.',
    validation: 'required',
    options: [
      {
        value: 'string',
        content: 'string',
      },
      {
        value: 'int',
        content: 'int',
      },
      {
        value: 'float',
        content: 'float',
      },
      {
        value: 'datetime',
        content: 'datetime',
      },
      {
        value: 'date',
        content: 'date',
      },
      {
        value: 'currency',
        content: 'currency',
      },
      {
        value: 'boolean',
        content: 'boolean',
      },
    ],
  },
};
const ValidateVariable = {
  type: 'FormInput',
  field: 'validation',
  panel: 'variable',
  config: {
    label: 'Validation',
    name: 'validation',
    helper: 'Validation rules ensure the integrity and validity of the data.',
  },
};
const ReadOnly = {
  type: 'FormCheckbox',
  field: 'readOnly',
  panel: 'variable',
  config: {
    label: 'Control is read only',
    toggle: true,
    helper: '',
  },
};
const LabelField = {
  type: 'FormInput',
  field: 'label',
  config: {
    label: 'Field Label',
    helper: 'The label describes the fields name',
  },
};
const Placeholder = {
  type: 'FormInput',
  field: 'placeholder',
  config: {
    label: 'Placeholder',
    helper: 'The placeholder is what is shown in the field when no value is provided yet',
  },
};
const Helper = {
  type: 'FormInput',
  field: 'helper',
  config: {
    label: 'Help Text',
    helper: 'Help text is meant to provide additional guidance on the field\'s value',
  },
};

export default [
  {
    builderComponent: FormText,
    builderBinding: 'FormText',
    rendererComponent: FormText,
    rendererBinding: 'FormText',
    control: {
      label: 'Text',
      component: 'FormText',
      'editor-component': 'FormText',
      config: {
        icon: 'fas fa-align-justify',
        label: 'New Text',
        fontSize: '1em',
        fontWeight: 'normal',
        textAlign: 'left',
        verticalAlign: 'top',
        name: '',
      },
      inspector: [
        {
          type: 'FormTextArea',
          field: 'label',
          config: {
            rows: 5,
            label: 'Text Content',
            helper: 'The text to display',
          },
        },
        {
          type: 'FormMultiselect',
          field: 'fontWeight',
          config: {
            label: 'Font Weight',
            name: 'Font Weight',
            helper: 'The weight of the text',
            validation: 'required',
            options: [
              {
                value: 'normal',
                content: 'Normal',
              },
              {
                value: 'bold',
                content: 'Bold',
              },
            ],
          },
        },
        {
          type: 'FormMultiselect',
          field: 'textAlign',
          config: {
            label: 'Text Horizontal Alignment',
            name: 'Text Horizontal Alignment',
            helper: 'Horizontal alignment of the text',
            validation: 'required',
            options: [
              {
                value: 'center',
                content: 'Center',
              },
              {
                value: 'left',
                content: 'Left',
              },
              {
                value: 'right',
                content: 'Right',
              },
              {
                value: 'justify',
                content: 'Justify',
              },
            ],
          },
        },
        {
          type: 'FormMultiselect',
          field: 'verticalAlign',
          config: {
            label: 'Text Vertical Alignment',
            name: 'Text Vertical Alignment',
            helper: 'Vertical alignment of the text',
            validation: 'required',
            options: [
              {
                value: 'top',
                content: 'Top',
              },
              {
                value: 'middle',
                content: 'Middle',
              },
              {
                value: 'bottom',
                content: 'Bottom',
              },
            ],
          },
        },
        {
          type: 'FormMultiselect',
          field: 'fontSize',
          config: {
            label: 'Font Size',
            name: 'Font Size',
            helper: 'The size of the text in em',
            validation: 'required',
            options: [
              {
                value: '0.5em',
                content: '0.5',
              },
              {
                value: '1em',
                content: '1',
              },
              {
                value: '1.5em',
                content: '1.5',
              },
              {
                value: '2em',
                content: '2',
              },
            ],
          },
        },
        bgcolorProperty,
        colorProperty,
      ],
    },
  },
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
        bgcolorProperty,
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
        KeyName,
        DataType,
        ValidateVariable,
        ReadOnly,
        LabelField,
        {
          type: 'FormMultiselect',
          field: 'type',
          config: {
            label: 'Field Type',
            name: 'Field Type',
            helper: 'The type for this field',
            validation: 'required',
            options: [
              {
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
        Placeholder,
        Helper,
        bgcolorProperty,
        colorProperty,
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
      config: {
        icon: 'fas fa-paragraph',
        label: 'New Textarea',
        placeholder: '',
        helper: null,
        rows: 2,
      },
      inspector: [
        KeyName,
        DataType,
        ValidateVariable,
        ReadOnly,
        LabelField,
        {
          type: 'FormInput',
          field: 'rows',
          config: {
            label: 'Rows',
            helper: 'The number of rows to provide for input',
          },
        },
        Placeholder,
        Helper,
        bgcolorProperty,
        colorProperty,
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
        options: [
          {
            value: null,
            content: 'Select',
          },
        ],
        helper: null,
      },
      inspector: [
        KeyName,
        DataType,
        ValidateVariable,
        ReadOnly,
        LabelField,
        Helper,
        {
          type: 'OptionsList',
          field: 'options',
          config: {
            label: 'Options List',
            helper: 'List of options available in the select drop down',
          },
        },
        bgcolorProperty,
        colorProperty,
      ],
    },
  },
  {
    editorComponent: FormRadioButtonGroup,
    editorBinding: 'FormRadioButtonGroup',
    rendererComponent: FormRadioButtonGroup,
    rendererBinding: 'FormRadioButtonGroup',
    control: {
      label: 'Radio Group',
      component: 'FormRadioButtonGroup',
      'editor-component': 'FormRadioButtonGroup',
      config: {
        icon: 'fas fa-list-ul',
        label: 'New Radio Button Group',
        options: [
          {
            value: 'new',
            content: 'New Option',
          },
        ],
        toggle: false,
        helper: null,
      },
      inspector: [
        KeyName,
        DataType,
        ValidateVariable,
        ReadOnly,
        LabelField,
        Helper,
        {
          type: 'OptionsList',
          field: 'options',
          config: {
            label: 'Options List',
            helper: 'List of options available in the radio button group',
          },
        },
        {
          type: 'FormCheckbox',
          field: 'toggle',
          config: {
            label: 'Toggle Style?',
            helper: '',
          },
        },
        bgcolorProperty,
        colorProperty,
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
        KeyName,
        DataType,
        ValidateVariable,
        ReadOnly,
        LabelField,
        Helper,
        {
          type: 'FormCheckbox',
          field: 'toggle',
          config: {
            label: 'Toggle Style?',
            helper: '',
          },
        },
        {
          type: 'FormCheckbox',
          field: 'initiallyChecked',
          config: {
            label: 'Initially Checked?',
            helper: 'Should the checkbox be checked by default',
          },
        },
        bgcolorProperty,
        colorProperty,
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
        type: 'date',
        name: '',
        placeholder: '',
      },
      inspector: [
        KeyName,
        DataType,
        ValidateVariable,
        ReadOnly,
        LabelField,
        Placeholder,
        bgcolorProperty,
        colorProperty,
      ],
    },
  },
  {
    editorComponent: FormButton,
    editorBinding: 'FormButton',
    rendererComponent: FormButton,
    rendererBinding: 'FormButton',
    control: {
      label: 'Navigation',
      component: 'FormButton',
      'editor-component': 'FormButton',
      config: {
        icon: 'far fa-compass',
        label: 'Page Navigation',
        variant: 'primary',
        event: 'pageNavigate',
        eventData: 0,
      },
      inspector: [
        {
          type: 'FormInput',
          field: 'label',
          config: {
            label: 'Field Label',
            helper: 'The label describes the button\'s text',
          },
        },
        {
          type: 'FormMultiselect',
          field: 'variant',
          config: {
            label: 'Variant',
            name: 'Variant',
            helper: 'The variant determines the appearance of the button',
            validation: 'required',
            options: [
              {
                value: 'primary',
                content: 'Primary',
              },
              {
                value: 'secondary',
                content: 'Secondary',
              },
              {
                value: 'success',
                content: 'Success',
              },
              {
                value: 'danger',
                content: 'Danger',
              },
              {
                value: 'warning',
                content: 'Warning',
              },
              {
                value: 'info',
                content: 'Info',
              },
              {
                value: 'light',
                content: 'Light',
              },

              {
                value: 'dark',
                content: 'Dark',
              },

              {
                value: 'link',
                content: 'Link',
              },
            ],
          },
        },
        {
          type: 'PageSelect',
          field: 'eventData',
          config: {
            label: 'Destination',
            helper: 'The destination page to navigate to',
          },
        },
      ],
    },
  },
  {
    editorComponent: FormMultiColumn,
    editorBinding: 'FormMultiColumn',
    rendererComponent: FormMultiColumn,
    rendererBinding: 'FormMultiColumn',
    control: {
      label: 'Table',
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
        options: [
          {
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
            label: 'Column Widths',
          },
        },
        bgcolorProperty,
        colorProperty,
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
        fields: [],
        form: '',
      },
      inspector: [
        KeyName,
        LabelField,
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
        bgcolorProperty,
        colorProperty,
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
      inspector: [
        KeyName,
        {
          type: 'FormInput',
          field: 'id',
          config: {
            label: 'Id',
            helper: 'Image id',
          },
        },
        {
          type: 'ImageUpload',
          field: 'image',
          config: {
            label: 'Upload image',
            helper: 'Upload image',
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
        {
          type: 'FormInput',
          field: 'height',
          config: {
            label: 'Height',
            helper: 'Image height',
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
      label: 'Submit',
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
      inspector: [
        KeyName,
        LabelField,
        {
          type: 'FormInput',
          field: 'fieldValue',
          config: {
            label: 'Field Value',
            helper: 'The value being submitted',
          },
        },
        {
          type: 'FormMultiselect',
          field: 'variant',
          config: {
            label: 'Variant',
            name: 'Variant',
            helper: 'The variant determines the appearance of the button',
            validation: 'required',
            options: [
              {
                value: 'primary',
                content: 'Primary',
              },
              {
                value: 'secondary',
                content: 'Secondary',
              },
              {
                value: 'success',
                content: 'Success',
              },
              {
                value: 'danger',
                content: 'Danger',
              },
              {
                value: 'warning',
                content: 'Warning',
              },
              {
                value: 'info',
                content: 'Info',
              },
              {
                value: 'light',
                content: 'Light',
              },
              {
                value: 'dark',
                content: 'Dark',
              },
              {
                value: 'link',
                content: 'Link',
              },
            ],
          },
        },
      ],
    },
  },
];
