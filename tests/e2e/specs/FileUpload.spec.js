describe('File Upload', () => {
  it('Automatically sets a variable name', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FileUpload]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();

    cy.get('[data-cy="screen-element-container"] .card-body').then((div) => {
      const data = div[0].__vue__.name;
      expect(data).to.eql('file_upload_1');
    });
  });
});
