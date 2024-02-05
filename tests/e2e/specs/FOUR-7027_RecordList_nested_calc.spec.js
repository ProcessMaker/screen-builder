describe("screen error nested calc", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify calc can access to _parent inside Record List with nested screen", () => {
    // @link https://processmaker.atlassian.net/browse/FOUR-7027
    cy.loadFromJson("Screen parent in record list.json", 0);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name='parentInput']")
      .clear()
      .type("new value to parent");

    // Click ADD record in Record List
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();

    // Click OK button to insert the row
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
    ).click();

    // Check the data of the screen
    cy.assertPreviewData({
      result: "new value to parent",
      parentInput: "new value to parent",
      form_record_list_1: [
        {
          result: "new value to parent"
        }
      ]
    });
  });
});
