describe('Nested screen', () => {

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/api/1.0/screens/1', JSON.stringify({
      id: 1,
      screen_category_id: 1,
      title: 'Sub screen example',
      description: 'A sub screen example',
      type: 'FORM',
      config: [
        {
          name: 'Sub screen example',
          items: [
            {
              'config': {
                'icon': 'far fa-square',
                'label': 'First name',
                'name': 'firstname',
                'placeholder': '',
                'validation': '',
                'helper': null,
                'type': 'text',
                'dataFormat': 'string',
                'customCssSelector': 'first-name',
              },
              'inspector': [],
              'component': 'FormInput',
              'editor-component': 'FormInput',
              'editor-control': 'FormInput',
              'label': 'Line Input',
              'value': '__vue_devtool_undefined__',
            },
            {
              'config': {
                'icon': 'far fa-square',
                'label': 'Last name',
                'name': 'lastname',
                'placeholder': '',
                'validation': '',
                'helper': null,
                'type': 'text',
                'dataFormat': 'string',
                'customCssSelector': '',
              },
              'inspector': [],
              'component': 'FormInput',
              'editor-component': 'FormInput',
              'editor-control': 'FormInput',
              'label': 'Line Input',
              'value': '__vue_devtool_undefined__',
            },
          ],
        },
      ],
      computed: [],
      watchers: [],
      custom_css: '[selector=\'first-name\'] label { font-style: italic; }',
      status: 'ACTIVE',
    }));
  });

  //it('With a variable defined', () => {
  //  cy.visit('/');
  //  cy.get('[data-cy=controls-FormNestedScreen]').drag('[data-cy=screen-drop-zone]', 'bottom');
  //  cy.get('[data-cy=screen-element-container]').click();
  //  cy.get('[data-cy=inspector-name]').type('person');
  //  cy.get('[data-cy=inspector-screen] div.multiselect').click();
  //  cy.get('[data-cy=inspector-screen] span:contains("Sub screen example"):first').click();
  //  cy.get('[data-cy=mode-preview]').click();
  //  cy.get('[data-cy=preview] input[name="firstname"]').type('Alan');
  //  cy.get('[data-cy=preview] input[name="lastname"]').type('Turing');
  //  cy.get('[data-cy=preview-data-content]').should((a) => {
  //    const person = JSON.parse(a.text().split('{...}').join(''));
  //    expect(person).to.eql({ person: { firstname: 'Alan', lastname: 'Turing' }});
  //  });
  //});

  it('Without a variable defined', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormNestedScreen]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-screen] div.multiselect').click();
    cy.get('[data-cy=inspector-screen] span:contains("Sub screen example"):first').click();
    cy.get('[data-cy=inspector-screen] .screen-link a')
      .should('have.attr', 'href')
      .and('include', '/designer/screen-builder/1/edit');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview] input[name="firstname"]').type('Alan');
    cy.get('[data-cy=preview] input[name="lastname"]').type('Turing');
    cy.get('[data-cy=preview-data-content]').should((a) => {
      const person = JSON.parse(a.text().split('{...}').join(''));
      expect(person).to.eql({ firstname: 'Alan', lastname: 'Turing' });
    });
    cy.get('[data-cy=mode-editor]').click();
  });

  it('With nested screen config.event set to submit', () => {
    cy.visit('/');
    cy.loadFromJson('nested_screen_with_event_submit.json', 1);
    cy.get('[data-cy=screen-element-container]').first().click();
    cy.get('[data-cy=inspector-screen]').should('contain.text', 'Screen');
  });
});
