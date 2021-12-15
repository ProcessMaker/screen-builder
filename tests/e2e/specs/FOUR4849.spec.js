describe('Tests null object property bind to an input text', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Verify visibility rules do not break', () => {
    cy.loadFromJson('FOUR-4849.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // When the person is null, the visibility rules should be working
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').should('not.be.visible');
    cy.get('[data-cy=preview-content] [name=check]').click();
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').should('be.visible');
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').clear().type('it works with person=null');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-person"]').selectOption('1');

    // When a person is selected, the visibility rules should still be working
    cy.get('[data-cy=preview-content] [name=check]').click();
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').should('not.be.visible');
    cy.get('[data-cy=preview-content] [name=check]').click();
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').should('be.visible');
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').clear().type('still working with person=1');
    // Check the data of the screen
    cy.assertPreviewData({
      'check': true,
      'select1': {
        'form_input_1': 'still working with person=1',
      },
      'person': {
        'value': '1',
        'content': '1',
      },
    });

    cy.get('[data-cy=preview-content] [data-cy="screen-field-person"]').unselectOption('1');

    // When the person is deselected, the visibility rules should still be working
    cy.get('[data-cy=preview-content] [name=check]').click();
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').should('not.be.visible');
    cy.get('[data-cy=preview-content] [name=check]').click();
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').should('be.visible');
    cy.get('[data-cy=preview-content] [name="select1.form_input_1"]').clear().type('still working with person back to null');

    // Check the data of the screen
    cy.assertPreviewData({
      'check': true,
      'select1': {
        'form_input_1': 'still working with person back to null',
      },
      'person': null,
    });
  });
});
