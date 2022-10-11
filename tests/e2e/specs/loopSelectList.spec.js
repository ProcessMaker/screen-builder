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
    });
  
    it('Verify number of service calls for loop that contains a multiselect list', () => {  
      cy.loadFromJson('loop_select_list.json', 0);
      cy.get('[data-cy=mode-preview]').click();
      cy.wait('@executeScript');
      cy.wait('@executeScript');
      cy.wait('@executeScript');
      cy.wait('@executeScript');
      cy.wait('@executeScript');
      cy.wait(1000);
  
      cy.get('@executeScript.all').should('have.length', 6)
    });
  });