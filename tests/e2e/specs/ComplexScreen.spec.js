import moment from 'moment';

describe('Complex screen', () => {
  const today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  const today_date = moment(today).format('YYYY-MM-DD');

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

    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        'form_input_1': '12345678',
        'form_text_area_1': 'Hello!',
        'form_select_list_1': 'a',
        'form_checkbox_1': true,
        'form_date_picker_1': today_date,
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
            'row_id': record_row_id,
          },
        ],
        'page1': null,
        'form_input_5': '',
        'form_select_list_4': null,
        'form_date_picker_7': null,
        'form_record_list_3': null,
        'page2': null,
        'form_text_area_4': '',
        'form_checkbox_4': false,
        'form_date_picker_8': null,
        'form_input_4': '',
        'form_date_picker_5': null,
        'form_text_area_3': '',
        'form_date_picker_6': null,
        'form_select_list_3': null,
        'form_checkbox_3': false,
      });
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
    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        'form_input_1': '12345678',
        'form_text_area_1': 'Hello!',
        'form_select_list_1': 'a',
        'form_checkbox_1': true,
        'form_date_picker_1': today_date,
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
            'row_id': record_row_id,
          },
        ],
        'page1': 1,
        'form_input_5': 'form input 5',
        'form_select_list_4': 'foo',
        'form_date_picker_7': now.toISOString(),
        'form_record_list_3': null,
        'page2': null,
        'form_text_area_4': 'form text area 4',
        'form_checkbox_4': true,
        'form_date_picker_8': now.toISOString(),
        'form_input_4': 'form input 4',
        'form_date_picker_5': today_date,
        'form_text_area_3': 'form text area 3',
        'form_date_picker_6': now.toISOString(),
        'form_select_list_3': null,
        'form_checkbox_3': true,
      });
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

    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const row_id0 = data.loop[0].form_record_list_2[0].row_id;
      const row_id1 = data.loop[1].form_record_list_2[0].row_id;
      const row_id2 = data.loop[2].form_record_list_2[0].row_id;
      const row_id3 = data.loop[3].form_record_list_2[0].row_id;
      const record_row_id = data.form_record_list_1[0].row_id;

      expect(data).to.eql({
        'form_input_1': '12345678',
        'form_text_area_1': 'Hello!',
        'form_select_list_1': 'a',
        'form_checkbox_1': true,
        'form_date_picker_1': today_date,
        'form_date_picker_2': now.toISOString(),
        'loop': [
          {
            'form_input_2': 'input in loop 1',
            'form_input_6': 'input 6 in loop 1',
            'form_input_3': 'info@processmaker.com',
            'form_text_area_2': 'form text area 2',
            'form_select_list_2': '2',
            'form_checkbox_2': false,
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id0,
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
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id1,
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
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id2,
              },
            ],
            'season': 2000,
          },
          {
            'form_input_3': 'info@processmaker.com',
            'form_text_area_2': 'form text area 2',
            'form_select_list_2': '2',
            'form_checkbox_2': false,
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id3,
              },
            ],
            'season': 2000,
          },
        ],
        'form_record_list_1': [
          {
            'first_name': 'Thomas A.',
            'last_name': 'Anderson',
            'row_id': record_row_id,
          },
        ],
        'page1': 1,
        'form_input_5': 'form input 5',
        'form_select_list_4': 'foo',
        'form_date_picker_7': now.toISOString(),
        'form_record_list_3': null,
        'page2': 1,
        'form_text_area_4': 'form text area 4',
        'form_checkbox_4': true,
        'form_date_picker_8': now.toISOString(),
        'form_input_4': 'form input 4',
        'form_date_picker_5': today_date,
        'form_text_area_3': 'form text area 3',
        'form_date_picker_6': now.toISOString(),
        'form_select_list_3': null,
        'form_checkbox_3': true,
      });
    });
  });

  it('Fill page 4', () => {
    // Next Page
    cy.get('[data-cy=preview-content] button:contains(Page Navigation >>)').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]').clear().type('form input 1');
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('123');
    cy.get('[data-cy=preview-content] [name=form_input_3]').clear().type('123.45');
    cy.get('[data-cy=preview-content] [name=form_input_4]').type('19.21');
    cy.get('[data-cy=preview-content] [name=form_input_5]').clear().type('123.45');
    cy.get('[data-cy=preview-content] [name=form_input_6]').clear().type(moment(now).format('YYYY-MM-DD HH:mm'));
    cy.get('[data-cy=preview-content] [name=form_input_7]').clear().type(moment(now).format('YYYY-MM-DD HH:mm'));
    cy.get('[data-cy=preview-content] [name=form_input_8]').type('password');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').selectOption('b');
    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_2]').should('be.checked');
    cy.get('[data-cy=preview-content] [name=form_checkbox_5]').parent().click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_6]').should('be.checked');
    cy.get('[data-cy=preview-content] [name=form_select_list_3]').eq(1).click();
    cy.get('[data-cy=preview-content] [name=form_select_list_4]').eq(1).click(); // Select b
    cy.get('[data-cy=preview-content] [name=form_select_list_4]').eq(2).click(); // Select c
    // record list - complete new fields
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=email]').clear().type('thomas@processmaker.com');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=url]').clear().type('https://thomas.processmaker.com');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Save)').click();
    // checkboxes
    cy.get('[data-cy=preview-content] [name=form_checkbox_9]').click();
    cy.get('[data-cy=preview-content] [name=form_checkbox_10]').click();
    // inputs in a loop
    cy.get('[data-cy=preview-content] [name=form_input_9]').eq(0).clear().type('input in loop 1');
    cy.get('[data-cy=preview-content] [name=form_input_9]').eq(0).clear().type('form input 1');
    cy.get('[data-cy=preview-content] [name=form_input_9]').eq(1).clear().type('form input 1');
    cy.get('[data-cy=preview-content] [name=form_input_9]').eq(2).clear().type('form input 1');
    cy.get('[data-cy=preview-content] [name=form_input_9]').eq(3).clear().type('form input 1');
    // Upload file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    })).as('uploadFile');
    cy.uploadFile('[data-cy=preview-content] [data-cy="screen-field-nested_file"] input[type=file]', 'avatar.jpeg', 'image/jpg');
    // Mock uploaded file
    files.page1.push({
      file_name: 'avatar.jpeg',
    });
    cy.wait('@uploadFile');
    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const row_id0 = data.loop[0].form_record_list_2[0].row_id;
      const row_id1 = data.loop[1].form_record_list_2[0].row_id;
      const row_id2 = data.loop[2].form_record_list_2[0].row_id;
      const row_id3 = data.loop[3].form_record_list_2[0].row_id;
      const record_row_id = data.form_record_list_1[0].row_id;

      expect(data).to.eql({
        'form_input_1': 'form input 1',
        'form_text_area_1': 'Hello!',
        'form_select_list_1': 'b',
        'form_checkbox_1': false,
        'form_date_picker_1': today_date,
        'form_date_picker_2': now.toISOString(),
        'loop': [
          {
            'form_input_2': 'input in loop 1',
            'form_input_6': 'input 6 in loop 1',
            'form_input_3': 'info@processmaker.com',
            'form_text_area_2': 'form text area 2',
            'form_select_list_2': '2',
            'form_checkbox_2': false,
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id0,
              },
            ],
            'season': 2000,
            'form_input_9': 'form input 1',
          },
          {
            'form_input_2': 'input in loop 2',
            'form_input_6': 'input 6 in loop 2',
            'form_input_3': 'info@processmaker.com',
            'form_text_area_2': 'form text area 2',
            'form_select_list_2': '2',
            'form_checkbox_2': false,
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id1,
              },
            ],
            'season': 2000,
            'form_input_9': 'form input 1',
          },
          {
            'form_input_2': 'input in loop 3',
            'form_input_6': 'input 6 in loop 3',
            'form_input_3': 'info@processmaker.com',
            'form_text_area_2': 'form text area 2',
            'form_select_list_2': '2',
            'form_checkbox_2': false,
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id2,
              },
            ],
            'season': 2000,
            'form_input_9': 'form input 1',
          },
          {
            'form_input_3': 'info@processmaker.com',
            'form_text_area_2': 'form text area 2',
            'form_select_list_2': '2',
            'form_checkbox_2': false,
            'form_date_picker_3': today_date,
            'form_date_picker_4': now.toISOString(),
            'form_record_list_2': [
              {
                'first_name': 'Thomas A.',
                'last_name': 'Anderson',
                'row_id': row_id3,
              },
            ],
            'season': 2000,
            'form_input_9': 'form input 1',
          },
        ],
        'form_record_list_1': [
          {
            'first_name': 'Thomas A.',
            'last_name': 'Anderson',
            'email': 'thomas@processmaker.com',
            'url': 'https://thomas.processmaker.com',
            'row_id': record_row_id,
          },
        ],
        'page1': 1,
        'form_input_5': 123.45,
        'form_select_list_4': [
          'b',
          'c',
        ],
        'form_date_picker_7': now.toISOString(),
        'form_record_list_3': null,
        'page2': 1,
        'form_text_area_4': 'form text area 4',
        'form_checkbox_4': true,
        'form_date_picker_8': now.toISOString(),
        'form_input_4': 4.21,
        'form_date_picker_5': today_date,
        'form_text_area_3': 'form text area 3',
        'form_date_picker_6': now.toISOString(),
        'form_select_list_3': 'b',
        'form_checkbox_3': true,
        'form_input_2': 123,
        'form_input_6': moment(now).format('YYYY-MM-DD HH:mm'),
        'form_text_area_2': '',
        'form_select_list_2': [],
        'form_input_3': 12345,
        'form_input_7': moment(now).format('YYYY-MM-DD'),
        'form_input_8': 'password',
        'form_checkbox_5': true,
        'form_checkbox_2': true,
        'form_checkbox_6': true,
        'form_checkbox_7': false,
        'form_date_picker_3': null,
        'form_checkbox_8': true,
        'form_date_picker_4': null,
        'nested_file': 1,
        'form_checkbox_9': true,
        'form_checkbox_10': true,
      });
    });
  });
});
