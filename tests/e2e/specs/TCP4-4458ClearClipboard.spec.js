describe("TCP4-4458 Verify clear all components in clipboard", () => {
  beforeEach(() => {
    // Step 1: Navigate to the homepage, show validation, and clear local storage
    cy.visit("/");
    cy.showValidationOnLoad();
    cy.clearLocalStorage();
  });

  it("Verify that after clicking Clear All, all controls are deleted.", () => {
    // Step 2: Load the JSON data (TCP4-4454)
    cy.loadFromJson("TCP4-4454.json", 0);

    // Step 3: Function to add a screen element to the clipboard
    const addToClipboard = (index) => {
      // Select screen element based on index, click it, then click the add to clipboard button
      cy.get(`:nth-child(${index}) > [data-cy="screen-element-container"]`).click({ force: true });
      cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
      cy.get('[data-cy="addToClipboard"]').should("not.exist");
    };

    // Step 4: Loop through elements (1-11) and add each to the clipboard
    for (let i = 1; i <= 11; i++) {
      addToClipboard(i);
    }

    // Step 5: Open the clipboard menu
    cy.get("[data-test=page-dropdown]").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });

    // Step 6: Verify that the Clipboard tab is active
    cy.get('a[role="tab"]')
      .contains('Clipboard')
      .should('have.class', 'active')
      .and('be.visible');

    // Step 7: Click 'Clear All' button in the clipboard
    cy.get('[data-test="tab-content"] > .btn-link').click();

    // Step 8: Confirm the action to clear the clipboard
    cy.contains('button', 'Confirm').click();

    // Step 9: Verify that all clipboard components have been deleted
    cy.get('[data-cy="editor-content"]').children().should('have.length', 0);
  });
});
