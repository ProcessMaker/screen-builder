describe("single select with invalid initial value", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Single select radio with array value without user interaction keep its value", () => {
    cy.loadFromJson("single_select_with_invalid_value.json", 0);

    // init screen data
    cy.setPreviewDataInput({ person: [] });
    cy.get("[data-cy=mode-preview]").click();

    // Check the data of the screen
    cy.assertPreviewData({
      person: []
    });
  });

  it("Single select radio with array value after user interaction change to the selected option", () => {
    cy.loadFromJson("single_select_with_invalid_value.json", 0);

    // init screen data
    cy.setPreviewDataInput({ person: [] });
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name=person]").eq(0).click();
    cy.get("[data-cy=preview-content] [name=person]").eq(1).click();
    cy.get("[data-cy=preview-content] [name=person]").eq(0).click();

    // Check the data of the screen
    cy.assertPreviewData({
      person: {
        content: "one",
        value: "one"
      }
    });
  });
});
