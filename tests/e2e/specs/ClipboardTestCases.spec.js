describe("Clipboard Button Actions", () => {

  it("TCP4-4441: Verify clipboard in section column and dropdown menu", () => {
    // Clear local storage
    cy.clearLocalStorage();
    cy.visit("/");
    cy.openAcordeonByLabel("Clipboard");
    cy.get("[data-cy=screen-drop-zone]").should(
      "contain.text",
      "Place your controls here."
    );

    // Step 1: Verify Drag & Paste component existe  in clipboard control section
    cy.get("[data-cy=controls-Clipboard]").should("exist");
    // Step 2: Verify clipboard is present in  dopdown pages menu
    cy.get("[data-test=page-dropdown").click();
    cy.get("[data-test=clipboard]").should("exist");
    cy.wait(1000);
    // Step 3: Verify Clipboard open like page in new tab
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });
    cy.get('a[role="tab"]')
      .contains('Clipboard')
      .should('have.class', 'active')
      .and('be.visible');

    // Step 4: Check if the 'Clipboard' tab is opened (active) 
    cy.get('div[role="tabpanel"][name="clipboard"]')
      .should('have.class', 'active')
      .and('be.visible')
      .within(() => {
        // Step 5: Check if it contains the 'Clear All' button
        cy.contains('button', 'Clear All').should('exist');
      });

    //Step 6: Verify that when the Clipboard page is opened the buttons: undo, redo, calculations, observers and options are disabled
    cy.get('button[data-cy="toolbar-undo"]').should('be.disabled');
    cy.get('button[data-cy="toolbar-redo"]').should('be.disabled');
    cy.get('button[data-cy="topbar-calcs"]').should('be.disabled');
    cy.get('button[data-cy="topbar-css"]').should('be.disabled');
    cy.get('button[data-cy="topbar-watchers"]').should('be.disabled');
    cy.get('div[data-cy="topbar-options"]').find('button')
      .should('exist')
      .and('be.disabled');
  });

  it("TCP4-4443: Verify that the controls from the INPUT FIELDS section have been added to the clipboard ", () => {
    // Clear local storage
    cy.clearLocalStorage();
    cy.visit("/");
    cy.openAcordeonByLabel("Input Fields");
    // Step 1: Dragging controls to screen drop zone
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    cy.get("[data-cy=controls-FormSelectList]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormButton]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormTextArea]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormDatePicker]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormCheckbox]").drag("[data-cy=screen-element-container]", { position: "top" });

    //Step 2: test add to clipboard button 
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(2) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(3) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(4) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(5) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(6) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get("[data-test=page-dropdown").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 6);
  });

  it("TCP4-4443: Verify that the controls from the CONTENT FIELDS section have been added to the clipboard ", () => {
    // Clear local storage
    cy.clearLocalStorage();
    cy.visit("/");
    cy.openAcordeonByLabel("Content Fields");

    cy.get("[data-cy=controls-FormHtmlViewer]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    cy.get("[data-cy=controls-FormImage]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormRecordList]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormNestedScreen]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=controls-FormMultiColumn]").drag("[data-cy=screen-element-container]", { position: "top" });

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(2) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(3) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(4) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(5) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(6) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get("[data-test=page-dropdown").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 6);
  });

  it("TCP4-4443: Verify that the control from the NAVIGATION section have been added to the clipboard", () => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.openAcordeonByLabel("Navigation");
    cy.wait(1000);
    
    
    cy.get('[data-cy=controls-FormButton]:contains("Page")').drag("[data-cy=screen-drop-zone]", { position: "bottom" });

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get("[data-test=page-dropdown").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 1);
  });

  it("TCP4-4443: Verify that the control from the FILES section have been added to the clipboard", () => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.openAcordeonByLabel("Files");
    cy.wait(1000);
    cy.get('[data-cy="controls"] > [data-cy="controls-FileUpload"]').drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    cy.get('[data-cy="controls"] > [data-cy="controls-FileDownload"]').drag("[data-cy=screen-element-container]", { position: "bottom" });

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");

    cy.get(':nth-child(2) > [data-cy="screen-element-container"]').click();
    cy.get('[data-cy="addToClipboard"]').should("be.visible");
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    cy.get('[data-cy="copied-badge"]').should("exist");


    cy.get("[data-test=page-dropdown").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 2);

  });
  it("Verify that focus out in rich text does not remove an item from the clipboard", () => {
    // STEP 1: Clear storage and navigate to homepage
    cy.clearLocalStorage();
    cy.visit("/");

    // STEP 2: Add HTML Viewer control and set content
    cy.openAcordeonByLabel("Content Fields");
    cy.wait(1000);
    cy.get('[data-cy="controls"] > [data-cy="controls-FormHtmlViewer"]').drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    cy.get("[data-cy=screen-element-container]").click();
    cy.window().then((win) => {
      win.tinymce.activeEditor.setContent('Hello, this is a test via API!');
    });

    // STEP 3: Add Input control and copy to clipboard
    cy.openAcordeonByLabel("Input Fields");
    cy.get("[data-cy=screen-element-container]").click();
    cy.get('[data-cy="controls"] > [data-cy="controls-FormInput"]').drag("[data-cy=screen-element-container]", { position: "bottom" });
    cy.get(':nth-child(2) > [data-cy="screen-element-container"]').click();
    cy.get('[data-cy="addToClipboard"]').click();

    // STEP 4: Update HTML content and verify clipboard badge
    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click();
    cy.window().then((win) => {
      win.tinymce.activeEditor.setContent('334444 qweq');
    });
    cy.get(':nth-child(2) > [data-cy="screen-element-container"]').click();
    cy.get('[data-cy="copied-badge"]').should("exist");
  });
});
