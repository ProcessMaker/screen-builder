describe("Screen Builder", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.openAllAcordeon();
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
  });

  it("Validation in inspector properties", () => {
    // Add a second input field
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").eq(0).click();
    cy.get("[data-cy=inspector-name]").clear();
    cy.get("[data-cy=screen-element-container]").eq(1).click();
    cy.get("[data-cy=open-console]").click();
    cy.get("[data-cy=focus-inspector]").click();
    cy.get("[data-cy=inspector-name]").should("have.class", "is-invalid");
  });

  it("Test switch between design and preview", () => {
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").type("Bob");
    cy.get("[data-cy=mode-editor]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.assertPreviewData({
      form_input_1: ""
    });
  });

  it("Test invalid preview input data", () => {
    cy.setPreviewDataInput("INVALID");
    cy.get("[data-cy=mode-preview]").click();
    // Assertion: The input data text editor has value "INVALID"
    cy.assertComponentValue("[data-cy=preview-data-input]", "INVALID");
    // Assertion: Screen is still rendered with only default data
    cy.assertComponentValue("[data-cy=screen-renderer]", {
      form_input_1: ""
    });
  });

  it("Validates variable names", () => {
    cy.get("[data-cy=screen-element-container]").eq(0).click();

    // Valid variable names
    [
      "A",
      "aaa",
      "aaa.bbb",
      "aaa.BBB.ccc",
      "aaa1",
      "aaa_abc.abc_1",
      "aaa1.bbb1"
    ].forEach((name) => {
      cy.get("[data-cy=inspector-name]").clear().type(name);
      cy.get("[data-cy=inspector-name]").should("not.have.class", "is-invalid");
    });

    // Invalid variable names
    [
      "1",
      "1.aaa",
      "aaa.0",
      "aaa.",
      "aaa.bbb.",
      "aaa._",
      "aaa._.ccc",
      "aaa..ccc",
      "aaa.123.ccc",
      "aaa.1.ccc"
    ].forEach((name) => {
      cy.get("[data-cy=inspector-name]").clear().type(name);
      cy.get("[data-cy=inspector-name]").should("have.class", "is-invalid");
    });
  });
});
