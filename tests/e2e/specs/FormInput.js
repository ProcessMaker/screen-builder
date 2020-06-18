describe('Form Input', () => {
  it('Default properties', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('Hello World');
    cy.assertPreviewData({
      form_input_1: 'Hello World',
    });
  });
  it('Variable properties', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-name]').clear().type('firstname');
    cy.get('[data-cy=inspector-label]').clear().type('Your Firstname');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content]').should('contain.html', 'Your Firstname');
    cy.get('[data-cy=preview-content] [name=firstname]').type('Bob');
    cy.assertPreviewData({
      firstname: 'Bob',
    });
  });
  it('Data type', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Integer');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('123');
    cy.assertPreviewData({
      form_input_1: 123,
    });
  });
  it('Validation rule', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-validation] button').click();
    cy.setMultiselect('[data-cy=inspector-validation] .multiselect', 'Email');
    cy.get('[data-cy=inspector-validation] button:contains("Save")').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('123');
    cy.get('[data-cy=preview-content]').should('contain.html', 'format is invalid');
    cy.get('[data-cy=preview-content] [name=form_input_1]').clear().type('admin@processmaker.com');
    cy.get('[data-cy=preview-content]').should('not.contain.html', 'format is invalid');
  });
});
