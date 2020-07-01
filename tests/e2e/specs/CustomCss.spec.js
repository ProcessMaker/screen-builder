describe('Custom CSS', () => {
    it('Shows Modal', () => {
        cy.visit('/');
        cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
        cy.get('[data-cy=screen-element-container]').click();
        cy.get('[data-cy=accordion-Advanced]').click();
        cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
        cy.get('[data-cy=topbar-css]').click();
        cy.get('[data-cy=monaco-editor]').should('be.visible');
    });

    it('Hides Modal', () => {
        cy.visit('/');
        cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
        cy.get('[data-cy=screen-element-container]').click();
        cy.get('[data-cy=accordion-Advanced]').click();
        cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
        cy.get('[data-cy=topbar-css]').click();
        cy.get('[data-cy=monaco-editor]').should('be.visible');
        cy.get('[data-cy=cancel-button]').click();
        cy.get('[data-cy=monaco-editor]').should('not.be.visible');
    });

    it('Closes Modal', () => {
        cy.visit('/');
        cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
        cy.get('[data-cy=screen-element-container]').click();
        cy.get('[data-cy=accordion-Advanced]').click();
        cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
        cy.get('[data-cy=topbar-css]').click();
        cy.get('[data-cy=monaco-editor]').should('be.visible');
        cy.get('#custom-css___BV_modal_header_ > .close').click();
        cy.get('[data-cy=monaco-editor]').should('not.be.visible');
    });

    it('Saves Custom CSS', () => {
        cy.visit('/');
        cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
        cy.get('[data-cy=screen-element-container]').click();
        cy.get('[data-cy=accordion-Advanced]').click();
        cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
        cy.get('[data-cy=topbar-css]').click();
        cy.get('[data-cy=monaco-editor]').type("div[selector='new_input_css'] {background-color:red;padding:10px;}", {parseSpecialCharSequences: false} );
        cy.get('[data-cy=save-button]').click();
        cy.get('[data-cy=topbar-css]').click();
        cy.get('[data-cy=monaco-editor]').should('not.be.empty');
    });

    it('Adds styling to element', () => {
      cy.visit('/');
      cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
      cy.get('[data-cy=screen-element-container]').click();
      cy.get('[data-cy=accordion-Advanced]').click();
      cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
      cy.get('[data-cy=topbar-css]').click();
      cy.get('[data-cy=monaco-editor]').type("div[selector='new_input_css'] {background-color:red;padding:10px;}", {parseSpecialCharSequences: false} );
      cy.get('[data-cy=save-button]').click();
      cy.get('[data-cy=mode-preview]').click();
      cy.get('.page').should('contain.html', '<div selector="new_input_css">');
    });
});
  