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
});
