describe("Record list", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.window().then((win) => {
      // Add request-id header
      const requestIdMeta = window.document.createElement("meta");
      requestIdMeta.setAttribute("name", "request-id");
      requestIdMeta.setAttribute("content", "1");
      win.document.head.appendChild(requestIdMeta);
    });
  });

  it("FileUpload in record lists within loops", () => {
    cy.loadFromJson("record_list_fileupload_loops.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Add 1 row to the record list.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();

    // Upload the first file.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_4]"
    )
      .eq(0)
      .clear()
      .type("First");
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file_upload_2"] input[type=file]',
      "avatar.jpeg",
      "image/jpg"
    );
    // Upload a second file.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy=loop-loop_1-add]"
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=form_input_4]"
    )
      .eq(1)
      .clear()
      .type("Second");
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file_upload_2"] input[type=file]',
      "avatar.jpeg",
      "image/jpg",
      1
    );
    cy.wait(1000);
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(0)
      .should("contain.text", "avatar.jpeg");
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(1)
      .should("contain.text", "avatar.jpeg");

    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)"
    ).click();
    // Edit record and check the uploaded files are displayed.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]"
    ).click();
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(0)
      .should("contain.text", "avatar.jpeg");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=form_input_4]"
    )
      .eq(1)
      .clear()
      .type("Second edited");
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(1)
      .should("contain.text", "avatar.jpeg");
    // Add a third file in edit modal.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy=loop-loop_1-add]"
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=form_input_4]"
    )
      .eq(2)
      .clear()
      .type("Third");
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 3
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file_upload_2"] input[type=file]',
      "avatar.jpeg",
      "image/jpg",
      2
    );
    cy.wait(1000);
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(2)
      .should("contain.text", "avatar.jpeg");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Save)"
    ).click();

    // Delete third file in edit modal.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]"
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy=loop-loop_1-remove]"
    ).click();
    cy.on("window:confirm", () => true);
    cy.wait(500);
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Save)"
    ).click();

    // Add 2nd. row to the record list and add a new file.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 4
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file_upload_2"] input[type=file]',
      "avatar.jpeg",
      "image/jpg"
    );
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)"
    ).click();

    // Click on Edit first record and check the uploaded files are still displayed.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]"
    )
      .eq(0)
      .click();
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(0)
      .should("contain.text", "avatar.jpeg");
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(1)
      .should("contain.text", "avatar.jpeg");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Save)"
    ).click();

    // Click on Edit second record and check uploaded files.
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]"
    )
      .eq(1)
      .click();
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file_upload_2"]'
    )
      .eq(0)
      .should("contain.text", "avatar.jpeg");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Save)"
    ).click();

    // Verify the data structure.
    cy.get("#screen-builder-container").then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      const second_record_row_id = data.form_record_list_1[1].row_id;
      expect(data).to.eql({
        form_record_list_1: [
          {
            loop_1: [
              {
                form_input_4: "First",
                file_upload_2: 1
              },
              {
                form_input_4: "Second edited",
                file_upload_2: 2
              }
            ],
            row_id: record_row_id
          },
          {
            loop_1: [
              {
                form_input_4: "",
                file_upload_2: 4
              }
            ],
            row_id: second_record_row_id
          }
        ],
        loop_1: [{}]
      });
    });
  });
});
