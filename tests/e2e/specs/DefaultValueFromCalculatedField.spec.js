describe("Computed field and default values", () => {
  it("Test default values with computed fields", () => {
    cy.visit("/");

    cy.loadFromJson("FOUR-6523.json", 0);

    // Preview
    cy.get("[data-cy=mode-preview]").click();

    cy.assertPreviewData({
      c: null,
      a: "0",
      b: 0,
      total: 0
    });
  });
});
