describe('Computed fields', () => {

  it('The user should not be able to change a control assigned to a computed property', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom'); 

    cy.get('[data-cy=screen-element-container]').eq(0).click();

    cy.get('[data-cy="topbar-calcs"]').click();
    cy.get('[data-cy="calcs-add-property"]').click();
    cy.get('[data-cy="calcs-property-name"]').clear().type('form_input_1');
    cy.get('[data-cy="calcs-property-description"]').clear().type('form_input_1 is always 1');
    cy.get('[data-cy="calcs-switch-javascript"]').click();
    cy.setVueComponentValue('[data-cy="calcs-property-javascript"]', 'return "one";');
    cy.get('[data-cy="calcs-button-save"]').click();
    cy.get('[data-cy="calcs-modal"] .close').click();
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name=form_input_1]').clear().type('two');

    // Assertion: Check the form_input_1 is always 1
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.value', 'one');
    cy.assertPreviewData({
      form_input_1: 'one',
    });
  });
});
