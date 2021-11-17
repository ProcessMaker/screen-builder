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
});