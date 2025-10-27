export const handlerEventProperty = {
  type: "CodeEditor",
  field: "handler",
  config: {
    label: "Click Handler",
    helper:
      "The handler is a JavaScript function that will be executed when the button is clicked.",
    dataFeature: "i1177"
  }
};

export const handlerSecurityProperty = {
  type: "FormCheckbox",
  field: "handlerSecurityEnabled",
  config: {
    label: "Secure Handler Execution",
    toggle: true,
    helper:
      "When enabled, the handler runs inside a sandboxed worker. Disable to allow full JavaScript access."
  }
};
