describe("Select List default Value", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify default value not existing in option list set value to null", () => {
    cy.loadFromJson("select_list_default_value.json", 0);

    // Configure a non existing default value in option list
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-basicValue]").clear().type("c");

    cy.get("[data-cy=mode-preview]").click();

    // Assert value was configured in null
    cy.assertPreviewData({
      form_select_list_1: null
    });

    // Select a valid option
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption("a");

    // Assert value is set correctly
    cy.assertPreviewData({
      form_select_list_1: "a"
    });

    cy.get("[data-cy=mode-editor]").click();

    // Configure an existing default value in option list
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-defaultValue-basicValue]").clear().type("b");

    cy.get("[data-cy=mode-preview]").click();

    // Assert default valid value is set correctly
    cy.assertPreviewData({
      form_select_list_1: "b"
    });
  });
});
