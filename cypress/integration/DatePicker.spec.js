import moment from 'moment';

describe('Date Picker', () => {

  it('Date time picker with maxDate before minDate should show a validation error', () => {
    const today = moment(new Date());
    const yesterday = moment(new Date()).subtract(1, 'days');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
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
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type(today.format('YYYY-MM-DD'));
    cy.get('[data-cy=inspector-maxDate]').clear().type(tomorrow.format('YYYY-MM-DD'));
    // Assert error validation not showing
    cy.get('.invalid-feedback > div')
      .should('not.exist');
  });
  it('Date type', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
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
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
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

  it('Date picker with minDate less than first datepicker should return null data', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateBefore = moment(new Date()).subtract(1, 'days').format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').last().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').type(date);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').type(dateBefore);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] [data-action="close"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD'),
      form_date_picker_2: null,
    });
  });

  it('Date picker with minDate equal than first datepicker should return the current date', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateSame = moment(new Date()).format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').last().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Date');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').type(date);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').type(dateSame);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] [data-action="close"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).format('YYYY-MM-DD'),
      form_date_picker_2: moment(dateSame).format('YYYY-MM-DD'),
    });
  });

  it('Date time picker with minDate less than first datepicker should return null data', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateBefore = moment(new Date()).subtract(1, 'days').format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').last().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').type(date);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').type(dateBefore);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] [data-action="close"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).toISOString(),
      form_date_picker_2: null,
    });
  });

  it('Date time picker with minDate equal than first datepicker should return the current date', () => {
    const date = moment(new Date()).format('MM/DD/YYYY');
    const dateSame = moment(new Date()).format('MM/DD/YYYY');

    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-element-container]', {position: 'bottom'});
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.setMultiselect('[data-cy=inspector-dataFormat]', 'Datetime');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.get('[data-cy=inspector-minDate]').clear().type('{{}{{}form_date_picker_1{}}{}}');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').type(date);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').type(dateSame);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] [data-action="close"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();

    cy.assertPreviewData({
      form_date_picker_1: moment(date).toISOString(),
      form_date_picker_2: moment(dateSame).toISOString(),
    });
  });
});
