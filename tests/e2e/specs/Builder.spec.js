describe('Screen Builder', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
  });

  it('Validation in inspector properties', () => {
    // Add a second input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').eq(0).click();
    cy.get('[data-cy=inspector-name]').clear();
    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy=open-console]').click();
    cy.get('[data-cy=focus-inspector]').click();
    cy.get('[data-cy=inspector-name]').should('have.class', 'is-invalid');
  });
});
