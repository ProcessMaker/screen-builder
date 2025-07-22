describe("Button click handler", () => {

  before(() => {
    cy.visit("/");
  });

  it("Test button click handler on main screen", () => {
    cy.loadFromJson("button_click_handler.json", 0);
    cy.get("[data-cy=mode-preview]").click();
    // Fill the first input
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(0).clear().type("12345678");
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(0).should(
      "have.value",
      "12345678"
    );
    // Click on the first button
    cy.get("[data-cy=preview-content] [name=button_with_handler]").eq(0).click();
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(0).should(
      "have.value",
      "value changed by handler"
    );
    // Fill the second input
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(1).clear().type("12345678");
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(1).should(
      "have.value",
      "12345678"
    );
    // Click on the second button
    cy.get("[data-cy=preview-content] [name=button_with_handler]").eq(1).click();
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(1).should(
      "have.value",
      "value changed by handler"
    );
    // Fill the third input
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(2).clear().type("12345678");
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(2).should(
      "have.value",
      "12345678"
    );
    // Click on the third button
    cy.get("[data-cy=preview-content] [name=button_with_handler]").eq(2).click();
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(2).should(
      "have.value",
      "value changed by handler"
    );
    // Add new row (data-cy="loop-loop_1-add")
    cy.get("[data-cy=preview-content] [data-cy=loop-loop_1-add]").click();
    // Fill the fourth input
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(3).clear().type("12345678");
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(3).should(
      "have.value",
      "12345678"
    );
    // Click on the fourth button
    cy.get("[data-cy=preview-content] [name=button_with_handler]").eq(3).click();
    cy.get("[data-cy=preview-content] [name=form_input_2]").eq(3).should(
      "have.value",
      "value changed by handler"
    );
  });

  it("Test button click handler on record list", () => {
    cy.loadFromJson("button_click_handler.json", 0);
    // wait for the screen to be loaded
    cy.wait(1000);
    cy.get("[data-cy=mode-preview]").click();
    // Add new row in record list (data-cy="add-row")
    cy.get("[data-cy=preview-content] [data-cy=add-row]").click();
    // Fill the first input
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_1]").clear().type("12345678");
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_1]").should(
      "have.value",
      "12345678"
    );
    // Click on the first button
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=record_list_button_with_handler]").click();
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_1]").should(
      "have.value",
      "value changed by handler"
    );
    // Click on OK
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary").click();

    // Edit the row
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]"
    ).eq(0).click();
    // Fill the second input
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=form_input_1]").clear().type("12345678");
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=form_input_1]").should(
      "have.value",
      "12345678"
    );
    // Click on the button with handler
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=record_list_button_with_handler]").click();
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=form_input_1]").should(
      "have.value",
      "value changed by handler"
    );
    // Click on OK
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary").click();
    // Check the value is updated in the table (data-cy="table")
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=table] [aria-rowindex=1] [aria-colindex=1]").should(
      "contain.text",
      "value changed by handler"
    );
  });
});
