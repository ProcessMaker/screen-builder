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
});