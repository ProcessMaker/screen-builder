describe('Complex screen', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.mockComponent('FileUpload').then(() => {
      cy.loadFromJson('complex_screen.json', 2);
    });
  });
  
  it('Load screen', () => {

  });
});
