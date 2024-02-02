describe("SelectList - Watcher", () => {
  const watcherResponse = [
    {
      id: 1,
      created_by_id: 2,
      updated_by_id: 2,
      created_at: "2021-11-08 10:29:56",
      updated_at: "2021-11-08 10:29:56",
      data: {
        id: 1,
        name: "John"
      },
      collection_id: 2,
      title: "1"
    },
    {
      id: 2,
      created_by_id: 2,
      updated_by_id: 2,
      created_at: "2021-11-08 10:29:56",
      updated_at: "2021-11-08 10:29:56",
      data: {
        id: 2,
        name: "Mary"
      },
      collection_id: 2,
      title: "2"
    }
  ];

  beforeEach(() => {
    // Mock the response from the data source
    cy.intercept(
      "POST",
      "/api/1.0/requests/data_sources/2",
      JSON.stringify({
        // Note: Mapping is done by the endpoint, not by the watcher
        response1: watcherResponse
      })
    ).as("getWatcherResponse");
    cy.visit("/");
  });

  it("Verify Radio select list loaded by watcher", () => {
    cy.loadFromJson("FOUR-6910_Watcher_Radio.json", 0);
    // set init screen test data
    // cy.setPreviewDataInput({person: []});
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name=enable]").click();

    // Select "John" option in radio buttons "form_select_list_2"
    cy.get(
      "[data-cy=preview-content] [name=form_select_list_2][value=John]"
    ).click();

    // Select "Mary" option in select list "form_select_list_3"
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_select_list_3]"
    ).selectOption("Mary");

    // Check the data of the screen
    cy.assertPreviewData({
      enable: true,
      form_select_list_2: "John",
      form_select_list_3: "Mary",
      response1: watcherResponse
    });
  });

  it("Verify Checkbox select list loaded by watcher", () => {
    cy.loadFromJson("FOUR-6910_Watcher_Checkbox.json", 0);
    // set init screen test data
    // cy.setPreviewDataInput({person: []});
    cy.get("[data-cy=mode-preview]").click();

    cy.get("[data-cy=preview-content] [name=enable]").click();

    // Select "John" option in radio buttons "form_select_list_2"
    cy.get(
      "[data-cy=preview-content] [name=form_select_list_2][value=John]"
    ).click();

    // Select "Mary" option in select list "form_select_list_3"
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_select_list_3]"
    ).selectOption("Mary");

    // Check the data of the screen
    cy.assertPreviewData({
      enable: true,
      form_select_list_2: ["John"],
      form_select_list_3: ["Mary"],
      response1: watcherResponse
    });
  });
});
