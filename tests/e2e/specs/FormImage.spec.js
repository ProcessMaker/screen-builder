describe('Form Image', () => {
  it('Upload image to show', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormImage]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.uploadFile('[data-cy=inspector-image] input[type=file]', 'avatar.jpeg', 'image/jpeg');
    cy.get('[data-cy=accordion-Design]').click();
    cy.get('[data-cy=inspector-height]').clear().type('80');
    cy.get('[data-cy=inspector-width]').clear().type('100');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] img').should('have.attr', 'src');
    cy.get('[data-cy=preview-content] img').should('have.attr', 'height', '80');
    cy.get('[data-cy=preview-content] img').should('have.attr', 'width', '100');
  });

  it('Image by variable', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormImage]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-renderImage]').click();
    cy.get('[data-cy=inspector-variableName]').clear().type('image');
    cy.get('[data-cy=accordion-Design]').click();
    cy.get('[data-cy=inspector-height]').clear().type('80');
    cy.get('[data-cy=inspector-width]').clear().type('100');

    cy.setPreviewDataInput({image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png'});
  
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] img').should('have.attr', 'src');
    cy.get('[data-cy=preview-content] img').should('have.attr', 'height', '80');
    cy.get('[data-cy=preview-content] img').should('have.attr', 'width', '100');
  });
});
