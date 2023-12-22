describe("multiselect with string value", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Multiselect checkbox with string value without user interaction keep its value", () => {
    cy.loadFromJson("multiselect_with_string_value.json", 0);

    // init screen data
    cy.setPreviewDataInput({ person: "foo" });
    cy.get("[data-cy=mode-preview]").click();

    // Check the data of the screen
    cy.assertPreviewData({
      person: "foo"
    });
  });

  it("Multiselect checkbox with string value after user interaction change to array", () => {
    cy.loadFromJson("multiselect_with_string_value.json", 0);

    // init screen data
    cy.setPreviewDataInput({ person: "foo" });
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name=person]").eq(0).click();
    cy.get("[data-cy=preview-content] [name=person]").eq(1).click();
    cy.get("[data-cy=preview-content] [name=person]").eq(0).click();

    // Check the data of the screen
    cy.assertPreviewData({
      person: [
        {
          content: "two",
          value: "two"
        }
      ]
    });
  });
});
