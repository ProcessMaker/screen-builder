describe('Complex screen', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
    cy.mockComponent('SavedSearchChart').then(() => {
      cy.loadFromJson('complex_screen.json', 1);
    });
  });
  
  it('Load screen', () => {
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('12345678');
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.value', '12345678');

    cy.get('[data-cy=preview-content] [name=form_text_area_1]').type('Hello!');
    cy.get('[data-cy=preview-content] [name=form_text_area_1]').should('have.value', 'Hello!');

    cy.setMultiselect('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]', 'a');

    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').click();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] input').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] .day.today').click();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] input').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] .day.today').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"] [data-action="close"]').click();

    const today = new Date();
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);

    const now = new Date();
    now.setUTCSeconds(0);
    now.setUTCMilliseconds(0);

    cy.get('[data-cy=preview-content] [name=form_input_2]').eq(0).clear().type('input in loop 1');
    cy.get('[data-cy=preview-content] [name=form_input_2]').eq(1).clear().type('input in loop 2');
    cy.get('[data-cy=preview-content] [name=form_input_2]').eq(2).clear().type('input in loop 3');

    cy.assertPreviewData({
      'form_input_1': '12345678',
      'form_text_area_1': 'Hello!',
      'form_select_list_1': 'a',
      'form_checkbox_1': true,
      'form_date_picker_1': today.toISOString(),
      'form_date_picker_2': now.toISOString(),
      'loop': [
        {
          'form_input_2': 'input in loop 1',
        },
        {
          'form_input_2': 'input in loop 2',
        },
        {
          'form_input_2': 'input in loop 3',
        },
      ],
      'form_record_list_1': null,
      'page1': null,
      'form_input_5': null,
      'form_select_list_4': null,
      'form_date_picker_7': null,
      'form_record_list_3': null,
      'page2': null,
      'form_text_area_4': null,
      'form_checkbox_4': null,
      'form_date_picker_8': null,
      'form_input_4': null,
      'form_date_picker_5': null,
      'form_text_area_3': null,
      'form_date_picker_6': null,
      'form_select_list_3': null,
      'form_checkbox_3': null,
      'first_name': null,
      'last_name': null,
    });
  });
});
