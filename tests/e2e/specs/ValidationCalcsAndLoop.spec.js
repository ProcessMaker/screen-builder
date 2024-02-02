describe("Validation Calcs properties and loop", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Data is fully accessible from a collection screen", () => {
    cy.loadFromJson("FOUR-4853.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-data-input]")
      .click()
      .focused()
      .type("{backspace}{backspace}")
      .type('{\n"foo": {\n"one": "one",\n"two": "two"');

    cy.get("[data-cy=mode-editor]").click();
    cy.get("[data-cy=mode-preview]").click();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-foo.two"]')
      .parent()
      .should("contain.text", "two");

    cy.get(":nth-child(2) > .form-group > :nth-child(1) > div > p").should(
      "contain.text",
      "output: one"
    );
  });

  it("Calcs working with select list and loop", () => {
    cy.loadFromJson("FOUR-5086.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-form_select_list_1"]'
    ).selectOption("Don Quijote");

    cy.get('[data-cy=preview-content] [data-cy="screen-field-cant"]').type(
      "12"
    );

    // Check final result
    cy.assertPreviewData({
      form_select_list_1: [
        {
          value:
            "https://www.infobae.com/new-resizer/9gv8XYFq7qmOw86jtRR_u7AlDdI=/420x630/filters:format(jpg):quality(85)/s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2016/07/20201800/mejores-libros-Don-Quijote-sf.jpg",
          content: "Don Quijote"
        }
      ],
      loop_1: [
        {
          value:
            "https://www.infobae.com/new-resizer/9gv8XYFq7qmOw86jtRR_u7AlDdI=/420x630/filters:format(jpg):quality(85)/s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2016/07/20201800/mejores-libros-Don-Quijote-sf.jpg",
          content: "Don Quijote",
          cant: 12,
          tot: 1200
        }
      ],
      total: 1200
    });
  });

  it("Calcs working with loop", () => {
    cy.loadFromJson("FOUR-5161.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name=form_checkbox_1]").click();

    cy.get('[data-cy=preview-content] [data-cy="screen-field-color"]').type(
      "red"
    );

    cy.get("[data-cy=loop-loop_1-add]").click();

    cy.get(
      ":nth-child(2) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > .row > :nth-child(1) > :nth-child(1) > .form-group > [data-cy=screen-field-color]"
    ).type("green");

    // Check final result
    cy.assertPreviewData({
      form_checkbox_1: true,
      loop_1: [
        {
          decription: "Color is :red",
          color: "red"
        },
        {
          decription: "Color is :green",
          color: "green"
        }
      ]
    });
  });
});
