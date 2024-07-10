import { dragAndDrop } from '../support/utils';

describe('Watchers list Drag&Drop', () => {
  const clickTopBarWatchers = () => {
    cy.get('[data-cy="topbar-watchers"]').click();
  };

  const aliasRowByIndex = (index, aliasName) => {
    cy.get(`[data-cy="watchers-table"] [data-test="item-${index}"]`).eq(0).as(aliasName);
  };

  const performDragAndDrop = (sourceAlias, targetAlias, sourceContent, targetContent) => {
    cy.get(sourceAlias).contains(sourceContent);
    cy.get(targetAlias).contains(targetContent);

    dragAndDrop(sourceAlias, targetAlias);
  };

  const verifyWatcherNameByIndex = (index, expectedName) => {
    cy.get(`[data-cy="watchers-table"] [data-test="item-${index}"]`).eq(0).contains(expectedName);
  };

  const extraWatchers = ['watcher_06', 'watcher_07', 'watcher_08'];

  beforeEach(() => {
    cy.visit('/');

    cy.loadFromJson('FOUR-13457.json', 0);
    clickTopBarWatchers();
  });

  it('should create 3 extra watchers', () => {
    extraWatchers.forEach((watcher) => {
      cy.get('[data-cy="watchers-add-watcher"]').click();
      cy.get('[data-cy="watchers-watcher-name"]').type(`watcher_${watcher}`);
      cy.setMultiselect('[data-cy="watchers-watcher-variable"]', watcher);
      cy.get('[data-cy="watchers-accordion-source"]').click({
        waitForAnimations: true,
      });
      cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
      cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', `{"${watcher}":"{{${watcher}}}"}`);
      cy.get('[data-cy="watchers-button-save"]').click();
    });

    cy.get('[data-cy="watchers-table"] > .sortable-item').should('have.length', 8);
  });

  it('should drag and drop first row to third row', () => {
    aliasRowByIndex(1, 'firstRow');
    aliasRowByIndex(3, 'thirdRow');

    performDragAndDrop('@firstRow', '@thirdRow', 'watcher_first_name', 'watcher_full_name');

    verifyWatcherNameByIndex(1, 'watcher_last_name');
    verifyWatcherNameByIndex(3, 'watcher_first_name');
  });

  it('should drag and drop second row to last row', () => {
    aliasRowByIndex(2, 'secondRow');
    aliasRowByIndex(5, 'lastRow');

    performDragAndDrop('@secondRow', '@lastRow', 'watcher_last_name', 'watcher_05');

    verifyWatcherNameByIndex(2, 'watcher_full_name');
    verifyWatcherNameByIndex(5, 'watcher_last_name');
  });

  it('should drag and drop last row to first row', () => {
    aliasRowByIndex(5, 'lastRow');
    aliasRowByIndex(1, 'firstRow');

    performDragAndDrop('@lastRow', '@firstRow', 'watcher_05', 'watcher_first_name');

    verifyWatcherNameByIndex(5, 'watcher_email');
    verifyWatcherNameByIndex(1, 'watcher_05');
  });

  it('should drag and drop to sort in ascending mode', () => {
    aliasRowByIndex(1, 'firstRow');
    aliasRowByIndex(2, 'secondRow');
    aliasRowByIndex(3, 'thirdRow');
    aliasRowByIndex(4, 'fourthRow');
    aliasRowByIndex(5, 'lastRow');

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
    aliasRowByIndex(1, 'firstRow');

    cy.get('@firstRow').contains('watcher_first_name');

    cy.get('@firstRow').find('[data-cy="watchers-table-edit"]').click();

    cy.get('[data-cy="watchers-watcher-name"]').clear().type('watcher_01');
    cy.get('[data-cy="watchers-button-save"]').click();

    cy.get('@firstRow').contains('watcher_01');
  });

  it('should delete the third calc', () => {
    aliasRowByIndex(3, 'thirdRow');
    cy.get('@thirdRow').contains('watcher_full_name');

    cy.get('@thirdRow').find('[data-cy="watchers-table-remove"]').click();

    cy.get('[data-cy="watchers-table"] [data-test="item-3"]').should('not.exist');
  });

  it('should bypass the second calc', () => {
    aliasRowByIndex(2, 'secondRow');

    cy.get('@secondRow').contains('watcher_last_name');

    cy.get('@secondRow').should('not.have.class', 'sortable-item-disabled');

    cy.get('@secondRow').find('[data-test="watchers-bypass"]').click();

    cy.get('@secondRow').should('have.class', 'sortable-item-disabled');
  });

  const createAndRunWatcher = (stubs, intercepts, assertion) => {
    intercepts();

    cy.visit('/', {
      onBeforeLoad(win) {
        stubs.forEach((stub) => {
          cy.stub(win.console, stub.name).as(stub.alias);
        });
      },
    });

    cy.openAcordeon('collapse-1');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', {
      position: 'bottom',
    });
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click();
    cy.get('[data-cy="watchers-accordion-source"]').click({
      waitForAnimations: true,
    });
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_2":"{{form_input_2}}"}');
    cy.get('[data-cy="watchers-accordion-output"]').click({
      waitForAnimations: true,
    });
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('user');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]')
      .clear()
      .type('name')
      .then(() => {
        cy.get('#watchers-synchronous').should('be.visible');
      });
    cy.wait(2000);

    assertion();
  };

  it('should display a custom log of SUCCESS type', () => {
    const intercepts = () => {
      cy.intercept(
        'POST',
        '/api/1.0/scripts/execute/1',
        JSON.stringify({
          output: {
            name: 'Steve',
          },
        }),
      );
    };

    createAndRunWatcher([{ name: 'log', alias: 'consoleLog' }], intercepts, () => {
      cy.get('#watchers-synchronous').should('not.exist');
      cy.assertPreviewData({
        form_input_1: 'name',
        user: {
          name: 'Steve',
        },
      });
      cy.get('@consoleLog').should('be.calledWith', '%c✅ %cWatcher "Watcher test" has %cRUN');
    });
  });

  it('should display a custom log of ERROR type', () => {
    const intercepts = () => {
      cy.intercept('POST', '/api/1.0/scripts/execute/1', {
        statusCode: 403,
        body: JSON.stringify({
          exception: 'Exception',
          message: 'Test exception response',
        }),
      });
    };

    createAndRunWatcher([{ name: 'groupCollapsed', alias: 'consoleGroupCollapsed' }], intercepts, () => {
      cy.get('@consoleGroupCollapsed').should('be.calledWith', '%c❌ %cWatcher "Watcher test" has %cFAILED');
    });
  });
});
