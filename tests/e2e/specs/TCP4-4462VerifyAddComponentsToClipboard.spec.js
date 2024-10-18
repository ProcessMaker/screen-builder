describe("TCP4-4462 Verify clear all components in clipboard", () => {
  beforeEach(() => {
    // Step 1: Navigate to the homepage, show validation, and clear local storage
    cy.visit("/");
    cy.showValidationOnLoad();
    cy.clearLocalStorage();
  });

  it("Verify that after clicking Clear All, all controls are deleted.", () => {


    cy.get("[data-test=page-dropdown]").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });

    cy.get('a[role="tab"]')
      .contains('Clipboard')
      .should('have.class', 'active')
      .and('be.visible');

    cy.get("[data-cy=controls-FormSelectList]").drag("[data-cy=editor-content]", { position: "top", force: true });
    cy.get("[data-cy=controls-FormButton]").drag("[data-cy=screen-element-container]", { position: "top", force: true });
    cy.get("[data-cy=controls-FormTextArea]").drag("[data-cy=screen-element-container]", { position: "top", force: true });
    cy.get("[data-cy=controls-FormDatePicker]").drag("[data-cy=screen-element-container]", { position: "top", force: true });
    cy.get("[data-cy=controls-FormCheckbox]").drag("[data-cy=screen-element-container]", { position: "top", force: true });

    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 5);
    cy.visit("/");
    cy.openAcordeonByLabel("Content Fields");

    cy.get("[data-cy=controls-FormHtmlViewer]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    cy.get("[data-cy=controls-FormImage]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormRecordList]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormNestedScreen]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormMultiColumn]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get('[data-cy="screen-element-container"]')
    .children()
    .should('have.length', 6);

  });
});
