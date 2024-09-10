describe("select list dependent collection", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.intercept(
      "GET",
      "/api/1.0/collections*",
      JSON.stringify({
        data: [
          { id: 88, name: "States" },
          { id: 99, name: "Cities" }
        ]
      })
    );

    cy.intercept(
      "GET",
      "/api/1.0/collections/88/columns*",
      JSON.stringify({
        data: [
          { label: "name", field: "data.name" },
          { label: "code", field: "data.code" }
        ]
      })
    );

    cy.intercept(
      "GET",
      "/api/1.0/collections/99/columns*",
      JSON.stringify({
        data: [
          { label: "city", field: "data.city" },
          { label: "state", field: "data.state" }
        ]
      })
    );

    cy.intercept(
      "GET",
      "/api/1.0/collections/88/records*",
      JSON.stringify({
        data: [
          { id: 123, data: { name: "California", code: "CA" } },
          { id: 456, data: { name: "Nevada", code: "NV" } }
        ]
      })
    );

    cy.intercept(
      "GET",
      /collections\/99\/records.*NV/,
      JSON.stringify({
        data: [
          { id: 123, data: { city: "Las Vegas" } },
          { id: 456, data: { city: "Reno" } }
        ],
        meta: { total: 400 }
      })
    );

    // load individual record
    cy.intercept(
      "GET",
      /collections\/99\/records.*NV.*(Henderson|789)/,
      JSON.stringify({
        data: [{ id: 789, data: { city: "Henderson" } }],
        meta: { total: 1 }
      })
    );

    cy.intercept(
      "GET",
      /collections\/99\/records.*3344/,
      JSON.stringify({
        data: [],
        meta: { total: 0 }
      })
    );
  });

  it("Configure collection select list", () => {
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormSelectList]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-DataSource]").click();

    cy.get("[data-cy=inspector-data-sources]").select("Collection");
    cy.get("[data-cy=inspector-collection]").select("States");
    cy.get("[data-cy=inspector-collection-label]").select("name");
    cy.get("[data-cy=inspector-collection-value]").select(
      "Collection Record ID"
    );

    cy.get("[data-cy=mode-preview]").click();

    // Select a valid option
    cy.get('[data-cy="screen-field-form_select_list_1"]').selectOption(
      "Nevada"
    );

    // Assert value is set correctly
    cy.assertPreviewData({
      form_select_list_1: "456"
    });
  });

  it("Without dependent list option checked", () => {
    cy.loadFromJson("select_list_dependent_collection.json", 0);
    cy.get("[data-cy=mode-preview]").click();
    cy.get('[data-cy="screen-field-state"]').selectOption("Nevada");
    cy.get('[data-cy="screen-field-city"]').selectOption("Henderson");
    cy.assertPreviewData({
      state: "NV",
      city: "789",
      id_gt_than: "33",
      form_select_list_2: null
    });

    // Updating a value referenced with mustache in the PMQL should trigger a backend call
    cy.get('[data-cy="screen-field-id_gt_than"]').type("44");

    cy.assertPreviewData({
      state: "NV",
      city: null, // Reset value since it's not in the results
      id_gt_than: 3344,
      form_select_list_2: null
    });
  });

  describe("with city and state set", () => {
    const setup = () => {
      cy.loadFromJson("select_list_dependent_collection.json", 0);
      cy.setPreviewDataInput({
        city: "789",
        state: "NV"
      });
    };

    const assert = () => {
      cy.get("[data-cy=mode-preview]").click();
      cy.get('[data-cy="screen-field-city"] .multiselect__single').should(
        "have.text",
        "Henderson"
      );
      cy.assertPreviewData({
        state: "NV",
        city: "789",
        id_gt_than: "33",
        form_select_list_2: null
      });
    };

    it("Sets the correct city in the select list", () => {
      setup();
      assert();
    });
  });
});
