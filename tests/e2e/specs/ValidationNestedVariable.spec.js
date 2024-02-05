describe("Validate nested variable", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.showValidationOnLoad();
  });

  it("Verify validations with nested variable user.properties.form_input_1", () => {
    // Variable name: user.properties.form_input_1

    cy.loadFromJson("validation_nested_variable.json", 0);
    // set init screen test data
    // cy.setPreviewDataInput({person: []});
    cy.get("[data-cy=mode-preview]").click();

    // Field is hidden by default
    cy.get(
      '[data-cy=preview-content] [name="user.properties.form_input_1"]'
    ).should("not.be.visible");
    // Should not be required
    cy.get('[data-cy=preview-content] [name="user.properties.form_input_1"]')
      .parent()
      .should("not.contain.text", "Field is required");
    // Should not be a valid email
    cy.get('[data-cy=preview-content] [name="user.properties.form_input_1"]')
      .parent()
      .should("not.contain.text", "Must be a valid email address");

    // When the checkbox is check it should be visible
    cy.get("[data-cy=preview-content] [name=form_checkbox_1]").click();
    cy.get(
      '[data-cy=preview-content] [name="user.properties.form_input_1"]'
    ).should("be.visible");

    // The field is required
    cy.get('[data-cy=preview-content] [name="user.properties.form_input_1"]')
      .parent()
      .should("contain.text", "Field is required");

    // The field should be an email
    cy.get('[data-cy=preview-content] [name="user.properties.form_input_1"]')
      .clear()
      .type("invalid email");
    cy.get('[data-cy=preview-content] [name="user.properties.form_input_1"]')
      .parent()
      .should("contain.text", "Must be a valid email address");

    cy.get('[data-cy=preview-content] [name="user.properties.form_input_1"]')
      .clear()
      .type("info@processmaker.com");
  });

  it("Verify validations with variable of three levels user.properties.three.form_input_1", () => {
    // Variable name: user.properties.form_input_1

    cy.loadFromJson("validation_nested_variable.json", 0);
    cy.get("[data-cy=screen-element-container]").eq(1).click();
    cy.get("[data-cy=inspector-name]")
      .clear()
      .type("user.properties.three.form_input_1");

    // set init screen test data
    // cy.setPreviewDataInput({person: []});
    cy.get("[data-cy=mode-preview]").click();

    // Field is hidden by default
    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    ).should("not.be.visible");
    // Should not be required
    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    )
      .parent()
      .should("not.contain.text", "Field is required");
    // Should not be a valid email
    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    )
      .parent()
      .should("not.contain.text", "Must be a valid email address");

    // When the checkbox is check it should be visible
    cy.get("[data-cy=preview-content] [name=form_checkbox_1]").click();
    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    ).should("be.visible");

    // The field is required
    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    )
      .parent()
      .should("contain.text", "Field is required");

    // The field should be an email
    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    )
      .clear()
      .type("invalid email");
    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    )
      .parent()
      .should("contain.text", "Must be a valid email address");

    cy.get(
      '[data-cy=preview-content] [name="user.properties.three.form_input_1"]'
    )
      .clear()
      .type("info@processmaker.com");
  });
});
