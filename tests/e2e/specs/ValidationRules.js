
describe('Record list', () => {

  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Invalid default values', () => {
    cy.loadFromJson('validation_rules.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // ACCEPTED CHECKBOX
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]').parent().should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]').parent().should('not.contain.text', 'Field must be accepted');

    // ACCEPTED INPUT
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]').parent().should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('on');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]').parent().should('not.contain.text', 'Field must be accepted');

    // IN LIST
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]').parent().should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_2]').type('2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]').parent().should('not.contain.text', 'Invalid value');

    // NOT IN LIST
    cy.get('[data-cy=preview-content] [name=form_input_3]').type('2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_3"]').parent().should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_3]').type('4');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_3"]').parent().should('not.contain.text', 'Invalid value');

    // REGEX
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]').parent().should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_4]').type('Aaa1');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]').parent().should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_4]').clear().type('Abc1');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]').parent().should('not.contain.text', 'Invalid value');

  });
});
