describe('Validation Rules', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Variable name object and rules', () => {
    cy.loadFromJson('validation_rules_name_object.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // ACCEPTED INPUT
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2.res"]')
      .parent()
      .should('contain.text', 'Field is required');
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('12');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2.res"]')
      .parent()
      .should('not.contain.text', 'Field is required');

    // ACCEPTED INPUT
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_21"]')
      .parent()
      .should('contain.text', 'Field is required');
    cy.get('[data-cy=preview-content] [name=form_input_11]').type('13');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_21"]')
      .parent()
      .should('not.contain.text', 'Field is required');

    // REJECTED INPUT
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4.res"]')
      .parent()
      .should('not.contain.text', 'Must be same as form_input_3');
    cy.get('[data-cy=preview-content] [name=form_input_3]').type('13');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4.res"]')
      .parent()
      .should('contain.text', 'Must be same as form_input_3');

    // REJECTED INPUT
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_6.res"]')
      .parent()
      .should('not.contain.text', 'Field is required');
    cy.get('[data-cy=preview-content] [name=form_input_5]').type('14');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_6.res"]')
      .parent()
      .should('contain.text', 'Field is required');

  });

});
