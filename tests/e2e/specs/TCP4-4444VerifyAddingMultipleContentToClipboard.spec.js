describe("Clipboard Button Actions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.showValidationOnLoad();
    cy.clearLocalStorage();
  });

  it("TCP4-4446: Content selected should remain flagged as selected for pasting", () => {
    // Step 1: Load the initial JSON data and check screen content
    cy.loadFromJson("TCP4-4446.json", 0);
    cy.get("[data-cy=screen-drop-zone]").should("not.contain.text", "Place your controls here.");

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    // Step 2: Load a new screen and repeat the process for adding to clipboard
    cy.loadFromJson("screen2TCP4-4446.json", 0);
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    // Step 3: Reload the first screen and verify that the element is flagged as selected
    cy.loadFromJson("TCP4-4446.json", 0);
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    // Step 4: Reload the second screen and verify clipboard status remains unchanged
    cy.loadFromJson("screen2TCP4-4446.json", 0);
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
  });
});
