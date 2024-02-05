describe.skip("Wrong Configuration Errors", () => {
  it("Screen with rendering problem in a component should show a warning", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.console, "warn").as("consoleWarn");
        cy.stub(win.console, "error").as("consoleError");
      }
    });
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("s.1");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=mode-editor]").click();
    cy.get("@consoleWarn").should(
      "be.calledWith",
      "There was a problem rendering the screen"
    );
  });

  it("Screen with rendering problem in a component should not show a warning after the problematic component is deleted", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.console, "warn").as("consoleWarn");
        cy.stub(win.console, "error").as("consoleError");
      }
    });
    cy.openAcordeon("collapse-1");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("s.1");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=mode-editor]").click();
    cy.get("@consoleWarn").should(
      "be.calledWith",
      "There was a problem rendering the screen"
    );
    cy.get("[data-cy=screen-element-container] .ml-auto > .btn-danger").click();
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=mode-editor]").click();
    cy.get("@consoleError").should("not.to.be.called");
    cy.get("@consoleWarn").should("not.to.be.calledTwice");
  });
});
