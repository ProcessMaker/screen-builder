describe('Media Query CSS', () => {
  it('Adds media query and styling the element', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-customCssSelector]').type('new_input_css');
    cy.get('[data-cy=topbar-css]').click();
    // write the media query in the custom css panel
    cy.get('#custom-css').type('@media (max-width: 800px) { [selector=\'new_input_css\'] {background-color: blue;}} @media (min-width: 800px) and (max-width: 1280px) { [selector=\'new_input_css\'] {background-color: red;}} @media (min-width: 1280px) { [selector=\'new_input_css\'] {background-color: green;}}');
    cy.get('[data-cy=save-button]').click();
    //preview
    cy.get('[data-cy=mode-preview]').click();
    //if the resilt contains the custom css name selector
    cy.get('.page').should('contain.html', '<div selector="new_input_css">');
    // backround color blue
    cy.wait(400);
    // update the viewport size
    // cy.viewport(700, 800);
    // Cypress.config('viewportWidth', 700);
    // cy.get('[selector=new_input_css]').should('have.css', 'background-color').and('eq','rgb(0, 0, 255)');
    Cypress.config('viewportWidth', 100)
    cy.viewport(700, 800);
    cy.wrap(Cypress.config('viewportWidth')).should('eq', 700)   // passing
    // console.log(cy.get('[selector=new_input_css]').should('have.css', 'background-color').and('eq','rgb(0, 0, 255)');
    cy.get('[selector=new_input_css]').should('have.css', 'background-color').and('eq','rgb(0, 0, 255)');
    // // backround color red
    // cy.wait(100);
    // // update the viewport size
    // cy.viewport(1000, 800);
    // cy.get('[selector=new_input_css]').should('have.css', 'background-color').and('eq','rgb(255, 0, 0)');
    // // backround color green
    // cy.wait(100);
    // // update the viewport size
    // cy.viewport(1500, 800);
    // cy.get('[selector=new_input_css]').should('have.css', 'background-color').and('eq','rgb(0, 128, 0)');
  });
});
