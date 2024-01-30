describe("ScreenBuilder", () => {
  it("Visits the app root url and renders form builder", () => {
    cy.visit("/");
    cy.contains("Place your controls here.").should("be.visible");
  });
});
