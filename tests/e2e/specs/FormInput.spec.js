describe("Form Input", () => {
  const visitAndOpenAcordeon = () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
  };

  const dragFormInput = () => {
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom",
    });
    cy.get("[data-cy=screen-element-container]").click();
  };

  const enterPreviewMode = () => {
    cy.get("[data-cy=mode-preview]").click();
  };

  const assertPreviewData = (data) => {
    cy.assertPreviewData(data);
  };

  it("Default properties", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("Hello World");
    assertPreviewData({
      form_input_1: "Hello World",
    });
  });

  it("Variable properties", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    cy.get("[data-cy=inspector-name]").clear().type("firstname");
    cy.get("[data-cy=inspector-label]").clear().type("Your Firstname");
    enterPreviewMode();
    cy.get("[data-cy=preview-content]").should("contain.html", "Your Firstname");
    cy.get("[data-cy=preview-content] [name=firstname]").type("Bob");
    assertPreviewData({
      firstname: "Bob",
    });
  });

  const setDataFormat = (format) => {
    cy.setMultiselect("[data-cy=inspector-dataFormat]", format);
  };

  it("Data type Integer", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    setDataFormat("Integer");
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("123");
    assertPreviewData({
      form_input_1: 123,
    });
  });

  const addRequiredRule = () => {
    cy.get("[data-cy=add-rule]").click();
    cy.setMultiselect("[data-cy=select-rule]", "Required");
    cy.get("[data-cy=save-rule]").click();
  };

  const addSubmitButton = () => {
    cy.get("[data-cy=controls-FormButton]").contains("Submit Button").drag("[data-cy=screen-element-container]", {
      position: "bottom",
    });
  };

  const checkInvalidClass = (shouldHaveClass) => {
    const assertion = shouldHaveClass ? "have.class" : "not.have.class";
    cy.get("[data-cy=preview-content] [data-cy='screen-field-form_input_1']").should(assertion, "is-invalid");
  };

  it("Data type Integer with 0 value (required)", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    addSubmitButton();
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    setDataFormat("Integer");
    addRequiredRule();
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("0");
    cy.get('[data-cy=preview-content] [name="Default"] > :nth-child(2) > .form-group > .btn').click();
    checkInvalidClass(false);
    cy.get("[data-cy=preview-content] [name=form_input_1]").clear();
    cy.get('[data-cy=preview-content] [name="Default"] > :nth-child(2) > .form-group > .btn').click();
    checkInvalidClass(true);
  });

  it("Data type Currency", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    setDataFormat("Currency");
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("1234");
    cy.get("[name=form_input_1]:visible").should("have.value", "1.234,00");
    assertPreviewData({
      form_input_1: 1234,
    });
  });

  it("Data type Currency with 0 value (required)", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    addSubmitButton();
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    setDataFormat("Currency");
    addRequiredRule();
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("0");
    cy.get('[data-cy=preview-content] [name="Default"] > :nth-child(2) > .form-group > .btn').click();
    checkInvalidClass(false);
  });

  it("Data type Currency with initial data", () => {
    visitAndOpenAcordeon();
    cy.setPreviewDataInput('{"form_input_1":1234}');
    dragFormInput();
    setDataFormat("Currency");
    enterPreviewMode();
    cy.get("[name=form_input_1]:visible").should("have.value", "1.234,00");
    assertPreviewData({
      form_input_1: 1234,
    });
  });

  it("Data type Currency when backspacing a decimal digit", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    setDataFormat("Currency");
    enterPreviewMode();
    cy.get("[name=form_input_1]:visible").type("1.1");
    cy.get("[data-cy=preview-data-input]").click(); // blur the text box
    assertPreviewData({ form_input_1: 1.1 });
    cy.get("[name=form_input_1]:visible").type("{home}{rightArrow}{rightArrow}{rightArrow}{backspace}");
    assertPreviewData({ form_input_1: 1 });
  });

  it("Validation rule", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    cy.get("[data-cy=inspector-readonly]").click();
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should("have.attr", "readonly");
  });

  it("Placeholder", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.get("[data-cy=inspector-placeholder]").clear().type("enter text here");
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should("have.attr", "placeholder", "enter text here");
  });

  it("Data type Percentage", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    setDataFormat("Percentage");
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("50");
    cy.get("[name=form_input_1]:visible").should("have.value", "50.00 %");
    assertPreviewData({
      form_input_1: 50,
    });
  });

  it("Data type Datetime", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    setDataFormat("Datetime");
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").clear().type("2020-01-31 02:30");
    cy.get("[name=form_input_1]:visible").should("have.value", "2020-01-31 02:30");
    assertPreviewData({
      form_input_1: "2020-01-31 02:30",
    });
  });

  it("Data type Date", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    setDataFormat("Date");
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").clear().type("20200131");
    cy.get("[name=form_input_1]:visible").should("have.value", "2020-01-31");
    assertPreviewData({
      form_input_1: "2020-01-31",
    });
  });

  it("Data type password", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    setDataFormat("Password");
    enterPreviewMode();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should("have.attr", "type", "password");
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("12345678");
  });
});