describe("Encrypted Field", () => {
  const visitAndOpenAcordeon = () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
  };

  const dragFormInput = () => {
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom",
    });
    cy.get("[data-cy=screen-element-container]").click();
  };

  const enterPreviewMode = () => {
    cy.get("[data-cy=mode-preview]").click();
  };

  const secretValue = "Secret Value";

  const uuid = "62abf17e-d1a6-4f68-a382-ed63872d29b0";

  it("Encrypted field properties and config", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    cy.get("[data-cy=accordion-Advanced]").click();
    // Enable encrypted
    cy.get("[data-cy=inspector-encryptedConfig]")
      .children()
      .children(".custom-control")
      .each((control) => {
        // forced click over the control
        control.children("input").trigger("click");
      });
    // Display available users/groups
    cy.get('[data-cy="inspector-encryptedConfig"] .multiselect').click();
    // Select a user
    cy.get('[data-cy="inspector-encryptedConfig"] #option-2-1').click();
    // Display available users/groups
    cy.get('[data-cy="inspector-encryptedConfig"] .multiselect').click();
    // Select a group
    cy.get('[data-cy="inspector-encryptedConfig"] #option-2-5').click();
    // Remove first selection
    cy.get('[data-cy="inspector-encryptedConfig"] .multiselect__tags i').first().click();
    // Display available users/groups
    cy.get('[data-cy="inspector-encryptedConfig"] .multiselect').click();
    // Select another user
    cy.get('[data-cy="inspector-encryptedConfig"] #option-2-2').click();
  });

  it("Encrypted field in preview", () => {
    visitAndOpenAcordeon();
    dragFormInput();
    cy.get("[data-cy=accordion-Advanced]").click();
    // Enable encrypted
    cy.get("[data-cy=inspector-encryptedConfig]")
      .children()
      .children(".custom-control")
      .each((control) => {
        // forced click over the control
        control.children("input").trigger("click");
      });
    // Display available users/groups
    cy.get('[data-cy="inspector-encryptedConfig"] .multiselect').click();
    // Select a group
    cy.get('[data-cy="inspector-encryptedConfig"] #option-2-4').click();
    // Go to preview mode
    enterPreviewMode();
    // Click in "Conceal" without data
    cy.get('[data-cy=preview-content] [name=form_input_1]').siblings('button').click();
    // Should have a validation error
    cy.shouldHaveValidationErrors("screen-field-form_input_1");
    // Write text in encrypted data
    cy.get("[data-cy=preview-content] [name=form_input_1]").type(secretValue);
    // Click in "Conceal" with data
    cy.get('[data-cy=preview-content] [name=form_input_1]').siblings('button').click();
    // Should not have a validation error
    cy.shouldNotHaveValidationErrors("screen-field-form_input_1");
    // After conceal should be in read only mode
    cy.get("[data-cy=preview-content] [name=form_input_1]").should("have.attr", "readonly");
    // After conceal the value should be different
    cy.get("[data-cy=preview-content] [name=form_input_1]").should("have.not.value", secretValue);
    // The value in data should be the uuid returned
    cy.assertPreviewData({
      form_input_1: uuid,
    });
    // Click in "Reveal"
    cy.get('[data-cy=preview-content] [name=form_input_1]').siblings('button').click();
    // After reveal should not be in read only mode
    cy.get("[data-cy=preview-content] [name=form_input_1]").should("have.not.attr", "readonly");
    // After conceal the value should be the same
    cy.get("[data-cy=preview-content] [name=form_input_1]").should("have.value", secretValue);
  });
});