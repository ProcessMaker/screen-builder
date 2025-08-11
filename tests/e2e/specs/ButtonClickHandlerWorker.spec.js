describe("Button click handler", () => {

  before(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // stub console.error
        cy.stub(win.console, 'error').as('consoleError')
      }
    });
  });

  it("Test circular reference and click handlers", () => {
    cy.loadFromJson("button_click_handler_worker.json", 0);
    cy.wait(1000);

    cy.get("[data-cy=mode-preview]").click();
    // Add new row in record list (data-cy="add-row")
    cy.get("[data-cy=preview-content] [data-cy=add-row]").click();
    // Fill the first input
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]").clear().type("12345678");
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]").should(
      "have.value",
      "12345678"
    );
    // Click on the first button
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=record_list_button_with_handler]").click();
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]").should(
      "have.value",
      "value changed by handler"
    );
    // Click on OK
    cy.get("[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary").click();

    // Add new row (data-cy="loop-form_record_list_1-add")
    cy.get("[data-cy=preview-content] [data-cy=loop-form_record_list_1-add]").click();

    // Click on first dete row
    cy.get("[data-cy=preview-content] [name=delete_row]").eq(0).click();

    // Click on first handle error
    cy.get("[data-cy=preview-content] [name=handle_error]").eq(0).click();
    // Check the error message in console
    cy.get('@consoleError')
      .should('have.been.called')
      .and('have.been.calledWith', 'Testing error');

    // Click on first change and submit
    cy.get("[data-cy=preview-content] [name=change_and_submit]").eq(0).click();

    // Check the data of the screen
    cy.assertPreviewData({
      "form_record_list_1": [
        {
          "delete_row": null,
          "handle_error": null,
          "name": "last change and submit",
          "change_and_submit": null
        }
      ]
    });
  });
});
