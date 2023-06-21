import moment from 'moment';

describe('Validation Rules', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Invalid default values', () => {
    cy.loadFromJson('validation_rules.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    
    cy.shouldNotHaveValidationErrors('screen-field-form_input_1');

    cy.get('[data-cy=preview-content] .page button').click();

    cy.shouldHaveValidationErrors('screen-field-form_input_1');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]')
      .clear()
      .type('on');
    cy.shouldNotHaveValidationErrors('screen-field-form_input_1');
  });
});
