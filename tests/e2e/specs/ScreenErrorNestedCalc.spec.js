describe("screen error nested calc", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify nested calc can access to _parent inside loop", () => {
    cy.loadFromJson("Screen error nested calc.json", 0);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name='parentInput']")
      .clear()
      .type("123");

    // Check the data of the screen
    cy.assertPreviewData({
      parentInput: "123",
      loop_1: [
        {
          result: "123"
        }
      ]
    });
  });

  it("Verify nested calc can access to _parent inside 2 loops", () => {
    cy.loadFromJson("Screen nested calc inside 2 loops.json", 0);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name='parentInput']")
      .clear()
      .type("123");

    // Check the data of the screen
    cy.assertPreviewData({
      parentInput: "123",
      loop_2: [
        {
          loop_1: [
            {
              result: "123"
            }
          ]
        },
        {
          loop_1: [
            {
              result: "123"
            }
          ]
        }
      ]
    });
  });

  it("Verify calc can access to _parent inside Record List", () => {
    cy.loadFromJson("Test Record List.json", 0);
    // set init screen test data
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name='form_input_1']")
      .clear()
      .type("123");

    // Click ADD record in Record List
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();

    // Type in form_input_2
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_2]"
    )
      .clear()
      .type("456");

    // Type in form_input_3
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_3]"
    )
      .clear()
      .type("789");

    // Click OK button to insert the row
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
    ).click();

    // Check the data of the screen
    cy.get("#screen-builder-container").then((div) => {
      const data = div[0].__vue__.previewData;
      const recordRowId = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        form_input_1: "123",
        form_record_list_1: [
          {
            calcParent1: "123",
            form_input_2: "456",
            form_input_3: "789",
            row_id: recordRowId
          }
        ]
      });
    });
  });
});
