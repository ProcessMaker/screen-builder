describe('select list mustache', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.route(
      'POST',
      '/api/1.0/requests/data_sources/2',
      JSON.stringify({
        'status': 200,
        'response': {
          'data': [{
            'id': 1,
            'created_by_id': 2,
            'updated_by_id': 2,
            'created_at': '2021-11-08 10:29:56',
            'updated_at': '2021-11-08 10:29:56',
            'data': {
              'dni': '1234',
              'name': {
                'last': 'Smith',
                'first': 'Oliver',
              },
              'id': 1,
            },
            'collection_id': 1,
            'title': '1',
            'created_by': {
              'id': 2,
              'email': 'admin@processmaker.com',
            },
            'updated_by': {
              'id': 2,
              'email': 'admin@processmaker.com',
            },
          }, {
            'id': 2,
            'created_by_id': 2,
            'updated_by_id': 2,
            'created_at': '2021-11-08 10:29:56',
            'updated_at': '2021-11-08 10:29:56',
            'data': {
              'dni': '5678',
              'name': {
                'last': 'Doe',
                'first': 'John',
              },
              'id': 2,
            },
            'collection_id': 1,
            'title': '2',
            'created_by': {
              'id': 2,
              'email': 'admin@processmaker.com',
            },
            'updated_by': {
              'id': 2,
              'email': 'admin@processmaker.com',
            },
          }],
          'meta': {
            'filter': '',
            'sort_by': '',
            'sort_order': '',
            'count': 2,
            'total_pages': 1,
            'current_page': 1,
            'from': 1,
            'last_page': 1,
            'path': '/api/1.0/collections/1/records',
            'per_page': 9223372036854775807,
            'to': 2,
            'total': 2,
          },
        },
      })
    ).as('executeScript');
  });


  it('Verify select list mustache + collection', () => {
    cy.loadFromJson('select_list_collection.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption('1234');
    // Select property `data.name`
    cy.get('[data-cy="screen-field-form_select_list_2"]').selectOption('Oliver');
    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_3"]').selectOption('DNI: 1234 Name: Oliver Smith');
    // Select data.dni
    cy.get('[data-cy="screen-field-form_select_list_4"]').selectOption('Oliver Smith');
    // Select {{ data.name.first }} {{ data.name.last }}
    cy.get('[data-cy="screen-field-form_select_list_5"]').selectOption('Oliver Smith');
    // Select {{ data.id }}
    cy.get('[data-cy="screen-field-form_select_list_6"]').selectOption('Oliver Smith');

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });
  });

  it('Verify radio list mustache + collection', () => {
    cy.loadFromJson('select_list_radio_collection.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_1"]').parent().find('label:contains("1234")').click();
    // Select property `data.name`
    cy.get('[data-cy="screen-field-form_select_list_2"]').parent().find('label:contains("Oliver")').click();
    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_3"]').parent().find('label:contains("DNI: 1234 Name: Oliver Smith")').click();
    // Select data.dni
    cy.get('[data-cy="screen-field-form_select_list_4"]').parent().find('label:contains("Oliver Smith")').click();
    // Select {{ data.name.first }} {{ data.name.last }}
    cy.get('[data-cy="screen-field-form_select_list_5"]').parent().find('label:contains("Oliver Smith")').click();
    // Select {{ data.id }}
    cy.get('[data-cy="screen-field-form_select_list_6"]').parent().find('label:contains("Oliver Smith")').click();

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });
  });

  it('Verify check list mustache + collection', () => {
    cy.loadFromJson('select_list_checkbox_collection.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_1"]').parent().find('label:contains("1234")').click();
    cy.get('[data-cy="screen-field-form_select_list_1"]').parent().find('label:contains("5678")').click();
    // Select property `data.name`
    cy.get('[data-cy="screen-field-form_select_list_2"]').parent().find('label:contains("Oliver")').click();
    cy.get('[data-cy="screen-field-form_select_list_2"]').parent().find('label:contains("John")').click();
    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_3"]').parent().find('label:contains("DNI: 1234 Name: Oliver Smith")').click();
    cy.get('[data-cy="screen-field-form_select_list_3"]').parent().find('label:contains("DNI: 5678 Name: John Doe")').click();
    // Select data.dni
    cy.get('[data-cy="screen-field-form_select_list_4"]').parent().find('label:contains("Oliver Smith")').click();
    cy.get('[data-cy="screen-field-form_select_list_4"]').parent().find('label:contains("John Doe")').click();
    // Select {{ data.name.first }} {{ data.name.last }}
    cy.get('[data-cy="screen-field-form_select_list_5"]').parent().find('label:contains("Oliver Smith")').click();
    cy.get('[data-cy="screen-field-form_select_list_5"]').parent().find('label:contains("John Doe")').click();
    // Select {{ data.id }}
    cy.get('[data-cy="screen-field-form_select_list_6"]').parent().find('label:contains("Oliver Smith")').click();
    cy.get('[data-cy="screen-field-form_select_list_6"]').parent().find('label:contains("John Doe")').click();

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_2': [
        {
          'last': 'Smith',
          'first': 'Oliver',
        },
        {
          'last': 'Doe',
          'first': 'John',
        },
      ],
      'form_select_list_3': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_4': [
        '1',
        '2',
      ],
      'form_select_list_5': [
        'Oliver Smith',
        'John Doe',
      ],
      'form_select_list_6': [
        '1',
        '2',
      ],
    });
  });

  it('Verify multiselect list mustache + collection', () => {
    cy.loadFromJson('select_list_multiselect_collection.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption('1234');
    cy.get('[data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy="screen-field-form_select_list_1"] li:contains("5678")').click();
    // Select property `data.name`
    cy.get('[data-cy="screen-field-form_select_list_2"]').selectOption('Oliver');
    cy.get('[data-cy="screen-field-form_select_list_2"]').click();
    cy.get('[data-cy="screen-field-form_select_list_2"] li:contains("John")').click();
    // Select all the row
    cy.get('[data-cy="screen-field-form_select_list_3"]').selectOption('DNI: 1234 Name: Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_3"]').click();
    cy.get('[data-cy="screen-field-form_select_list_3"] li:contains("DNI: 5678 Name: John Doe")').click();
    // Select data.dni
    cy.get('[data-cy="screen-field-form_select_list_4"]').selectOption('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_4"]').click();
    cy.get('[data-cy="screen-field-form_select_list_4"] li:contains("John Doe")').click();
    // Select {{ data.name.first }} {{ data.name.last }}
    cy.get('[data-cy="screen-field-form_select_list_5"]').selectOption('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_5"]').click();
    cy.get('[data-cy="screen-field-form_select_list_5"] li:contains("John Doe")').click();
    // Select {{ data.id }}
    cy.get('[data-cy="screen-field-form_select_list_6"]').selectOption('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_6"]').click();
    cy.get('[data-cy="screen-field-form_select_list_6"] li:contains("John Doe")').click();

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_2': [
        {
          'last': 'Smith',
          'first': 'Oliver',
        },
        {
          'last': 'Doe',
          'first': 'John',
        },
      ],
      'form_select_list_3': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_4': [
        '1',
        '2',
      ],
      'form_select_list_5': [
        'Oliver Smith',
        'John Doe',
      ],
      'form_select_list_6': [
        '1',
        '2',
      ],
    });
  });

  it('Verify Load values in select list mustache + collection', () => {
    cy.loadFromJson('select_list_collection.json', 0);
    cy.setPreviewDataInput({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });

    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__single').contains('1234');
    cy.get('[data-cy="screen-field-form_select_list_2"] .multiselect__single').contains('Oliver');
    cy.get('[data-cy="screen-field-form_select_list_3"] .multiselect__single').contains('DNI: 1234 Name: Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_4"] .multiselect__single').contains('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_5"] .multiselect__single').contains('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_6"] .multiselect__single').contains('Oliver Smith');

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });
  });

  it('Verify Load values in select list mustache + collection', () => {
    cy.loadFromJson('select_list_collection.json', 0);
    cy.setPreviewDataInput({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });

    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__single').contains('1234');
    cy.get('[data-cy="screen-field-form_select_list_2"] .multiselect__single').contains('Oliver');
    cy.get('[data-cy="screen-field-form_select_list_3"] .multiselect__single').contains('DNI: 1234 Name: Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_4"] .multiselect__single').contains('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_5"] .multiselect__single').contains('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_6"] .multiselect__single').contains('Oliver Smith');

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });
  });

  it('Verify Load values in radio list mustache + collection', () => {
    cy.loadFromJson('select_list_radio_collection.json', 0);
    cy.setPreviewDataInput({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });

    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy="screen-field-form_select_list_1"] + .form-check-label:contains("1234")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_2"] + .form-check-label:contains("Oliver")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_3"] + .form-check-label:contains("DNI: 1234 Name: Oliver Smith")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_4"] + .form-check-label:contains("Oliver Smith")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_5"] + .form-check-label:contains("Oliver Smith")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_6"] + .form-check-label:contains("Oliver Smith")').parent().find('input').should('be.checked');

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_2': {
        'last': 'Smith',
        'first': 'Oliver',
      },
      'form_select_list_3': {
        'dni': '1234',
        'name': {
          'last': 'Smith',
          'first': 'Oliver',
        },
        'id': 1,
      },
      'form_select_list_4': '1',
      'form_select_list_5': 'Oliver Smith',
      'form_select_list_6': '1',
    });
  });

  it('Verify Load value in check list mustache + collection', () => {
    cy.loadFromJson('select_list_checkbox_collection.json', 0);
    cy.setPreviewDataInput({
      'form_select_list_1': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_2': [
        {
          'last': 'Smith',
          'first': 'Oliver',
        },
        {
          'last': 'Doe',
          'first': 'John',
        },
      ],
      'form_select_list_3': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_4': [
        '1',
        '2',
      ],
      'form_select_list_5': [
        'Oliver Smith',
        'John Doe',
      ],
      'form_select_list_6': [
        '1',
        '2',
      ],
    });
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy="screen-field-form_select_list_1"] + .form-check-label:contains("1234")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_1"] + .form-check-label:contains("5678")').parent().find('input').should('be.checked');

    cy.get('[data-cy="screen-field-form_select_list_2"] + .form-check-label:contains("Oliver")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_2"] + .form-check-label:contains("John")').parent().find('input').should('be.checked');

    cy.get('[data-cy="screen-field-form_select_list_3"] + .form-check-label:contains("DNI: 1234 Name: Oliver Smith")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_3"] + .form-check-label:contains("DNI: 5678 Name: John Doe")').parent().find('input').should('be.checked');

    cy.get('[data-cy="screen-field-form_select_list_4"] + .form-check-label:contains("Oliver Smith")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_4"] + .form-check-label:contains("John Doe")').parent().find('input').should('be.checked');

    cy.get('[data-cy="screen-field-form_select_list_5"] + .form-check-label:contains("Oliver Smith")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_5"] + .form-check-label:contains("John Doe")').parent().find('input').should('be.checked');

    cy.get('[data-cy="screen-field-form_select_list_6"] + .form-check-label:contains("Oliver Smith")').parent().find('input').should('be.checked');
    cy.get('[data-cy="screen-field-form_select_list_6"] + .form-check-label:contains("John Doe")').parent().find('input').should('be.checked');

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_2': [
        {
          'last': 'Smith',
          'first': 'Oliver',
        },
        {
          'last': 'Doe',
          'first': 'John',
        },
      ],
      'form_select_list_3': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_4': [
        '1',
        '2',
      ],
      'form_select_list_5': [
        'Oliver Smith',
        'John Doe',
      ],
      'form_select_list_6': [
        '1',
        '2',
      ],
    });
  });

  it('Verify Load values in multiselect list mustache + collection', () => {
    cy.loadFromJson('select_list_multiselect_collection.json', 0);
    cy.setPreviewDataInput({
      'form_select_list_1': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'id': 2,
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
        },
      ],
      'form_select_list_2': [
        {
          'last': 'Smith',
          'first': 'Oliver',
        },
        {
          'last': 'Doe',
          'first': 'John',
        },
      ],
      'form_select_list_3': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_4': [
        '1',
        '2',
      ],
      'form_select_list_5': [
        'Oliver Smith',
        'John Doe',
      ],
      'form_select_list_6': [
        '1',
        '2',
      ],
    });
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__tag:contains("1234")').contains('1234');
    cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__tag:contains("5678")').contains('5678');

    cy.get('[data-cy="screen-field-form_select_list_2"] .multiselect__tag:contains("Oliver")').contains('Oliver');
    cy.get('[data-cy="screen-field-form_select_list_2"] .multiselect__tag:contains("John")').contains('John');

    cy.get('[data-cy="screen-field-form_select_list_3"] .multiselect__tag:contains("DNI: 1234 Name: Oliver Smith")').contains('DNI: 1234 Name: Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_3"] .multiselect__tag:contains("DNI: 5678 Name: John Doe")').contains('DNI: 5678 Name: John Doe');

    cy.get('[data-cy="screen-field-form_select_list_4"] .multiselect__tag:contains("Oliver Smith")').contains('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_4"] .multiselect__tag:contains("John Doe")').contains('John Doe');

    cy.get('[data-cy="screen-field-form_select_list_5"] .multiselect__tag:contains("Oliver Smith")').contains('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_5"] .multiselect__tag:contains("John Doe")').contains('John Doe');

    cy.get('[data-cy="screen-field-form_select_list_6"] .multiselect__tag:contains("Oliver Smith")').contains('Oliver Smith');
    cy.get('[data-cy="screen-field-form_select_list_6"] .multiselect__tag:contains("John Doe")').contains('John Doe');

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_2': [
        {
          'last': 'Smith',
          'first': 'Oliver',
        },
        {
          'last': 'Doe',
          'first': 'John',
        },
      ],
      'form_select_list_3': [
        {
          'dni': '1234',
          'name': {
            'last': 'Smith',
            'first': 'Oliver',
          },
          'id': 1,
        },
        {
          'dni': '5678',
          'name': {
            'last': 'Doe',
            'first': 'John',
          },
          'id': 2,
        },
      ],
      'form_select_list_4': [
        '1',
        '2',
      ],
      'form_select_list_5': [
        'Oliver Smith',
        'John Doe',
      ],
      'form_select_list_6': [
        '1',
        '2',
      ],
    });
  });
});
