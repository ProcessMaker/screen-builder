export default [
    {
        label: "Line Input",
        "editor-component": "FormInput",
        config: {
            label: "New Input",
            placeholder: "",
            helper: null
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
        "editor-component": "FormSelect",
        config: {
            label: "New Select",
            placeholder: "",
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
        label: "Radio Group",
        "editor-component": "FormRadioButtonGroup",
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
        "editor-component": "FormCheckbox",
        config: {
            label: "New Checkbox",
            helper: null,
            name: null,
            checked: false,
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
                type: "FormCheckbox",
                field: "checked",
                config: {
                    label: "Initially Checked?",
                    helper:
                        "Should the checkbox be checked by default"
                }
            },
            {
                type: "FormInput",
                field: "name",
                config: {
                    label: "Name Group",
                    helper:
                        "The name of the group for the checkbox. All checkboxes which share the same name will work together."
                }
            }
        ]
    },

    {
        label: "Textarea",
        "editor-component": "FormTextArea",
        config: {
            label: "New TextArea",
            placeholder: "",
            helper: null,
            rows: 2
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

]
