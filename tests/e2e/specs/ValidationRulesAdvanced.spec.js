
describe('Validation Rules (Advanced test)', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Verify all validation rules within loops', () => {
    cy.loadFromJson('validation rules loop.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    fillInputText('screen-field-form_input_1', 0, '1');

    fillInputText('screen-field-form_input_2', 0, 'abc');

    fillInputText('screen-field-form_input_3', 0, '123');

    fillInputText('screen-field-form_input_4', 0, '10');

    fillInputText('screen-field-Email', 0, 'john.doe@example.com');

    fillInputText('screen-field-form_input_6', 0, '2020-10-10');

    fillInputText('screen-field-form_input_7', 0, '8');

    fillInputText('screen-field-form_input_8', 0, '12345');

    fillInputText('screen-field-form_input_15', 0, 'john.doe@example.com');
    fillInputText('screen-field-form_input_16', 0, 'john.doe@example.com');

    fillInputText('screen-field-form_input_5', 0, 'https://www.example.com');

    fillInputText('screen-field-form_input_9', 0, '123');

    fillInputText('screen-field-form_input_10', 0, '8');

    fillInputText('screen-field-form_input_11', 0, 'x');

    fillInputText('screen-field-Required', 0, 'ok');

    fillInputText('screen-field-form_input_14', 0, 'paola');
    fillInputText('screen-field-form_input_13', 0, 'paola');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_2"]').selectOption('one');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').pickTomorrow();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_3"]').pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_4"]').pickYesterday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_5"]').pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_6"]').pickTomorrow();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_7"]').pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_8"]').pickYesterday();

    shouldNotHaveValidationErrors();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_2"]').selectOption('two');
    shouldHaveValidationErrors();
    fillInputText('screen-field-form_input_12', 0, 'ok');
    shouldNotHaveValidationErrors();

    submitForm();
  });
});

function fillInputText(dataCy, index = null, value = 'test')
{
  if (index === null) {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`)
      .clear()
      .type(value);
  } else {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`).eq(index)
      .clear()
      .type(value);
  }
}

function shouldHaveValidationErrors()
{
  cy.get('#preview .form-group.form-group--error:visible')
    .should('have.length.greaterThan', 0);
}

function shouldNotHaveValidationErrors()
{
  cy.get('#preview .form-group.form-group--error:visible')
    .should('have.length', 0);
}

function submitForm()
{
  cy.get('#preview .form-group.form-group--error:visible')
    .should('have.length', 0);
  cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"] button')
    .click();
}
