describe('Loop control', () => {
  it('Input inside loop', () => {
    cy.visit('/');
    // Add loop control
    cy.get('[data-cy=controls-FormLoop]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-name]').clear().type('rows');
    cy.get('[data-cy=inspector-source]').select('existing');
    cy.get('[data-cy=inspector-add]').click();

    // Add input to loop
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable div', 'bottom');

    // Preview
    cy.get('[data-cy=mode-preview]').click();
    
    cy.assertPreviewData({
      rows: [],
    });

    // Change source to new array
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=inspector-source]').select('new');
    cy.get('[data-cy=inspector-times]').clear().type('2');
    
    // Preview
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.length', 2);
    cy.get('[data-cy=preview-content] [name=form_input_1]').eq(0).clear().type('one');
    cy.get('[data-cy=preview-content] [name=form_input_1]').eq(1).clear().type('two');

    cy.get('[data-cy=preview-content] [data-cy=loop-rows-add]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.length', 3);
    cy.get('[data-cy=preview-content] [name=form_input_1]').eq(2).clear().type('three');

    cy.assertPreviewData({
      rows: [
        { form_input_1: 'one' },
        { form_input_1: 'two' },
        { form_input_1: 'three' },
      ],
    });

    // Remove items
    cy.get('[data-cy=preview-content] [data-cy=loop-rows-remove]').click();
    cy.on('window:confirm', () => true);

    cy.assertPreviewData({
      rows: [
        { form_input_1: 'one' },
        { form_input_1: 'two' },
      ],
    });
  });
});
