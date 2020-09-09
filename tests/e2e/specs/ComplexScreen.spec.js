describe('Complex screen', () => {
  const today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);

  const now = new Date();
  now.setUTCHours(8);
  now.setUTCMinutes(15);
  now.setUTCSeconds(0);
  now.setUTCMilliseconds(0);

  before(() => {
    cy.visit('/');
    cy.server();
    cy.window().then(win => {
      win.PM4ConfigOverrides = {
        postFileEndpoint: '/api/1.0/requests/1/files',
      };
    });
    cy.mockComponent('SavedSearchChart').then(() => {
      cy.loadFromJson('complex_screen.json', 1);
    });
  });

  beforeEach(() => {
    cy.server();
  });

  it('Fill page 1', () => {
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('12345678');
    cy.get('[data-cy=preview-content] [name=form_input_1]').should('have.value', '12345678');

    cy.get('[data-cy=preview-content] [name=form_text_area_1]').type('Hello!');
    cy.get('[data-cy=preview-content] [name=form_text_area_1]').should('have.value', 'Hello!');

    cy.setMultiselect('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]', 'a');

    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').click();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]').pickToday();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_2"]').pickTodayWithTime('08', '15', 'AM');

    cy.get('[data-cy=preview-content] [name=form_input_2]').eq(0).clear().type('input in loop 1');
    cy.get('[data-cy=preview-content] [name=form_input_2]').eq(1).clear().type('input in loop 2');
    cy.get('[data-cy=preview-content] [name=form_input_2]').eq(2).clear().type('input in loop 3');

    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=first_name]').clear().type('Thomas');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=last_name]').clear().type('Anderson');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]').eq(0).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=first_name]').type(' A.');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Save)').click();

    // Upload file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy="screen-field-page1"] input[type=file]', 'avatar.jpeg', 'image/jpg');

    cy.assertPreviewData({
      'form_input_1': '12345678',
      'form_text_area_1': 'Hello!',
      'form_select_list_1': 'a',
      'form_checkbox_1': true,
      'form_date_picker_1': '2020-09-09T00:00:00.000Z',
      'form_date_picker_2': '2020-09-09T08:15:00.000Z',
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
      'form_record_list_1': [
        {
          'first_name': 'Thomas A.',
          'last_name': 'Anderson',
        },
      ],
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

  it('Fill page 2', () => {
    // Next Page
    cy.get('[data-cy=preview-content] button:contains(Page Navigation >>)').click();

    cy.get('[data-cy=preview-content] [name=form_input_5]').type('form input 5');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_4"]').selectOption('foo');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_7"]').pickTodayWithTime('08', '15', 'AM');

    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_3] [data-cy=add-row]').click();
    cy.get('[data-cy=modal-not-assigned] button.btn-primary').click();

    cy.get('[data-cy=preview-content] [name=form_text_area_4]').type('form text area 4');

    cy.get('[data-cy=preview-content] [name=form_checkbox_4]').click();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_8"]').pickTodayWithTime('08', '15', 'AM');

    cy.get('[data-cy=preview-content] [name=form_input_6]').eq(0).clear().type('input 6 in loop 1');
    cy.get('[data-cy=preview-content] [name=form_input_6]').eq(1).clear().type('input 6 in loop 2');
    cy.get('[data-cy=preview-content] [name=form_input_6]').eq(2).clear().type('input 6 in loop 3');

    cy.get('[data-cy=preview-content] [name=form_input_4]').type('form input 4');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_5"]').pickToday();

    cy.get('[data-cy=preview-content] [name=form_text_area_3]').type('form text area 3');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_6"]').pickTodayWithTime('08', '15', 'AM');

    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_3"]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_3"]').should('contain.text', 'No Data Available');

    cy.get('[data-cy=preview-content] [name=form_checkbox_3]').click();

    // Upload file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy="screen-field-page2"] input[type=file]', 'avatar.jpeg', 'image/jpg');

    cy.assertPreviewData({
      'form_input_1': '12345678',
      'form_text_area_1': 'Hello!',
      'form_select_list_1': 'a',
      'form_checkbox_1': true,
      'form_date_picker_1': '2020-09-09T00:00:00.000Z',
      'form_date_picker_2': '2020-09-09T08:15:00.000Z',
      'loop': [
        {
          'form_input_2': 'input in loop 1',
          'form_input_6': 'input 6 in loop 1',
        },
        {
          'form_input_2': 'input in loop 2',
          'form_input_6': 'input 6 in loop 2',
        },
        {
          'form_input_2': 'input in loop 3',
          'form_input_6': 'input 6 in loop 3',
        },
      ],
      'form_record_list_1': [
        {
          'first_name': 'Thomas A.',
          'last_name': 'Anderson',
        },
      ],
      'page1': 'avatar.jpeg',
      'form_input_5': 'form input 5',
      'form_select_list_4': 'foo',
      'form_date_picker_7': '2020-09-09T08:15:00.000Z',
      'form_record_list_3': null,
      'page2': null,
      'form_text_area_4': 'form text area 4',
      'form_checkbox_4': true,
      'form_date_picker_8': '2020-09-09T08:15:00.000Z',
      'form_input_4': 'form input 4',
      'form_date_picker_5': '2020-09-09T00:00:00.000Z',
      'form_text_area_3': 'form text area 3',
      'form_date_picker_6': '2020-09-09T08:15:00.000Z',
      'form_select_list_3': null,
      'form_checkbox_3': true,
      'first_name': null,
      'last_name': null,
    });
  });
});
