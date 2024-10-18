describe("TCP4-4452 Verify reload page, remove button still present in the copied elements", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.showValidationOnLoad();
    cy.clearLocalStorage();
  });

  it("Verify that after reloading the page, all controls within each page are displayed with (-) button", () => {
    // Step 1: Load the initial JSON data and check screen content
    cy.loadFromJson("TCP4-4452.json", 0);
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .m-2 > .form-group').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .m-2').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    

    cy.get('#form_record_list_1 > .m-2').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
    // reload page
    cy.loadFromJson("TCP4-4452.json", 0);
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .m-2 > .form-group').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .m-2').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get('#form_record_list_1 > .m-2').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
  });
});
