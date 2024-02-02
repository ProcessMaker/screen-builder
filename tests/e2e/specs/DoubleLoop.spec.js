describe("Double loop tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify access to _parent._parent inside a double loop", () => {
    cy.loadFromJson("FOUR-6990_Double_Loop.json", 0);
    // set init screen test data
    cy.setPreviewDataInput({
      accounts: [
        {
          accountUid: "one",
          accountLabel: "one"
        },
        {
          accountUid: "two",
          accountLabel: "two"
        }
      ]
    });
    cy.get("[data-cy=mode-preview]").click();

    // Select option "one" on select inside loop 2
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_select_list_1]"
    ).selectOption("one");

    // Select option "one" on select inside loop 3
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_select_list_2]"
    ).selectOption("two");

    // Check the data of the screen
    cy.assertPreviewData({
      accounts: [
        {
          accountUid: "one",
          accountLabel: "one"
        },
        {
          accountUid: "two",
          accountLabel: "two"
        }
      ],
      loop_1: [
        {
          form_select_list_1: "one",
          loop_3: [
            {
              form_select_list_2: "two"
            }
          ]
        }
      ]
    });
  });
});
