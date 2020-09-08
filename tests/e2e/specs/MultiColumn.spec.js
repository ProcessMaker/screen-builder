describe('MultiColumns', () => {

  it('Configure using JSON', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormMultiColumn]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable:empty');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable:empty');
    cy.get('.custom-switch:has([data-cy="inspector-jsonFormat"]) label').click();
    cy.get('[data-cy=inspector-dataJson]').clear().type(JSON.stringify([
      { value:'1', content: '4' },
      { value:'1', content: '8' },
    ]), { parseSpecialCharSequences: false });
    cy.get('[data-cy=inspector-dataJson-save]').click();

    // Assertion: Verify multicolumns
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: check preview contains the configured columns
    cy.get('[data-cy=preview-content]').should('contain.html', '<div class="col-sm-4"');
    cy.get('[data-cy=preview-content]').should('contain.html', '<div class="col-sm-8"');

    // Assertion: Verify the inputs works
    cy.get('[data-cy=preview-content] [name=form_input_1]').clear().type('firstname');
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('lastname');
    cy.assertPreviewData({
      form_input_1: 'firstname',
      form_input_2: 'lastname',
    });
  });

  it('Configure using columns configuration', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormMultiColumn]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();

    // Remove first column
    cy.get('[data-cy=inspector-columns-remove]').eq(0).click();
    // Add column of width 4
    cy.get('[data-cy=inspector-columns-add]').click();
    cy.get('[data-cy=inspector-add-column-width]').type('4');
    cy.get('[data-cy=inspector-add-column-modal] button.btn-primary').click();

    // Remove first column
    cy.get('[data-cy=inspector-columns-remove]').eq(0).click();
    // Add column of width 8
    cy.get('[data-cy=inspector-columns-add]').click();
    cy.get('[data-cy=inspector-add-column-width]').clear().type('invalid');
    cy.get('[data-cy=inspector-add-column-modal] button.btn-primary').click();
    cy.get('[data-cy=inspector-add-column-modal]').should('contain.text', 'This value must be numeric');
    cy.get('[data-cy=inspector-add-column-width]').clear().type('18');
    cy.get('[data-cy=inspector-add-column-modal] button.btn-primary').click();
    cy.get('[data-cy=inspector-add-column-modal]').should('contain.text', 'This value must be between 1-12');
    cy.get('[data-cy=inspector-add-column-width]').clear().type('10');
    cy.get('[data-cy=inspector-add-column-modal] button.btn-primary').click();
    cy.get('[data-cy=inspector-add-column-modal]').should('contain.text', 'The total size of the columns exceeds 12');
    cy.get('[data-cy=inspector-add-column-width]').clear().type('8');
    cy.get('[data-cy=inspector-add-column-modal] button.btn-primary').click();

    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable:empty');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable:empty');

    // Assertion: Verify multicolumns
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: check preview contains the configured columns
    cy.get('[data-cy=preview-content]').should('contain.html', '<div class="col-sm-4"');
    cy.get('[data-cy=preview-content]').should('contain.html', '<div class="col-sm-8"');

    // Assertion: Verify the inputs works
    cy.get('[data-cy=preview-content] [name=form_input_1]').clear().type('firstname');
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('lastname');
    cy.assertPreviewData({
      form_input_1: 'firstname',
      form_input_2: 'lastname',
    });
  });
});
