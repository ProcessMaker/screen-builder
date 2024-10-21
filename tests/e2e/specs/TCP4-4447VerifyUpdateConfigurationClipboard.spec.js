describe("TCP4-4474 Verify that the configuration made in line controls", () => {
  beforeEach(() => {
    // Step 1: Navigate to the homepage, show validation, and clear local storage
    cy.visit("/"); // Visit the application homepage
    cy.showValidationOnLoad(); // Show validation rules on page load
    cy.clearLocalStorage(); // Clear local storage before each test to start fresh
  });

  const verifyClipboardSync = (elementType, name, label) => {
    // Step 1: Clear local storage and re-visit the homepage
    cy.clearLocalStorage();
    cy.visit("/");

    // Step 2: Open the "Input Fields" accordion
    cy.openAcordeonByLabel("Input Fields");

    // Step 3: Drag the specified control to the screen drop zone
    cy.get(`[data-cy=controls-${elementType}]`).drag("[data-cy=screen-drop-zone]", { position: "bottom" });

    // Step 4: Interact with the first screen element to open the inspector
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });

    // Step 5: Ensure the "Add to Clipboard" button is visible
    cy.get('[data-cy="addToClipboard"]').should("be.visible");

    // Step 6: Fill in the inspector fields
    cy.get("[data-cy=inspector-name]").clear().type(name);
    cy.get("[data-cy=inspector-label]").clear().type(label);

    // Step 7: Set validation rules in the inspector
    cy.get('[data-cy="inspector-validation"]')
      .find('input[type="checkbox"]')
      .should('be.visible')
      .check()
      .should('be.checked');

    // Step 8: Click the "Add to Clipboard" button
    cy.get('[data-cy="addToClipboard"]').click();

    // Step 9: Open the clipboard and verify the added checkbox
    cy.get("[data-test=page-dropdown]").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });

    // Step 10: Verify the inspector fields after selecting the copied element
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get("[data-cy=inspector-name]").should('have.value', name); // Verify the name
    cy.get("[data-cy=inspector-label]").should('have.value', label); // Verify the label
    cy.get('[data-cy="inspector-validation"]')
      .find('input[type="checkbox"]')
      .should('be.checked'); // Verify validation checkbox

    // Step 11: Navigate back to the original page and update the element name
    cy.get("[data-test=page-dropdown]").click();
    cy.get('[data-cy="page-0"]').should("exist").click({ force: true });
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get("[data-cy=inspector-name]").clear().type(`${name}Updated`).blur();

    // Step 12: Ensure the "Add to Clipboard" button is still visible after update
    cy.get('[data-cy="addToClipboard"]').should("exist");
  };

  it("Verify FormInput configuration updates sync with clipboard", () => {
    verifyClipboardSync("FormInput", "inputTest", "Input Test");
  });

  it("Verify FormCheckbox configuration updates sync with clipboard", () => {
    verifyClipboardSync("FormCheckbox", "checkboxTest", "Checkbox Test");
    
    // Additional steps specific to FormCheckbox
    cy.get('[data-cy="inspector-initiallyChecked"]').check().should('be.checked'); // Check Initially Checked
    cy.get('[data-cy="inspector-disabled"]').check().should('be.checked'); // Check Disabled
  });

  it("Verify FormSelectList configuration updates sync with clipboard", () => {
    verifyClipboardSync("FormSelectList", "selectTest", "Select Test");
  });

  it("Verify FormTextArea configuration updates sync with clipboard", () => {
    verifyClipboardSync("FormTextArea", "textTest", "Text Test");
  });


  it("Verify FormDatePicker configuration updates sync with clipboard", () => {
    verifyClipboardSync("FormDatePicker", "dateTest", "Date Test");
  });
});
