describe('Default values', () => {
  it('Check visible', () => {
    cy.visit('/');
    cy.setPreviewDataInput({name: 'world'});
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-conditionalHide]').clear().type('name');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('be.visible');
  });
  it('Check hidden', () => {
    cy.visit('/');
    cy.setPreviewDataInput({name: ''});
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-conditionalHide]').clear().type('name');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('be.not.visible');
  });
  it('Check dynamic visibility rule', () => {
    cy.visit('/');
    cy.setPreviewDataInput({name: ''});
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    // Add a second input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-conditionalHide]').clear().type('form_input_2');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('be.not.visible');
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('show next');
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('be.visible');
    cy.get('[data-cy=preview-content] [name=form_input_1]').clear().type('visible');
  });
});
