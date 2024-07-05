describe("FOUR-16958_watchers ", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify that watcher clean data from the watcher works", () => {
     // Mock script response

     cy.intercept(
      "POST",
      "/api/1.0/scripts/execute/2272",
      JSON.stringify({
        output: {
          "input1": "",
          "input2": "",
          "q1comment": "",
          "q2comment": "",
          "form_text_area_1": ""
        }
      })
    );
    cy.loadFromJson("FOUR-16958_watchers.json", 0);

    cy.get("[data-cy=mode-preview]").click();

    cy.get('[data-cy="screen-field-nyc.q1comment"]').type("1");
    cy.get('[data-cy="screen-field-nyc.form_text_area_1"]').type("2");
    cy.get('[data-cy="screen-field-nyc.input1"]').type("3");
    cy.get('[data-cy="screen-field-nyc.input2"]').type("4");
    cy.get("[name=resetfields]").click();
    cy.wait(800);
    cy.get('[data-cy="screen-field-nyc.input2"]').type("5");
    cy.get('[data-cy="screen-field-nyc.q1comment"]').should('be.empty');
    cy.get('[data-cy="screen-field-nyc.form_text_area_1"]').should('be.empty');
    cy.get('[data-cy="screen-field-nyc.input1"]').should('be.empty');
  });
});
