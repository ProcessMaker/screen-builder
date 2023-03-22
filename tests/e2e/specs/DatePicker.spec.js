import moment from 'moment';

describe('Date Picker', () => {

  it('Date time picker with maxDate before minDate should show a validation error', () => {
    const today = moment(new Date());
    const yesterday = moment(new Date()).subtract(1, 'days');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type(today.format('YYYY-MM-DD'));
    cy.get('[data-cy=inspector-maxDate]').clear().type(yesterday.format('YYYY-MM-DD'));

    // Assert error validation showing
    cy.get('.invalid-feedback > div')
      .should('be.visible')
      .should('contain.text', 'Must be after or equal Minimum Date');
  });
  it('Date time picker with maxDate after minDate should not show a validation error', () => {
    const today = moment(new Date());
    const tomorrow = moment(new Date()).add(1, 'days');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type(today.format('YYYY-MM-DD'));
    cy.get('[data-cy=inspector-maxDate]').clear().type(tomorrow.format('YYYY-MM-DD'));
    // Assert error validation not showing
    cy.get('.invalid-feedback > div')
      .should('be.not.visible');
  });
  it('Date type', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .selectable.today').click();
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
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .selectable.today').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpHoursInput').type("8");
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpMinutesInput').type("{moveToEnd}15");
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdp12HourToggleBtn').then(toggle => {
      if (toggle.is('.vdp12HourToggleBtn')){
        cy.get(toggle).click();
      }
    });

    const today = new Date();
    today.setUTCHours(20);
    today.setUTCMinutes(15);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);

    cy.assertPreviewData({
      form_date_picker_1: today.toISOString(),
    });
  });
  it('Date time picker should update the helper text', () => {
    const helperTextFirstChange = 'Testing helper text';
    const helperTextSecondChange = 'Testing helper text 2';
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-helper]').type(helperTextFirstChange);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=screen-field-form_date_picker_1]').should('contain.text', helperTextFirstChange);
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-helper]').clear().type(helperTextSecondChange);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=screen-field-form_date_picker_1]').should('contain.text', helperTextSecondChange);
  });

  it('Date picker with default value should show the default value on input and data', () => {
    const date = moment(new Date()).subtract(2, 'days').format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-defaultValue-basicValue]').clear().type(date);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').should('be', date);
    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD'),
    });
  });

  it('Date picker with minDate less than first datepicker should return null data', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateBefore = moment(new Date()).subtract(1, 'days').format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').type(date);
    cy.get('[data-cy=preview-content]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').type(dateBefore);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD'),
      form_date_picker_2: null,
    });
  });
  it('Date picker with maxDate greater than first datepicker should return null data', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateAfter = moment(new Date()).add(1, 'days').format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').type(date);
    cy.get('[data-cy=preview-content]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').type(dateAfter);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD'),
      form_date_picker_2: null,
    });
  });

  it('Date picker with minDate equal or less than first datepicker should return the current date', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateSame = moment(new Date()).format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type(date);
    cy.get('[data-cy=preview-content]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').type(dateSame);
    cy.get('[data-cy=preview-content]').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD'),
      form_date_picker_2: moment(dateSame).format('YYYY-MM-DD'),
    });
  });
  it('Date picker with maxDate equal or greater than first datepicker should return the current date', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateSame = moment(new Date()).format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type(date);
    cy.get('[data-cy=preview-content]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').type(dateSame);
    cy.get('[data-cy=preview-content]').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD'),
      form_date_picker_2: moment(dateSame).format('YYYY-MM-DD'),
    });
  });

  it('Date picker with minDate and maxDate should show the value in Data Preview', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const minDate = moment(new Date()).subtract('5', 'days').format('MM/DD/YYYY');
    const maxDate = moment(new Date()).add('5', 'days').format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type(minDate);
    cy.get('[data-cy=inspector-maxDate]').clear().type(maxDate);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type(date);
    cy.get('[data-cy=preview-content]').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD')
    });
  });

  it('Date time picker with minDate less than first datepicker should return null data', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateBefore = moment(new Date()).subtract(1, 'days').format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type(date);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').type(dateBefore);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();
    cy.get('[data-cy=preview-content]').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).toISOString(),
      form_date_picker_2: null,
    });
  });

  it('Date time picker with minDate equal than first datepicker should return the current date', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateSame = moment(new Date()).format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type(date);
    cy.get('[data-cy=preview-content]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').type(dateSame);
    cy.get('[data-cy=preview-content]').click();
    cy.assertPreviewData({
      form_date_picker_1: moment(date).toISOString(),
      form_date_picker_2: moment(dateSame).toISOString(),
    });
  });
  it('Date time picker validate when the user enter a string instead of a valid date', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateSame = moment(new Date()).format('MM/DD/YYYY');

    cy.visit('/');

    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');

    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
   
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type('fooBarr{enter}');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').click();
    cy.assertPreviewData({
      form_date_picker_1: null,
      form_date_picker_2: null
    });
  });
  it('Date time picker validate enter a valid date + string', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateSame = moment(new Date()).format('MM/DD/YYYY');

    cy.visit('/');

    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');

    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
   
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type(date+"{enter}");
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .vdpComponent').type(date + "foo{enter}");
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .vdpComponent').click();
    cy.assertPreviewData({
      form_date_picker_1:  moment(date).toISOString(),
      form_date_picker_2: null
    });
  });
  it('Date Time Picker should have the class .datePicker applied in design mode', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container] .vdpComponent')
      .should('have.class', 'datePicker');
  });

  it('Date Time Picker should have the class .datePicker applied in preview mode', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] .vdpComponent')
      .should('have.class', 'datePicker');
  });
});
