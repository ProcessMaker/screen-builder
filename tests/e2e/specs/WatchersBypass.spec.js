describe("Watchers", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "/api/1.0/screens/1",
      JSON.stringify({
        id: 1,
        screen_category_id: 1,
        title: "Sub screen example",
        description: "A sub screen example",
        type: "FORM",
        config: [
          {
            name: "Sub screen example",
            items: [
              {
                config: {
                  icon: "far fa-square",
                  label: "First name",
                  name: "firstname",
                  placeholder: "",
                  validation: "",
                  helper: null,
                  type: "text",
                  dataFormat: "string",
                  customCssSelector: "first-name"
                },
                inspector: [],
                component: "FormInput",
                "editor-component": "FormInput",
                "editor-control": "FormInput",
                label: "Line Input",
                value: "__vue_devtool_undefined__"
              },
              {
                config: {
                  icon: "far fa-square",
                  label: "Last name",
                  name: "lastname",
                  placeholder: "",
                  validation: "",
                  helper: null,
                  type: "text",
                  dataFormat: "string",
                  customCssSelector: ""
                },
                inspector: [],
                component: "FormInput",
                "editor-component": "FormInput",
                "editor-control": "FormInput",
                label: "Line Input",
                value: "__vue_devtool_undefined__"
              }
            ]
          }
        ],
        computed: [],
        watchers: [],
        custom_css: "[selector='first-name'] label { font-style: italic; }",
        status: "ACTIVE"
      })
    );

    cy.intercept(
      "POST",
      "/api/1.0/scripts/execute/1",
      JSON.stringify({
        output: {
          name: "Steve"
        }
      })
    );
  });

  Cypress.Commands.add('setupFormInput', (inputName) => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", { position: "bottom" });
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-element-container]", { position: "top" });
    cy.get("[data-cy=screen-element-container]").last().click();
    cy.get("[data-cy=inspector-name]").clear().type(inputName);
  });

  Cypress.Commands.add('createWatcher', (bypass = false) => {
    cy.get('[data-cy="topbar-watchers"]').click();
    cy.get('[data-cy="watchers-add-watcher"]').click();
    cy.get('[data-cy="watchers-watcher-name"]').clear().type("Watcher test");
    cy.setMultiselect('[data-cy="watchers-watcher-variable"]', "form_input_2");
    cy.get('[data-cy="watchers-accordion-source"]').click({ waitForAnimations: true });
    cy.setMultiselect('[data-cy="watchers-watcher-source"]', "Test Script");
    cy.setVueComponentValue('[data-cy="watchers-watcher-input_data"]', '{"form_input_2":"{{form_input_2}}"}');
    cy.get('[data-cy="watchers-accordion-output"]').click({ waitForAnimations: true });
    cy.get('[data-cy="watchers-watcher-output_variable"]').clear().type("user");
    cy.get('[data-cy="watchers-button-save"]').click();
    cy.get('[data-cy="watchers-table"]').should("contain.text", "Watcher test");
    if (bypass) {
      cy.get('[data-test="watchers-bypass"]').click();
    }
    cy.get('[data-cy="watchers-modal"] .close').click();
  });

  function runWatcherTest(bypass) {
    cy.setupFormInput("user.name");
    cy.createWatcher(bypass);
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_2]").clear().type("name");
    cy.get("#watchers-synchronous").should("not.exist");
    cy.wait(3000);
    const expectedData = {
      form_input_2: "name",
      user: {
        name: bypass ? "" : "Steve"
      }
    };
    cy.assertPreviewData(expectedData);
  }

  it("Ensure that a watch is not bypassed", () => {
    runWatcherTest(false);
  });

  it("Ensure that a watch is bypassed", () => {
    runWatcherTest(true);
  });
});
