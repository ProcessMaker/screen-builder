import moment from "moment";

describe("Validation Rules", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Invalid default values", () => {
    cy.loadFromJson("validation_rules.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.shouldHaveValidationErrors("screen-field-form_checkbox_1");
    cy.shouldHaveValidationErrors("screen-field-form_input_1");
    cy.shouldHaveValidationErrors("screen-field-form_input_2");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_3");
    cy.shouldHaveValidationErrors("screen-field-form_input_4");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_5");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_6");

    cy.get("[data-cy=preview-content] .page button").click();

    cy.shouldHaveValidationErrors("screen-field-form_input_1");

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]')
      .clear()
      .type("on");

    cy.shouldHaveValidationErrors("screen-field-form_checkbox_1");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_1");
    cy.shouldHaveValidationErrors("screen-field-form_input_2");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_3");
    cy.shouldHaveValidationErrors("screen-field-form_input_4");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_5");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_6");
  });
});
