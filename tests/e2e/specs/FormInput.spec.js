describe("Form Input", () => {
  it("Default properties", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("Hello World");
    cy.assertPreviewData({
      form_input_1: "Hello World"
    });
  });
  it("Variable properties", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("firstname");
    cy.get("[data-cy=inspector-label]").clear().type("Your Firstname");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content]").should(
      "contain.html",
      "Your Firstname"
    );
    cy.get("[data-cy=preview-content] [name=firstname]").type("Bob");
    cy.assertPreviewData({
      firstname: "Bob"
    });
  });
  it("Data type Integer", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Integer");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("123");
    cy.assertPreviewData({
      form_input_1: 123
    });
  });
  it("Data type Integer with 0 value (required)", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=controls-FormButton]")
      .contains("Submit Button")
      .drag("[data-cy=screen-element-container]", { position: "bottom" });

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Integer");
    cy.get("[data-cy=add-rule]").click();
    cy.setMultiselect("[data-cy=select-rule]", "Required");
    cy.get("[data-cy=save-rule]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("0");
    cy.get(
      '[data-cy=preview-content] [name="Default"] > :nth-child(2) > .form-group > .btn'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_input_1']"
    ).should("not.have.class", "is-invalid");
    cy.get("[data-cy=preview-content] [name=form_input_1]").clear();
    cy.get(
      '[data-cy=preview-content] [name="Default"] > :nth-child(2) > .form-group > .btn'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_input_1']"
    ).should("have.class", "is-invalid");
  });
  it("Data type Currency", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Currency");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("1234");
    cy.get("[name=form_input_1]:visible").should("have.value", "1.234,00");
    cy.assertPreviewData({
      form_input_1: 1234
    });
  });
  it("Data type Currency with 0 value (required)", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=controls-FormButton]")
      .contains("Submit Button")
      .drag("[data-cy=screen-element-container]", { position: "bottom" });

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Currency");
    cy.get("[data-cy=add-rule]").click();
    cy.setMultiselect("[data-cy=select-rule]", "Required");
    cy.get("[data-cy=save-rule]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("0");
    cy.get(
      '[data-cy=preview-content] [name="Default"] > :nth-child(2) > .form-group > .btn'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_input_1']"
    ).should("not.have.class", "is-invalid");
  });
  it("Data type Currency with initial data", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.setPreviewDataInput('{"form_input_1":1234}');
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Currency");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[name=form_input_1]:visible").should("have.value", "1.234,00");
    cy.assertPreviewData({
      form_input_1: 1234
    });
  });
  it("Data type Currency when backspacing a decimal digit", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Currency");
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[name=form_input_1]:visible").type("1.1");
    cy.get("[data-cy=preview-data-input]").click(); // blur the text box
    cy.assertPreviewData({ form_input_1: 1.1 });

    cy.get("[name=form_input_1]:visible").type(
      "{home}{rightArrow}{rightArrow}{rightArrow}{backspace}"
    );
    cy.assertPreviewData({ form_input_1: 1 });
  });
  it("Validation rule", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-readonly]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.attr",
      "readonly"
    );
  });
  it("Placeholder", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.get("[data-cy=inspector-placeholder]").clear().type("enter text here");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.attr",
      "placeholder",
      "enter text here"
    );
  });
  it("Data type Percentage", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Percentage");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("50");
    cy.get("[name=form_input_1]:visible").should("have.value", "50.00 %");
    cy.assertPreviewData({
      form_input_1: 50
    });
  });
  it("Data type Datetime", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Datetime");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]")
      .clear()
      .type("2020-01-31 02:30");
    cy.get("[name=form_input_1]:visible").should(
      "have.value",
      "2020-01-31 02:30"
    );
    cy.assertPreviewData({
      form_input_1: "2020-01-31 02:30"
    });
  });
  it("Data type Date", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Date", 1);
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]")
      .clear()
      .type("20200131");
    cy.get("[name=form_input_1]:visible").should("have.value", "2020-01-31");
    cy.assertPreviewData({
      form_input_1: "2020-01-31"
    });
  });
  it("Data type password", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Password");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.attr",
      "type",
      "password"
    );
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("12345678");
  });
});
