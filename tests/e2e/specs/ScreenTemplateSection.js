describe('Screen Template Section', () => {
  it('Opens the screen template panel when Templates button is clicked', () => {
    cy.visit("/");
    cy.get("[data-cy=screen-templates]").click();
    cy.get("[data-cy=screen-templates-section]").should(
      "be.visible"
    );
  })
});

it("Closes the screen template panel when X button is clicked", () => {
  cy.visit("/");
  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=screen-templates-section]").should(
    "be.visible"
  );
  cy.get("[data-cy=close-templates-section]").click();
  cy.wait(2000);
  cy.get("[data-cy=screen-templates-section]").should(
    "not.exist"
  );
});

it("Displays My Templates when My Templates button is clicked", () => {
  cy.visit("/");
  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=screen-templates-section]").should(
    "be.visible"
  );
  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=my-templates-tab]").click();

  // CHECK REQUEST DATA FOR is_public = 0

  cy.intercept(
    "POST",
    "/api/1.0/scripts/execute/1",
    JSON.stringify({
      output: [
        {
          value: "Jobs",
          content: "Steve Jobs"
        },
        {
          value: "Musk",
          content: "Elon Musk"
        }
      ]
    })
  );

});

it("Displays Shared Templates when Shared Templates button is clicked", () => {
  cy.visit("/");
  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=screen-templates-section]").should(
    "be.visible"
  );
  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=shared-templates-tab]").click();

  // CHECK REQUEST DATA FOR is_public = 1

});

it("Is hidden when an Inspector Panel should open", () => {
  cy.visit("/");

  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=screen-templates-section]").should(
    "be.visible"
  );
  
  cy.setPreviewDataInput({ name: "" });
  cy.openAcordeon("collapse-1");
  cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
    position: "bottom"
  });
  cy.get("[data-cy=screen-element-container]").click();

  cy.get("[data-cy=screen-templates-section]").should(
    "not.exist"
  );
});