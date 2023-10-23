describe('Button', () => {
  it('Submit', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormButton]:contains("Submit")').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-label]').clear().type('Submit Button Test');
    cy.get('[data-cy=inspector-name]').clear().type('submit');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content]').should('contain.html', 'Submit Button Test');
    cy.get('[data-cy=preview-content] [name=submit]').should('have.attr', 'class', 'btn btn-primary disabled');
  });

  it('Regular', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormButton]:contains("Submit")').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-name]').clear().type('submit');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.setMultiselect('[data-cy="inspector-event"]', 'Regular Button');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=submit]').should('have.attr', 'class', 'btn btn-primary');
  });
});
