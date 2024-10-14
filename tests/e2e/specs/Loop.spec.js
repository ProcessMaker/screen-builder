describe("Loop control", () => {
  it("Input inside loop", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    // Add loop control
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]").clear().type("rows");
    cy.get("[data-cy=inspector-source]").select("existing");
    cy.get("[data-cy=inspector-add]").click();

    // Add input to loop
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container] .column-draggable div",
      { position: "bottom" }
    );

    // Preview
    cy.get("[data-cy=mode-preview]").click();

    cy.assertPreviewData({
      rows: []
    });

    // Change source to new array
    cy.get("[data-cy=mode-editor]").click();
    cy.get("[data-cy=inspector-source]").select("new");
    cy.get("[data-cy=inspector-times]").clear().type("2");

    // Preview
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.length",
      2
    );
    cy.get("[data-cy=preview-content] [name=form_input_1]")
      .eq(0)
      .clear()
      .type("one");
    cy.get("[data-cy=preview-content] [name=form_input_1]")
      .eq(1)
      .clear()
      .type("two");

    cy.get("[data-cy=preview-content] [data-cy=loop-rows-add]").click();
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.length",
      3
    );
    cy.get("[data-cy=preview-content] [name=form_input_1]")
      .eq(2)
      .clear()
      .type("three");

    cy.assertPreviewData({
      rows: [
        { form_input_1: "one" },
        { form_input_1: "two" },
        { form_input_1: "three" }
      ]
    });

    // Remove items
    cy.get("[data-cy=preview-content] [data-cy=loop-rows-remove]").click();
    cy.on("window:confirm", () => true);

    cy.assertPreviewData({
      rows: [{ form_input_1: "one" }, { form_input_1: "two" }]
    });
  });

  it("Verify validation on visible fields", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    // Add loop control
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]");
    cy.get("[data-cy=inspector-source]").select("existing");

    // Add input to loop
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container] .column-draggable div",
      { position: "bottom" }
    );
    cy.get("[data-cy=controls-FormInput]").drag(
      "[data-cy=screen-element-container] .column-draggable div",
      { position: "top" }
    );

    // Configure Validation rule
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-label]").click().clear().type("New Input 2");
    cy.get("[data-cy=add-rule]").click();
    cy.get("[data-cy=select-rule]").click().type("Required{enter}{esc");
    cy.get("[data-cy=save-rule]").click();

    // Set Visibility rule
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-conditionalHide]")
      .clear()
      .type('name !== "foo"');

    // Add submit button
    cy.get("[data-cy=controls-FormButton]")
      .contains("Submit Button")
      .drag("[data-cy=screen-element-container]", { position: "bottom" });

    cy.setPreviewDataInput('{"loop_1":[{"name": "foo"}]}');

    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=form_input_2]").should(
      "not.be.visible"
    );

    // submit form valid
    cy.get(
      '[data-cy=preview-content] [name="Default"] > :nth-child(2) > .form-group > .btn'
    ).click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Preview Form was Submitted");
    });
  });

  it("Runs validations on loops referencing same variable ", () => {
    cy.visit("/");

    let alert = false;
    cy.on("window:alert", (msg) => (alert = msg));
    cy.loadFromJson("multi_loop_validations.json", 0);

    cy.setPreviewDataInput('{"accounts": [{"name": "foobar"}]}');

    cy.get("[data-cy=mode-preview]").click();

    //  Add data to input field in last loop
    cy.get("[data-cy=screen-field-form_input_2]").type("bar");
    cy.wait(1000);

    // Ensure the form cannot yet be submitted
    cy.get(":nth-child(4) > .form-group > .btn")
      .click()
      .then(() => expect(alert).to.equal(false));

    // Fill out the required missing field; ensure the form *can* be submitted
    cy.get("[data-cy=screen-field-form_input_1]").type("text");

    cy.get(":nth-child(4) > .form-group > .btn");
  });

  it("Verify validation with multicolumn ", () => {
    cy.visit("/");
    let alert = false;
    cy.on("window:alert", (msg) => (alert = msg));

    // Add loop control
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]");
    cy.get("[data-cy=inspector-source]").select("existing");

    // Add multicolumn to loop
    cy.get("[data-cy=controls-FormMultiColumn]").drag(
      "[data-cy=screen-element-container] .column-draggable div",
      { position: "bottom" }
    );

    // Set multicolumn Visibility Rule
    cy.get(".mb-1 > :nth-child(1) > .row > :nth-child(1)").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-conditionalHide]").clear().type('name != "foo"');

    // Add input to multicolumn
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag(
      ".mb-1 > :nth-child(1) > .row > :nth-child(1)",
      { position: "bottom" }
    );

    // Configure Validation rule
    cy.get("#form_input_1 > .m-2").click();
    cy.get("[data-cy=add-rule]").click();
    cy.get("[data-cy=select-rule]").click().type("Required{enter}{esc");
    cy.get("[data-cy=save-rule]").click();

    // Add submit button
    cy.get("[data-cy=controls-FormButton]")
      .contains("Submit Button")
      .drag("[data-cy=screen-element-container]", { position: "bottom" });

    // Set preview data
    cy.setPreviewDataInput('{"loop_1":[{"name": "bar"}, {"name": "foo"}]}');

    cy.get("[data-cy=mode-preview]").click();
    cy.get(
      ":nth-child(2) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > .row > :nth-child(1)"
    ).should("not.be.visible");

    // Ensure form cannot be submitted
    cy.get('[name="Default"] > :nth-child(2) > .form-group > .btn')
      .click()
      .then(() => expect(alert).to.equal(false));

    // Add data to input field
    cy.get(
      ":nth-child(1) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > .row > :nth-child(1) > :nth-child(1) > .form-group > [data-cy=screen-field-form_input_1]"
    )
      .clear()
      .type("foobar")
      .blur();

    // Ensure form can be submitted
    cy.get(".form-group > .btn")
      .click()
      .then(() => expect(alert).to.equal("Preview Form was Submitted"));
  });

  it("Verify validation with nested loop ", () => {
    cy.visit("/");
    let alert = false;
    cy.on("window:alert", (msg) => (alert = msg));

    // Add loop contro
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]");
    cy.get("[data-cy=inspector-source]").select("existing");

    // Add loop to loop
    cy.get("[data-cy=controls-FormLoop]").drag(
      "[data-cy=screen-element-container] .column-draggable div",
      { position: "bottom" }
    );

    // Set nested loop Visibility Rule
    cy.get(".m-2").click();
    cy.get("[data-cy=inspector-times]").clear().type(1);
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-conditionalHide]").clear().type('name != "foo"');

    // Add input to nested loop
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag(
      ".m-2 > .column-draggable > div",
      { position: "bottom" }
    );

    // Configure Input Validation rule
    cy.get("#form_input_1 > .m-2").click();
    cy.get("[data-cy=add-rule]").click();
    cy.get("[data-cy=select-rule]").click().type("Required{enter}{esc");
    cy.get("[data-cy=save-rule]").click();

    // Add submit button
    cy.get("[data-cy=controls-FormButton]")
      .contains("Submit Button")
      .drag("[data-cy=screen-element-container]", { position: "bottom" });

    // Set preview data
    cy.setPreviewDataInput('{"loop_1":[{"name": "bar"}, {"name": "foo"}]}');

    cy.get("[data-cy=mode-preview]").click();
    cy.get('[name="loop_1"] > :nth-child(2) > :nth-child(1)').should(
      "not.be.visible"
    );

    // Ensure form cannot be submitted
    cy.get('[name="Default"] > :nth-child(2) > .form-group > .btn')
      .click()
      .then(() => expect(alert).to.equal(false));

    // Add data to input field
    cy.get(
      ':nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > [name="loop_2"] > :nth-child(1) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > .form-group > [data-cy=screen-field-form_input_1]'
    )
      .clear()
      .type("foobar")
      .blur();

    // Ensure form can be submitted
    cy.get('[name="Default"] > :nth-child(2) > .form-group > .btn')
      .click()
      .then(() => expect(alert).to.equal("Preview Form was Submitted"));
  });

  it("Verify validation with nested screen ", () => {
    // Load Nested Screen

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
                  validation: "required",
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

    cy.visit("/");
    cy.showValidationOnLoad();
    let alert = false;
    cy.on("window:alert", (msg) => (alert = msg));
    cy.openAcordeon("collapse-3");

    // Add loop control
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-name]");
    cy.get("[data-cy=inspector-source]").select("existing");

    // Add nested screen to loop
    cy.get("[data-cy=controls-FormNestedScreen]").drag(
      "[data-cy=screen-element-container] .column-draggable div",
      { position: "bottom" }
    );
    cy.get(".m-2").click();
    cy.get(".multiselect__tags")
      .click()
      .wait(1000)
      .type("{downarrow}{enter}{esc}");

    // Set Nested Screen Visibility Rule
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-conditionalHide]").clear().type('name != "foo"');

    // Add submit button
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormButton]")
      .contains("Submit Button")
      .drag("[data-cy=screen-element-container]", { position: "bottom" });

    // Set preview data
    cy.setPreviewDataInput('{"loop_1":[{"name": "bar"}, {"name": "foo"}]}');

    cy.get("[data-cy=mode-preview]").click();
    cy.get('[name="loop_1"] > :nth-child(2) > :nth-child(1)').should(
      "not.be.visible"
    );
    cy.wait(1000);
    cy.get(
      ':nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > [data-cy="screen-field-Nested Screen"] > [data-cy=screen-renderer] > :nth-child(1) > .page > [selector="first-name"] > .form-group > [data-cy=screen-field-firstname]'
    )
      .parent()
      .find(".invalid-feedback")
      .should("be.visible");

    // Ensure form cannot be submitted
    cy.get('[name="Default"] > :nth-child(2) > .form-group > .btn')
      .click()
      .then(() => expect(alert).to.equal(false));

    // Add data to input field
    cy.get(
      ':nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > [data-cy="screen-field-Nested Screen"] > [data-cy=screen-renderer] > :nth-child(1) > .page > [selector="first-name"] > .form-group > [data-cy=screen-field-firstname]'
    )
      .clear()
      .type("foobar")
      .blur();

    // Ensure form can be submitted
    cy.get('[name="Default"] > :nth-child(2) > .form-group > .btn')
      .click()
      .then(() => expect(alert).to.equal("Preview Form was Submitted"));
  });
});
