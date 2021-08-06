describe('Computed fields', () => {

  it('The user should not be able to change a FormInput assigned to a computed property', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom'); 

    cy.get('[data-cy=screen-element-container]').eq(0).click();

    cy.get('[data-cy="topbar-calcs"]').click();
    cy.get('[data-cy="calcs-add-property"]').click();
    cy.get('[data-cy="calcs-property-name"]').clear().type('form_input_1');
    cy.get('[data-cy="calcs-property-description"]').clear().type('form_input_1 is always 1');
    cy.get('[data-cy="calcs-switch-javascript"]').click();
    cy.setVueComponentValue('[data-cy="calcs-property-javascript"]', 'return "1";');
    cy.get('[data-cy="calcs-button-save"]').click();
    cy.get('[data-cy="calcs-modal"] .close').click();
    cy.get('[data-cy=mode-preview]').click();

    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

    // Check Type Integer
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Integer');
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

    // Check Type Currency
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Currency');
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

    // Check Type Percentage
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Percentage');
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

    // Check Type Decimal
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Decimal');
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

    // Check Type Datetime
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

    // Check Type Date
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

    // Check Type Password
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Password');
    cy.get('[data-cy=mode-preview]').click();
    // Assertion: Check the form_input_1 is read only
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_input_1 is always 1
    cy.assertPreviewData({
      form_input_1: '1',
    });

  });

  it('The user should not be able to change a FormTextArea assigned to a computed property', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormTextArea]').drag('[data-cy=screen-drop-zone]', 'bottom'); 

    cy.get('[data-cy=screen-element-container]').eq(0).click();

    cy.get('[data-cy="topbar-calcs"]').click();
    cy.get('[data-cy="calcs-add-property"]').click();
    cy.get('[data-cy="calcs-property-name"]').clear().type('form_text_area_1');
    cy.get('[data-cy="calcs-property-description"]').clear().type('form_text_area_1 is always 1');
    cy.get('[data-cy="calcs-switch-javascript"]').click();
    cy.setVueComponentValue('[data-cy="calcs-property-javascript"]', 'return "1";');
    cy.get('[data-cy="calcs-button-save"]').click();
    cy.get('[data-cy="calcs-modal"] .close').click();
    cy.get('[data-cy=mode-preview]').click();

    // Assertion: Check the form_text_area_1 is read only
    cy.get('[data-cy=preview-content] [name=form_text_area_1]').should('have.attr', 'readonly');
    // Assertion: Check the form_text_area_1 is always 1
    cy.assertPreviewData({
      form_text_area_1: '1',
    });
  });

  it('The user should not be able to change a FormDatePicker assigned to a computed property', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');

    cy.get('[data-cy="topbar-calcs"]').click();
    cy.get('[data-cy="calcs-add-property"]').click();
    cy.get('[data-cy="calcs-property-name"]').clear().type('form_date_picker_1');
    cy.get('[data-cy="calcs-property-description"]').clear().type('form_date_picker_1 is always 1');
    cy.get('[data-cy="calcs-switch-javascript"]').click();
    cy.setVueComponentValue('[data-cy="calcs-property-javascript"]', 'return "1";');
    cy.get('[data-cy="calcs-button-save"]').click();
    cy.get('[data-cy="calcs-modal"] .close').click();
    cy.get('[data-cy=mode-preview]').click();

    // Assertion: Check the form_date_picker_1 is read only
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').should('have.attr', 'disabled');
    // Assertion: Check the form_date_picker_1 is always 1
    cy.assertPreviewData({
      form_date_picker_1: '1',
    });
  });

  it('The user should not be able to change a FormSelectList assigned to a computed property', () => {
    cy.visit('/');
    // Add an input field
    cy.get('[data-cy=controls-FormSelectList]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Provide Values');
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('1');
    cy.get('[data-cy=inspector-option-content]').type('one');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('2');
    cy.get('[data-cy=inspector-option-content]').type('two');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('3');
    cy.get('[data-cy=inspector-option-content]').type('three');
    cy.get('[data-cy=inspector-option-cancel]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('4');
    cy.get('[data-cy=inspector-option-content]').type('four');
    cy.get('[data-cy=inspector-option-save]').click();

    cy.get('[data-cy="topbar-calcs"]').click();
    cy.get('[data-cy="calcs-add-property"]').click();
    cy.get('[data-cy="calcs-property-name"]').clear().type('form_select_list_1');
    cy.get('[data-cy="calcs-property-description"]').clear().type('form_select_list_1 is always 1');
    cy.get('[data-cy="calcs-switch-javascript"]').click();
    cy.setVueComponentValue('[data-cy="calcs-property-javascript"]', 'return "1";');
    cy.get('[data-cy="calcs-button-save"]').click();
    cy.get('[data-cy="calcs-modal"] .close').click();
    cy.get('[data-cy=mode-preview]').click();

    // Assertion: Check the form_select_list_1 is read only
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"] input').should('have.attr', 'disabled');
    // Assertion: Check the form_select_list_1 is always 1
    cy.assertPreviewData({
      form_select_list_1: '1',
    });
  });
});
