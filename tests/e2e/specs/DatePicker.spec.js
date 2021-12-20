import moment from 'moment';

describe('Date Picker', () => {
  it('Date type', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .day.today').click();
    const today = new Date();
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);

    cy.assertPreviewData({
      form_date_picker_1: moment(today).format('YYYY-MM-DD'),
    });
  });
  it('DateTime type', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .day.today').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] [data-action="togglePicker"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] [data-action="showHours"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] [data-action="selectHour"]:contains(08)').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] [data-action="showMinutes"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] [data-action="selectMinute"]:contains(15)').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] [data-action="togglePeriod"]').then(toggle => {
      if (toggle.is(':contains(PM)')){
        cy.get(toggle).click();
      }
    });
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] [data-action="close"]').click();

    const today = new Date();
    today.setUTCHours(8);
    today.setUTCMinutes(15);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);

    cy.assertPreviewData({
      form_date_picker_1: today.toISOString(),
    });
  });

  it('Mustache in Date validation After Date with a before input date should show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'After Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/08/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('contain.html', '<div>Must be after {{form_input_1}}</div>');
  });

  it('Mustache in Date validation After Date with an after input date should not show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'After Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/21/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert not see validation error
    cy.get('.page').should('not.contain.html', '<div>Must be after {{form_input_1}}</div>');
  });

  it('Mustache in Date validation After or Equal Date with a before input date should show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'After or Equal to Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/08/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('contain.html', '<div>Must be equal or after {{form_input_1}}</div>');
  });

  it('Mustache in Date validation After or Equal Date with same input date should not show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'After or Equal to Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/20/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('not.contain.html', '<div>Must be equal or after {{form_input_1}}</div>');
  });

  it('Mustache in Date validation Before Date with an after input date should show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'Before Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/21/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('contain.html', '<div>Must be before {{form_input_1}}</div>');
  });

  it('Mustache in Date validation Before Date with a before input date should not show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'Before Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/19/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert not see validation error
    cy.get('.page').should('not.contain.html', '<div>Must be before {{form_input_1}}</div>');
  });

  it('Mustache in Date validation Before or Equal Date with an after input date should show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'Before or Equal to Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/21/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('contain.html', '<div>Must be equal or before {{form_input_1}}</div>');
  });

  it('Mustache in Date validation Before or Equal Date with same input date should not show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'Before or Equal to Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}form_input_1{}}{}}');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021-12-20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/20/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('not.contain.html', '<div>Must be equal or before {{form_input_1}}</div>');
  });

  it('Mustache combination in Date validation After Date with an before input date should show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'After Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}year_input{}}{}}-{{}{{}month_input{}}{}}-{{}{{}day_input{}}{}}');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=inspector-name]').clear().type('year_input');
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021');
    cy.get(':nth-child(2) > [data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=inspector-name]').clear().type('month_input');
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('12');
    cy.get(':nth-child(3) > [data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=inspector-name]').clear().type('day_input');
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/18/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('contain.html', '<div>Must be after {{year_input}}-{{month_input}}-{{day_input}}</div>');
  });

  it('Mustache combination in Date validation Before or Equal Date with same input date should not show validation error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=add-rule]').click();
    cy.setMultiselect('[data-cy=select-rule]', 'Before or Equal to Date');
    cy.get('[data-cy=save-rule]').click();
    cy.get('*[class^="form-control"]').get('[name="Date"]').type('{{}{{}year_input{}}{}}-{{}{{}month_input{}}{}}-{{}{{}day_input{}}{}}');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=update-rule]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=inspector-name]').clear().type('year_input');
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('2021');
    cy.get(':nth-child(2) > [data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=inspector-name]').clear().type('month_input');
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('12');
    cy.get(':nth-child(3) > [data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=inspector-name]').clear().type('day_input');
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type('20');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').type('12/20/2021');
    cy.get('[data-cy=preview-content]').click();
    // Assert see validation error
    cy.get('.page').should('not.contain.html', '<div>Must be equal or before {{form_input_1}}</div>');
  });
});
