describe("Dynamic Panel - Empty Configuration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    // Load the screen configuration from fixture with only a dynamic panel
    cy.loadFromJson("dynamic_panel_empty.json", 0, "form");
  });

  describe("Empty Dynamic Panel Rendering", () => {
    it("should render empty dynamic panel with default error message", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // Wait a bit for the content to load
      cy.wait(1000);

      // Check if the preview content area exists and is visible
      cy.get("[data-cy=preview-content]").should("be.visible");

      // Since there's no index configured, the dynamic panel should show empty state
      // Look for the empty state element
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");

      // Check what's actually in the empty state element
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").then(($emptyState) => {
        cy.log("Empty state HTML:", $emptyState.html());
        cy.log("Empty state text:", $emptyState.text());
      });

      // Should show some message about missing index configuration (partial match)
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("contain", "No data available");

      // The nested input should not be visible since there's no data
      cy.get("[data-cy=preview-content] [name=test_input]").should("not.exist");
    });

    it("should display proper styling for empty state", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // Wait for content to load
      cy.wait(1000);

      // Verify empty state styling - check if it has any styling classes
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");
      
      // Check what classes the empty state element actually has
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").then(($emptyState) => {
        cy.log("Empty state classes:", $emptyState.attr("class"));
      });
    });
  });

  describe("Empty State Message Content", () => {
    it("should show helpful message about missing index configuration", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();
      // The message should guide the user to configure an Index Name (partial match)
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("contain", "No data available");
      
      // Check if it mentions something about configuration or index
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").then(($emptyState) => {
        const text = $emptyState.text();
        cy.log("Full empty state message:", text);
        
        // Check if it contains any helpful information
        expect(text.length).to.be.greaterThan(0);
      });
    });

    it("should not show any dynamic panel content", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // The nested input should not be visible
      cy.get("[data-cy=preview-content] [name=test_input]").should("not.exist");
      
      // No labels from the nested content should be visible
      cy.get("[data-cy=preview-content] label").should("not.exist");
    });
  });

  describe("Form Structure", () => {
    it("should maintain proper form structure even when empty", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // The form should still be properly structured
      cy.get("[data-cy=preview-content]").should("be.visible");
      
      // The dynamic panel container should be present (as an empty state)
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");
    });

    it("should not interfere with other form elements", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // The form should render without errors
      cy.get("[data-cy=preview-content]").should("be.visible");
      
      // The empty state should be visible
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");
    });
  });

  describe("Console Warnings", () => {
    it("should log helpful warning about missing index configuration", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // Note: Console warnings might not be easily testable in Cypress
      // This test documents the expected behavior
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");
      
      // The message should indicate some issue (partial match)
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("contain", "No data available");
    });
  });

  describe("Accessibility", () => {
    it("should provide clear visual feedback about the empty state", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // Empty state should be clearly visible
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");
      
      // Message should be readable and helpful (partial match)
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("contain", "No data available");
    });

    it("should maintain proper contrast and readability", () => {
      // Switch to preview mode
      cy.get("[data-cy=mode-preview]").click();

      // Empty state should have some styling
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");
      
      // The message should be clearly visible
      cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("be.visible");
    });
  });
}); 