describe('Select List with Default Option selected', () => {
  before(() => {
    cy.server();
    cy.visit('/');
  });
  describe('Select List with No Options', () => {
    it('should add a select list', function () {
      cy.get('[data-cy="controls-FormSelectList"]').drag('[data-cy=screen-drop-zone]', 'bottom');
    });
    it('should select the recently added select list', function () {
      cy.get('[data-cy="screen-element-container"]').click();
    });
    it('should NOT have the defaultValue input option', function () {
      cy.get('[data-cy="accordion-Advanced"]').click();
      cy.get('[data-cy="inspector-defaultValue"]').should('not.be.visible');
    });
    it('Select List options should have unselected', () => {
      cy.get('[data-cy="accordion-DataSource"]').click();
      cy.get('[data-cy="unselected-container"]').should('be.visible');
    });
    it('should add 2 options', function () {
      cy.get('[data-cy="inspector-add-option"]').click();
      cy.get('[data-cy="inspector-option-value"]').type('true');
      cy.get('[data-cy="inspector-option-content"]').type('True');
      cy.get('[data-cy="inspector-option-save"]').click();
      // Verify that the element was added successfully
      cy.get('[data-cy="option-true"').should('be.visible');

      cy.get('[data-cy="inspector-add-option"]').click();
      cy.get('[data-cy="inspector-option-value"]').type('false');
      cy.get('[data-cy="inspector-option-content"]').type('False');
      cy.get('[data-cy="inspector-option-save"]').click();
      // Verify that the element was added successfully
      cy.get('[data-cy="option-false"').should('be.visible');
    });
    it('should select true as the default option', function () {
      cy.get('[data-cy="option-true"] input').click();
    });
    it('should set the default value as true in preview mode', function () {
      cy.get('[data-cy="mode-preview"]').click();

    });
  });
});
