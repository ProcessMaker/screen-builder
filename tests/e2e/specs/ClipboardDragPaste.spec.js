import {
  addControlInsideLoop,
  addControlInsideTable,
} from "../support/utils.js";
import { nodeControls } from "../support/constants.js";

describe("Clipboard Drag and Paste", () => {

  it("Copy input element to clipboard", () => {
    cy.window().then((win) => {
      // Clear storage to remove any previous clipboard items
      win.localStorage.clear();

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

  it("Copy multicolumn element to clipboard", () => {
    cy.window().then((win) => {
      // Clear storage to remove any previous clipboard items
      win.localStorage.clear();

      // Step 1: Visit the homepage and open the 'Input Fields' and 'Content Fields' accordions
      cy.visit("/");
      cy.openAcordeonByLabel("Input Fields");
      cy.openAcordeonByLabel("Content Fields");

      // Step 2: Drag FormMultiColumn control to the screen's drop zone
      cy.get("[data-cy=controls-FormMultiColumn]").drag("[data-cy=screen-drop-zone]", {
        position: "bottom"
      });

      // Step 3: Add a TextArea control inside the multicolumn table
      addControlInsideTable(1, nodeControls.formTextArea);

      // Step 4: Click on the screen element container to select it
      cy.get('[data-cy="screen-element-container"]').click();

      // Step 5: Copy the multicolumn element to the clipboard
      cy.get('[data-cy="addToClipboard"]').should("be.visible");
      cy.get('[data-cy="addToClipboard"]').click();
      cy.get('[data-cy="addToClipboard"]').should("not.exist");
    });
  });

  it("Paste multicolumn clipboard item to a different screen", () => {
    // Step 1: Visit the homepage and open the 'Clipboard' accordion
    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");

    // Step 2: Drag clipboard item to the screen's drop zone
    cy.get('[data-cy="controls-Clipboard"]').drag('[data-cy=screen-drop-zone]');

    // Step 3: Verify the multicolumn element with TextArea exists (2 columns)
    cy.get('[data-cy="screen-element-container"]').should('have.length', 1);
    cy.get('[data-cy="screen-element-container"] .column-draggable').should('have.length', 2);
    cy.get('[data-cy="screen-element-container"] .column-draggable').eq(1).find('textarea').should('exist');

    // Step 4: Click on the screen element container to activate it
    cy.get('[data-cy="screen-element-container"]').click();
  });

  it("Copy loop element to clipboard", () => {
    cy.window().then((win) => {
      // Clear storage to remove any previous clipboard items
      win.localStorage.clear();

      // Step 1: Visit the homepage and open the 'Input Fields' and 'Content Fields' accordions
      cy.visit("/");
      cy.openAcordeonByLabel("Input Fields");
      cy.openAcordeonByLabel("Content Fields");

      // Step 2: Drag FormLoop control to the screen's drop zone
      cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
        position: "bottom"
      });

      // Step 3: Add a TextArea control inside the loop
      addControlInsideLoop(1, nodeControls.formTextArea);

      // Step 4: Click on the screen element container to select it
      cy.get('[data-cy="screen-element-container"]').click({
        position: "top"
      });

      // Step 5: Copy the loop element to the clipboard
      cy.get('[data-cy="addToClipboard"]').should("be.visible");
      cy.get('[data-cy="addToClipboard"]').click();
      cy.get('[data-cy="addToClipboard"]').should("not.exist");
    });
  });

  it("Paste loop clipboard item to a different screen", () => {
    // Step 1: Visit the homepage and open the 'Clipboard' accordion
    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");

    // Step 2: Drag clipboard item to the screen's drop zone
    cy.get('[data-cy="controls-Clipboard"]').drag('[data-cy=screen-drop-zone]');

    // Step 3: Verify the loop element with TextArea exists
    cy.get('[data-cy="screen-element-container"]').should('have.length', 1);
    cy.get('[data-cy="screen-element-container"] .column-draggable').should('have.length', 1);
    cy.get('[data-cy="screen-element-container"] .column-draggable').eq(0).find('textarea').should('exist');

    // Step 4: Click on the screen element container to activate it
    cy.get('[data-cy="screen-element-container"]').click();
  });

  it("Copy element from inside multicolumn to clipboard", () => {
    cy.window().then((win) => {
      // Clear storage to remove any previous clipboard items
      win.localStorage.clear();

      // Step 1: Visit the homepage and open the 'Input Fields' and 'Content Fields' accordions
      cy.visit("/");
      cy.openAcordeonByLabel("Input Fields");
      cy.openAcordeonByLabel("Content Fields");

      // Step 2: Drag Multicolumn control to the screen's drop zone and add a TextArea inside
      cy.get("[data-cy=controls-FormMultiColumn]").drag("[data-cy=screen-drop-zone]", {
        position: "bottom"
      });
      addControlInsideTable(1, nodeControls.formTextArea);

      // Step 3: Click on the textarea element inside the multicolumn to select it
      cy.get('[data-cy="screen-element-container"] [class="control-item"]').click();

      // Step 4: Copy the textarea element to the clipboard
      cy.get('[data-cy="addToClipboard"]').should("be.visible");
      cy.get('[data-cy="addToClipboard"]').click();
      cy.get('[data-cy="addToClipboard"]').should("not.exist");
    });
  });

  it("Paste clipboard item from inside multicolumn to a different screen", () => {
    // Step 1: Visit the homepage and open the 'Clipboard' accordion
    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");

    // Step 2: Drag clipboard item to the screen's drop zone
    cy.get('[data-cy="controls-Clipboard"]').drag('[data-cy=screen-drop-zone]');

    // Step 3: Verify that only a textarea was pasted (no multicolumn)
    cy.get('[data-cy="screen-element-container"]').should('have.length', 1);
    cy.get('[data-cy="screen-element-container"] .column-draggable').should('have.length', 0);
    cy.get('[data-cy="screen-element-container"]').find('textarea').should('exist');

    // Step 4: Click on the screen element container to activate it
    cy.get('[data-cy="screen-element-container"]').click();
  });

  it("Copy two input element to clipboard", () => {
    cy.window().then((win) => {
      // Clear storage to remove any previous clipboard items
      win.localStorage.clear();

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

      // Step 5: Drag a second FormInput control to the screen's drop zone
      cy.get("[data-cy=controls-FormInput]").drag("[data-cy=editor-content]", {
      });

      // Step 6: Click on the screen element container to select it
      cy.get('[data-cy="screen-element-container"]').eq(1).click();

      // Step 7: Copy the selected element to the clipboard
      cy.get('[data-cy="addToClipboard"]').should("be.visible");
      cy.get('[data-cy="addToClipboard"]').click();
      cy.get('[data-cy="addToClipboard"]').should("not.exist");
    });
  });

  it("Paste clipboard items to a different screen", () => {
    // Step 1: Visit the homepage and open the 'Clipboard' accordion
    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");

    // Step 2: Drag clipboard item to the screen's drop zone
    cy.get('[data-cy="controls-Clipboard"]').drag('[data-cy=screen-drop-zone]');

    // Step 3: Verify that there are two input elements pasted
    cy.get('[data-cy="screen-element-container"]').should('have.length', 2);
    cy.get('[data-cy="screen-element-container"]').eq(0).find('input').should('exist');
    cy.get('[data-cy="screen-element-container"]').eq(1).find('input').should('exist');
  });
  it("Drag and Drop clipboard item into a multicolumn ", () => {
    // Step 1: Visit the homepage and open the 'Content Fields' and 'Clipboard' accordions
    cy.visit("/");
    cy.openAcordeonByLabel("Content Fields");
    cy.openAcordeonByLabel("Clipboard");

    // Step 2: Drag Multicolumn control to the screen's drop zone and add a Clipboard control inside
    cy.get("[data-cy=controls-FormMultiColumn]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    addControlInsideTable(1, nodeControls.clipboard);

    // Step 3: Verify that there are one input elements pasted
    cy.get('[data-cy="screen-element-container"]').should('have.length', 1);
    cy.get('[data-cy="screen-element-container"]').eq(0).find('input').should('exist');
  });

  it("Drag and Drop clipboard item into a loop", () => {
    // Step 1: Visit the homepage and open the 'Content Fields' and 'Clipboard' accordions
    cy.visit("/");
    cy.openAcordeonByLabel("Content Fields");
    cy.openAcordeonByLabel("Clipboard");

    // Step 2: Drag Loop control to the screen's drop zone and add a Clipboard control inside
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    addControlInsideLoop(1, nodeControls.clipboard);

    // Step 3: Verify that there are one input elements pasted
    cy.get('[data-cy="screen-element-container"]').should('have.length', 1);
    cy.get('[data-cy="screen-element-container"]').eq(0).find('input').should('exist');
  });
});
