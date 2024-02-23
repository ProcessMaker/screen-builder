describe("Test access to _parent", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify calc can access to _parent inside Record List with nested screen and Loops", () => {
    cy.loadFromJson("ParentNestedScreen.json", 1);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name='parentInput']")
      .eq(0)
      .clear()
      .type("value in parent")
      .blur();

    cy.get("[data-cy=preview-content] [name='form_input_1']")
      .eq(0)
      .type(":value in loop");

    // Click ADD record in Record List
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();

    // Type in form_input_1 inside record list
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_1]"
    )
      .type(":value in record list + loop")
      .blur();

    // Click OK button to insert the row
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
    ).click();

    // Check the data of the screen
    cy.assertPreviewData({
      parentInput: "value in parent",
      loop_1: [
        {
          parentInput: "value in parent",
          loop_1: [
            {
              form_input_1: "value in parent:value in loop"
            }
          ]
        }
      ],
      form_record_list_1: [
        {
          parentInput: "value in parent",
          loop_1: [
            {
              form_input_1: "value in parent:value in record list + loop"
            }
          ]
        }
      ]
    });
  });
});
