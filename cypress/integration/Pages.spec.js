describe('Pages and navigations', () => {
  it('Basic default value', () => {
    cy.visit('/');
    cy.get('[data-cy=toolbar-add]').click();
    // Define Page 2
    cy.get('[data-cy=add-page-name]').clear().type('Page 2');
    cy.get('[data-cy=add-page-modal] button.btn').eq(1).click();
    cy.get('[data-cy=controls-FormButton]:contains("Page")').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-label]').clear().type('Go to Page 1');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.setMultiselect('[data-cy=inspector-eventData]', 'Default');
    // Define Page 1
    cy.get('[data-cy=toolbar-page]').select('0');
    cy.get('[data-cy=controls-FormButton]:contains("Page")').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-label]').clear().type('Go to Page 2');
    cy.get('[data-cy=accordion-Configuration]').click();
    cy.setMultiselect('[data-cy=inspector-eventData]', 'Page 2');
    // Preview
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content]').should('contain.text', 'Go to Page 2');
    cy.get('[data-cy=preview-content] button').click();
    cy.get('[data-cy=preview-content]').should('contain.text', 'Go to Page 1');
  });
});
