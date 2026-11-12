describe("Required whitespace validation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.loadFromJson("required_whitespace.json", 0);
    cy.get("[data-cy=mode-preview]").click();
  });

  it("blocks whitespace-only values without modifying valid input", () => {
    let alert = false;
    cy.on("window:alert", (message) => {
      alert = message;
    });

    cy.get("[data-cy=preview-content] [name=required_input]").type("   ", {
      parseSpecialCharSequences: false
    });
    cy.get("[data-cy=preview-content] [name=required_textarea]").type("   ", {
      parseSpecialCharSequences: false
    });
    cy.get("[data-cy=preview-content] [name=submit_button]").click();

    cy.shouldHaveValidationErrors("screen-field-required_input");
    cy.shouldHaveValidationErrors("screen-field-required_textarea");
    cy.then(() => expect(alert).to.equal(false));

    cy.get("[data-cy=preview-content] [name=required_input]")
      .clear()
      .type("  value  ", { parseSpecialCharSequences: false })
      .should("have.value", "  value  ");
    cy.get("[data-cy=preview-content] [name=required_textarea]")
      .clear()
      .type("  value  ", { parseSpecialCharSequences: false })
      .should("have.value", "  value  ");

    cy.shouldNotHaveValidationErrors("screen-field-required_input");
    cy.shouldNotHaveValidationErrors("screen-field-required_textarea");
    cy.get("[data-cy=preview-content] [name=submit_button]").click();
    cy.then(() => expect(alert).to.equal("Preview Form was Submitted"));
  });
});
