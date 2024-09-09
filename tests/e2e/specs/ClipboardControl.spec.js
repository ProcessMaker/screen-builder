describe("Add Clipboard Section to Control Menu", () => {

  /**
   * Test to verify that the Clipboard section is present in the control menu.
   */
  it('should display the "Clipboard" section in the control menu', () => {
    // Step 1: Navigate to the homepage
    cy.visit("/");

    // Step 2: Verify that the Clipboard section is visible in the control menu
    cy.contains("Clipboard").should("be.visible");
  });

  /**
   * Test to verify that the Clipboard accordion expands and shows the "Drag to Paste" control.
   */
  it('should expand the Clipboard accordion and display the "Drag to Paste" control', () => {
    // Step 1: Navigate to the homepage
    cy.visit("/");

    // Step 2: Open all accordions in the control menu
    cy.openAllAcordeon();

    // Step 3: Verify that the Clipboard accordion exists and is visible
    cy.get('[data-cy="controls-Clipboard"]').should("exist").should("be.visible");
  });

  /**
   * Test to verify the visibility of the popover when hovering over the "Drag to Paste" control.
   */
  it('should display the popover when hovering over the "Drag to Paste" control', () => {
    // Step 1: Navigate to the homepage
    cy.visit("/");

    // Step 2: Open all accordions in the control menu
    cy.openAllAcordeon();

    // Step 3: Click to open the Clipboard accordion
    cy.get('[data-cy="controls-Clipboard"]').click();

    // Step 4: Verify that the popover associated with the "Drag to Paste" control is visible
    cy.get('.custom-popover').should("be.visible");
  });
});
