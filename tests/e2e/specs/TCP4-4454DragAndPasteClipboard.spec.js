describe("TCP4-4454 Verify Drag and Paste", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.showValidationOnLoad();
    cy.clearLocalStorage();
  });

  it("Verify that all contents of the clipboard are copied to the right side in second page", () => {
    // Step 1: Load the initial JSON data and check screen content
    cy.loadFromJson("TCP4-4454.json", 0);

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(2) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    
    cy.get(':nth-child(3) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(4) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(5) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(6) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(7) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(8) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    
    cy.get(':nth-child(9) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(10) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(11) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");


    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");
    cy.get('[data-cy=controls-Clipboard]').drag("[data-cy=screen-drop-zone]", { position: "bottom", force: true });
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 11);

  });
});
