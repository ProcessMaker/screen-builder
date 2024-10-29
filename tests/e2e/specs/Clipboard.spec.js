describe("Clipboard Button Actions", () => {

  it("Should display an empty drop zone message when no elements are present", () => {
    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");
    cy.get("[data-cy=screen-drop-zone]").should(
      "contain.text",
      "Place your controls here."
    );
  });

  it("Should allow adding and removing an input field to/from the clipboard", () => {
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
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    // Step 4: Verify 'Remove from Clipboard' button is visible after adding to clipboard and then click it
    cy.get('[data-cy="removeFromClipboard"]').should("be.visible");
    cy.get('[data-cy="removeFromClipboard"]').click({force: true});
    cy.get('[data-cy="removeFromClipboard"]').should("not.exist");
  });

  it("Should allow adding and removing a multi-column form to/from the clipboard", () => {
    cy.visit("/");
    cy.openAcordeonByLabel("Content Fields");  // Open the multi-column controls section
    cy.openAcordeonByLabel("Input Fields");  // Open the form controls section

    // Step 1: Dragging FormMultiColumn control to screen drop zone
    cy.get("[data-cy=controls-FormMultiColumn]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );

    // Step 2: Add two input fields to different columns in the multi-column layout
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container] .column-draggable:empty"
    );
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container] .column-draggable:empty"
    );

    // Step 3: Toggle JSON format in the inspector and input custom column data
    cy.get('.custom-switch:has([data-cy="inspector-jsonFormat"]) label').click();
    cy.get("[data-cy=inspector-dataJson]")
      .clear()
      .type(
        JSON.stringify([
          { value: "1", content: "6" },
          { value: "1", content: "6" }
        ]),
        { parseSpecialCharSequences: false }
      );
    cy.get("[data-cy=inspector-dataJson-save]").click();

    // Step 4: Select the form input element and add it to the clipboard
    cy.get('[id="form_input_1"]').click();
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    // Step 5: Remove the form input from the clipboard
    cy.get('[data-cy="removeFromClipboard"]').should("be.visible");
    cy.get('[data-cy="removeFromClipboard"]').click({force: true});
    cy.get('[data-cy="removeFromClipboard"]').should("not.exist");
  });

  it("Should allow adding and removing a loop form to/from the clipboard", () => {
    cy.visit("/");
    cy.openAcordeonByLabel("Content Fields");
    // Step 1: Dragging FormLoop control to screen drop zone
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]");
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("rows");
    cy.get("[data-cy=inspector-source]").select("existing");
    cy.get("[data-cy=inspector-add]").click();

    // Step 2: Add an input field in the Loop layout
    cy.openAcordeonByLabel("Input Fields"); 
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container] .column-draggable div",
      { position: "bottom" }
    );

    // Step 3: Select the form input element and add it to the clipboard
    cy.get('#form_input_1').click();
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    // Step 4: Remove the form input from the clipboard
    cy.get('[data-cy="removeFromClipboard"]').should("be.visible");
    cy.get('[data-cy="removeFromClipboard"]').click({force: true});
    cy.get('[data-cy="removeFromClipboard"]').should("not.exist");
  });

});