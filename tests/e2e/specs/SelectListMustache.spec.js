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
                'last': 'Callizaya',
                'first': 'David',
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
                'last': 'Loayza',
                'first': 'Dante',
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

  it('Verify select list mustache + data source', () => {
    cy.loadFromJson('select_list_mustache.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption('id: 2');

    // Check the data of the screen
    cy.assertPreviewData({
      form_select_list_1: {
        'dni': '5678',
        'name': {
          'last': 'Loayza',
          'first': 'Dante',
        },
        'id': 2,
      },
    });
  });

  it('Verify select list mustache + data source with custom key', () => {
    cy.loadFromJson('select_list_mustache_custom_key.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption('id: 2');

    // Check the data of the screen
    cy.assertPreviewData({
      form_select_list_1: {
        'dni': '5678',
        'name': {
          'last': 'Loayza',
          'first': 'Dante',
        },
        'id': 2,
      },
    });
  });

  it('Verify select list simple array of options', () => {
    cy.loadFromJson('select_list_array_data.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption('two');

    // Check the data of the screen
    cy.assertPreviewData({
      form_select_list_1: '2',
    });
  });

  it('Verify select list mustache with request data', () => {
    cy.loadFromJson('select_list_mustache_request_data.json', 0);
    // Setup Request Data
    cy.setPreviewDataInput({
      array: [
        {
          'id': '1',
          'content': 'one',
        },
        {
          'id': '2',
          'content': 'two',
        },
      ],
    });
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption('id: 2 two');

    // Check the data of the screen
    cy.assertPreviewData({
      array: [
        {
          'id': '1',
          'content': 'one',
        },
        {
          'id': '2',
          'content': 'two',
        },
      ],
      form_select_list_1: '2',
    });
  });
});