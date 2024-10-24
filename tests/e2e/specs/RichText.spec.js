describe("Rich Text control", () => {
  it("Rich text with mustache", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormHtmlViewer]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-content]")
      .focus()
      .clear()
      .type("<p>Hello {{ name }}</p>", { parseSpecialCharSequences: false });
    cy.get("[data-cy=mode-preview]").click();
    cy.setPreviewDataInput('{"name":"World"}');
    cy.get("[data-cy=preview-content]").should(
      "contain.html",
      "<p>Hello World</p>"
    );
  });

  it("Rich text render HTML from a Variable", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormHtmlViewer]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-content]")
      .focus()
      .clear()
      .type("{{ name }}", { parseSpecialCharSequences: false });
    cy.get("[data-cy=inspector-renderVarHtml]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.setPreviewDataInput('{"name":"<p>Hello <b>World</b></p>"}');
    cy.get("[data-cy=preview-content]").should(
      "contain.html",
      "<p>Hello <b>World</b></p>"
    );
  });
});
