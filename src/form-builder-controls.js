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
    options: [{
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
    options: [{
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
            helper: 'The weight of the text',
            options: [{
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
            helper: 'Horizontal alignment of the text',
            options: [{
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
            helper: 'Vertical alignment of the text',
            options: [{
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
            helper: 'The size of the text in em',
            options: [{
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
        {
          type: 'FormInput',
          field: 'name',
          config: {
            label: 'Variable Name',
            name: 'Variable Name',
            validation: 'required',
            helper: 'The data name for this field',
          },
        },
        {
          type: 'FormMultiselect',
          field: 'type',
          config: {
            label: 'Field Type',
            name: 'Field Type',
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
        {
          type: 'FormInput',
          field: 'label',
          config: {
            label: 'Field Label',
            helper: 'The label describes the fields name',
          },
        },
        {
          type: 'FormInput',
          field: 'validation',
          config: {
            label: 'Validation',
            helper: 'The validation rules needed for this field',
          },
        },
        {
          type: 'FormInput',
          field: 'placeholder',
          config: {
            label: 'Placeholder',
            helper: 'The placeholder is what is shown in the field when no value is provided yet',
          },
        },
        {
          type: 'FormInput',
          field: 'helper',
          config: {
            label: 'Help Text',
            helper: 'Help text is meant to provide additional guidance on the field\'s value',
          },
        },
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
      'fa-icon': 'fas fa-paragraph',
      config: {
        icon: 'fas fa-paragraph',
        label: 'New Textarea',
        placeholder: '',
        helper: null,
        rows: 2,
      },
      inspector: [{
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Variable Name',
          name: 'Variable Name',
          validation: 'required',
          helper: 'The data name for this field',
        },
      },
      {
        type: 'FormInput',
        field: 'label',
        config: {
          label: 'Field Label',
          helper: 'The label describes the fields name',
        },
      },
      {
        type: 'FormInput',
        field: 'validation',
        config: {
          label: 'Validation',
          helper: 'The validation rules needed for this field',
        },
      },
      {
        type: 'FormInput',
        field: 'rows',
        config: {
          label: 'Rows',
          helper: 'The number of rows to provide for input',
        },
      },
      {
        type: 'FormInput',
        field: 'placeholder',
        config: {
          label: 'Placeholder',
          helper: 'The placeholder is what is shown in the field when no value is provided yet',
        },
      },
      {
        type: 'FormInput',
        field: 'helper',
        config: {
          label: 'Help Text',
          helper: 'Help text is meant to provide additional guidance on the field\'s value',
        },
      },
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
        {
          type: 'FormInput',
          field: 'name',
          config: {
            label: 'Variable Name',
            helper: 'The variable name for this field',
            validation: 'required',
            name: 'Variable Name',
          },
        },
        {
          type: 'FormInput',
          field: 'label',
          config: {
            label: 'Field Label',
            helper: 'The label describes the fields name',
          },
        },
        {
          type: 'FormInput',
          field: 'validation',
          config: {
            label: 'Validation',
            helper: 'The validation rules needed for this field',
          },
        },
        {
          type: 'FormInput',
          field: 'helper',
          config: {
            label: 'Help Text',
            helper: 'Help text is meant to provide additional guidance on the field\'s value',
          },
        },
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
        options: [{
          value: 'new',
          content: 'New Option',
        }],
        toggle: false,
        helper: null,
      },
      inspector: [{
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Variable Name',
          name: 'Variable Name',
          helper: 'The variable name for this field',
          validation: 'required',
        },
      },
      {
        type: 'FormInput',
        field: 'label',
        config: {
          label: 'Field Label',
          helper: 'The label describes the fields name',
        },
      },
      {
        type: 'FormInput',
        field: 'helper',
        config: {
          label: 'Help Text',
          helper: 'Help text is meant to provide additional guidance on the field\'s value',
        },
      },
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
      inspector: [{
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Variable Name',
          name: 'Variable Name',
          validation: 'required',
          helper: 'The name of the group for the checkbox. All checkboxes which share the same name will work together.',
        },
      },
      {
        type: 'FormInput',
        field: 'label',
        config: {
          label: 'Field Label',
          helper: 'The label describes the fields name',
        },
      },
      {
        type: 'FormInput',
        field: 'helper',
        config: {
          label: 'Help Text',
          helper: 'Help text is meant to provide additional guidance on the field\'s value',
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
      inspector: [{
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Variable Name',
          name: 'Variable Name',
          validation: 'required',
          helper: 'The variable name for this field',
        },
      },
      {
        type: 'FormInput',
        field: 'label',
        config: {
          label: 'Field Label',
          helper: 'The label describes the fields name',
        },
      },
      {
        type: 'FormInput',
        field: 'placeholder',
        config: {
          label: 'Placeholder',
          helper: 'The placeholder is what is shown in the field when no value is provided yet',
        },
      },
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
      inspector: [{
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
          helper: 'The variant determines the appearance of the button',
          options: [{
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
      inspector: [{
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'List Name',
          name: 'List Name',
          validation: 'required',
          helper: 'The variable name for this list',
        },
      },
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
      inspector: [{
        type: 'FormInput',
        field: 'id',
        config: {
          label: 'Id',
          helper: 'Image id',
        },
      },
      {
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Variable Name',
          helper: 'The variable name of the image',
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
      inspector: [{
        type: 'FormInput',
        field: 'label',
        config: {
          label: 'Field Label',
          helper: 'The label describes the button\'s text',
        },
      },
      {
        type: 'FormInput',
        field: 'name',
        config: {
          label: 'Variable Name',
          validation: 'required',
          name: 'Variable Name',
          helper: 'The name of the button',
        },
      },
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
          helper: 'The variant determines the appearance of the button',
          options: [{
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
