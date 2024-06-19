import { dragAndDrop } from '../support/utils';

describe('Watchers list Drag&Drop', () => {
  const clickTopBarWatchers = () => {
    cy.get('[data-cy="topbar-watchers"]').click();
  };

  const extraWatchers = ['watcher_06', 'watcher_07', 'watcher_08'];

  beforeEach(() => {
    cy.visit('/');

    cy.loadFromJson('FOUR-13457.json', 0);
  });

  it('should create 3 extra watchers', () => {
    clickTopBarWatchers();

    extraWatchers.forEach((watcher) => {
      cy.get('[data-cy="watchers-add-watcher"]').click();
      cy.get('[data-cy="watchers-watcher-name"]').type(`watcher_${watcher}`);
      cy.setMultiselect('[data-cy="watchers-watcher-variable"]', watcher);
      cy.get('[data-cy="watchers-accordion-source"]').click({
        waitForAnimations: true,
      });
      cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
      cy.setVueComponentValue(
        '[data-cy="watchers-watcher-input_data"]',
        `{"${watcher}":"{{${watcher}}}"}`,
      );
      cy.get('[data-cy="watchers-button-save"]').click();
    });

    cy.get('[data-cy="watchers-table"] > .sortable-item').should(
      'have.length',
      8,
    );
  });

  it('should drag and drop first row to third row', () => {
    clickTopBarWatchers();

    cy.get('[data-cy="watchers-table"] [data-test="item-1"]').eq(0).as('firstRow');
    cy.get('[data-cy="watchers-table"] [data-test="item-3"]').eq(0).as('thirdRow');

    cy.get('@firstRow').contains('watcher_first_name');
    cy.get('@thirdRow').contains('watcher_full_name');

    dragAndDrop('@firstRow', '@thirdRow');

    cy.get('[data-cy="watchers-table"] [data-test="item-1"]').eq(0).contains('watcher_last_name');
    cy.get('[data-cy="watchers-table"] [data-test="item-3"]').eq(0).contains('watcher_first_name');
  });

  it('should drag and drop second row to last row', () => {
    clickTopBarWatchers();

    cy.get('[data-cy="watchers-table"] [data-test="item-2"]').eq(0).as('secondRow');
    cy.get('[data-cy="watchers-table"] [data-test="item-5"]').eq(0).as('lastRow');

    cy.get('@secondRow').contains('watcher_last_name');
    cy.get('@lastRow').contains('watcher_05');

    dragAndDrop('@secondRow', '@lastRow');

    cy.get('[data-cy="watchers-table"] [data-test="item-2"]').eq(0).contains('watcher_full_name');
    cy.get('[data-cy="watchers-table"] [data-test="item-5"]').eq(0).contains('watcher_last_name');
  });

  it('should drag and drop last row to first row', () => {
    clickTopBarWatchers();

    cy.get('[data-cy="watchers-table"] [data-test="item-5"]').eq(0).as('lastRow');
    cy.get('[data-cy="watchers-table"] [data-test="item-1"]').eq(0).as('firstRow');

    cy.get('@lastRow').contains('watcher_05');
    cy.get('@firstRow').contains('watcher_first_name');

    dragAndDrop('@lastRow', '@firstRow');

    cy.get('[data-cy="watchers-table"] [data-test="item-5"]').eq(0).contains('watcher_email');
    cy.get('[data-cy="watchers-table"] [data-test="item-1"]').eq(0).contains('watcher_05');
  });

  it('should drag and drop to sort in ascending mode', () => {
    clickTopBarWatchers();

    cy.get('[data-cy="watchers-table"] [data-test="item-1"]').eq(0).as('firstRow');
    cy.get('[data-cy="watchers-table"] [data-test="item-2"]').eq(0).as('secondRow');
    cy.get('[data-cy="watchers-table"] [data-test="item-3"]').eq(0).as('thirdRow');
    cy.get('[data-cy="watchers-table"] [data-test="item-4"]').eq(0).as('fourthRow');
    cy.get('[data-cy="watchers-table"] [data-test="item-5"]').eq(0).as('lastRow');

    cy.get('@firstRow').contains('first_name');
    cy.get('@secondRow').contains('last_name');
    cy.get('@thirdRow').contains('full_name');
    cy.get('@fourthRow').contains('email');
    cy.get('@lastRow').contains('watcher_05');

    dragAndDrop('@secondRow', '@thirdRow');
    dragAndDrop('@fourthRow', '@firstRow');

    cy.get('@firstRow').contains('email');
    cy.get('@secondRow').contains('first_name');
    cy.get('@thirdRow').contains('full_name');
    cy.get('@fourthRow').contains('last_name');
    cy.get('@lastRow').contains('watcher_05');
  });

  it('should edit the name of the first calc', () => {
    clickTopBarWatchers();

    cy.get('[data-cy="watchers-table"] [data-test="item-1"]').eq(0).as('firstRow');

    cy.get('@firstRow').contains('watcher_first_name');

    cy.get('@firstRow').find('[data-cy="watchers-table-edit"]').click();

    cy.get('[data-cy="watchers-watcher-name"]').clear().type('watcher_01');
    cy.get('[data-cy="watchers-button-save"]').click();

    cy.get('@firstRow').contains('watcher_01');
  });

  it('should delete the third calc', () => {
    clickTopBarWatchers();

    cy.get('[data-cy="watchers-table"] [data-test="item-3"]').eq(0).as('thirdRow');

    cy.get('@thirdRow').contains('watcher_full_name');

    cy.get('@thirdRow').find('[data-cy="watchers-table-remove"]').click();

    cy.get('[data-cy="watchers-table"] [data-test="item-3"]').should('not.exist');
  });

  it('should bypass the second calc', () => {
    clickTopBarWatchers();

    cy.get('[data-cy="watchers-table"] [data-test="item-2"]').eq(0).as('secondRow');

    cy.get('@secondRow').contains('watcher_last_name');

    cy.get('@secondRow').should('not.have.class', 'sortable-item-disabled');

    cy.get('@secondRow').find('[data-test="watchers-bypass"]').click();

    cy.get('@secondRow').should('have.class', 'sortable-item-disabled');
  });
});
