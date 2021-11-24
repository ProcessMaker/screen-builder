describe('Select List with DataSource', () => {
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

  it('Verify Load values in select list using mustache from root data from DataSource', () => {
    cy.loadFromJson('select_list_datasource.json', 0);
    cy.setPreviewDataInput({
      'form_select_list_1': {
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
      },
    });

    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__single').contains('1');

    // Check the data of the screen
    cy.assertPreviewData({
      'form_select_list_1': {
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
      },
    });
  });
});
