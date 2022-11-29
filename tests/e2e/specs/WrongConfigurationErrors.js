describe("Wrong Configuration Errors", () => {
  it("Screen rendering problem warning", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.console, "warn").as("consoleWarn");
        cy.stub(win.console, "error").as("consoleError");
      }
    });
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-drop-zone]",
      "bottom"
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("s.1");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=mode-editor]").click();
    cy.get("@consoleWarn").should(
      "be.calledWith",
      "There was a problem rendering the screen"
    );
  });
//   it("Screen rendering valid screen", () => {
//     cy.visit("/", {
//       onBeforeLoad(win) {
//         cy.stub(win.console, "warn").as("consoleWarn");
//         cy.stub(win.console, "error").as("consoleError");
//       }
//     });
//     cy.get("[data-cy=controls-FormInput]").drag(
//       "[data-cy=screen-drop-zone]",
//       "bottom"
//     );
//     cy.get("[data-cy=screen-element-container]").click();
//     cy.get("[data-cy=inspector-name]").clear().type("s.1");
//     cy.get("[data-cy=mode-preview]").click();
//     cy.get("[data-cy=mode-editor]").click();
//     cy.get("@consoleWarn").shouldNot(
//       "be.calledWith",
//       "There was a problem rendering the screen"
//     );
//   });
});
