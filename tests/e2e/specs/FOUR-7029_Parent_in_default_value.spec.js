describe("access to _parent variable in default value", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Test access to _parent variable in default value inside a nested inside a loop", () => {
    cy.loadFromJson("Screen _parent in default value.json", 0);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name='parentInput']")
      .clear()
      .type("new value to parent");

    cy.assertPreviewData({
      parentInput: "new value to parent",
      loop_1: [
        {
          inputDefault: "new value to parent"
        }
      ]
    });
  });
});
