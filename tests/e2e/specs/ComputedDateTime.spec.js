describe("Computed datetime", () => {
  it("", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.console, "log").as("consoleLog");
        cy.stub(win.console, "error").as("consoleError");
      }
    });
    cy.loadFromJson("computed_datetime.json", 0);

    // Enter preview mode
    cy.get("[data-cy=mode-preview]").click();

    // verify that no console errors are registerd when using the computed
    // property
    cy.get("@consoleError").should("not.to.be.called");
  });
});
