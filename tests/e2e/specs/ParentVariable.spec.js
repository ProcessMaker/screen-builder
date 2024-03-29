describe("_parent variable", () => {
  beforeEach(() => {});

  it("Test _parent in loop>nested", () => {
    cy.visit("/");
    cy.loadFromJson("parent_variable.json", 1);
    cy.get("[data-cy=mode-preview]").click();

    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-select_padre"]'
    ).selectOption("aaaa");

    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-select_hijo"]'
    ).selectOption("aaaa");
    cy.get('[data-cy=preview-content] [data-cy="screen-field-input_hijo"]')
      .clear()
      .type("test");

    cy.assertPreviewData({
      select_padre: [
        {
          value: "a",
          content: "aaaa"
        }
      ],
      loop_1: [
        {
          input_hijo: "test",
          select_hijo: "a"
        }
      ],
      form_record_list_1: null
    });
  });

  it("Test _parent in record list", () => {
    cy.visit("/");
    cy.loadFromJson("parent_variable.json", 1);
    cy.get("[data-cy=mode-preview]").click();

    cy.get(
      '[data-cy=preview-content] [data-cy="screen-field-select_padre"]'
    ).selectOption("aaaa");

    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-form_select_list_1"]'
    ).selectOption("aaaa");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
    ).click();

    cy.assertPreviewData({
      select_padre: [
        {
          value: "a",
          content: "aaaa"
        }
      ],
      loop_1: [
        {
          input_hijo: "",
          select_hijo: null
        }
      ],
      form_record_list_1: [
        {
          form_select_list_1: "a"
        }
      ]
    });
  });
});
