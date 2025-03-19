describe("Clipboard Page and Control Duplication", () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should allow duplicating controls within the clipboard page", () => {
    //STEP 1: Add initial control to clipboard
    cy.openAcordeonByLabel("Input Fields");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    
    //STEP 2: Add control to clipboard
    cy.get('[data-cy="screen-element-container"]').click();
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="copied-badge"]').should("exist");

    //STEP 3: Navigate to clipboard page
    cy.get("[data-test=page-dropdown]").click(); 
    cy.get("[data-test=clipboard]").click({ force: true });

    //STEP 4: Verify initial control exists
    cy.get('[data-cy="editor-content"]')
      .children()
      .should('have.length', 1);

    //STEP 5: Test duplicating control multiple times
    cy.get('[data-cy="screen-element-container"]').first().click();
    cy.get('[data-test="copy-control-btn"]').click();
    
    cy.get('[data-cy="editor-content"]')
      .children()
      .should('have.length', 2);

    cy.get('[data-test="copy-control-btn"]').click();
    
    cy.get('[data-cy="editor-content"]')
      .children() 
      .should('have.length', 3);
  });

  it("should maintain control properties when duplicating", () => {
    //STEP 1: Add and configure initial control
    cy.openAcordeonByLabel("Input Fields");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    
    //STEP 2: Configure the control
    cy.get('[data-cy="screen-element-container"]').click();
    cy.get('[data-cy="inspector-label"]').clear().type("Test Label");
    cy.get('[data-cy="inspector-name"]').clear().type("test_field");
    
    //STEP 3: Add to clipboard and navigate
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get("[data-test=page-dropdown]").click();
    cy.get("[data-test=clipboard]").click({ force: true });
    
    //STEP 4: Duplicate control
    cy.get('[data-cy="screen-element-container"]').first().click();
    cy.get('[data-test="copy-control-btn"]').click();
    
    //STEP 5: Verify properties are maintained
    cy.get('[data-cy="screen-element-container"]').eq(1).click();
    cy.get('[data-cy="inspector-label"]').should('have.value', 'Test Label');
    cy.get('[data-cy="inspector-name"]').should('have.value', 'test_field');
  });


  it("should handle edge cases in control duplication", () => {
    //STEP 1: Add control with special characters
    cy.openAcordeonByLabel("Input Fields");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    
    //STEP 2: Configure with special characters
    cy.get('[data-cy="screen-element-container"]').click();
    cy.get('[data-cy="inspector-label"]').clear().type("Special $#@! Characters");
    cy.get('[data-cy="inspector-name"]').clear().type("special_chars_123");
    
    //STEP 3: Add to clipboard and navigate
    cy.get('[data-cy="addToClipboard"]').click();
    cy.get("[data-test=page-dropdown]").click();
    cy.get("[data-test=clipboard]").click({ force: true });
    
    //STEP 4: Rapid duplicate clicks
    cy.get('[data-cy="screen-element-container"]').first().click();
    cy.get('[data-test="copy-control-btn"]').click().click().click();
    
    //STEP 5: Verify duplicates and properties
    cy.get('[data-cy="editor-content"]')
      .children()
      .should('have.length', 4);
    
    cy.get('[data-cy="screen-element-container"]').last().click();
    cy.get('[data-cy="inspector-label"]').should('have.value', 'Special $#@! Characters');
    cy.get('[data-cy="inspector-name"]').should('have.value', 'special_chars_123');
  });

  it("should allow duplicating controls in the Default page", () => {
     //STEP 3: Navigate to clipboard page
     cy.get("[data-test=page-dropdown]").click(); 
     cy.get("[data-test=page-Default]").click({ force: true });
    //STEP 1: Add initial control to screen
    cy.openAcordeonByLabel("Input Fields");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    

    //STEP 2: Configure the control
    cy.get('[data-cy="screen-element-container"]').click();
    cy.get('[data-cy="inspector-label"]').clear().type("Original Control");
    cy.get('[data-cy="inspector-name"]').clear().type("original_field");
    
    //STEP 3: Duplicate control in Default page
    cy.get('[data-test="copy-control-btn"]').click();
    
    //STEP 4: Verify duplicate exists and maintains properties
    cy.get('[data-cy="editor-content"]')
      .children()
      .should('have.length', 2);
    
    cy.get('[data-cy="screen-element-container"]').last().click();
    cy.get('[data-cy="inspector-label"]').should('have.value', 'Original Control');
    cy.get('[data-cy="inspector-name"]').should('have.value', 'original_field');
    
    //STEP 5: Test multiple duplications
    cy.get('[data-test="copy-control-btn"]').click();
    cy.get('[data-test="copy-control-btn"]').click();
    
    cy.get('[data-cy="editor-content"]')
      .children()
      .should('have.length', 4);
  });

});

