describe("FOUR-7257 validations", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.showValidationOnLoad();
  });

  it("Verify FOUR-7257 has validations", () => {
    cy.loadFromJson("NestedScreenFOUR-7257.json", 0);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    // click on "enable controls" button
    cy.get(
      "[data-cy=preview-content] button[aria-label='enable controls']"
    ).click();

    // Verify validations are active
    // form_input_1 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.class",
      "is-invalid"
    );
    // type numbers in form_input_2 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_2]").type("123");
    cy.get("[data-cy=preview-content] [name=form_input_2]").should(
      "have.class",
      "is-invalid"
    );
    // type non alpha-numerics in form_input_3 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_3]").type(".,");
    cy.get("[data-cy=preview-content] [name=form_input_3]").should(
      "have.class",
      "is-invalid"
    );
    // form_input_4 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_4]").should(
      "have.class",
      "is-invalid"
    );
    // type invalid email in form_input_5 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_5]").type("test");
    cy.get("[data-cy=preview-content] [name=form_input_5]").should(
      "have.class",
      "is-invalid"
    );
    // form_input_6 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_6]").should(
      "have.class",
      "is-invalid"
    );
    // empty required form_input_7 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_7]").should(
      "have.class",
      "is-invalid"
    );
    // invalid url in form_input_8 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_8]").type("test");
    cy.get("[data-cy=preview-content] [name=form_input_8]").should(
      "have.class",
      "is-invalid"
    );
    // type 9 in form_input_9 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_9]").type("9");
    cy.get("[data-cy=preview-content] [name=form_input_9]").should(
      "have.class",
      "is-invalid"
    );
    // unselected form_select_list_1 is invalid
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_select_list_1']"
    )
      .parent()
      .should("have.class", "has-errors");
    // unselected form_checkbox_1 is invalid
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_checkbox_1']"
    ).should("have.class", "is-invalid");
  });

  it("Verify Nested FOUR-7257 has validations", () => {
    cy.loadFromJson("NestedScreenFOUR-7257.json", 1);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    // click on "enable controls" button
    cy.get(
      "[data-cy=preview-content] button[aria-label='enable controls']"
    ).click();

    // Verify validations are active
    // form_input_1 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.class",
      "is-invalid"
    );
    // type numbers in form_input_2 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_2]").type("123");
    cy.get("[data-cy=preview-content] [name=form_input_2]").should(
      "have.class",
      "is-invalid"
    );
    // type non alpha-numerics in form_input_3 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_3]").type(".,");
    cy.get("[data-cy=preview-content] [name=form_input_3]").should(
      "have.class",
      "is-invalid"
    );
    // form_input_4 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_4]").should(
      "have.class",
      "is-invalid"
    );
    // type invalid email in form_input_5 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_5]").type("test");
    cy.get("[data-cy=preview-content] [name=form_input_5]").should(
      "have.class",
      "is-invalid"
    );
    // form_input_6 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_6]").should(
      "have.class",
      "is-invalid"
    );
    // empty required form_input_7 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_7]").should(
      "have.class",
      "is-invalid"
    );
    // invalid url in form_input_8 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_8]").type("test");
    cy.get("[data-cy=preview-content] [name=form_input_8]").should(
      "have.class",
      "is-invalid"
    );
    // type 9 in form_input_9 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_9]").type("9");
    cy.get("[data-cy=preview-content] [name=form_input_9]").should(
      "have.class",
      "is-invalid"
    );
    // unselected form_select_list_1 is invalid
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_select_list_1']"
    )
      .parent()
      .should("have.class", "has-errors");
    // unselected form_checkbox_1 is invalid
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_checkbox_1']"
    ).should("have.class", "is-invalid");
  });

  it("Verify Nested FOUR-7257/FOUR-7290 has validations with additional Nested", () => {
    cy.loadFromJson("Nested screen FOUR-7257 4.4.0RC2.json", 1);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    // click on "enable controls" button
    cy.get(
      "[data-cy=preview-content] button[aria-label='enable controls']"
    ).click();

    // Verify validations are active
    // form_input_1 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_1]").should(
      "have.class",
      "is-invalid"
    );
    // type numbers in form_input_2 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_2]").type("123");
    cy.get("[data-cy=preview-content] [name=form_input_2]").should(
      "have.class",
      "is-invalid"
    );
    // type non alpha-numerics in form_input_3 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_3]").type(".,");
    cy.get("[data-cy=preview-content] [name=form_input_3]").should(
      "have.class",
      "is-invalid"
    );
    // form_input_4 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_4]").should(
      "have.class",
      "is-invalid"
    );
    // type invalid email in form_input_5 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_5]").type("test");
    cy.get("[data-cy=preview-content] [name=form_input_5]").should(
      "have.class",
      "is-invalid"
    );
    // form_input_6 = invalid
    cy.get("[data-cy=preview-content] [name=form_input_6]").should(
      "have.class",
      "is-invalid"
    );
    // empty required form_input_7 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_7]").should(
      "have.class",
      "is-invalid"
    );
    // invalid url in form_input_8 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_8]").type("test");
    cy.get("[data-cy=preview-content] [name=form_input_8]").should(
      "have.class",
      "is-invalid"
    );
    // type 9 in form_input_9 is invalid
    cy.get("[data-cy=preview-content] [name=form_input_9]").type("9");
    cy.get("[data-cy=preview-content] [name=form_input_9]").should(
      "have.class",
      "is-invalid"
    );
    // unselected form_select_list_1 is invalid
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_select_list_1']"
    )
      .parent()
      .should("have.class", "has-errors");
    // unselected form_checkbox_1 is invalid
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_checkbox_1']"
    ).should("have.class", "is-invalid");
  });
});
