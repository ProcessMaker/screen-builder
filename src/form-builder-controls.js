import FormText from "./components/renderer/form-text";
import FormButton from "./components/renderer/form-button"
import FormMultiColumn from "./components/renderer/form-multi-column"
import FormRecordList from "./components/renderer/form-record-list"


import {
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormDatePicker
} from "@processmaker/vue-form-elements/src/components";

export default [{
        builderComponent: FormText,
        builderBinding: 'FormText',
        rendererComponent: FormText,
        rendererBinding: 'FormText',
        control: {
            label: 'Text Box',
            component: 'FormText',
            'editor-component': 'FormText',
            'editor-icon': require('./assets/icons/font-solid.svg'),
            config: {
                label: 'New Text',
                fontSize: '1em',
                fontWeight: 'normal'
            },
            inspector: [
                {
                    type: "FormTextArea",
                    field: "label",
                    config: {
                        rows: 5,
                        label: "Text Content",
                        helper: "The text to display",
                    }
                },
                {
                    type: "FormSelect",
                    field: "fontWeight",
                    config: {
                        label: "Font Weight",
                        helper: "The weight of the text",
                        options: [{
                                value: 'normal',
                                content: 'Normal'
                            },
                            {
                                value: 'bold',
                                content: 'Bold'
                            }
                        ]
                    }
                },


                {
                    type: "FormSelect",
                    field: "fontSize",
                    config: {
                        label: "Font Size",
                        helper: "The size of the text in em",
                        options: [{
                                value: '0.5em',
                                content: '0.5'
                            },
                            {
                                value: '1em',
                                content: '1'
                            },
                            {
                                value: '1.5em',
                                content: '1.5'
                            },
                            {
                                value: '2em',
                                content: '2'
                            },
                        ]
                    }
                },


            ]
        }
    },
    {
        builderComponent: FormInput,
        builderBinding: 'FormInput',
        rendererComponent: FormInput,
        rendererBinding: 'FormInput',
        control: {
            label: "Line Input",
            component: 'FormInput',
            "editor-component": "FormInput",
            'editor-icon': require('./assets/icons/square-regular.svg'),
            config: {
                label: "New Input",
                name: '',
                placeholder: '',
                validation: '',
                helper: null,
                type: 'text'
            },
            inspector: [{
                    type: "FormInput",
                    field: "name",
                    config: {
                        label: "Field Name",
                        name: 'Field Name',
                        validation: 'required',
                        helper: "The data name for this field"
                    }
                },
                {
                    type: "FormSelect",
                    field: "type",
                    config: {
                        label: "Field Type",
                        name: 'Field Type',
                        helper: "The type for this field",
                        options: [{
                                value: 'text',
                                content: 'Text'
                            },
                            {
                                value: 'password',
                                content: 'Password'
                            }
                        ]
                    }
                },

                {
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the fields name"
                    }
                },
                {
                    type: "FormInput",
                    field: "validation",
                    config: {
                        label: "Validation",
                        helper: "The validation rules needed for this field"
                    }
                },

                {
                    type: "FormInput",
                    field: "placeholder",
                    config: {
                        label: "Placeholder",
                        helper: "The placeholder is what is shown in the field when no value is provided yet"
                    }
                },
                {
                    type: "FormInput",
                    field: "helper",
                    config: {
                        label: "Help Text",
                        helper: "Help text is meant to provide additional guidance on the field's value"
                    }
                }
            ]
        },
    },
    {
        editorComponent: FormSelect,
        editorBinding: 'FormSelect',
        rendererComponent: FormSelect,
        rendererBinding: 'FormSelect',
        control: {
            label: "Select",
            component: 'FormSelect',
            "editor-component": "FormSelect",
            'editor-icon': require('./assets/icons/caret-square-down-solid.svg'),
            config: {
                label: "New Select",
                placeholder: "",
                validation: '',
                options: [{
                        value: 'new',
                        content: 'New Option'
                    }

                ],
                helper: null,
            },
            inspector: [{
                    type: "FormInput",
                    field: "name",
                    config: {
                        label: "Field Name",
                        helper: "The data name for this field"
                    }
                },
                {
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the fields name"
                    }
                },
                {
                    type: "FormInput",
                    field: "validation",
                    config: {
                        label: "Validation",
                        helper: "The validation rules needed for this field"
                    }
                },

                {
                    type: "FormInput",
                    field: "helper",
                    config: {
                        label: "Help Text",
                        helper: "Help text is meant to provide additional guidance on the field's value"
                    }
                },
                {
                    type: "OptionsList",
                    field: "options",
                    config: {
                        label: 'Options List',
                        helper: "List of options available in the select drop down"
                    }
                }
            ]
        },
    },
    {
        editorComponent: FormRadioButtonGroup,
        editorBinding: 'FormRadioButtonGroup',
        rendererComponent: FormRadioButtonGroup,
        rendererBinding: 'FormRadioButtonGroup',
        control: {
            label: "Radio Group",
            component: 'FormRadioButtonGroup',
            "editor-component": "FormRadioButtonGroup",
            'editor-icon': require('./assets/icons/list-ul-solid.svg'),
            config: {
                label: "New Radio Button Group",
                options: [{
                    value: 'new',
                    content: 'New Option'
                }],
                helper: null,
            },
            inspector: [{
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the fields name"
                    }
                },
                {
                    type: "FormInput",
                    field: "helper",
                    config: {
                        label: "Help Text",
                        helper: "Help text is meant to provide additional guidance on the field's value"
                    }
                },
                {
                    type: "OptionsList",
                    field: "options",
                    config: {
                        label: 'Options List',
                        helper: "List of options available in the select drop down"
                    }
                }
            ]
        },
    },
    {
        editorComponent: FormCheckbox,
        editorBinding: 'FormCheckbox',
        rendererComponent: FormCheckbox,
        rendererBinding: 'FormCheckbox',
        control: {
            label: "Checkbox",
            component: 'FormCheckbox',
            "editor-component": "FormCheckbox",
            'editor-icon': require('./assets/icons/check-square-solid.svg'),
            config: {
                label: "New Checkbox",
                helper: null,
                name: null,
                checked: false,
                validation: '',
            },
            inspector: [{
                    type: "FormInput",
                    field: "name",
                    config: {
                        label: "Field Name",
                        helper: "The name of the group for the checkbox. All checkboxes which share the same name will work together."
                    }
                },
                {
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the fields name"
                    }
                },
                {
                    type: "FormInput",
                    field: "helper",
                    config: {
                        label: "Help Text",
                        helper: "Help text is meant to provide additional guidance on the field's value"
                    }
                },
                {
                    type: "FormCheckbox",
                    field: "checked",
                    config: {
                        label: "Initially Checked?",
                        helper: "Should the checkbox be checked by default"
                    }
                },
            ]
        },
    },
    {
        editorComponent: FormTextArea,
        editorBinding: 'FormTextArea',
        rendererComponent: FormTextArea,
        rendererBinding: 'FormTextArea',
        control: {
            label: "Textarea",
            component: 'FormTextArea',
            "editor-component": "FormTextArea",
            'editor-icon': require('./assets/icons/paragraph-solid.svg'),
            config: {
                label: "New TextArea",
                placeholder: "",
                helper: null,
                rows: 2
            },
            inspector: [{
                    type: "FormInput",
                    field: "name",
                    config: {
                        label: "Field Name",
                        name: 'Field Name',
                        validation: 'required',
                        helper: "The data name for this field"
                    }
                },
                {
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the fields name"
                    }
                },
                {
                    type: "FormInput",
                    field: "validation",
                    config: {
                        label: "Validation",
                        helper: "The validation rules needed for this field"
                    }
                },

                {
                    type: "FormInput",
                    field: "rows",
                    config: {
                        label: "Rows",
                        helper: "The number of rows to provide for input"
                    }
                },
                {
                    type: "FormInput",
                    field: "placeholder",
                    config: {
                        label: "Placeholder",
                        helper: "The placeholder is what is shown in the field when no value is provided yet"
                    }
                },
                {
                    type: "FormInput",
                    field: "helper",
                    config: {
                        label: "Help Text",
                        helper: "Help text is meant to provide additional guidance on the field's value"
                    }
                }
            ]
        },
    },
    {
        editorComponent: FormDatePicker,
        editorBinding: 'FormDatePicker',
        rendererComponent: FormDatePicker,
        rendererBinding: 'FormDatePicker',
        control: {
            label: "Date Picker",
            component: 'FormDatePicker',
            "editor-component": "FormDatePicker",
            'editor-icon': require('./assets/icons/calendar-regular.svg'),
            config: {
                label: "New Date Picker",
                type: 'date',
                name: ''
            },
            inspector: [{
                    type: "FormInput",
                    field: "name",
                    config: {
                        label: "Field Name",
                        name: 'Field Name',
                        validation: 'required',
                        helper: "The data name for this field"
                    }
                },
                {
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the fields name"
                    }
                },
                {
                    type: "FormInput",
                    field: "placeholder",
                    config: {
                        label: "Placeholder",
                        helper: "The placeholder is what is shown in the field when no value is provided yet"
                    }
                }
            ]
        },
    },
    {
        editorComponent: FormButton,
        editorBinding: 'FormButton',
        rendererComponent: FormButton,
        rendererBinding: 'FormButton',
        control: {
            label: "Submit Button",
            component: 'FormButton',
            "editor-component": "FormButton",
            'editor-icon': require('./assets/icons/share-square-solid.svg'),
            config: {
                label: "New Submit",
                variant: 'primary',
                event: 'submit'
            },
            inspector: [{
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the button's text"
                    }
                },
                {
                    type: "FormSelect",
                    field: "variant",
                    config: {
                        label: "Variant",
                        helper: "The variant determines the appearance of the button",
                        options: [{
                                value: 'primary',
                                content: 'Primary'
                            },
                            {
                                value: 'secondary',
                                content: 'Secondary'
                            },
                            {
                                value: 'success',
                                content: 'Success'
                            },
                            {
                                value: 'danger',
                                content: 'Danger'
                            },
                            {
                                value: 'warning',
                                content: 'Warning'
                            },
                            {
                                value: 'info',
                                content: 'Info'
                            },
                            {
                                value: 'light',
                                content: 'Light'
                            },

                            {
                                value: 'dark',
                                content: 'Dark'
                            },

                            {
                                value: 'link',
                                content: 'Link'
                            }
                        ]
                    }
                }

            ]
        },
    },
    {
        editorComponent: FormButton,
        editorBinding: 'FormButton',
        rendererComponent: FormButton,
        rendererBinding: 'FormButton',
        control: {
            label: "Page Navigation",
            component: 'FormButton',
            "editor-component": "FormButton",
            'editor-icon': require('./assets/icons/angle-double-right-solid.svg'),
            config: {
                label: "New Page Navigation",
                variant: 'primary',
                event: 'pageNavigate',
                eventData: 0

            },
            inspector: [{
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "Field Label",
                        helper: "The label describes the button's text"
                    }
                },
                {
                    type: "FormSelect",
                    field: "variant",
                    config: {
                        label: "Variant",
                        helper: "The variant determines the appearance of the button",
                        options: [{
                                value: 'primary',
                                content: 'Primary'
                            },
                            {
                                value: 'secondary',
                                content: 'Secondary'
                            },
                            {
                                value: 'success',
                                content: 'Success'
                            },
                            {
                                value: 'danger',
                                content: 'Danger'
                            },
                            {
                                value: 'warning',
                                content: 'Warning'
                            },
                            {
                                value: 'info',
                                content: 'Info'
                            },
                            {
                                value: 'light',
                                content: 'Light'
                            },

                            {
                                value: 'dark',
                                content: 'Dark'
                            },

                            {
                                value: 'link',
                                content: 'Link'
                            }
                        ]
                    }
                },
                {
                    type: "PageSelect",
                    field: "eventData",
                    config: {
                        label: "Destination",
                        helper: "The destination page to navigate to"
                    }
                }

            ]
        },
    },
    {
        editorComponent: FormMultiColumn,
        editorBinding: 'FormMultiColumn',
        rendererComponent: FormMultiColumn,
        rendererBinding: 'FormMultiColumn',
        control: {
            label: "Multi Column",
            component: 'FormMultiColumn',
            "editor-component": "MultiColumn",
            'editor-icon': require('./assets/icons/columns-solid.svg'),
            container: true,
            // Default items container
            items: [
                [],
                []
            ],
            config: {},
            inspector: [{
                    type: "FormText",
                    config: {
                        label: "MultiColumn",
                    }
                }

            ]
        },
    },
    {
        editorComponent: FormText,
        editorBinding: 'FormText',
        rendererComponent: FormRecordList,
        rendererBinding: 'FormRecordList',
        control: {
            label: "Record List",
            component: 'FormRecordList',
            "editor-component": "FormText",
            'editor-icon': require('./assets/icons/th-list-solid.svg'),
            config: {
                name: '',
                label: "New Record List",
                editable: false,
                fields: [],
                form: ''
            },
            inspector: [{
                    type: "FormInput",
                    field: "name",
                    config: {
                        label: "List Name",
                        name: 'List Name',
                        validation: 'required',
                        helper: "The data name for this list"
                    }
                },
                {
                    type: "FormInput",
                    field: "label",
                    config: {
                        label: "List Label",
                        helper: "The label describes this record list"
                    }
                },
                {
                    type: "FormCheckbox",
                    field: "editable",
                    config: {
                        label: "Editable?",
                        helper: "Should records be editable/removable and can new records be added"
                    }
                },

                {
                    type: "OptionsList",
                    field: "fields",
                    config: {
                        label: 'Fields List',
                        helper: "List of fields to display in the record list"
                    }
                },
                {
                    type: "PageSelect",
                    field: "form",
                    config: {
                        label: "Record Form",
                        helper: "The form to use for adding/editing records"
                    }
                }

            ]

        },


    }

]