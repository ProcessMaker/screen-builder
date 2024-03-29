describe("Validation Rules (Hidden fields and Nested Screens)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify validation rules before submit", () => {
    cy.loadFromJson("nested_validations.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get('[data-cy=preview-content] [name="submit"]').click();

    fillInputText("screen-field-parent_input_1");
    cy.shouldNotHaveValidationErrors("screen-field-parent_input_1");
    fillInputText("screen-field-parent_loop_input_2", 0);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 0);
    fillInputText("screen-field-parent_loop_input_2", 1);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 1);
    fillInputText("screen-field-parent_loop_input_2", 2);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 2);
    fillInputText("screen-field-nested_1");
    cy.shouldNotHaveValidationErrors("screen-field-nested_1");
    fillInputText("screen-field-nested_2");
    cy.shouldNotHaveValidationErrors("screen-field-nested_2");
    fillInputText("screen-field-nested_3");
    cy.shouldNotHaveValidationErrors("screen-field-nested_3");

    submitForm();
  });

  it("Verify validation rules with hidden fields before submit", () => {
    cy.loadFromJson("nested_validations_with_hidden_rules.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get('[data-cy=preview-content] [name="submit"]').click();

    fillInputText("screen-field-parent_input_1");
    cy.shouldNotHaveValidationErrors("screen-field-parent_input_1");
    fillInputText("screen-field-parent_loop_input_2", 0);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 0);
    fillInputText("screen-field-parent_loop_input_2", 1);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 1);
    fillInputText("screen-field-parent_loop_input_2", 2);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 2);
    fillInputText("screen-field-nested_1");
    cy.shouldNotHaveValidationErrors("screen-field-nested_1");
    fillInputText("screen-field-nested_2");
    cy.shouldNotHaveValidationErrors("screen-field-nested_2");
    fillInputText("screen-field-nested_3");
    cy.shouldNotHaveValidationErrors("screen-field-nested_3");

    submitForm();
  });

  it("Verify validation rules with hidden fields in nested screen before submit", () => {
    cy.loadFromJson("nested_validations_with_hidden_rules.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get('[data-cy=preview-content] [name="submit"]').click();

    fillInputText("screen-field-parent_input_1");
    cy.shouldNotHaveValidationErrors("screen-field-parent_input_1");
    fillInputText("screen-field-nested_1");
    cy.shouldNotHaveValidationErrors("screen-field-nested_1");
    fillInputText("screen-field-nested_2");
    cy.shouldNotHaveValidationErrors("screen-field-nested_2");
    fillInputText("screen-field-nested_3");
    cy.shouldNotHaveValidationErrors("screen-field-nested_3");
    fillInputText("screen-field-parent_loop_input_2", 0);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 0);
    fillInputText("screen-field-parent_loop_input_2", 1);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 1);
    fillInputText("screen-field-parent_loop_input_2", 2);
    cy.shouldNotHaveValidationErrors("screen-field-parent_loop_input_2", 2);

    submitForm();
  });

  it("Verify validation rules with hidden fields and use of _parent in the conditional validation rules", () => {
    cy.loadFromJson("loops_validations_with_parent_rules.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    fillInputText("screen-field-form_input_1", 0, "13");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_1", 0);
    fillInputText("screen-field-form_input_3", 0, "ok");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_3", 0);
    fillInputText("screen-field-form_input_3", 1, "ok");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_3", 1);
    fillInputText("screen-field-form_input_3", 2, "ok");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_3", 2);
    fillInputText("screen-field-form_input_1", 1, "12");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_1", 1);
    fillInputText("screen-field-form_input_2", 0, "ok");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_2", 0);
    fillInputText("screen-field-form_input_2", 0, "10");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_2", 0);
    fillInputText("screen-field-form_input_4", 0, "ok");
    cy.shouldNotHaveValidationErrors("screen-field-form_input_4", 0);

    submitForm();
  });
});

function fillInputText(dataCy, index = null, value = "test") {
  if (index === null) {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`)
      .clear()
      .type(value);
  } else {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`)
      .eq(index)
      .clear()
      .type(value);
  }
}

function submitForm() {
  cy.get(
    '[data-cy=preview-content] [data-cy="screen-field-submit"] button'
  ).click();
}
