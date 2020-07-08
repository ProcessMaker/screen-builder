describe('Custom CSS', () => {
  it('Shows Modal', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
    cy.get('[data-cy=topbar-css]').click();
    cy.get('#custom-css').should('be.visible');
  });

  it.skip('Closes Modal', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
    cy.get('[data-cy=topbar-css]').click();
    cy.get('#custom-css').should('be.visible');
    cy.get('#custom-css___BV_modal_header_ > .close').click();
    cy.get('#custom-css').should('not.be.visible');
  });

  it('Does Not Save Custom CSS', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
    cy.get('[data-cy=topbar-css]').click();
    cy.get('[data-cy=monaco-editor]').type('div[selector=\'new_input_css\'] {background-color:red;padding:10px;}', {parseSpecialCharSequences: false} );
    cy.get('[data-cy=cancel-button]').click();
    cy.get('[data-cy=topbar-css]').click();
    cy.get('[data-cy=monaco-editor] > .monaco-editor > .overflow-guard > .monaco-scrollable-element > .lines-content > .view-lines > .view-line').should('contain.html', '<span><span>&nbsp;</span></span>');
  });

  it('Saves Custom CSS', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
    cy.get('[data-cy=topbar-css]').click();
    cy.get('[data-cy=monaco-editor]').type('div[selector=\'new_input_css\'] {background-color:red;padding:10px;}', {parseSpecialCharSequences: false} );
    cy.get('[data-cy=save-button]').click();
    cy.get('[data-cy=topbar-css]').click();
    cy.get('[data-cy=monaco-editor] > .monaco-editor > .overflow-guard > .monaco-scrollable-element > .lines-content > .view-lines > .view-line').should('not.contain.html', '<span><span>&nbsp;</span></span>');
  });

  it('Adds styling to element', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
    cy.get('[data-cy=topbar-css]').click();
    cy.get('#custom-css').type('div[selector=\'new_input_css\'] {background-color:red;padding:10px;}', {parseSpecialCharSequences: false} );
    cy.get('[data-cy=save-button]').click();
    cy.get('[data-cy=mode-preview]').click();
    cy.get('.page').should('contain.html', '<div selector="new_input_css">');
  });
});
  