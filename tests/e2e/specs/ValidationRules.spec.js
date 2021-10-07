import moment from 'moment';

describe('Validation Rules', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Invalid default values', () => {
    cy.loadFromJson('validation_rules.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // ACCEPTED CHECKBOX
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .parent()
      .should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [name=form_checkbox_1]').click();
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .parent()
      .should('not.contain.text', 'Field must be accepted');

    // ACCEPTED INPUT
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]')
      .parent()
      .should('contain.text', 'Field must be accepted');
    cy.get('[data-cy=preview-content] [name=form_input_1]').type('on');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_1"]')
      .parent()
      .should('not.contain.text', 'Field must be accepted');

    // IN LIST
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_2]').type('2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]')
      .parent()
      .should('not.contain.text', 'Invalid value');

    // NOT IN LIST
    cy.get('[data-cy=preview-content] [name=form_input_3]').type('2');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_3"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_3]').type('4');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_3"]')
      .parent()
      .should('not.contain.text', 'Invalid value');

    // REGEX
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_4]').type('Aaa1');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]')
      .parent()
      .should('contain.text', 'Invalid value');
    cy.get('[data-cy=preview-content] [name=form_input_4]')
      .clear()
      .type('Abc1');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_4"]')
      .parent()
      .should('not.contain.text', 'Invalid value');

    // between
    cy.get('[data-cy=preview-content] [name=form_input_5]').type(10);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_5"]')
      .parent()
      .should('contain.text', 'Must have a value between 1 and 5');
    cy.get('[data-cy=preview-content] [name=form_input_5]')
      .clear()
      .type(1);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_5"]')
      .parent()
      .should('not.contain.text', 'Must have a value between 1 and 5');

    // same
    cy.get('[data-cy=preview-content] [name=form_input_6]').type(10);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_6"]')
      .parent()
      .should('contain.text', 'Must be same as form_input_5');
    cy.get('[data-cy=preview-content] [name=form_input_6]')
      .clear()
      .type(1);
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_6"]')
      .parent()
      .should('not.contain.text', 'Must be same as form_input_5');

    // same
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_date_picker_1] > .form-control'
    )
      .parent()
      .should('contain.text', 'Must be equal or before today');
    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"]'
    ).pickToday();
    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-form_date_picker_1"] > .form-control'
    )
      .parent()
      .should('not.contain.text', 'Must be equal or before today');

    //submit form valid
    cy.get(':nth-child(9) > .form-group > .btn').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Preview Form was Submitted');
    });
    cy.on('window:confirm', () => true);
  });

  it('Validations should be skipped for readonly fields', () => {
    // Setup
    let alert = false;
    cy.on('window:alert', msg => alert = msg);
    cy.loadFromJson('screen_with_readonly_fields.json', 0);

    // In editor: ensure standard required field displays error while readonly required field does not
    cy.get('[data-cy=editor-content] [name="form_input"]')
      .parent()
      .find('.invalid-feedback')
      .should('be.visible');
      
    cy.get('[data-cy=editor-content] [name="form_input_readonly"]')
      .parent()
      .find('.invalid-feedback')
      .should('be.not.visible');

    // In preview: ensure standard required field displays error while readonly required field does not    
    cy.get('[data-cy=mode-preview]').click();
    
    cy.get('[data-cy=preview-content] [name="form_input"]')
      .parent()
      .find('.invalid-feedback')
      .should('be.visible');
      
    cy.get('[data-cy=preview-content] [name="form_input_readonly"]')
      .parent()
      .find('.invalid-feedback')
      .should('be.not.visible');
    
    // Ensure the form cannot yet be submitted
    cy.get('[data-cy=preview-content] [name="submit_button"]')
      .click()
      .then(() => expect(alert).to.equal(false));
    
    // Fill out the required missing field; ensure the form *can* be submitted
    cy.get('[data-cy=preview-content] [name="form_input"]')
      .type('text');

    cy.get('[data-cy=preview-content] [name="submit_button"]')
      .click()
      .then(() => expect(alert).to.equal('Preview Form was Submitted'));
  });

  it('RequireIf validation must be able to access the _parent\'s variables', () => {
    cy.loadFromJson('test_parent_in_validations.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_1"]').parent().find('.invalid-feedback').should('be.not.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]').selectOption('YES');
    cy.get('[data-cy=preview-content] [name="form_input_1"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
  });

  it('Date Validations must be able to access the _parent\'s variables', () => {
    cy.loadFromJson('test_parent_in_validations.json', 0);

    const date = moment(new Date()).format('YYYY-MM-DD');
    const dateBefore = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
    const dateAfter = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');

    // Change validation rule to After Date
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').eq(2).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('After Date');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] [name="Date"]').type('_parent.form_input_1');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_1"]').type(dateBefore);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').type(date);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');

    // Change validation rule to After or Equal to Date
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').eq(2).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('After or Equal to Date');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] [name="Date"]').type('_parent.form_input_1');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_1"]').type(dateBefore);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').type(dateBefore);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').clear().type(date);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');

    // Change validation rule to Before date
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').eq(2).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('Before Date');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] [name="Date"]').type('_parent.form_input_1');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_1"]').type(dateAfter);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').type(date);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');

    // Change validation rule to Before or Equal to Date
    cy.get('[data-cy=mode-editor]').click();
    cy.get('[data-cy=screen-element-container]').eq(2).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('Before or Equal to Date');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] [name="Date"]').type('_parent.form_input_1');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_1"]').type(dateAfter);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').type(dateAfter);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').clear().type(date);
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
  });

  it('RequireUnless must be able to access the _parent\'s variables', () => {
    cy.loadFromJson('test_parent_in_validations.json', 0);

    // Change validation rule to Required Unless
    cy.get('[data-cy=screen-element-container]').eq(2).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('Required Unless');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] input[name="variable-name"]').type('_parent.form_input_1');
    cy.get('[data-cy="inspector-validation"] input[name="variable-value"]').type('abc');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_1"]').type('abc');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').type('abc');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
  });

  it('SameAs must be able to access the _parent\'s variables', () => {
    cy.loadFromJson('test_parent_in_validations.json', 0);

    // Change validation rule to Same
    cy.get('[data-cy=screen-element-container]').eq(2).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('Same');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] input[name="variable-name"]').type('_parent.form_input_1');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_1"]').type('abc');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').type('abc');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
  });

  it('Access to Request _parent variables', () => {
    cy.loadFromJson('test_parent_in_validations.json', 0);
    cy.setPreviewDataInput({_parent: {user_name: 'from_parent_request'}});

    // Change validation rule to Same (input 1)
    cy.get('[data-cy=screen-element-container]').eq(1).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('Same');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] input[name="variable-name"]').type('_parent.user_name');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();

    // Change validation rule to Same (input 1 inside loop)
    cy.get('[data-cy=screen-element-container]').eq(2).click();
    cy.get('[data-cy="inspector-validation"] [data-cy="remove-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="confirm-delete-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="add-rule"]').click();
    cy.get('[data-cy="inspector-validation"] [data-cy="select-rule"]').selectOption('Same');
    cy.get('[data-cy="inspector-validation"] [data-cy="save-rule"]:visible').click();
    cy.get('[data-cy="inspector-validation"] input[name="variable-name"]').type('_parent._parent.user_name');
    cy.get('[data-cy="inspector-validation"] [data-cy="update-rule"]:visible').click();

    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="form_input_1"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_1"]').type('abc');
    cy.get('[data-cy=preview-content] [name="form_input_1"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_1"]').clear().type('from_parent_request');
    cy.get('[data-cy=preview-content] [name="form_input_1"]').parent().find('.invalid-feedback').should('be.not.visible');

    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').type('abc');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.visible');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').clear().type('from_parent_request');
    cy.get('[data-cy=preview-content] [name="form_input_2"]').parent().find('.invalid-feedback').should('be.not.visible');
  });

  it('Required IF with boolean values', () => {
    cy.loadFromJson('required_if_with_checkbox.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Check box 1
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .click();

    // Name should be required
    cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"]')
      .should('contain.html', 'alert alert-danger');

    // Uncheck box 1
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .click();

    // Name should not be required
    cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"]')
      .should('not.contain.html', 'alert alert-danger');

    // Check box 1
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .click();

    // Fill name
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]')
      .clear()
      .type('test');

    // Name should not be required
    cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"]')
      .should('not.contain.html', 'alert alert-danger');

  });

  it('Required Unless with boolean values', () => {
    cy.loadFromJson('required_unless_with_checkbox.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Check box 1
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .click();

    // Name should be required
    cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"]')
      .should('contain.html', 'alert alert-danger');

    // Uncheck box 1
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .click();

    // Name should not be required
    cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"]')
      .should('not.contain.html', 'alert alert-danger');

    // Check box 1
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_checkbox_1"]')
      .click();

    // Fill name
    cy.get('[data-cy=preview-content] [data-cy="screen-field-form_input_2"]')
      .clear()
      .type('test');

    // Name should not be required
    cy.get('[data-cy=preview-content] [data-cy="screen-field-submit"]')
      .should('not.contain.html', 'alert alert-danger');

  });
});
