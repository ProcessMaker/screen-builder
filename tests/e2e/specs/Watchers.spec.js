describe('Watchers', () => {

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

  it('CRUD of watchers', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    // Create
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click();
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    // Fix invalid config
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setVueComponentValue('[data-cy="watchers-watcher-script_configuration"]', '{"form_input_1":"{{form_input_1}}"}');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Search
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-table-search"]').clear().type('missing');
    cy.get('[data-cy="watchers-table-search-button"]').click();
    cy.get('[data-cy="watchers-table"]').should('not.contain.text', 'missing');
    cy.get('[data-cy="watchers-table-search"]').clear().type('Watcher test');
    cy.get('[data-cy="watchers-table-search-button"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Edit the created watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-table-edit"]:first').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test 2');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click();
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Data Source');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-button-save"]').click();
    // Fix missing endpoint
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-endpoint"]', 'list');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test 2');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Delete the created watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-table-remove"]:first').click();
    cy.get('[data-cy="watchers-table"]').should('not.contain.text', 'Watcher test 2');
    cy.get('[data-cy="watchers-modal"] .close').click();
  });
  it('Test cancel', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.get('[data-cy="watchers-button-cancel"]').click();
    cy.get('[data-cy="watchers-table"]').should('not.contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();
  });
  it('Test variables in multi columns', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormMultiColumn]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container] .column-draggable', 'bottom');
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
  });

  it('Test variables in nested screens', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormNestedScreen]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-screen] div.multiselect').click();
    cy.get('[data-cy=inspector-screen] span:contains("Sub screen example"):first').click();
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'firstname');
    cy.get('[data-cy="watchers-button-cancel"]').click();
    cy.get('[data-cy="watchers-modal"] .close').click();
  });

  it('Create duplicated properties', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    // Create a calculated watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click();
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_1":"{{form_input_1}}"}');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('output');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    // Create a duplicated record
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    // choose save variable
    cy.get('[data-cy="watchers-watcher-variable"]').click();
    cy.get('[data-cy="watchers-watcher-variable"] input').clear().type('form_input_1');
    cy.get('[data-cy="watchers-watcher-variable"]').should('contain.text', 'No elements found.');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('#watcherConfig').should('contain.text', 'The Variable to Watch field is required');
  });
  it('Test synchronous watcher', () => {
    // Mock script response
    cy.server();
    cy.route('POST', '/api/1.0/scripts/execute/1', JSON.stringify({
      output: {
        name: 'Steve',
      },
    }));

    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy=inspector-name]').clear().type('user.name');

    // Create
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_2');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click({force:true});
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_2":"{{form_input_2}}"}');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('user');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('name');
    // Assertion: Watcher popup is displayed
    cy.get('#watchers-synchronous').should('be.visible');
    // wait for watcher execution
    cy.wait(2000);
    cy.get('#watchers-synchronous').should('not.be.visible');
    cy.assertPreviewData({
      form_input_2: 'name',
      user: {
        name: 'Steve',
      },
    });
  });
  it('Test asynchronous watcher', () => {
    // Mock script response
    cy.server();
    cy.route('POST', '/api/1.0/scripts/execute/1', JSON.stringify({
      output: {
        name: 'Steve',
      },
    }));

    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy=inspector-name]').clear().type('user.name');

    // Create
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_2');
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_2":"{{form_input_2}}"}');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('user');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('name');
    // Assertion: Watcher popup is not displayed
    cy.get('#watchers-synchronous').should('not.be.visible');
    // wait for watcher execution
    cy.wait(3000);
    cy.assertPreviewData({
      form_input_2: 'name',
      user: {
        name: 'Steve',
      },
    });
  });
  it('Test error in synchronous watcher', () => {
    // Mock script response
    cy.server();
    cy.route({
      method: 'POST',
      url: '/api/1.0/scripts/execute/1',
      response: JSON.stringify({
        exception: 'Exception',
        message: 'Test exception response',
      }),
      status: 403,
    });

    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-element-container]', 'bottom');
    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy=inspector-name]').clear().type('user.name');

    // Create
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_2');
    cy.get('.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label').click({force:true});
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"exception":"error"}');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('user');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_2]').clear().type('name');
    // Assertion: Watcher popup is displayed
    cy.get('#watchers-synchronous').should('be.visible');
    // wait for watcher execution
    cy.wait(2000);
    cy.get('#watchers-synchronous').should('be.visible');
    cy.get('[data-cy="watchers-show-error-message"]').click();
    cy.get('#watchers-synchronous').should('contain.text', 'Test exception response');
  });

  it('Test watcher with select list', () => {
    cy.visit('/');
    // Mock script response
    cy.server();
    cy.loadFromJson('watcher_select_list.json', 0);
    cy.route(
      'POST',
      '/api/1.0/scripts/execute/1',
      JSON.stringify({
        output: [
          {
            value: 'Jobs',
            content: 'Steve Jobs',
          },
          {
            value: 'Musk',
            content: 'Elon Musk',
          },
        ],
      })
    );

    // Configure a watcher
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]')
      .clear()
      .type('Watcher test');
    cy.get('[data-cy="watchers-watcher-variable"]').selectOption(
      'form_input_1'
    );
    cy.get(
      '.custom-switch:has([data-cy="watchers-watcher-synchronous"]) label'
    ).click({force:true});
    cy.get('[data-cy="watchers-accordion-source"]').click();
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', 'Test Script');
    cy.setVueComponentValue(
      '[data-cy="watchers-watcher-input_data"]',
      '{"form_input_1":"{{form_input_1}}"}'
    );
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]')
      .clear()
      .type('listValues');
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should('contain.text', 'Watcher test');
    cy.get('[data-cy="watchers-modal"] .close').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=form_input_1]')
      .clear()
      .type('first');
    // Assertion: Watcher popup is displayed
    cy.get('#watchers-synchronous').should('be.visible');
    // wait for watcher execution
    cy.wait(2000);
    cy.get('#watchers-synchronous').should('not.be.visible');
    cy.wait(2000);

    // Assertion: Check listValues was loaded
    cy.assertPreviewData({
      form_input_1: 'first',
      form_select_list_1: null,
      listValues: [
        {
          value: 'Jobs',
          content: 'Steve Jobs',
        },
        {
          value: 'Musk',
          content: 'Elon Musk',
        },
      ],
    });

    // Select option
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption(
      'Musk'
    );

    // Assertion: Check listValues was loaded
    cy.assertPreviewData({
      form_input_1: 'first',
      form_select_list_1: 'Musk',
      listValues: [
        {
          value: 'Jobs',
          content: 'Steve Jobs',
        },
        {
          value: 'Musk',
          content: 'Elon Musk',
        },
      ],
    });
  });
  it.only('Focuses the first field that has an error', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type('Watcher test');
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', 'form_input_1');
    cy.get('[data-cy="watchers-button-save"]').click();

    cy.get('[data-cy="watchers-watcher-source"] .multiselect__content-wrapper').should('be.visible');

    cy.get('#option-1-3').click(); // Select "script" source
    cy.get('[data-cy="watchers-watcher-input_data"] .monaco-editor').click().focused().type('abc');
    cy.get('[data-cy="watchers-accordion-output"]').click();
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type('output');
    cy.get('[data-cy="watchers-button-save"]').click();
    
    cy.focused().should('be.visible'); // Source accordion opens automatically
    cy.focused().should('have.attr', 'class', 'inputarea'); // Monaco should be focused
  });
});
