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

  const files= {
    page1: [],
    page2: [],
  };

  before(() => {
    cy.visit('/');
    cy.server();
    cy.window().then(win => {
      // Add request-id header
      const requestIdMeta = window.document.createElement('meta');
      requestIdMeta.setAttribute('name', 'request-id');
      requestIdMeta.setAttribute('content', '1');
      win.document.head.appendChild(requestIdMeta);
    });
    cy.mockComponent('SavedSearchChart').then(() => {
      cy.loadFromJson('complex_screen.json', 1);
    });
  });

  beforeEach(() => {
    cy.server();
    cy.loadFromJson('complex_screen.json');
    cy.route('GET', '/api/1.0/requests/1/files?name=page1', JSON.stringify({data: files.page1}));
    cy.route('GET', '/api/1.0/requests/1/files?name=page2', JSON.stringify({data: files.page2}));
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
    // Mock uploaded file
    files.page1.push({
      file_name: 'avatar.jpeg',
    });

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
    // Mock uploaded file
    files.page2.push({
      file_name: 'avatar.jpeg',
    });

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
      'form_date_picker_7': now.toISOString(),
      'form_record_list_3': null,
      'page2': null,
      'form_text_area_4': 'form text area 4',
      'form_checkbox_4': true,
      'form_date_picker_8': now.toISOString(),
      'form_input_4': 'form input 4',
      'form_date_picker_5': today.toISOString(),
      'form_text_area_3': 'form text area 3',
      'form_date_picker_6': now.toISOString(),
      'form_select_list_3': null,
      'form_checkbox_3': true,
      'first_name': null,
      'last_name': null,
    });
  });

  it('Fill page 3', () => {
    let loop;
    // Next Page
    cy.get('[data-cy=preview-content] button:contains(Page Navigation >>)').click();

    // FILL LOOP 1
    loop = 0;
    cy.get('[data-cy=preview-content] [name=form_input_3]').eq(loop).type('info@processmaker.com');
    cy.get('[data-cy=preview-content] [name=form_text_area_2]').eq(loop).type('form text area 2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_2"]').eq(loop).selectOption('2');
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_3"]').eq(loop).pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_4"]').eq(loop).pickTodayWithTime('08', '15', 'AM');

    // fill grid
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=add-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=first_name]').eq(loop).clear().type('Thomas');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=last_name]').eq(loop).clear().type('Anderson');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] button.btn-primary').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=edit-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] [name=first_name]').eq(loop).type(' A.');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] button:contains(Save)').eq(loop).click();

    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('1999');
    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('2000');

    // FILL LOOP 2
    loop = 1;
    cy.get('[data-cy=preview-content] [name=form_input_3]').eq(loop).type('info@processmaker.com');
    cy.get('[data-cy=preview-content] [name=form_text_area_2]').eq(loop).type('form text area 2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_2"]').eq(loop).selectOption('2');
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_3"]').eq(loop).pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_4"]').eq(loop).pickTodayWithTime('08', '15', 'AM');

    // fill grid
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=add-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=first_name]').eq(loop).clear().type('Thomas');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=last_name]').eq(loop).clear().type('Anderson');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] button.btn-primary').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=edit-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] [name=first_name]').eq(loop).type(' A.');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] button:contains(Save)').eq(loop).click();

    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('1999');
    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('2000');

    // FILL LOOP 3
    loop = 2;
    cy.get('[data-cy=preview-content] [name=form_input_3]').eq(loop).type('info@processmaker.com');
    cy.get('[data-cy=preview-content] [name=form_text_area_2]').eq(loop).type('form text area 2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_2"]').eq(loop).selectOption('2');
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_3"]').eq(loop).pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_4"]').eq(loop).pickTodayWithTime('08', '15', 'AM');

    // fill grid
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=add-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=first_name]').eq(loop).clear().type('Thomas');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=last_name]').eq(loop).clear().type('Anderson');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] button.btn-primary').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=edit-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] [name=first_name]').eq(loop).type(' A.');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] button:contains(Save)').eq(loop).click();

    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('1999');
    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('2000');

    // add loop row
    cy.get('[data-cy=preview-content] [data-cy=loop-loop-add]').click();

    // FILL LOOP 4
    loop = 3;
    cy.get('[data-cy=preview-content] [name=form_input_3]').eq(loop).type('info@processmaker.com');
    cy.get('[data-cy=preview-content] [name=form_text_area_2]').eq(loop).type('form text area 2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_2"]').eq(loop).selectOption('2');
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_3"]').eq(loop).pickToday();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_date_picker_4"]').eq(loop).pickTodayWithTime('08', '15', 'AM');

    // fill grid
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=add-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=first_name]').eq(loop).clear().type('Thomas');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] [name=last_name]').eq(loop).clear().type('Anderson');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-add] button.btn-primary').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=edit-row]').eq(loop).click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] [name=first_name]').eq(loop).type(' A.');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_2] [data-cy=modal-edit] button:contains(Save)').eq(loop).click();

    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('1999');
    cy.get('[data-cy=preview-content] [name=season]').eq(loop).clear().type('2000');

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
          'form_input_6': 'input 6 in loop 1',
          'form_input_3': 'info@processmaker.com',
          'form_text_area_2': 'form text area 2',
          'form_select_list_2': '2',
          'form_checkbox_2': false,
          'form_date_picker_3': today.toISOString(),
          'form_date_picker_4': now.toISOString(),
          'form_record_list_2': [
            {
              'first_name': 'Thomas A.',
              'last_name': 'Anderson',
            },
          ],
          'season': 2000,
        },
        {
          'form_input_2': 'input in loop 2',
          'form_input_6': 'input 6 in loop 2',
          'form_input_3': 'info@processmaker.com',
          'form_text_area_2': 'form text area 2',
          'form_select_list_2': '2',
          'form_checkbox_2': false,
          'form_date_picker_3': today.toISOString(),
          'form_date_picker_4': now.toISOString(),
          'form_record_list_2': [
            {
              'first_name': 'Thomas A.',
              'last_name': 'Anderson',
            },
          ],
          'season': 2000,
        },
        {
          'form_input_2': 'input in loop 3',
          'form_input_6': 'input 6 in loop 3',
          'form_input_3': 'info@processmaker.com',
          'form_text_area_2': 'form text area 2',
          'form_select_list_2': '2',
          'form_checkbox_2': false,
          'form_date_picker_3': today.toISOString(),
          'form_date_picker_4': now.toISOString(),
          'form_record_list_2': [
            {
              'first_name': 'Thomas A.',
              'last_name': 'Anderson',
            },
          ],
          'season': 2000,
        },
        {
          'form_input_3': 'info@processmaker.com',
          'form_text_area_2': 'form text area 2',
          'form_select_list_2': '2',
          'form_checkbox_2': false,
          'form_date_picker_3': today.toISOString(),
          'form_date_picker_4': now.toISOString(),
          'form_record_list_2': [
            {
              'first_name': 'Thomas A.',
              'last_name': 'Anderson',
            },
          ],
          'season': 2000,
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
      'form_date_picker_7': now.toISOString(),
      'form_record_list_3': null,
      'page2': 'avatar.jpeg',
      'form_text_area_4': 'form text area 4',
      'form_checkbox_4': true,
      'form_date_picker_8': now.toISOString(),
      'form_input_4': 'form input 4',
      'form_date_picker_5': today.toISOString(),
      'form_text_area_3': 'form text area 3',
      'form_date_picker_6': now.toISOString(),
      'form_select_list_3': null,
      'form_checkbox_3': true,
      'first_name': null,
      'last_name': null,
    });
  });
});
