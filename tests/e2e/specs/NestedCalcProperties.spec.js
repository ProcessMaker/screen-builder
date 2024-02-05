describe("nested calculated properties", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // @link: https://processmaker.atlassian.net/browse/FOUR-4873
  it("Verify nested calculated properties", () => {
    cy.loadFromJson("nested_calc_properties.json", 1);
    cy.get("[data-cy=mode-preview]").click();

    cy.get('[data-cy=preview] input[name="varA"]').type(10);
    cy.get('[data-cy=preview] input[name="varB"]').type(5);
    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-operation"]'
    ).selectOption("Addition");

    // Wait until you load the screen
    cy.wait(500);

    // Check the data of the screen
    cy.assertPreviewData({
      equal: "=",
      operation: 1,
      varA: 10,
      varB: 5,
      varR: 15
    });
  });
});
