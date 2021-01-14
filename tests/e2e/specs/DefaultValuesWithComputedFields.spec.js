describe('Computed field and default values', () => {

  it('Test default values with computed fields', () => {
    cy.visit('/');
    cy.server();
    cy.loadFromJson('default_values_with_computed_fields.json', 0);

    // Preview
    cy.get('[data-cy=mode-preview]').click();

    // Assertion: Calculated properties are correct:
    //   - varA = 1
    //   - res = ok
    // Control with default value is correct:
    //   - uno = {{varA}} = "1"
    cy.assertPreviewData({
      'uno': '1',
      'varA': 1,
      'res': 'ok',
    });

  });
});
