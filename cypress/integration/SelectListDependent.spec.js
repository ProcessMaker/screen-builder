describe('select list mustache', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.route(
      'POST',
      '/api/1.0/requests/data_sources/3',
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
              'id': 1,
              'name': 'Bolivia',
            },
            'collection_id': 3,
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
              'id': 2,
              'name': 'United States',
            },
            'collection_id': 3,
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
            'path': '/api/1.0/collections/3/records',
            'per_page': 9223372036854775807,
            'to': 2,
            'total': 2,
          },
        },
      })
    ).as('executeScript');
    // Bolivia Cities
    const BoliviaCities = [{
      'id': 1,
      'created_by_id': 2,
      'updated_by_id': 2,
      'created_at': '2021-11-08 10:29:56',
      'updated_at': '2021-11-08 10:29:56',
      'data': {
        'id': 1,
        'name': 'La Paz',
      },
      'collection_id': 4,
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
        'id': 2,
        'name': 'Santa Cruz',
      },
      'collection_id': 4,
      'title': '2',
      'created_by': {
        'id': 2,
        'email': 'admin@processmaker.com',
      },
      'updated_by': {
        'id': 2,
        'email': 'admin@processmaker.com',
      },
    }];
    // US Cities
    const USCities = [{
      'id': 3,
      'created_by_id': 2,
      'updated_by_id': 2,
      'created_at': '2021-11-08 10:29:56',
      'updated_at': '2021-11-08 10:29:56',
      'data': {
        'id': 3,
        'name': 'Las Vegas',
      },
      'collection_id': 4,
      'title': '1',
      'created_by': {
        'id': 1,
        'email': 'admin@processmaker.com',
      },
      'updated_by': {
        'id': 1,
        'email': 'admin@processmaker.com',
      },
    }, {
      'id': 4,
      'created_by_id': 2,
      'updated_by_id': 2,
      'created_at': '2021-11-08 10:29:56',
      'updated_at': '2021-11-08 10:29:56',
      'data': {
        'id': 4,
        'name': 'Asheville',
      },
      'collection_id': 4,
      'title': '2',
      'created_by': {
        'id': 2,
        'email': 'admin@processmaker.com',
      },
      'updated_by': {
        'id': 2,
        'email': 'admin@processmaker.com',
      },
    }];
    let cities = [];
    cy.route({
      method: 'POST',
      url: '/api/1.0/requests/data_sources/4',
      onRequest: ({ xhr, request }) => {
        switch (request.body.config.outboundConfig[0].value) {
          case 'data.country_id=1':
            cities = BoliviaCities;
            break;
          case 'data.country_id=2':
            cities = USCities;
            break;
          default:
            cities = [];
        }
        const response = {
          'data': cities,
          'meta': {
            'filter': '',
            'sort_by': '',
            'sort_order': '',
            'count': cities.length,
            'total_pages': 1,
            'current_page': 1,
            'from': 1,
            'last_page': 1,
            'path': '/api/1.0/collections/4/records',
            'per_page': 9223372036854775807,
            'to': cities.length,
            'total': cities.length,
          },
        };
        xhr.setRequestHeader(
          'X-Cypress-Response',
          '"response":' + JSON.stringify(response) + '}',
        );
      },
      response: '{"status": 200',
    });
  });

  it('Verify Load values in multiselect list mustache + collection', () => {
    cy.loadFromJson('select_list_dependent.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Country should be empty
    cy.get('[data-cy="screen-field-country"] .multiselect__placeholder').should('be.visible');
    // City should be empty
    cy.get('[data-cy="screen-field-city"] .multiselect__placeholder').should('be.visible');

    cy.get('[data-cy="screen-field-country"]').selectOption('Bolivia');
    cy.get('[data-cy="screen-field-city"]').selectOption('La Paz');
    cy.get('[data-cy="screen-field-country"]').selectOption('United States');
    // Once selected a different country city should be cleaned
    cy.get('[data-cy="screen-field-city"] .multiselect__placeholder').should('be.visible');
    cy.get('[data-cy="screen-field-city"]').selectOption('Asheville');

    cy.assertPreviewData({
      'country': '2',
      'city': '4',
    });
  });
});
