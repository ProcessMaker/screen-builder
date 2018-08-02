export default [
    {
        label: 'Text',
        component: 'FormText',
        'editor-component': 'FormText',
        'editor-icon': require('./assets/icons/Label.png'),
        config: {
            label: 'New Text',
            fontSize: '1em',
            fontWeight: 'normal'
        },
        inspector: [
             {
                type: "FormInput",
                field: "label",
                config: {
                    label: "Text Label",
                    helper: "The text to display",
                }
            },
             {
                type: "FormSelect",
                field: "fontWeight",
                config: {
                    label: "Font Weight",
                    helper: "The weight of the text",
                    options: [
                        {
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
                    options: [
                        {
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
    },
    {
        label: "Line Input",
        component: 'FormInput',
        "editor-component": "FormInput",
        'editor-icon': require('./assets/icons/TextField.png'),
        config: {
            label: "New Input",
            name: '',
            placeholder: '',
            validation: '',
            helper: null,
            type: 'text'
        },
        inspector: [
            {
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
                    options: [
                        {
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
                    helper:
                        "The placeholder is what is shown in the field when no value is provided yet"
                }
            },
            {
                type: "FormInput",
                field: "helper",
                config: {
                    label: "Help Text",
                    helper:
                        "Help text is meant to provide additional guidance on the field's value"
                }
            }
        ]
    },
    {
        label: "Select",
        component: 'FormSelect',
        "editor-component": "FormSelect",
        'editor-icon': require('./assets/icons/Dropdown.png'),
        config: {
            label: "New Select",
            placeholder: "",
            validation: '',
            options: [
                {
                    value: 'new',
                    content: 'New Option'
                }

            ],
            helper: null,
        },
        inspector: [
            {
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
                    helper:
                        "Help text is meant to provide additional guidance on the field's value"
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
    {
        label: "Radio Group",
        component: 'FormRadioButtonGroup',
        "editor-component": "FormRadioButtonGroup",
        'editor-icon': require('./assets/icons/RadioButton.png'),
        config: {
            label: "New Radio Button Group",
            options: [
                {
                    value: 'new',
                    content: 'New Option'
                }
            ],
            helper: null,
        },
        inspector: [
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
                    helper:
                        "Help text is meant to provide additional guidance on the field's value"
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

    {
        label: "Checkbox",
        component: 'FormCheckbox',
        "editor-component": "FormCheckbox",
        'editor-icon': require('./assets/icons/Checkbox.png'),
        config: {
            label: "New Checkbox",
            helper: null,
            name: null,
            checked: false,
            validation: '',
        },
        inspector: [
            {
                type: "FormInput",
                field: "name",
                config: {
                    label: "Field Name",
                    helper:
                        "The name of the group for the checkbox. All checkboxes which share the same name will work together."
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
                    helper:
                        "Help text is meant to provide additional guidance on the field's value"
                }
            },
            {
                type: "FormCheckbox",
                field: "checked",
                config: {
                    label: "Initially Checked?",
                    helper:
                        "Should the checkbox be checked by default"
                }
            },
       ]
    },

    {
        label: "Textarea",
        component: 'FormTextArea',
        "editor-component": "FormTextArea",
        'editor-icon': require('./assets/icons/TextArea.png'),
        config: {
            label: "New TextArea",
            placeholder: "",
            helper: null,
            rows: 2
        },
        inspector: [
            {
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
                    helper:
                        "The placeholder is what is shown in the field when no value is provided yet"
                }
            },
            {
                type: "FormInput",
                field: "helper",
                config: {
                    label: "Help Text",
                    helper:
                        "Help text is meant to provide additional guidance on the field's value"
                }
            }
        ]
    },
    {
        label: "Date Picker",
        component: 'FormDatePicker',
        "editor-component": "FormDatePicker",
        'editor-icon': require('./assets/icons/Date.png'),
        config: {
            label: "New Date Picker",
            type: 'date',
            name: ''
        },
        inspector: [
            {
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
                field: "placeholder",
                config: {
                    label: "Placeholder",
                    helper:
                        "The placeholder is what is shown in the field when no value is provided yet"
                }
            }
        ]
    },

    {
        label: "Submit Button",
        component: 'FormButton',
        "editor-component": "FormButton",
        'editor-icon': require('./assets/icons/SubmitButton.png'),
        config: {
            label: "New Submit",
            variant: 'primary',
            event: 'submit'
        },
        inspector: [
            {
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
                    options: [
                        {
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
    {
        label: "Page Navigation",
        component: 'FormButton',
        "editor-component": "FormButton",
        'editor-icon': require('./assets/icons/Button.png'),
        config: {
            label: "New Page Navigation",
            variant: 'primary',
            event: 'pageNavigate',
            eventData: 0

        },
        inspector: [
            {
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
                    options: [
                        {
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
    {
        label: "Multi Column",
        component: 'FormMultiColumn',
        "editor-component": "MultiColumn",
        'editor-icon': require('./assets/icons/Button.png'),
        container: true,
        // Default items container
        items: [
            [],
            []
        ],
        config: {
       },
        inspector: [
            {
                 type: "FormText",
                config: {
                    label: "MultiColumn",
                }
            }

        ]
    }
 

]
