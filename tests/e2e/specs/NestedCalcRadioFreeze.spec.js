describe("nested calc radio freeze", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // @link: https://processmaker.atlassian.net/browse/FOUR-4873
  it("Verify nested calc radio do not freeze", () => {
    cy.loadFromJson("nested_calc_radio_freeze.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] button:contains(Continue)").click();
    // Wait until you load the screen
    cy.wait(500);

    // Check the data of the screen
    cy.assertPreviewData({
      jointOwner: [
        {
          varb: null,
          form_input_1: null,
          selectLIst1: null,
          form_select_list_1: [],
          selectIsArray: true
        }
      ]
    });
  });
});
