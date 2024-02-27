describe("Pages and navigations", () => {
  it("Basic default value", () => {
    cy.visit("/");
    cy.openAllAcordeon();
    cy.get("[data-test=page-dropdown]").click();
    cy.get("[data-test=add-page]").click({ force: true });
    // Define Page 2
    cy.get("[data-cy=add-page-name]").clear().type("Page 2");
    cy.get("[data-cy=add-page-modal] button.btn").eq(1).click();
    cy.get('[data-cy=controls-FormButton]:contains("Page")').drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-label]").clear().type("Go to Page 1");
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.setMultiselect("[data-cy=inspector-eventData]", "Default");
    // Define Page 1
    cy.get("[data-test=page-dropdown]").click();
    cy.get("[data-cy=page-0]").click({ force: true });
    cy.get('[data-cy=controls-FormButton]:contains("Page")').drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-label]").clear().type("Go to Page 2");
    cy.get("[data-cy=accordion-Configuration]").click();
    cy.setMultiselect("[data-cy=inspector-eventData]", "Page 2");
    // Preview
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content]").should("contain.text", "Go to Page 2");
    cy.get("[data-cy=preview-content] button").click();
    cy.get("[data-cy=preview-content]").should("contain.text", "Go to Page 1");
  });
});
