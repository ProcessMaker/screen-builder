describe("Clipboard Page and clear all", () => {

  

  it("Verify that the controls created in the clipboard page were removed with clear all option", () => {
    // Clear local storage
    cy.clearLocalStorage();
    cy.visit("/");
    cy.openAcordeonByLabel("Input Fields");
    
    cy.get("[data-test=page-dropdown").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });
    // Step 1: Dragging controls to screen drop zone
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=editor-content]", { position: "bottom" });
    cy.get("[data-cy=controls-FormSelectList]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormButton]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormTextArea]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormDatePicker]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormCheckbox]").drag("[data-cy=screen-element-container]", { position: "top" });

  
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 6);
    cy.contains('button', 'Clear All').click();
    cy.contains('button', 'Cancel').click();
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 6);
    cy.contains('button', 'Clear All').click();
    cy.contains('button', 'Confirm').click();

    cy.get('[data-cy="editor-content"]')
      .children()
      .should('have.length', 0);
  });

});