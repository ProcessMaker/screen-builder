describe('Complex screen', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loadFromJson('complex_screen.json', 2);
    cy.loadFromJson('complex_screen.json', 2);
  });
  
  it('Load screen', () => {

  });
});
