
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

  it('Watcher on a Loop of New Array of Objects inside Recordlist should not be triggered when popup is opened', () => {
    // Load screen
    cy.loadFromJson('watcher_on_loop_inside_recordlist.json', 0);
    // Mock script call
    cy.route(
      'POST',
      '/api/1.0/scripts/execute/4',
      JSON.stringify({
        output: [],
      })
    ).as('executeScript');

    cy.get('[data-cy=mode-preview]').click();

    // Add a recordlist row
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();
    // Watcher should not be triggered on open popup AddItem
    cy.wait(2000);
    cy.get('#watchers-synchronous').should('not.exist');

    // Click [+] add loop item and inmediatly close popup
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button[title="Add Item"]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary').click();

    // Watcher should be triggered but not displayed after the popup is closed
    cy.wait('@executeScript');
    cy.wait(2000);
    cy.get('#watchers-synchronous').should('not.exist');

    //Edit created row
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]').click();
    // Watcher should not be triggered on open popup EditItem
    cy.wait(2000);
    cy.get('#watchers-synchronous').should('not.exist');

    // Click [+] add loop item
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button[title="Add Item"]').click();
    // Watcher should be displayed and executed
    cy.get('#watchers-synchronous').should('exist');
    cy.wait('@executeScript');

    //Close edit popup
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary').click();
  });
});
