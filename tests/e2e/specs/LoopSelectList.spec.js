describe('Select List Cache', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.route(
      'GET',
      '/api/1.0/requests/data_sources/3/resources/ListAll/data**',
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
    ).as('getDataSource');
  });

  it('None Cached - Verify number of service calls for loop that contains a multiselect list', () => {
    cy.loadFromJson('loop_select_list.json', 0);
    cy.wait('@getDataSource');     // designer call
    cy.get('[data-cy=mode-preview]').click();
    cy.wait('@getDataSource');
    cy.wait('@getDataSource');
    cy.wait('@getDataSource');
    cy.wait('@getDataSource');
    cy.wait('@getDataSource');
    cy.get('@getDataSource.all').should('have.length', 6);
  });

  it('Cached - Verify number of service calls for loop that contains a multiselect list', () => {
    cy.loadFromJson('loop_select_list.json', 0);

    cy.window().then((win) => {
      win.ProcessMaker.screen = {
        cacheEnabled: true,
        cacheTimeout: 3000
      };
    });
    cy.wait('@getDataSource');  // designer call does not use cache
    cy.get('[data-cy=mode-preview]').click();
    cy.wait('@getDataSource');
    cy.get('@getDataSource.all').should('have.length', 2)
    //testing cacheTimeout
    cy.wait(5000);
    cy.get('[data-cy=mode-preview]').click();
    cy.wait('@getDataSource');
    cy.get('@getDataSource.all').should('have.length', 3)
  });
});