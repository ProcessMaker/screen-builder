describe('Default values', () => {
  it('Variable names with dots 2 levels', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-name]').clear().type('user.address');
    cy.get('[data-cy=mode-preview]').click();
    cy.assertPreviewData({
      user: {
        address: '',
      },
    });
  });
  it('Variable names with dots 3 levels', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-name]').clear().type('user.address.city');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="user.address.city"]').type('La Paz');
    cy.assertPreviewData({
      user: {
        address: {
          city: 'La Paz',
        },
      },
    });
  });
  it('Variable names with dots and one attribute same as the name', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=inspector-name]').clear().type('address.address.city');
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name="address.address.city"]').type('La Paz');
    cy.assertPreviewData({
      address: {
        address: {
          city: 'La Paz',
        },
      },
    });
  });
});
