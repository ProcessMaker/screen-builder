
describe('Validation Rules (Hidden fields and Nested Screens)', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Verify validation rules before submit', () => {
    cy.loadFromJson('nested_validations.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name="submit"]')
      .click();

    fillInputText('screen-field-parent_input_1');
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 0);
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 1);
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 2);
    shouldHaveValidationErrors();

    fillInputText('screen-field-nested_1');
    shouldHaveValidationErrors();
    fillInputText('screen-field-nested_2');
    shouldHaveValidationErrors();
    fillInputText('screen-field-nested_3');

    submitForm();
  });

  it('Verify validation rules with hidden fields before submit', () => {
    cy.loadFromJson('nested_validations_with_hidden_rules.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name="submit"]')
      .click();

    fillInputText('screen-field-parent_input_1');
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 0);
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 1);
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 2);
    shouldHaveValidationErrors();

    fillInputText('screen-field-nested_1');
    shouldHaveValidationErrors();
    fillInputText('screen-field-nested_2');
    shouldHaveValidationErrors();
    fillInputText('screen-field-nested_3');

    submitForm();
  });

  it('Verify validation rules with hidden fields in nested screen before submit', () => {
    cy.loadFromJson('nested_validations_with_hidden_rules.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name="submit"]')
      .click();

    fillInputText('screen-field-parent_input_1');
    shouldHaveValidationErrors();

    fillInputText('screen-field-nested_1');
    shouldHaveValidationErrors();
    fillInputText('screen-field-nested_2');
    shouldHaveValidationErrors();
    fillInputText('screen-field-nested_3');
    shouldHaveValidationErrors();

    fillInputText('screen-field-parent_loop_input_2', 0);
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 1);
    shouldHaveValidationErrors();
    fillInputText('screen-field-parent_loop_input_2', 2);

    submitForm();
  });
});

function fillInputText(dataCy, index = null)
{
  if (index === null) {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`)
      .clear()
      .type('test');
  } else {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`).eq(index)
      .clear()
      .type('test');
  }
}

function shouldHaveValidationErrors()
{
  cy.get('#preview .form-group.form-group--error:visible')
    .should('have.length.greaterThan', 0);
}

function submitForm()
{
  cy.get('#preview .form-group.form-group--error:visible')
    .should('have.length', 0);
  cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"] button')
    .click();
}
