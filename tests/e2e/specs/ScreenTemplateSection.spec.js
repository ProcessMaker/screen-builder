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
  cy.get("[data-cy=screen-templates-section]").should(
    "not.exist"
  );
});

it("Displays My Templates when My Templates button is clicked", () => {
  cy.visit("/");

  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=screen-templates-section]").should("be.visible");
  
  cy.intercept(
    "GET",
    "/api/1.0/templates/screen?is_public=0",
    {
      statusCode: 200,
      body: {
        data: [{
          asset_type: null,
          description: "This is a sample screen description for testing.",
          editing_screen_uuid: null,
          id: 1,
          is_default_template: 0,
          is_owner: true,
          is_public: 0,
          is_system: 0,
          media: [],
          name: "My Templates Test",
          screen_custom_css: null,
          screen_type: "EMAIL",
          template_media: [],
          updated_at: "2024-09-10T18:18:27+00:00",
          user_id: 1,
          version: "1"
        }]
    }
  }
  ).as("fetchMyTemplates");

  cy.get("[data-cy=my-templates-tab]").click();

  cy.wait("@fetchMyTemplates");

  cy.get("[data-cy=my-templates-list]")
    .should("be.visible")
    .within(() => {
      cy.contains("My Templates Test").should("exist");
    });
});

it("Displays Shared Templates when Shared Templates button is clicked", () => {
  cy.visit("/");

  cy.get("[data-cy=screen-templates]").click();
  cy.get("[data-cy=screen-templates-section]").should("be.visible");
  
  cy.intercept(
    "GET",
    "/api/1.0/templates/screen?is_public=1",
    {
      statusCode: 200,
      body: {
        data: [{
          asset_type: null,
          description: "This is a sample screen description for testing.",
          editing_screen_uuid: null,
          id: 2,
          is_default_template: 0,
          is_owner: true,
          is_public: 1,
          is_system: 0,
          media: [],
          name: "Shared Templates Test",
          screen_custom_css: null,
          screen_type: "FORM",
          template_media: [],
          updated_at: "2024-09-10T18:18:27+00:00",
          user_id: 1,
          version: "1"
        }]
    }
  }
  ).as("fetchSharedTemplates");

  cy.get("[data-cy=shared-templates-tab]").click();

  cy.wait("@fetchSharedTemplates");

  cy.get("[data-cy=shared-templates-list]")
    .should("be.visible")
    .within(() => {
      cy.contains("Shared Templates Test").should("exist");
    });
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