describe('Undo and Redo', () => {
  it('Can Undo', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-undo]').click();
    cy.get('[data-cy=screen-drop-zone]').should('contain.text', 'Drag an element here');
  });

  it('Can Redo', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-undo]').click();
    cy.get('[data-cy=toolbar-redo]').click();
    cy.get('[data-cy=screen-drop-zone]').should('not.contain.text', 'Drag an element here');
  });
});
  