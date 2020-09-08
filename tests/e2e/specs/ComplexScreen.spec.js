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

    cy.get('[data-cy=preview-content] [name=form_input_5]').type('55555');
    cy.get('[data-cy=preview-content] [name=form_input_5]').should('have.value', '55555');

    cy.get('[data-cy=preview-content] [name=form_text_area_1]').should('have.value', 'Hello!');

    cy.get('[data-cy=preview-content] [name=form_input_2]').type('testing');
    cy.get('[data-cy=preview-content] [name=form_input_2]').should('have.value', 'testing');

    //cy.get('[data-cy=preview-content] [name=form_input_6]').type('text');
    //cy.get('[data-cy=preview-content] [name=form_input_6]').should('have.value', 'text');

    //cy.get('[data-cy=preview-content] [name=form_text_area_2]').type('some large text');
    //cy.get('[data-cy=preview-content] [name=form_text_area_2]').should('have.value', 'some large text');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content] span:contains(a)').should('be.visible');

    cy.assertPreviewData({
      'form_input_1': '12345678',
      'form_input_5': null,
      'form_text_area_1': 'Hello!',
      'form_select_list_1': null,
      'form_input_2': null,
      'form_input_6': null,
      'form_text_area_2': null,
      'form_select_list_2': null,
      'form_input_3': null,
      'form_input_7': null,
      'form_text_area_3': '<h4 style="color:red"><i>HELLO!</i></h4>',
      'form_select_list_3': null,
      'form_input_4': null,
      'form_input_8': null,
      'form_select_list_4': null,
      'form_checkbox_1': null,
      'form_checkbox_5': null,
      'form_date_picker_1': null,
      'form_checkbox_2': true,
      'form_checkbox_6': true,
      'form_date_picker_2': null,
      'form_checkbox_3': null,
      'form_checkbox_7': null,
      'form_date_picker_3': null,
      'form_checkbox_4': true,
      'form_checkbox_8': true,
      'form_date_picker_4': null,
      'form_record_list_1': null,
      'loop': [
        {
          'form_input_9': null,
        },
        {
          'form_input_9': null,
        },
      ],
      'form_checkbox_9': null,
      'form_checkbox_10': null,
      'email': null,
      'url': null,
    });
  });
});
