describe("Validation Default value", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify with mustache in nested and record list", () => {
    cy.loadFromJson("parent_record_list_and_loop.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    fillInputText("screen-field-parentValue", 0, 130);

    cy.assertPreviewData({
      parentValue: "130",
      loop_1: [
        {
          form_record_list_1: null
        }
      ],
      loop_2: [
        {
          form_input_1: "130"
        }
      ]
    });

    cy.get("[data-cy=add-row]").click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_1]"
    ).should("have.value", "130");
  });
});

function fillInputText(dataCy, index = null, value = "test") {
  if (index === null) {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`)
      .clear()
      .type(value);
  } else {
    cy.get(`[data-cy=preview-content] [data-cy="${dataCy}"]`)
      .eq(index)
      .clear()
      .type(value);
  }
}
