describe('Screen Warnings', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Large screen warning', () => {
    cy.loadFromJson('large_screen_warning.json', 1);

    cy.get('[data-cy="open-console"] .badge-warning').should('contain.text', '1');
    cy.get('[data-cy="open-console"]').click();
    cy.get('[data-cy="validation-panel"]').should('contain.text', 'We recommend using fewer than 25 form elements in your screen for optimal performance.');
  });

  it('Use script warning', () => {
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').type('test');
    cy.get('[data-cy="watchers-watcher-variable"]').selectOption('form_input_1');
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.get('#watcherSource').should('not.contain.text', 'Using watchers with Scripts can slow the performance of your screen');
    cy.get('[data-cy="watchers-watcher-source"]').selectOption('Test Script');
    cy.get('#watcherSource').should('contain.text', 'Using watchers with Scripts can slow the performance of your screen');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-modal"] .close').click();
    cy.get('[data-cy="open-console"] .badge-warning').should('contain.text', '1');
    cy.get('[data-cy="open-console"]').click();
    cy.get('[data-cy="validation-panel"]').should('contain.text', 'Using watchers with Scripts can slow the performance of your screen.');
  });
});
