describe("refresh nested screen", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify main screen is refreshed with nested changes", () => {
    cy.loadFromJson("refresh_nested_screen.json", 0);

    // Preview the screen
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content]").should("contain.text", "Form Input 1");
    cy.get("[data-cy=preview-content]").should("contain.text", "Form Input 2");

    // Go back to edit the screen
    cy.get("[data-cy=mode-editor]").click();

    // CHANGE the nested screen content from behind the scenes
    cy.loadFromJson("refresh_nested_screen_2.json");

    // Preview the screen: It should show the new content
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content]").should(
      "contain.text",
      "CHANGED Form Input 1"
    );
    cy.get("[data-cy=preview-content]").should(
      "contain.text",
      "CHANGED Form Input 2"
    );

    // Go back to edit the screen: Should show the new content
    cy.get("[data-cy=mode-editor]").click();
    cy.get("[data-cy=editor-content]").should(
      "contain.text",
      "CHANGED Form Input 1"
    );
    cy.get("[data-cy=editor-content]").should(
      "contain.text",
      "CHANGED Form Input 2"
    );
  });

  it("Verify main screen is refreshed with nested nested changes", () => {
    cy.loadFromJson("refresh_nested_nested_screen.json", 0);

    // CHANGE the nested screen content from behind the scenes
    cy.loadFromJson("refresh_nested_nested_screen_2.json");

    cy.get("[data-cy=screen-element-container]").eq(0).click();
    cy.get("[data-cy=inspector-screen] div.multiselect").click();
    cy.get(
      '[data-cy=inspector-screen] span:contains("Nested Screen"):first'
    ).click();
    cy.get("[data-cy=inspector-screen] div.multiselect").click();
    cy.get(
      '[data-cy=inspector-screen] span:contains("Nested Screen"):first'
    ).click();

    // Should show the new content
    cy.get("[data-cy=editor-content]").should(
      "contain.text",
      "CHANGED Form Input 1"
    );
    cy.get("[data-cy=editor-content]").should(
      "contain.text",
      "CHANGED Nested Nested Input 1"
    );
  });
});
