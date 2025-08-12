describe("Dynamic Panels - Simplified", () => {
  beforeEach(() => {
    cy.visit("/");
    // Load the screen configuration from fixture
    cy.loadFromJson("dynamic_panels_screen.json", 0, "form");
  });

  it("should render the screen with dynamic panels correctly", () => {
    // Switch to preview mode
    cy.get("[data-cy=mode-preview]").click();

    // Verify the Index Number input is present
    cy.get("[data-cy=preview-content] [name=index]").should("be.visible");
    cy.get("[data-cy=preview-content] label").contains("Index Number").should("be.visible");

    // Verify the multicolumn structure is present
    cy.get("[data-cy=preview-content] .col-sm-6").should("have.length", 2);

    // Verify the loop inputs are present (should be 3 based on the configuration)
    cy.get("[data-cy=preview-content] [name=name]").should("have.length", 3);

    // Verify the dynamic panel is present
    cy.get("[data-cy=preview-content] [name=name]").should("be.visible");

    // Verify the submit button is present
    cy.get("[data-cy=preview-content] button").contains("New Submit").should("be.visible");
  });

  it("should test dynamic panel functionality with loop data", () => {
    // Switch to preview mode
    cy.get("[data-cy=mode-preview]").click();

    // Set preview data with loop items
    const testData = {
      index: "0",
      loop_1: [
        { name: "John Doe" },
        { name: "Jane Smith" },
        { name: "Bob Johnson" }
      ]
    };

    cy.setPreviewDataInput(testData);

    // Verify the Index Number field has the correct value
    cy.get("[data-cy=preview-content] [name=index]").should("have.value", "0");

    // Verify the loop inputs are populated correctly
    cy.get("[data-cy=preview-content] [name=name]").eq(0).should("have.value", "John Doe");
    cy.get("[data-cy=preview-content] [name=name]").eq(1).should("have.value", "Jane Smith");
    cy.get("[data-cy=preview-content] [name=name]").eq(2).should("have.value", "Bob Johnson");

    // Test dynamic panel functionality by changing the index
    cy.get("[data-cy=preview-content] [name=index]").clear().type("1");
    
    // Find the input field that has the "Selected Name" label and check its value
    // The dynamic panel should show the selected name based on the index
    cy.get("[data-cy=preview-content] label").contains("Selected Name").parent().find("input").should("have.value", "Jane Smith");

    // Test with index 0
    cy.get("[data-cy=preview-content] [name=index]").clear().type("0");
    cy.get("[data-cy=preview-content] label").contains("Selected Name").parent().find("input").should("have.value", "John Doe");

    // Test with index 2
    cy.get("[data-cy=preview-content] [name=index]").clear().type("2");
    cy.get("[data-cy=preview-content] label").contains("Selected Name").parent().find("input").should("have.value", "Bob Johnson");
    
    // Test with invalid index - the dynamic panel should not exist or be hidden
    cy.get("[data-cy=preview-content] [name=index]").clear().type("5");
    cy.get("[data-cy=preview-content] label").contains("Selected Name").should("not.exist");

    // Test with negative index - the dynamic panel should not exist
    cy.get("[data-cy=preview-content] [name=index]").clear().type("-1");
    cy.get("[data-cy=preview-content] label").contains("Selected Name").should("not.exist");

    // Test with non-numeric index - the dynamic panel should not exist
    cy.get("[data-cy=preview-content] [name=index]").clear().type("abc");
    cy.get("[data-cy=preview-content] label").contains("Selected Name").should("not.exist");
  });

  // test update loop items and see if the dynamic panel updates
  it("should test update loop items and see if the dynamic panel updates", () => {
    // Switch to preview mode
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=index]").clear().type("1");

    // Update the loop items
    cy.get("[data-cy=preview-content] [name=name]").eq(0).clear().type("Alice Cooper");
    cy.get("[data-cy=preview-content] [name=name]").eq(1).clear().type("Bob Dylan");
    cy.get("[data-cy=preview-content] [name=name]").eq(2).clear().type("Charlie Brown");

    // Verify the dynamic panel shows the correct selected name
    cy.get("[data-cy=preview-content] label").contains("Selected Name").parent().find("input").should("have.value", "Bob Dylan");

    // Update Bob Dylan
    cy.get("[data-cy=preview-content] [name=name]").eq(1).clear().type("Bob Dylan Updated");
    cy.get("[data-cy=preview-content] label").contains("Selected Name").parent().find("input").should("have.value", "Bob Dylan Updated");

  });

  it("should test form submission with dynamic panels", () => {
    // Switch to preview mode
    cy.get("[data-cy=mode-preview]").click();

    // Fill in the form data
    cy.get("[data-cy=preview-content] [name=index]").clear().type("1");
    cy.get("[data-cy=preview-content] [name=name]").eq(0).clear().type("Alice Cooper");
    cy.get("[data-cy=preview-content] [name=name]").eq(1).clear().type("Bob Dylan");
    cy.get("[data-cy=preview-content] [name=name]").eq(2).clear().type("Charlie Brown");

    // Verify the dynamic panel shows the correct selected name
    cy.get("[data-cy=preview-content] label").contains("Selected Name").parent().find("input").should("have.value", "Bob Dylan");

    // Wait for the submit button to be visible and click it
    cy.get('[data-cy=preview-content]').should('be.visible');
    cy.get('[data-cy=preview-content] button').contains('New Submit').click();

    // Verify the final data structure
    cy.assertPreviewData({
      index: "1",
      loop_1: [
        { name: "Alice Cooper" },
        { name: "Bob Dylan" },
        { name: "Charlie Brown" }
      ]
    });
  });

  it("should test state message with Mustache and html syntax", () => {
    // Switch to preview mode
    cy.get("[data-cy=mode-preview]").click();
    
    // Set up preview data with loop_1 array so {{loop_1.length}} resolves to "3"
    const testData = {
      index: "0",
      loop_1: [
        { name: "John Doe" },
        { name: "Jane Smith" },
        { name: "Bob Johnson" }
      ]
    };
    
    cy.setPreviewDataInput(testData);
    
    // Test with no data - should show default empty state message with Mustache processed
    cy.get("[data-cy=preview-content] [name=index]").clear().type("5"); // Invalid index
    
    // Verify the default empty state message is displayed with Mustache processed
    cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("contain", "No data available for this dynamic panel 3");
    
    // Verify HTML is rendered (not escaped)
    cy.get("[data-cy=preview-content] .dynamic-panel-empty h3").should("be.visible");
    cy.get("[data-cy=preview-content] .dynamic-panel-empty h3").should("contain", "No data available for this dynamic panel 3");
    
    // Test with valid data - should show the panel content
    cy.get("[data-cy=preview-content] [name=index]").clear().type("0");
    cy.get("[data-cy=preview-content] label").contains("Selected Name").should("be.visible");
    
    // Test with another invalid index to show empty state again
    cy.get("[data-cy=preview-content] [name=index]").clear().type("10");
    cy.get("[data-cy=preview-content] .dynamic-panel-empty").should("contain", "No data available for this dynamic panel 3");
  });

}); 