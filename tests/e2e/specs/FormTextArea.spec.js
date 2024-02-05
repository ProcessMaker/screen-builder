describe("Form Text Area Field", () => {
  it("Default properties", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_text_area_1]").type(
      "Hello World"
    );
    cy.assertPreviewData({
      form_text_area_1: "Hello World"
    });
  });
  it("Variable properties", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("comments");
    cy.get("[data-cy=inspector-label]").clear().type("Comments");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content]").should("contain.html", "Comments");
    cy.get("[data-cy=preview-content] [name=comments]").type(
      "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockup."
    );
    cy.assertPreviewData({
      comments:
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockup."
    });
  });
  it("Read Only", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("comments");
    cy.get("[data-cy=inspector-label]").clear().type("Comments");

    cy.get("[data-cy=inspector-readonly").check();
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=screen-field-comments").should(
      "have.attr",
      "readonly",
      "readonly"
    );
  });

  // Configuration
  it("Placeholder", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.get("[data-cy=inspector-placeholder]").clear().type("enter text here");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_text_area_1]").should(
      "have.attr",
      "placeholder",
      "enter text here"
    );
  });
  it("Helper Text", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.get("[data-cy=inspector-helper]").clear().type("helper text test");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content]").should(
      "contain.html",
      "helper text test"
    );
  });
  it("Rich Text", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.get("[data-cy=inspector-richtext").check(); // Check checkbox element
    cy.get("[data-cy=mode-preview]").click();
    cy.setPreviewDataInput('{"form_text_area_1":"<p>Hello <b>World</b></p>"}');
    cy.assertPreviewData({
      form_text_area_1: "<p>Hello <b>World</b></p>"
    });
  });
  it("Rows", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.get("[data-cy=inspector-rows]").clear().type("4");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_text_area_1]").should(
      "have.attr",
      "rows",
      "4"
    );
  });
  it("Default Value", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-basicValue]")
      .clear()
      .type("default value test");
    cy.get("[data-cy=mode-preview]").click();
    cy.assertPreviewData({
      form_text_area_1: "default value test"
    });
  });
  it("CSS Selector Name", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]")
      .clear()
      .type("customSelector");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_text_area_1]")
      .parent()
      .parent()
      .should("have.attr", "selector", "customSelector");
  });
  it("Aria Label", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-ariaLabel]").clear().type("Aria label test");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_text_area_1]").should(
      "have.attr",
      "aria-label",
      "Aria label test"
    );
  });
  it("Tab Order", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-tabindex]").clear().type("5");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_text_area_1]").should(
      "have.attr",
      "tabindex",
      "5"
    );
  });
});
