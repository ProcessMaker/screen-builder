describe('Record list', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Invalid default values', () => {
    cy.loadFromJson('validation_rules.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // ACCEPTED CHECKBOX
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .parent()
      .should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .parent()
      .should('not.contain.text', 'Field must be accepted');

    // ACCEPTED INPUT
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]')
      .parent()
      .should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('on');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]')
      .parent()
      .should('not.contain.text', 'Field must be accepted');

    // IN LIST
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_2]').type('2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]')
      .parent()
      .should('not.contain.text', 'Invalid value');

    // NOT IN LIST
    cy.get('[data-cy=preview-content] [name=form_input_3]').type('2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_3"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_3]').type('4');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_3"]')
      .parent()
      .should('not.contain.text', 'Invalid value');

    // REGEX
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_4]').type('Aaa1');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_4]')
      .clear()
      .type('Abc1');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]')
      .parent()
      .should('not.contain.text', 'Invalid value');

    // between
    cy.get('[data-cy=preview-content] [name=form_input_5]').type(10);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_5"]')
      .parent()
      .should('contain.text', 'Must have a value between 1 and 5');
    cy.get('[data-cy=preview-content] [name=form_input_5]')
      .clear()
      .type(1);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_5"]')
      .parent()
      .should('not.contain.text', 'Must have a value between 1 and 5');

    // same
    cy.get('[data-cy=preview-content] [name=form_input_6]').type(10);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_6"]')
      .parent()
      .should('contain.text', 'Must be same as form_input_5');
    cy.get('[data-cy=preview-content] [name=form_input_6]')
      .clear()
      .type(1);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_6"]')
      .parent()
      .should('not.contain.text', 'Must be same as form_input_5');

    // same
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_date_picker_1] > .form-control'
    )
      .parent()
      .should('contain.text', 'Must be equal or before today');
    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]'
    ).pickToday();
    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] > .form-control'
    )
      .parent()
      .should('not.contain.text', 'Must be equal or before today');

    //submit form valid
    cy.get(':nth-child(9) > .form-group > .btn').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Preview Form was Submitted');
    });
    cy.on('window:confirm', () => true);
  });
});
