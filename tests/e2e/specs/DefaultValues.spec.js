describe('Default values', () => {
  it('Basic default value', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('initial value');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.value', 'initial value');
    cy.assertPreviewData({
      form_input_1: 'initial value',
    });
  });
  it('Javascript default value', () => {
    cy.visit('/');
    cy.setPreviewDataInput({name: 'world'});
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-js]').click();
    cy.setVueComponentValue('[data-cy=inspector-defaultValue-jsValue]', 'return `hello ${this.name}`;');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.value', 'hello world');
    cy.assertPreviewData({
      name: 'world',
      form_input_1: 'hello world',
    });
  });
  it('Initially checked checkbox', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormCheckbox]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-initiallyChecked]').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').should('have.prop', 'checked');
    cy.assertPreviewData({
      form_checkbox_1: true,
    });
  });
  it('Dynamic Basic default value', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    // Add a second input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');

    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('initial value - {{form_input_2}}', {parseSpecialCharSequences: false});
    cy.get('[data-cy=mode-preview]').click();
    cy.assertPreviewData({
      form_input_2: '',
      form_input_1: 'initial value - ',
    });
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('next value');
    cy.assertPreviewData({
      form_input_2: 'next value',
      form_input_1: 'initial value - next value',
    });
  });
  it('Dynamic Javascript default value', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    // Add a second input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');

    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-js]').click();
    cy.setVueComponentValue('[data-cy=inspector-defaultValue-jsValue]', 'return `initial value - ${this.form_input_2 || ""}`;');
    cy.get('[data-cy=mode-preview]').click();
    cy.assertPreviewData({
      form_input_2: '',
      form_input_1: 'initial value - ',
    });
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('next value');
    cy.assertPreviewData({
      form_input_2: 'next value',
      form_input_1: 'initial value - next value',
    });
  });
});
