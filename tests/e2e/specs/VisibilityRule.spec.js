describe("Default values", () => {
  it("Check visible", () => {
    cy.visit("/");
    cy.setPreviewDataInput({ name: "world" });
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-conditionalHide]").clear().type("name");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "be.visible"
    );
  });
  it("Check hidden", () => {
    cy.visit("/");
    cy.setPreviewDataInput({ name: "" });
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-conditionalHide]").clear().type("name");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "not.be.visible"
    );
  });
  it("Check dynamic visibility rule", () => {
    cy.visit("/");
    cy.setPreviewDataInput({ name: "" });
    cy.openAcordeon("collapse-1");
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
    cy.get("[data-cy=inspector-conditionalHide]").clear().type("form_input_2");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "not.be.visible"
    );
    cy.get("[data-cy=preview-content] [name=form_input_2]")
      .clear()
      .type("show next");
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "be.visible"
    );
    cy.get("[data-cy=preview-content] [name=form_input_1]")
      .clear()
      .type("visible");
  });
});
