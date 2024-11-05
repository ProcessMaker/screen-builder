import ClipboardManager from "../../../src/store/modules/ClipboardManager";

describe("Clipboard Manager", () => {

  it("Should be updated when adding and removing an input field to/from the clipboard", () => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.openAcordeonByLabel("Input Fields");

    // Step 1: Dragging FormInput control to screen drop zone
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });

    // Step 2: Click on the screen element container to activate it
    cy.get('[data-cy="screen-element-container"]').click();

    // Step 3: Verify 'Add to Clipboard' button is visible and then click it
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist").then(() => {
      // Verify it was added to the clipboard storage
      const content = ClipboardManager.loadFromLocalStorage();
      expect(content.length).to.equal(1);
    });

    // Step 4: Verify 'Remove from Clipboard' button is visible after adding to clipboard and then click it
    cy.get('[data-cy="removeFromClipboard"]').should("be.visible");
    cy.get('[data-cy="removeFromClipboard"]').click();
    cy.get('[data-cy="removeFromClipboard"]').should("not.exist").then(() => {
      // Verify it was removed from the clipboard storage
      const content = ClipboardManager.loadFromLocalStorage();
      expect(content.length).to.equal(0);
    });
  });

  it("ClipboardManager can clear the local storage", () => {
    cy.window().then((win) => {
      // Clear storage to remove any previous clipboard items
      ClipboardManager.saveToLocalStorage([]);

      // Step 1: Visit the homepage and open the 'Input Fields' accordion
      cy.visit("/");
      cy.openAcordeonByLabel("Input Fields");

      // Step 2: Drag FormInput control to the screen's drop zone
      cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
        position: "bottom"
      });

      // Step 3: Click on the screen element container to select it
      cy.get('[data-cy="screen-element-container"]').click();

      // Step 4: Copy the selected element to the clipboard
      cy.get('[data-cy="addToClipboard"]').should("be.visible");
      cy.get('[data-cy="addToClipboard"]').click();
      cy.get('[data-cy="addToClipboard"]').should("not.exist");
    });
  });

  it("Paste clipboard item to a different screen", () => {
    // Step 1: Visit the homepage and open the 'Clipboard' accordion
    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");

    // Step 2: Drag clipboard item to the screen's drop zone
    cy.get('[data-cy="controls-Clipboard"]').drag('[data-cy=screen-drop-zone]');

    // Step 3: Verify that the item has been pasted correctly (1 element should be present)
    cy.get('[data-cy="screen-element-container"]').should('have.length', 1);

    // Step 4: Click on the pasted element to activate it
    cy.get('[data-cy="screen-element-container"]').click();
  });
});