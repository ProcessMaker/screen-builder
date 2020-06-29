describe('Watchers', () => {

  it('CRUD of watchers', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    // Create
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click();
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_1":"{{form_input_1}}"}');
    // Put an invalid config
    cy.setVueComponentValue('[data-cy="watchers-watcher-script_configuration"]', '{"invalid"}');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('output');
    cy.get('[data-cy="watchers-button-save"]').click();
    // Fix invalid config
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setVueComponentValue('[data-cy="watchers-watcher-script_configuration"]', '{"form_input_1":"{{form_input_1}}"}');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Search
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-table-search"]').clear().type('missing');
    cy.get('[data-cy="watchers-table-search-button"]').click();
    cy.get('[data-cy="watchers-table"]').should('not.contain.text', 'missing');
    cy.get('[data-cy="watchers-table-search"]').clear().type('Watcher test');
    cy.get('[data-cy="watchers-table-search-button"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Edit the created watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-table-edit"]:first').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test 2');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click();
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Data Source');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_2":"{{form_input_1}}"}');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('output2');
    cy.get('[data-cy="watchers-button-save"]').click();
    // Fix missing endpoint
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-endpoint"]', 'list');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test 2');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Delete the created watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-table-remove"]:first').click();
    cy.get('[data-cy="watchers-table"]').should('not.contain.text', 'Watcher test 2');
    cy.get('[data-cy="watchers-modal"] .close').click();
  });
  it('Test cancel', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.get('[data-cy="watchers-button-cancel"]').click();
    cy.get('[data-cy="watchers-table"]').should('not.contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();
  });
  it('Test variables in multi columns', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormMultiColumn]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable', 'bottom');
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
  });
  it('Test variables in nested screens', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormNestedScreen]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-screen] div.multiselect').click();
    cy.get('[data-cy=inspector-screen] span:contains("Sub screen example"):first').click();
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'firstname');
    cy.get('[data-cy="watchers-button-cancel"]').click();
    cy.get('[data-cy="watchers-modal"] .close').click();
  });
  it('Create duplicated properties', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click();
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_1":"{{form_input_1}}"}');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('output');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Create a duplicated record
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    // choose save variable
    cy.get('[data-cy="watchers-watcher-variable"]').click();
    cy.get('[data-cy="watchers-watcher-variable"] input').clear().type('form_input_1');
    cy.get('[data-cy="watchers-watcher-variable"]').should('contain.text', 'No elements found.');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('#watcherConfig').should('contain.text', 'The Variable to Watch field is required');
  });
});
