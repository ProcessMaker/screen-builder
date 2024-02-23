import moment from "moment";

describe("Validation Rules And Recordlist", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("After add a record submit button should be enabled", () => {
    cy.loadFromJson("validation_rules_and_recordlist.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Add row
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();
    cy.wait(1000);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_2]"
    ).type("TEST");
    cy.wait(500);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
    ).click();

    // Assert submit button is not disabled
    cy.get(".form-group > .btn").should("not.have.attr", "disabled");
  });

  it("After edit a record submit button should be enabled", () => {
    cy.loadFromJson("validation_rules_and_recordlist.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Add row
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();
    cy.wait(1000);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_2]"
    ).type("TEST");
    cy.wait(500);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
    ).click();

    // Edit row
    cy.get("[data-cy=edit-row]").click();
    cy.wait(1000);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=form_input_2]"
    ).type("_MODIFIED");
    cy.wait(500);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();

    // Assert submit button is not disabled
    cy.get(".form-group > .btn").should("not.have.attr", "disabled");
  });

  it("After close record list modal button should be enabled", () => {
    cy.loadFromJson("validation_rules_and_recordlist.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Add row
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();
    cy.wait(1000);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-secondary"
    ).click();

    // Assert submit button is not disabled
    cy.get(".form-group > .btn").should("not.have.attr", "disabled");
  });
});
