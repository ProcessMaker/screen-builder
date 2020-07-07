describe('Form Select List', () => {
  beforeEach(() => {
    cy.visit('/');
    // Add loop control
    cy.get('[data-cy=controls-FormSelectList]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
    cy.get('[data-cy=screen-element-container]').click();
  });

  it('Default properties', () => {
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content]').should('contain.text', 'No Data Available');
    cy.assertPreviewData({
      form_select_list_1: null,
    });
  });

  it('Set data source values', () => {
    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Provide Values');
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('one');
    cy.get('[data-cy=inspector-option-content]').type('one');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('two');
    cy.get('[data-cy=inspector-option-content]').type('two');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('three');
    cy.get('[data-cy=inspector-option-content]').type('three');
    cy.get('[data-cy=inspector-option-cancel]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('four');
    cy.get('[data-cy=inspector-option-content]').type('four');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-options-remove]').eq(2).click();
    cy.get('[data-cy=inspector-options-remove-cancel]').click();
    cy.get('[data-cy=inspector-options-remove]').eq(2).click();
    cy.get('[data-cy=inspector-options-remove-confirm]').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content] span:contains(one)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(two)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(three)').should('not.exist');

    cy.get('[data-cy=preview-content] span:contains(two):first').click();
    cy.assertPreviewData({
      form_select_list_1: 'two',
    });
  });

  it('Multi select list', () => {
    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Provide Values');
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('one');
    cy.get('[data-cy=inspector-option-content]').type('one');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('two');
    cy.get('[data-cy=inspector-option-content]').type('two');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('three');
    cy.get('[data-cy=inspector-option-content]').type('three');
    cy.get('[data-cy=inspector-option-cancel]').click();
    cy.get('[data-cy=inspector-allow-multi-select]').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content] span:contains(one)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(two)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(three)').should('not.exist');

    cy.get('[data-cy=preview-content] span:contains(two):first').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content] span:contains(one):first').click();

    cy.assertPreviewData({
      form_select_list_1: ['two', 'one'],
    });
  });

  it('Checkbox select list', () => {
    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Provide Values');
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('one');
    cy.get('[data-cy=inspector-option-content]').type('one');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('two');
    cy.get('[data-cy=inspector-option-content]').type('two');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('three');
    cy.get('[data-cy=inspector-option-content]').type('three');
    cy.get('[data-cy=inspector-option-cancel]').click();
    cy.get('[data-cy=inspector-render-as]').select('Radio/Checkbox Group');
    cy.get('[data-cy=inspector-allow-multi-select]').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').eq(1).click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').eq(0).click();

    cy.assertPreviewData({
      form_select_list_1: ['two', 'one'],
    });
  });

  it('Radiobox select list', () => {
    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Provide Values');
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('one');
    cy.get('[data-cy=inspector-option-content]').type('one');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('two');
    cy.get('[data-cy=inspector-option-content]').type('two');
    cy.get('[data-cy=inspector-option-save]').click();
    cy.get('[data-cy=inspector-add-option]').click();
    cy.get('[data-cy=inspector-option-value]').type('three');
    cy.get('[data-cy=inspector-option-content]').type('three');
    cy.get('[data-cy=inspector-option-cancel]').click();
    cy.get('[data-cy=inspector-render-as]').select('Radio/Checkbox Group');

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').eq(1).click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').eq(0).click();

    cy.assertPreviewData({
      form_select_list_1: 'one',
    });
  });

  it('Options from Request Variable (object value)', () => {
    cy.setPreviewDataInput({
      options: [
        {id:'one', label: 'one'},
        {id:'two', label: 'two'},
      ],
    });

    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Request Data');
    cy.get('[data-cy=inspector-options-variable]').clear().type('options');
    cy.get('[data-cy=inspector-options-label]').clear().type('label');
    cy.get('[data-cy=inspector-value-returned]').select('Object');

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content] span:contains(one)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(two)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(three)').should('not.exist');

    cy.get('[data-cy=preview-content] span:contains(two):first').click();
    cy.assertPreviewData({
      options: [
        {id:'one', label: 'one'},
        {id:'two', label: 'two'},
      ],
      form_select_list_1: {id:'two', label: 'two'},
    });
  });

  it('Options from Request Variable (single value)', () => {
    cy.setPreviewDataInput({
      options: [
        {id:'one', label: 'one'},
        {id:'two', label: 'two'},
      ],
    });

    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Request Data');
    cy.get('[data-cy=inspector-options-variable]').clear().type('options');
    cy.get('[data-cy=inspector-options-label]').clear().type('label');
    cy.get('[data-cy=inspector-value-returned]').select('Single Value');
    cy.get('[data-cy=inspector-options-value]').clear().type('id');

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content] span:contains(one)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(two)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(three)').should('not.exist');

    cy.get('[data-cy=preview-content] span:contains(two):first').click();
    cy.assertPreviewData({
      options: [
        {id:'one', label: 'one'},
        {id:'two', label: 'two'},
      ],
      form_select_list_1: 'two',
    });
  });

  it('Options from data connector (single value)', () => {
    cy.get('[data-cy=accordion-DataSource]').click();
    cy.get('[data-cy=inspector-data-sources]').select('Data Connector');
    cy.get('[data-cy=inspector-data-connector]').select('Persons');
    cy.get('[data-cy=inspector-endpoint]').select('list');
    cy.get('[data-cy=inspector-options-variable]').clear().type('response');
    cy.get('[data-cy=inspector-datasource-content]').clear().type('content');
    cy.get('[data-cy=inspector-value-returned]').select('Single Value');
    cy.get('[data-cy=inspector-datasource-value]').clear().type('value');

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').click();
    cy.get('[data-cy=preview-content] span:contains(James)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(John)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(Mary)').should('be.visible');
    cy.get('[data-cy=preview-content] span:contains(Patricia)').should('be.visible');

    cy.get('[data-cy=preview-content] span:contains(John):first').click();
    cy.assertPreviewData({
      form_select_list_1: '2',
    });
  });
});
