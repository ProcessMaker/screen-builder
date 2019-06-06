export default [
    {
        inspector:
            [
                {
                    type: "FormInput",
                    field: "conditionalHide",
                    config: {
                        label: "Visibility Rule",
                        helper: "This control is hidden until this expression is true"
                    }
                },
                {
                    type: "FormInput",
                    field: "selector",
                    config: {
                        label: "CSS Selector Name",
                        helper: "Use this in your custom css rules",
                        validation: 'regex: [-?[_a-zA-Z]+[_-a-zA-Z0-9]*]'
                    }
                }
            ]
    }

];
