describe("Default values", () => {
  it("Basic default value", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-basicValue]")
      .clear()
      .type("initial value");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.value",
      "initial value"
    );
    cy.assertPreviewData({
      form_input_1: "initial value"
    });
  });

  it('Text Input Default value if the variable has the next format "people.firstName"', () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("people.firstName");
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-basicValue]")
      .clear()
      .type("initial value");
    cy.get("[data-cy=mode-preview]").click();
    cy.get('[data-cy=preview-content] [name="people.firstName"]').should(
      "have.value",
      "initial value"
    );
    cy.assertPreviewData({
      people: {
        firstName: "initial value"
      }
    });
  });

  it('Select List- Default if the variable has the next format "numbers.int"', () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormSelectList]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("number.int");
    cy.get("[data-cy=accordion-DataSource]").click();
    cy.get("[data-cy=inspector-data-sources]").select("Provide Values");
    cy.get("[data-cy=inspector-add-option]").click();
    cy.get("[data-cy=inspector-option-value]").type("one");
    cy.get("[data-cy=inspector-option-content]").type("one");
    cy.get("[data-cy=inspector-option-save]").click();
    cy.get("[data-cy=inspector-add-option]").click();
    cy.get("[data-cy=inspector-option-value]").type("two");
    cy.get("[data-cy=inspector-option-content]").type("two");
    cy.get("[data-cy=inspector-option-save]").click();
    cy.get("[data-cy=inspector-add-option]").click();
    cy.get("[data-cy=inspector-option-value]").type("three");
    cy.get("[data-cy=inspector-option-content]").type("three");
    cy.get("[data-cy=inspector-option-cancel]").click();
    cy.get("[data-cy=inspector-add-option]").click();
    cy.get("[data-cy=inspector-option-value]").type("four");
    cy.get("[data-cy=inspector-option-content]").type("four");
    cy.get("[data-cy=inspector-option-save]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-basicValue]").clear().type("two");
    cy.get("[data-cy=mode-preview]").click();
    cy.assertPreviewData({
      number: {
        int: "two"
      }
    });
  });

  it("Javascript default value", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.setPreviewDataInput({ name: "world" });
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-js]").click();
    cy.setVueComponentValue(
      "[data-cy=inspector-defaultValue-jsValue]",
      "return `hello ${this.name}`;"
    );
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.value",
      "hello world"
    );
    cy.assertPreviewData({
      name: "world",
      form_input_1: "hello world"
    });
  });
  it("Initially checked checkbox", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormCheckbox]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-initiallyChecked]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_checkbox_1]").should(
      "have.prop",
      "checked"
    );
    cy.assertPreviewData({
      form_checkbox_1: true
    });
  });
  it("Dynamic Basic default value", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    // Add an input field
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    // Add a second input field
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container]",
      { position: "bottom" }
    );

    cy.get("[data-cy=screen-element-container]").first().click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-basicValue]")
      .clear()
      .type("initial value - {{form_input_2}}", {
        parseSpecialCharSequences: false
      });
    cy.get("[data-cy=mode-preview]").click();
    cy.assertPreviewData({
      form_input_2: "",
      form_input_1: "initial value - "
    });
    cy.get("[data-cy=preview-content] [name=form_input_2]")
      .clear()
      .type("next value");
    cy.assertPreviewData({
      form_input_2: "next value",
      form_input_1: "initial value - next value"
    });
  });
  it("Dynamic Javascript default value", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    // Add an input field
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    // Add a second input field
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container]",
      { position: "bottom" }
    );

    cy.get("[data-cy=screen-element-container]").first().click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-js]").click();
    cy.setVueComponentValue(
      "[data-cy=inspector-defaultValue-jsValue]",
      'return `initial value - ${this.form_input_2 || ""}`;'
    );
    cy.get("[data-cy=mode-preview]").click();
    cy.assertPreviewData({
      form_input_2: "",
      form_input_1: "initial value - "
    });
    cy.get("[data-cy=preview-content] [name=form_input_2]")
      .clear()
      .type("next value");
    cy.assertPreviewData({
      form_input_2: "next value",
      form_input_1: "initial value - next value"
    });
  });
});
