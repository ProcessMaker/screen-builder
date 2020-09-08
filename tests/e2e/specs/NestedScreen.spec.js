describe('Nested screen', () => {
  //it('With a variable defined', () => {
  //  cy.visit('/');
  //  cy.get('[data-cy=controls-FormNestedScreen]').drag('[data-cy=screen-drop-zone]', 'bottom');
  //  cy.get('[data-cy=screen-element-container]').click();
  //  cy.get('[data-cy=inspector-name]').type('person');
  //  cy.get('[data-cy=inspector-screen] div.multiselect').click();
  //  cy.get('[data-cy=inspector-screen] span:contains("Sub screen example"):first').click();
  //  cy.get('[data-cy=mode-preview]').click();
  //  cy.get('[data-cy=preview] input[name="firstname"]').type('Alan');
  //  cy.get('[data-cy=preview] input[name="lastname"]').type('Turing');
  //  cy.get('[data-cy=preview-data-content]').should((a) => {
  //    const person = JSON.parse(a.text().split('{...}').join(''));
  //    expect(person).to.eql({ person: { firstname: 'Alan', lastname: 'Turing' }});
  //  });
  //});

  it('Without a variable defined', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormNestedScreen]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-screen] div.multiselect').click();
    cy.get('[data-cy=inspector-screen] span:contains("Sub screen example"):first').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview] input[name="firstname"]').type('Alan');
    cy.get('[data-cy=preview] input[name="lastname"]').type('Turing');
    cy.get('[data-cy=preview-data-content]').should((a) => {
      const person = JSON.parse(a.text().split('{...}').join(''));
      expect(person).to.eql({ firstname: 'Alan', lastname: 'Turing' });
    });
  });
});
