describe("File Upload", () => {
  it("Automatically sets a variable name", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-6");
    cy.get("[data-cy=controls-FileUpload]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();

    cy.get('[data-cy="screen-element-container"] .card-body').then((div) => {
      const data = div[0].__vue__.name;
      expect(data).to.eql("file_upload_1");
    });

    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=file-upload-button]").should("not.have.attr", "disabled");
  });

  it("Disables when task is self service", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-6");
    cy.window().then((win) => {
      win.ProcessMaker.isSelfService = true;
    });
    cy.get("[data-cy=controls-FileUpload]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=file-upload-button]").should("have.attr", "disabled");
  });
});
