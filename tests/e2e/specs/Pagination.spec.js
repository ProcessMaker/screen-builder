describe('Pagination', () => {
  it('Should Not Be Visible', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormRecordList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-add]').click();
    cy.get('[data-cy=add-page-name]').type('page2');
    cy.get('#addPageModal___BV_modal_footer_ > .btn-secondary').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-page]').select('0');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('.form-check-label').click();
    cy.get('div.multiselect').click();
    cy.get('.multiselect__element > .multiselect__option span:contains("page2")').click();
    cy.get('button:contains("Columns")').click();
    cy.get('.col-2 > .fas').click();
    cy.get('#option-content').type('Test Input');
    cy.get('#option-value').type('form_input_1');
    cy.get('.card-footer > .btn-secondary').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.setPreviewDataInput({form_record_list_1: [{"form_input_1": "John"}]});
    cy.get('[data-cy=table-pagination]').should('not.be.visible');
  });

  it('Should Be Visible', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormRecordList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-add]').click();
    cy.get('[data-cy=add-page-name]').type('page2');
    cy.get('#addPageModal___BV_modal_footer_ > .btn-secondary').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-page]').select('0');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('.form-check-label').click();
    cy.get('div.multiselect').click();
    cy.get('.multiselect__element > .multiselect__option span:contains("page2")').click();
    cy.get('button:contains("Columns")').click();
    cy.get('.col-2 > .fas').click();
    cy.get('#option-content').type('Test Input');
    cy.get('#option-value').type('form_input_1');
    cy.get('.card-footer > .btn-secondary').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.setPreviewDataInput({form_record_list_1: [{"form_input_1": "John"}, {"form_input_1": "Sarah"}]});
    cy.get('[data-cy=table-pagination]').should('be.visible');
  });

  it('Should Display Data', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormRecordList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-add]').click();
    cy.get('[data-cy=add-page-name]').type('page2');
    cy.get('#addPageModal___BV_modal_footer_ > .btn-secondary').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-page]').select('0');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('.form-check-label').click();
    cy.get('div.multiselect').click();
    cy.get('.multiselect__element > .multiselect__option span:contains("page2")').click();
    cy.get('button:contains("Columns")').click();
    cy.get('.col-2 > .fas').click();
    cy.get('#option-content').type('Test Input');
    cy.get('#option-value').type('form_input_1');
    cy.get('.card-footer > .btn-secondary').click();
    cy.get('[data-cy=mode-preview]').click();
    // TODO: Need to find a way to update per page.
    // perPage has to be set to 1 in form-record-list.vue in order for this test to pass.
    cy.setPreviewDataInput({form_record_list_1: [{"form_input_1": "John"}, {"form_input_1": "Sarah"}]});
    cy.get('[data-cy=table-pagination] .ui > :nth-child(4)').click();
    cy.get('.vuetable tbody').should('have.length', '1');
  });

  it('Update Per Page', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormRecordList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-add]').click();
    cy.get('[data-cy=add-page-name]').type('page2');
    cy.get('#addPageModal___BV_modal_footer_ > .btn-secondary').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-page]').select('0');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('.form-check-label').click();
    cy.get('div.multiselect').click();
    cy.get('.multiselect__element > .multiselect__option span:contains("page2")').click();
    cy.get('button:contains("Columns")').click();
    cy.get('.col-2 > .fas').click();
    cy.get('#option-content').type('Test Input');
    cy.get('#option-value').type('form_input_1');
    cy.get('.card-footer > .btn-secondary').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.setPreviewDataInput({form_record_list_1: [{"form_input_1": "John"}, {"form_input_1": "Sarah"}]});
    cy.setVueComponentProperty('[data-cy=table-pagination]', 'perPageSelectEnabled', 'true');
    cy.get('.pagination-nav-drop').should('be.visible');
    cy.get('.pagination-nav-drop').select('25');
    // TODO: Assert table length is 25. 
  });

  it('Displays Single Title', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormRecordList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-add]').click();
    cy.get('[data-cy=add-page-name]').type('page2');
    cy.get('#addPageModal___BV_modal_footer_ > .btn-secondary').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-page]').select('0');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('.form-check-label').click();
    cy.get('div.multiselect').click();
    cy.get('.multiselect__element > .multiselect__option span:contains("page2")').click();
    cy.get('button:contains("Columns")').click();
    cy.get('.col-2 > .fas').click();
    cy.get('#option-content').type('Test Input');
    cy.get('#option-value').type('form_input_1');
    cy.get('.card-footer > .btn-secondary').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.setPreviewDataInput({form_record_list_1: [{"form_input_1": "John"}]});
    cy.setVueComponentProperty('[data-cy=table-pagination]', 'single', 'Test');
    cy.get('[data-cy=table-pagination]').should('contain.text', 'Test');
  });

  it('Displays Plural Title', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormRecordList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-add]').click();
    cy.get('[data-cy=add-page-name]').type('page2');
    cy.get('#addPageModal___BV_modal_footer_ > .btn-secondary').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=toolbar-page]').select('0');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('.form-check-label').click();
    cy.get('div.multiselect').click();
    cy.get('.multiselect__element > .multiselect__option span:contains("page2")').click();
    cy.get('button:contains("Columns")').click();
    cy.get('.col-2 > .fas').click();
    cy.get('#option-content').type('Test Input');
    cy.get('#option-value').type('form_input_1');
    cy.get('.card-footer > .btn-secondary').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.setPreviewDataInput({form_record_list_1: [{"form_input_1": "John"}, {"form_input_1": "Sarah"}]});
    cy.setVueComponentProperty('[data-cy=table-pagination]', 'plural', 'Tests');
    cy.get('[data-cy=table-pagination]').should('contain.text', 'Tests');
  });
});
  