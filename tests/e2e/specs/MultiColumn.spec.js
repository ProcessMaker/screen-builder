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
