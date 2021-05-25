
describe('Watcher on Loops', () => {

  beforeEach(() => {
    cy.visit('/');

    cy.server();
  });

  it('Watcher on a Loop of New Array of Objects should not be triggered on load screen', () => {
    // Load screen
    cy.loadFromJson('watcher_on_loop_new_array.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    // Wait if Watcher is executed on load (without "Run watcher on Screen Load" option)
    cy.wait(2000);
    cy.get('#watchers-synchronous').should('not.exist');
  });

  it('Watcher on a Loop of New Array of Objects should triggered when an element is added', () => {
    // Load screen
    cy.loadFromJson('watcher_on_loop_new_array.json', 0);
    // Mock script call
    cy.route(
      'POST',
      '/api/1.0/scripts/execute/4',
      JSON.stringify({
        output: [],
      })
    ).as('executeScript');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('#watchers-synchronous').should('not.exist');
    cy.get('button[title="Add Item"]').click();
    cy.wait('@executeScript');
  });
});
