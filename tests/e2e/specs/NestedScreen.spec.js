describe('Nested screen', () => {
  it('With a variable defined', () => {
    cy.visit('/');
    cy.get('#controls > div:contains("Nested Screen")').drag('#screen-container div:contains("Drag an element here")', 'bottom');
    cy.get('#screen-container div.card').click();
    cy.get('#Variable input[name="DataVariable"]').type('person');
    cy.get('#Variable div.multiselect').click();
    cy.get('#Variable span:contains("Sub screen example"):first').click();
    cy.get('#app button:contains("Preview"):first').click();
    cy.get('#person input[name="firstname"]').type('Alan');
    cy.get('#person input[name="lastname"]').type('Turing');
    cy.get('#showDataPreview').should((a) => {
      const person = JSON.parse(a.text().split('{...}').join(''));
      expect(person).to.eql({ person: { firstname: 'Alan', lastname: 'Turing' }});
    });
  });

  it('Without a variable defined', () => {
    cy.visit('/');
    cy.get('#controls > div:contains("Nested Screen")').drag('#screen-container div:contains("Drag an element here")', 'bottom');
    cy.get('#screen-container div.card').click();
    cy.get('#Variable div.multiselect').click();
    cy.get('#Variable span:contains("Sub screen example"):first').click();
    cy.get('#app button:contains("Preview"):first').click();
    cy.get('#preview input[name="firstname"]').type('Alan');
    cy.get('#preview input[name="lastname"]').type('Turing');
    cy.get('#showDataPreview').should((a) => {
      const person = JSON.parse(a.text().split('{...}').join(''));
      expect(person).to.eql({ firstname: 'Alan', lastname: 'Turing' });
    });
  });
});
