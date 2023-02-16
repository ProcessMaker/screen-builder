describe('ScreenBuilder', () => {
  it('Visits the app root url and renders form builder', () => {
    cy.visit('/');
    cy.contains('Drag an element here').should('be.visible');
  });
});
