describe('Computed fields', () => {

  it('Create a javascript computed field', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    // Add a second input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');

    cy.get('[data-cy=screen-element-container]').eq(0).click();
    cy.get('[data-cy=screen-element-container]').eq(1).click();

    cy.get('[data-cy="topbar-calcs"]').click();
    cy.get('[data-cy="calcs-add-property"]').click();
    cy.get('[data-cy="calcs-property-name"]').clear().type('form_input_1');
    cy.get('[data-cy="calcs-property-description"]').clear().type('form_input_1 is the upper case of form_input_2');
    cy.get('[data-cy="calcs-switch-javascript"]').click();
    cy.setVueComponentValue('[data-cy="calcs-property-javascript"]', 'return String(this.form_input_2).toUpperCase();');
    cy.get('[data-cy="calcs-button-save"]').click();
    cy.get('[data-cy="calcs-modal"] .close').click();
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('name');

    // Assertion: Check the form_input_1 is the upper case of form_input_2
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.value', 'NAME');
    cy.assertPreviewData({
      form_input_1: 'NAME',
      form_input_2: 'name',
    });
  });

  it('Create a computed field with formula', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    // Add a second input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');

    cy.get('[data-cy=screen-element-container]').eq(0).click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Integer');
    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Integer');

    cy.get('[data-cy="topbar-calcs"]').click();
    cy.get('[data-cy="calcs-add-property"]').click();
    cy.get('[data-cy="calcs-property-name"]').clear().type('form_input_1');
    cy.get('[data-cy="calcs-property-description"]').clear().type('form_input_1 = form_input_2 ^ 2');
    cy.get('[data-cy="calcs-switch-formula"]').click();
    cy.get('[data-cy="calcs-property-formula"]').clear().type('pow(form_input_2, 2)');
    cy.get('[data-cy="calcs-button-save"]').click();
    cy.get('[data-cy="calcs-modal"] .close').click();
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('4');

    // Assertion: Check the form_input_1 is the upper case of form_input_2
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.value', '16');
    cy.assertPreviewData({
      form_input_1: 16,
      form_input_2: 4,
    });
  });
});
