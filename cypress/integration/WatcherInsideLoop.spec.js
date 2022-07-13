describe('watcher inside loop', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.route(
      'POST',
      '/api/1.0/scripts/execute/6',
      JSON.stringify({
        output: {
          foo: 'bar',
        },
      })
    ).as('executeScript');
  });

  it('Verify watcher is placed inside loop', () => {
    cy.loadFromJson('watcher_inside_loop.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Check the data of the screen
    cy.assertPreviewData({
      'loop_1': [
        {
          'form_input_1': '',
          'inside_loop': null,
        },
        {
          'form_input_1': '',
          'inside_loop': null,
        },
        {
          'form_input_1': '',
          'inside_loop': null,
        },
      ],
    });

    // Change form_input_1 to trigger watcher in the first loop
    cy.get('[data-cy="screen-field-form_input_1"]').eq(0).type('foo');
    cy.wait('@executeScript');
    // Check the data of the screen
    cy.assertPreviewData({
      'loop_1': [
        {
          'form_input_1': 'foo',
          'inside_loop': {
            foo: 'bar',
          },
        },
        {
          'form_input_1': '',
          'inside_loop': null,
        },
        {
          'form_input_1': '',
          'inside_loop': null,
        },
      ],
    });

    // Change form_input_1 to trigger watcher in the second loop
    cy.get('[data-cy="screen-field-form_input_1"]').eq(1).type('foo');
    cy.wait('@executeScript');
    // Check the data of the screen
    cy.assertPreviewData({
      'loop_1': [
        {
          'form_input_1': 'foo',
          'inside_loop': {
            foo: 'bar',
          },
        },
        {
          'form_input_1': 'foo',
          'inside_loop': {
            foo: 'bar',
          },
        },
        {
          'form_input_1': '',
          'inside_loop': null,
        },
      ],
    });

    // Change form_input_1 to trigger watcher in the third loop
    cy.get('[data-cy="screen-field-form_input_1"]').eq(2).type('foo');
    cy.wait('@executeScript');
    // Check the data of the screen
    cy.assertPreviewData({
      'loop_1': [
        {
          'form_input_1': 'foo',
          'inside_loop': {
            foo: 'bar',
          },
        },
        {
          'form_input_1': 'foo',
          'inside_loop': {
            foo: 'bar',
          },
        },
        {
          'form_input_1': 'foo',
          'inside_loop': {
            foo: 'bar',
          },
        },
      ],
    });

  });
});
