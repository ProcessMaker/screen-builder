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

  it('Run validation only on visible fields', () => {
    cy.visit('/');
    // Add loop control
    cy.get('[data-cy=controls-FormLoop]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-name]');
    cy.get('[data-cy=inspector-source]').select('existing');

    // Add input to loop
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable div', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable div', 'bottom');

    // Configure Validation rule
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-label]').click().clear().type('New Input 2');
    cy.get('[data-cy=add-rule]').click();
    cy.get('[data-cy=select-rule]').click().type('Required{enter}{esc');
    cy.get('[data-cy=save-rule]').click();

    // Set Visibility rule
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-conditionalHide]').clear().type('name != "foo"');

    // Add submit button
    cy.get('[data-cy=controls] > :nth-child(14)').drag('[data-cy=screen-element-container]', 'bottom');

    cy.setPreviewDataInput('{"loop_1":[{"name": "foo"}]}');

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_2]').should('be.not.visible');

    //submit form valid
    cy.get('[data-cy=preview-content] [name="Default"] > :nth-child(1) > .form-group > .btn').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Preview Form was Submitted');
    });
  });

  it('Runs validations on loops referencing same variable ', () => {
    cy.visit('/');
    cy.server();
    let alert = false;
    cy.on('window:alert', msg => alert = msg);
    cy.loadFromJson('multi_loop_validations.json', 0);

    cy.setPreviewDataInput('{"accounts": [{"name": "foobar"}]}');

    cy.get('[data-cy=mode-preview]').click();

    //  Add data to input field in last loop
    cy.get('[data-cy=screen-field-form_input_2]').type('bar');
    cy.wait(1000);

    // Ensure the form cannot yet be submitted
    cy.get(':nth-child(4) > .form-group > .btn')
      .click()
      .then(() => expect(alert).to.equal(false));
   
    // Fill out the required missing field; ensure the form *can* be submitted
    cy.get('[data-cy=screen-field-form_input_1]').type('text');

    cy.get(':nth-child(4) > .form-group > .btn')
      .click()
      .then(() => expect(alert).to.equal('Preview Form was Submitted'));
  });
});
