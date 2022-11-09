describe("screen error nested calc", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/");
  });

  it("Verify nested calc can access to _parent inside loop", () => {
    cy.loadFromJson("Screen error nested calc.json", 0);
    // set init screen test data
    // cy.setPreviewDataInput({person: []});
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
    // cy.setPreviewDataInput({person: []});
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
});
