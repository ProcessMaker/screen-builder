describe("RAOS 1.0.0 Account Opening Customer Form", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify Calcs with visibility rules update immediately on the same screen", () => {
    cy.loadFromJson("RAOS1.0.0AccountOpeningCustomerForm.json", 1);

    cy.get("[data-cy=mode-preview]").click();

    // add a new account
    cy.get(
      "[data-cy=preview-content] [data-cy='loop-additionalAccounts-add']"
    ).click();
    // select the first account type: "Checking Account"
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-productType']"
    ).selectOption("Checking Account");
    // click on continue
    cy.get("[data-cy=preview-content] [aria-label='Continue']").eq(0).click();
    // choose funding method
    cy.get("[data-cy=preview-content] [data-cy='screen-field-fundingMethod']")
      .eq(0)
      .click();
    // "initialDepositOther" field must be visible
    cy.get("[data-cy=preview-content] [name='initialDepositOther']")
      .eq(0)
      .should("be.visible");

    // check that ONLY requireInitialDepositOther property was initialized in accounts variable
    cy.assertPreviewData({
      accounts: [
        {
          product: "Checking",
          initialDepositOther: 0,
          requireInitialDepositOther: "Yes"
        }
      ],
      showFundingAccountLoop: true,
      additionalAccounts: [
        {
          productType: "Checking"
        }
      ],
      fundingMethod: "Transfer from Existing Quaint Oak Account",
      externalBank: "",
      externalAccountType: null,
      externalAccountName: "",
      externalRoutingNumber: "",
      externalAccountNumber: "",
      internalAccountType: null,
      internalAccountNumber: ""
    });
  });
});
