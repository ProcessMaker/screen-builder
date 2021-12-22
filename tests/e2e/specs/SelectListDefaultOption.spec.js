describe('Select List with Default Option selected', () => {
  before(() => {
    cy.server();
    cy.visit('/');
  });
  describe('Select List with unselected option', () => {
    it('should add a select list', () => {
      cy.get('[data-cy="controls-FormSelectList"]').drag('[data-cy=screen-drop-zone]', 'bottom');
    });
    it('should select the recently added select list', () => {
      cy.get('[data-cy="screen-element-container"]').click();
    });
    it('should NOT have the defaultValue input option', () => {
      cy.get('[data-cy="accordion-Advanced"]').click();
      cy.get('[data-cy="inspector-defaultValue"]').should('not.be.visible');
    });
    it('Select List options should have unselected', () => {
      cy.get('[data-cy="accordion-DataSource"]').click();
      cy.get('[data-cy="unselected-container"]').should('be.visible');
    });
  });
  describe('Select List should create 2 options', () => {
    it('should add 2 options', () => {
      cy.get('[data-cy="inspector-add-option"]').click();
      cy.get('[data-cy="inspector-option-value"]').type('true');
      cy.get('[data-cy="inspector-option-content"]').type('True');
      cy.get('[data-cy="inspector-option-save"]').click();
      // Verify that the element was added successfully
      cy.get('[data-cy="option-true"]').should('be.visible');

      cy.get('[data-cy="inspector-add-option"]').click();
      cy.get('[data-cy="inspector-option-value"]').type('false');
      cy.get('[data-cy="inspector-option-content"]').type('False');
      cy.get('[data-cy="inspector-option-save"]').click();
      // Verify that the element was added successfully
      cy.get('[data-cy="option-false"]').should('be.visible');
    });
  });
  describe('Select List should set True as the default value', () => {
    it('should select true as the default option', () => {
      cy.get('[data-cy="option-true"] input').click();
    });
    it('should set the default value as true in preview mode', () => {
      cy.get('[data-cy="mode-preview"]').click();
      cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__single').contains('True');
    });
  });

  describe('Select List should set False as the default value', () => {
    it('should go back to design mode', () => {
      cy.get('[data-cy="mode-editor"]').click();
    });
    it('should select true as the default option', () => {
      cy.get('[data-cy="option-false"] input').click();
    });
    it('should set the default value as true in preview mode', () => {
      cy.get('[data-cy="mode-preview"]').click();
      cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__single').contains('False');
    });
  });

  describe('Should change the data model of the defaultValue if the Type of Value Returned changes', () => {
    it('should go back to design mode', () => {
      cy.get('[data-cy="mode-editor"]').click();
    });
    it('should change the type of value returned from a single value to object', () => {
      cy.get('[data-cy="inspector-value-returned"]').select('object');
    });
    it('should be defaultValue to be False', () => {
      cy.get('[data-cy="mode-preview"]').click();
      cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__single').contains('False');
    });
  });
  describe('Should defaultValue to be false even if rolledback to single returned value', () => {
    it('should go back to design mode', () => {
      cy.get('[data-cy="mode-editor"]').click();
    });
    it('should change the type of value returned from a single value to object', () => {
      cy.get('[data-cy="inspector-value-returned"]').select('single');
    });
    it('should be defaultValue to be False', () => {
      cy.get('[data-cy="mode-preview"]').click();
      cy.get('[data-cy="screen-field-form_select_list_1"] .multiselect__single').contains('False');
    });
  });
});
