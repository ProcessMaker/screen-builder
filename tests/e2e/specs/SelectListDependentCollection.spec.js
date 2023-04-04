describe('select list mustache', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');

    cy.route(
      'GET',
      '/api/1.0/collections',
      JSON.stringify({
        'data': [
          { 'id': 88, 'name': 'Collection 1', },
          { 'id': 99, 'name': 'Collection 2', },
        ],
      })
    );
    
    cy.route(
      'GET',
      '/api/1.0/collections/88/columns',
      JSON.stringify({
        'data': [
          { 'label': 'Name', 'field': 'data.name' },
          { 'label': 'Address', 'field': 'data.address' },
        ],
      })
    );
    
    cy.route(
      'GET',
      '/api/1.0/collections/88/records*',
      JSON.stringify({
        'data': [
          { id: 123, data: { name: 'Someone', address: '123 test st.' } },
          { id: 456, data: { name: 'Another', address: '123 fake st.' } },
        ],
      })
    );
    
    cy.route(
      'GET',
      '/api/1.0/collections/3/records*',
      JSON.stringify({
        'data': [
          { id: 123, data: { name: 'California', code: 'CA' } },
          { id: 456, data: { name: 'Nevada', code: 'NV' } },
        ],
      })
    );
    
    cy.route('GET', /collections\/4\/records.*NV/,
      JSON.stringify({
        data: [
          { id: 123, data: { city: 'Las Vegas' } },
          { id: 456, data: { city: 'Reno'} },
        ],
        meta: { total: 400 }
      })
    );
    
    cy.route('GET', /collections\/4\/records.*NV.*(Henderson|789)/,
      JSON.stringify({
        data: [
          { id: 789, data: { city: 'Henderson' } },
        ],
        meta: { total: 1 }
      })
    );
    
    cy.route('GET', /collections\/4\/records.*3344/,
      JSON.stringify({
        data: [],
        meta: { total: 0 }
      })
    );
  });

  it('Configure collection select list', () => {
    cy.get('[data-cy=controls-FormSelectList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-DataSource]').click();

    cy.get('[data-cy=inspector-data-sources]').select('Collection');
    cy.get('[data-cy=inspector-collection]').select('Collection 1');
    cy.get('[data-cy=inspector-collection-label]').select('Name');
    cy.get('[data-cy=inspector-collection-value]').select('Collection Record ID');
    
    cy.get('[data-cy=mode-preview]').click();
    
    // Select a valid option
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption('Another');

    // Assert value is set correctly
    cy.assertPreviewData({
      'form_select_list_1': 456
    });
  });

  it.only('Without dependent list option checked', () => {
    cy.loadFromJson('select_list_dependent_collection.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy="screen-field-state"]').selectOption('Nevada');
    cy.get('[data-cy="screen-field-city"]').selectOption('Henderson');
    cy.assertPreviewData({
      state: 'NV',
      city: 789,
      id_gt_than: '33',
      form_select_list_2: null
    });

    // Without depenedent list option checked, this makes a backend call
    cy.get('[data-cy="screen-field-id_gt_than"]').type('44');

    cy.assertPreviewData({
      state: 'NV',
      city: null, // Reset value since it's not in the results
      id_gt_than: 3344,
      form_select_list_2: null
    });
  });

  it('With dependent list option checked', () => {
  });

  it('With city and set set', () => {
    cy.setPreviewDataInput({
      'city': 123,
      'state': 456,
    });
  });
});