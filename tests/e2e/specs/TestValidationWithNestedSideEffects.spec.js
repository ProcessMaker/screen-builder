describe("test validation with nested side effects", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.showValidationOnLoad();
  });

  it("Verify test validation with nested side effects", () => {
    cy.loadFromJson("Test Validation with Nested side effects.json", 1);
    // click on preview
    cy.get("[data-cy=mode-preview]").click();
    // click on New Submit button
    cy.get("[data-cy=preview-content] button[aria-label='Submit']").click();
    // In editor: ensure standard required field displays error while readonly required field does not
    cy.get("[data-cy=preview-content] [name='form_input_2']")
      .parent()
      .find(".invalid-feedback")
      .should("be.visible");
  });
});
