describe("Undo and Redo", () => {
  it("Can Undo", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=toolbar-undo]").click();
    cy.get("[data-cy=screen-drop-zone]").should(
      "contain.text",
      "Place your controls here."
    );
  });

  it("Can Redo", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=toolbar-undo]").click();
    cy.get("[data-cy=toolbar-redo]").click();
    // Check that New Input control was restored
    cy.get("[data-cy=screen-element-container]").should(
      "contain.text",
      "New Input"
    );
  });
});
