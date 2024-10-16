describe("Verify that controls that are within multicolumn can be added to the clipboard", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.showValidationOnLoad();
    cy.intercept(
      "GET",
      "http://localhost:5173/api/1.0/screens/2576",
      {
        "id": 2576,
        "uuid": "9d3e5c56-0208-4c55-80bf-c2fa643d6c67",
        "screen_category_id": "1",
        "title": "screenToNestedTCP4-4443",
        "description": "Test",
        "type": "FORM",
        "config": [
          {
            "name": "screenToNestedTCP4-4443",
            "items": [
              {
                "label": "Line Input",
                "config": {
                  "icon": "far fa-square",
                  "name": "form_input_1",
                  "type": "text",
                  "label": "New Input",
                  "helper": null,
                  "dataFormat": "string",
                  "validation": null,
                  "placeholder": null
                },
                "component": "FormInput",

                "editor-control": "FormInput",
                "editor-component": "FormInput"
              },
              {
                "label": "Submit Button",
                "config": {
                  "icon": "fas fa-share-square",
                  "name": null,
                  "event": "submit",
                  "label": "New Submit",
                  "loading": false,
                  "tooltip": [],
                  "variant": "primary",
                  "fieldValue": null,
                  "loadingLabel": "Loading...",
                  "defaultSubmit": true
                },
                "component": "FormButton",
               
                "editor-control": "FormSubmit",
                "editor-component": "FormButton"
              }
            ],
            "order": 1
          }
        ],
        "computed": [],
        "custom_css": null,
        "created_at": "2024-09-18T01:37:43+00:00",
        "updated_at": "2024-10-14T13:13:46+00:00",
        "status": "ACTIVE",
        "key": null,
        "watchers": null,
        "translations": null,
        "is_template": 0,
        "asset_type": null,
        "projects": "[]"
      }
    );
  });

  it("TCP4-4446: Content selected should remain flagged as selected for pasting", () => {
    // Step 1: Load the initial JSON data and check screen content
    cy.loadFromJson("TCP4-4444.json", 0);
    // cy.get("[data-cy=screen-drop-zone]").should("not.contain.text", "Place your controls here.");

    cy.get(':nth-child(1) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");


    cy.get(':nth-child(2) > [data-cy="screen-element-container"]').click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(3) > [data-cy="screen-element-container"]').scrollIntoView({ offset: { top: -20, left: 0 } }).click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(4) > [data-cy="screen-element-container"]').scrollIntoView({ offset: { top: -20, left: 0 } }).click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");

    cy.get(':nth-child(5) > [data-cy="screen-element-container"]').scrollIntoView({ offset: { top: -20, left: 0 } }).click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("be.visible").click();
    cy.get('[data-cy="addToClipboard"]').should("not.exist");


    cy.get("[data-test=page-dropdown").click();
    cy.get("[data-test=clipboard]").should("exist").click({ force: true });
    cy.get('[data-cy="screen-element-container"]')
      .children()
      .should('have.length', 5);

  });
});
