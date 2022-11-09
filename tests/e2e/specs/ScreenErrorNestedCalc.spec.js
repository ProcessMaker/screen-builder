describe("screen error nested calc", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/");
  });

  it("Verify screen error nested calc", () => {
    cy.loadFromJson("Screen error nested calc.json", 0);
    // set init screen test data
    // cy.setPreviewDataInput({person: []});
    cy.get("[data-cy=mode-preview]").click();

    cy.get('[data-cy=preview-content] [name="parentInput"]')
      .clear()
      .type("123");

    // Check the data of the screen
    cy.assertPreviewData({
      parentInput: "123",
      loop_1: [
        {
          result: "123"
        }
      ]
    });
  });
});
