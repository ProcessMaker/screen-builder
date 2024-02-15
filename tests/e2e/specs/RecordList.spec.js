import moment from "moment";

describe.skip("Record list", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.showValidationOnLoad();
    cy.window().then((win) => {
      // Add request-id header
      const requestIdMeta = window.document.createElement("meta");
      requestIdMeta.setAttribute("name", "request-id");
      requestIdMeta.setAttribute("content", "1");
      win.document.head.appendChild(requestIdMeta);
    });
  });

  it("Invalid default values", () => {
    cy.loadFromJson("record_list_invalid.json", 0);
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] [name=firstname]").type("Patricia");
    cy.get("[data-cy=preview-content] [name=lastname]").type("Smith");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=fullname]"
    ).type("{home}Miss ");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=fullname]"
    ).should("have.value", "Miss Patricia Smith");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=date]"
    )
      .parent()
      .should("contain.text", "Must be a valid Date");
  });

  it("Add row with default values", () => {
    cy.loadFromJson("record_list.json", 0);
    cy.get("[data-cy=mode-preview]").click();
    const today = new Date().toISOString().substr(0, 10);
    cy.get("[data-cy=preview-content] [name=firstname]").type("Patricia");
    cy.get("[data-cy=preview-content] [name=lastname]").type("Smith");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=fullname]"
    ).type("{home}Miss ");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
    ).click();
    cy.get("#screen-builder-container").then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        firstname: "Patricia",
        lastname: "Smith",
        form_record_list_1: [
          {
            fullname: "Miss Patricia Smith",
            date: today,
            row_id: record_row_id
          }
        ]
      });
    });
  });

  it("Recordlist pagination when deleting items should go to previous page if no records in current page", () => {
    cy.loadFromJson("record_list_single_input.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Add 7 rows
    for (let i = 1; i <= 7; i++) {
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
      ).click();
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]"
      ).type(i);
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
      ).click();
    }

    // Go to pagination page 2
    cy.get(":nth-child(4) > .page-link").click();

    // Delete record 7
    cy.get(
      '[aria-rowindex="7"] > .text-right > .actions > .btn-group > [data-cy=remove-row]'
    ).click();
    cy.get("[data-cy='modal-remove'] button.btn.btn-primary").click();

    cy.get(".table-column").should("contain.text", "6");

    cy.get("[data-cy=table-pagination]").should("be.visible");

    // Delete record 6
    cy.get("[data-cy=remove-row]").click();
    cy.get("[data-cy='modal-remove'] button.btn.btn-primary").click();

    // Assert we see page 1
    cy.get("[data-cy=table-pagination]").should("not.exist");

    for (let i = 1; i <= 5; i++) {
      cy.get(`[aria-rowindex="${i}"] > .table-column`).should(
        "contain.text",
        i
      );
    }
  });

  it("FileUpload in record lists", () => {
    cy.loadFromJson("record_list_fileupload.json", 0);
    cy.get("[data-cy=mode-preview]").click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();

    // Upload first file
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file1"] input[type=file]',
      "avatar.jpeg",
      "image/jpg"
    );

    // Upload second file
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file2"] input[type=file]',
      "record_list_fileupload.json",
      "application/json"
    );
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)"
    ).click();

    // Check the file is rendered in the record list
    cy.get("[data-cy=preview-content] table tbody tr td").should(
      "contain.text",
      "1"
    );
    cy.get("[data-cy=preview-content] table tbody tr td").should(
      "contain.text",
      "2"
    );

    // Edit record and check the uploaded files are displayed
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]"
    ).click();
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file1"]'
    ).should("contain.text", "avatar.jpeg");
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file2"]'
    ).should("contain.text", "record_list_fileupload.json");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Cancel)"
    ).click();

    // Verify the data structure
    cy.get("#screen-builder-container").then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        form_record_list_1: [
          {
            file1: 1,
            file2: 2,
            row_id: record_row_id
          }
        ]
      });
    });
  });

  it("Required FileUpload in record lists", () => {
    cy.loadFromJson("record_list_fileupload_required.json", 0);
    cy.get("[data-cy=mode-preview]").click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
    ).click();

    // Upload first file
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file1"] input[type=file]',
      "avatar.jpeg",
      "image/jpg"
    );
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)"
    ).click();
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file2"]'
    ).should("contain.text", "required");

    // Upload second file
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    );
    cy.uploadFile(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file2"] input[type=file]',
      "record_list_fileupload_required.json",
      "application/json"
    );
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)"
    ).click();

    // Check the file is rendered in the record list
    cy.get("[data-cy=preview-content] table tbody tr td").should(
      "contain.text",
      "1"
    );
    cy.get("[data-cy=preview-content] table tbody tr td").should(
      "contain.text",
      "2"
    );

    // Edit record and check the uploaded files are displayed
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]"
    ).click();
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file1"]'
    ).should("contain.text", "avatar.jpeg");
    cy.get(
      '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file2"]'
    ).should("contain.text", "record_list_fileupload_required.json");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Cancel)"
    ).click();

    // Verify the data structure
    cy.get("#screen-builder-container").then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        form_record_list_1: [
          {
            file1: 1,
            file2: 2,
            row_id: record_row_id
          }
        ]
      });
    });
  });

  it("Check editing the correct record in recordlist after sorting", () => {
    cy.loadFromJson("record_list_single_input.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    const data = ["B", "C", "A", "E", "D", "G", "F"];

    // Add 7 rows
    for (let i = 0; i < 7; i++) {
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
      ).click();
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]"
      ).type(data[i]);
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
      ).click();
    }

    // Sort data
    cy.get(".b-table-sort-icon-left").click();

    // Select and edit "B" to "BBB"
    cy.get(
      '[aria-rowindex="2"] > .text-right > .actions > .btn-group > [data-cy=edit-row]'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    );
    // Check after sort the field has B
    cy.should("have.value", "B");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    ).type("BB");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();
    // Check the data is correct after edit
    cy.get('[aria-rowindex="1"] > .table-column').should("contain.text", "A");
    cy.get('[aria-rowindex="2"] > .table-column').should("contain.text", "BBB");
    cy.get('[aria-rowindex="3"] > .table-column').should("contain.text", "C");
    cy.get('[aria-rowindex="4"] > .table-column').should("contain.text", "D");
    cy.get('[aria-rowindex="5"] > .table-column').should("contain.text", "E");
    // Go to pagination page 2
    cy.get(":nth-child(4) > .page-link").click();
    cy.get('[aria-rowindex="6"] > .table-column').should("contain.text", "F");
    cy.get('[aria-rowindex="7"] > .table-column').should("contain.text", "G");

    // Sort data
    cy.get(".b-table-sort-icon-left").click();
    // Check last row A has the correct value "A" in the modal
    cy.get(
      '[aria-rowindex="7"] > .text-right > .actions > .btn-group > [data-cy=edit-row]'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    ).should("have.value", "A");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();

    // Go to pagination page 1
    cy.get(":nth-child(3) > .page-link").click();
    // Sort data
    cy.get(".b-table-sort-icon-left").click();
    // Get record "D" and replace to "Z"
    cy.get(
      '[aria-rowindex="4"] > .text-right > .actions > .btn-group > [data-cy=edit-row]'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    )
      .should("have.value", "D")
      .clear()
      .type("Z");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();

    // Check the data is correct after edit
    cy.get('[aria-rowindex="1"] > .table-column').should("contain.text", "A");
    cy.get('[aria-rowindex="2"] > .table-column').should("contain.text", "BBB");
    cy.get('[aria-rowindex="3"] > .table-column').should("contain.text", "C");
    cy.get('[aria-rowindex="4"] > .table-column').should("contain.text", "E");
    cy.get('[aria-rowindex="5"] > .table-column').should("contain.text", "F");
  });

  it("Check deleting the correct record in recordlist after sorting", () => {
    cy.loadFromJson("record_list_single_input.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    const data = ["B", "C", "A", "E", "D", "G", "F"];

    // Add 7 rows
    for (let i = 0; i < 7; i++) {
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
      ).click();
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]"
      ).type(data[i]);
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
      ).click();
    }

    // Sort data
    cy.get(".b-table-sort-icon-left").click();

    // Go to pagination page 2
    cy.get(":nth-child(4) > .page-link").click();

    // Delete H
    cy.get(
      '[aria-rowindex="6"] > .text-right > .actions > .btn-group > [data-cy=remove-row]'
    ).click();
    cy.get("[data-cy=modal-remove] .btn-primary").click();

    // Check after Delete it was deleted the correct row and other data are in table
    cy.get(".table-column").should("contain.text", "G");
    cy.get(":nth-child(3) > .page-link").click();
    cy.get('[aria-rowindex="1"] > .table-column').should("contain.text", "A");
    cy.get('[aria-rowindex="2"] > .table-column').should("contain.text", "B");
    cy.get('[aria-rowindex="3"] > .table-column').should("contain.text", "C");
    cy.get('[aria-rowindex="4"] > .table-column').should("contain.text", "D");
    cy.get('[aria-rowindex="5"] > .table-column').should("contain.text", "E");

    // Sort data
    cy.get(".b-table-sort-icon-left").click();

    // Delete B
    cy.get(
      '[aria-rowindex="5"] > .text-right > .actions > .btn-group > [data-cy=remove-row]'
    ).click();
    cy.get("[data-cy=modal-remove] .btn-primary").click();

    // Check after Delete B, it was deleted the correct row and other data are in table
    cy.get('[aria-rowindex="1"] > .table-column').should("contain.text", "G");
    cy.get('[aria-rowindex="2"] > .table-column').should("contain.text", "E");
    cy.get('[aria-rowindex="3"] > .table-column').should("contain.text", "D");
    cy.get('[aria-rowindex="4"] > .table-column').should("contain.text", "C");
    cy.get('[aria-rowindex="5"] > .table-column').should("contain.text", "A");
  });

  it("Check editing after remove all records from second page", () => {
    cy.loadFromJson("record_list_single_input.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    const data = ["A", "B", "C", "D", "E", "F"];

    // Add 7 rows
    for (let i = 0; i < 6; i++) {
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
      ).click();
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]"
      ).type(data[i]);
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
      ).click();
    }

    // Go to pagination page 2
    cy.get(":nth-child(4) > .page-link").click();

    // Delete F
    cy.get("[data-cy=remove-row]").click();
    cy.get("[data-cy=modal-remove] .btn-primary").click();

    // Get record "B" and replace to "BB"
    cy.get(
      '[aria-rowindex="2"] > .text-right > .actions > .btn-group > [data-cy=edit-row]'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    )
      .should("have.value", "B")
      .type("B");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();

    // Check the data is correct after edit
    cy.get('[aria-rowindex="1"] > .table-column').should("contain.text", "A");
    cy.get('[aria-rowindex="2"] > .table-column').should("contain.text", "BB");
    cy.get('[aria-rowindex="3"] > .table-column').should("contain.text", "C");
    cy.get('[aria-rowindex="4"] > .table-column').should("contain.text", "D");
    cy.get('[aria-rowindex="5"] > .table-column').should("contain.text", "E");
  });

  it("FileUpload in record lists within loops", () => {
    cy.loadFromJson("record_list_fileupload_loops.json", 0);
    cy.get("[data-cy=mode-preview]").click();
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

    // Verify the data structure.
    cy.get("#screen-builder-container").then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        form_record_list_1: [
          {
            loop_1: [
              {
                form_input_4: "First",
                file_upload_2: 1
              },
              {
                form_input_4: "Second",
                file_upload_2: 2
              }
            ],
            row_id: record_row_id
          }
        ],
        loop_1: [{}]
      });
    });
  });

  it("Check deleting the correct record in recordlist with empty after sorting", () => {
    cy.loadFromJson("record_list_date_input.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    const data = [
      { date: moment("01/02/2022").format("MM/DD/YYYY"), name: "B" },
      { date: moment("01/03/2022").format("MM/DD/YYYY"), name: "C" },
      { date: moment("01/01/2022").format("MM/DD/YYYY"), name: "A" },
      { date: moment("01/05/2022").format("MM/DD/YYYY"), name: "E" },
      { date: moment("01/04/2022").format("MM/DD/YYYY"), name: "D" },
      { date: moment("01/06/2022").format("MM/DD/YYYY"), name: "G" },
      { date: "", name: "" },
      { date: "", name: "F" },
      { date: "", name: "H" }
    ];

    // Add data
    for (let i = 0; i < 9; i++) {
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
      ).click();
      if (data[i].date !== "") {
        cy.get(
          '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-date"] input'
        )
          .click()
          .type(data[i].date);
      }
      if (data[i].name !== "") {
        cy.get(
          "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]"
        ).type(data[i].name);
      }
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
      ).click();
    }

    // Sort data
    cy.get('[aria-colindex="1"] > div').click();

    // Go to pagination page 2
    cy.get(":nth-child(4) > .page-link").click();

    // Delete G
    cy.get(
      '[aria-rowindex="6"] > .text-right > .actions > .btn-group > [data-cy=remove-row]'
    ).click();
    cy.get("[data-cy=modal-remove] .btn-primary").click();

    // Sort data
    cy.get('[aria-colindex="1"] > div').click();

    // Delete B
    cy.get(
      '[aria-rowindex="7"] > .text-right > .actions > .btn-group > [data-cy=remove-row]'
    ).click();
    cy.get("[data-cy=modal-remove] .btn-primary").click();

    // Go to pagination page 1
    cy.get(":nth-child(3) > .page-link").click();

    // Delete Empty
    cy.get(
      '[aria-rowindex="1"] > .text-right > .actions > .btn-group > [data-cy=remove-row]'
    ).click();
    cy.get("[data-cy=modal-remove] .btn-primary").click();

    // Delete H
    cy.get(
      '[aria-rowindex="2"] > .text-right > .actions > .btn-group > [data-cy=remove-row]'
    ).click();
    cy.get("[data-cy=modal-remove] .btn-primary").click();

    // Sort data
    cy.get('[aria-colindex="1"] > div').click();

    // Check after Delete it was deleted the correct row and other data are in table
    cy.get('[aria-rowindex="1"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/01/2022"
    );
    cy.get('[aria-rowindex="2"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/03/2022"
    );
    cy.get('[aria-rowindex="3"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/04/2022"
    );
    cy.get('[aria-rowindex="4"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/05/2022"
    );
    cy.get('[aria-rowindex="5"] > [aria-colindex="1"]').should(
      "contain.text",
      ""
    );

    cy.get('[aria-rowindex="1"] > [aria-colindex="2"]').should(
      "contain.text",
      "A"
    );
    cy.get('[aria-rowindex="2"] > [aria-colindex="2"]').should(
      "contain.text",
      "C"
    );
    cy.get('[aria-rowindex="3"] > [aria-colindex="2"]').should(
      "contain.text",
      "D"
    );
    cy.get('[aria-rowindex="4"] > [aria-colindex="2"]').should(
      "contain.text",
      "E"
    );
    cy.get('[aria-rowindex="5"] > [aria-colindex="2"]').should(
      "contain.text",
      "F"
    );
  });

  it("Check editing records with empty from second page", () => {
    cy.loadFromJson("record_list_date_input.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    const data = [
      { date: moment("01/02/2022").format("MM/DD/YYYY"), name: "B" },
      { date: moment("01/03/2022").format("MM/DD/YYYY"), name: "C" },
      { date: moment("01/01/2022").format("MM/DD/YYYY"), name: "A" },
      { date: moment("01/05/2022").format("MM/DD/YYYY"), name: "E" },
      { date: moment("01/04/2022").format("MM/DD/YYYY"), name: "D" },
      { date: moment("01/06/2022").format("MM/DD/YYYY"), name: "G" },
      { date: "", name: "" },
      { date: "", name: "F" },
      { date: "", name: "H" }
    ];

    // Add data
    for (let i = 0; i < 9; i++) {
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]"
      ).click();
      if (data[i].date !== "") {
        cy.get(
          '[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-date"] input'
        )
          .click()
          .type(data[i].date);
      }
      if (data[i].name !== "") {
        cy.get(
          "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]"
        ).type(data[i].name);
      }
      cy.get(
        "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary"
      ).click();
    }

    // Sort data
    cy.get('[aria-colindex="1"] > div').click();

    // Go to pagination page 2
    cy.get(":nth-child(4) > .page-link").click();

    // Get record "G" and replace to "GG" and date 01/06/2022 to 06/06/2022
    cy.get(
      '[aria-rowindex="6"] > .text-right > .actions > .btn-group > [data-cy=edit-row]'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy=screen-field-date] input"
    )
      .should("have.value", "01/06/2022")
      .clear()
      .type("06/06/2022");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    )
      .should("have.value", "G")
      .type("G");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();

    // Get record empty "" and replace to "New value" and date 01/10/2022
    cy.get(
      '[aria-rowindex="7"] > .text-right > .actions > .btn-group > [data-cy=edit-row]'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy=screen-field-date] input"
    )
      .should("have.value", "")
      .type("01/10/2022");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    )
      .should("have.value", "")
      .type("New value");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();

    // Check after edit values are correct
    cy.get('[aria-rowindex="6"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/10/2022"
    );
    cy.get('[aria-rowindex="7"] > [aria-colindex="1"]').should(
      "contain.text",
      "06/06/2022"
    );
    cy.get('[aria-rowindex="8"] > [aria-colindex="1"]').should(
      "contain.text",
      ""
    );
    cy.get('[aria-rowindex="9"] > [aria-colindex="1"]').should(
      "contain.text",
      ""
    );

    cy.get('[aria-rowindex="6"] > [aria-colindex="2"]').should(
      "contain.text",
      "New value"
    );
    cy.get('[aria-rowindex="7"] > [aria-colindex="2"]').should(
      "contain.text",
      "GG"
    );
    cy.get('[aria-rowindex="8"] > [aria-colindex="2"]').should(
      "contain.text",
      "F"
    );
    cy.get('[aria-rowindex="9"] > [aria-colindex="2"]').should(
      "contain.text",
      "H"
    );

    // Go to pagination page 1
    cy.get(":nth-child(3) > .page-link").click();

    // Check after edit values are correct
    cy.get('[aria-rowindex="1"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/01/2022"
    );
    cy.get('[aria-rowindex="2"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/02/2022"
    );
    cy.get('[aria-rowindex="3"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/03/2022"
    );
    cy.get('[aria-rowindex="4"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/04/2022"
    );
    cy.get('[aria-rowindex="5"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/05/2022"
    );

    cy.get('[aria-rowindex="1"] > [aria-colindex="2"]').should(
      "contain.text",
      "A"
    );
    cy.get('[aria-rowindex="2"] > [aria-colindex="2"]').should(
      "contain.text",
      "B"
    );
    cy.get('[aria-rowindex="3"] > [aria-colindex="2"]').should(
      "contain.text",
      "C"
    );
    cy.get('[aria-rowindex="4"] > [aria-colindex="2"]').should(
      "contain.text",
      "D"
    );
    cy.get('[aria-rowindex="5"] > [aria-colindex="2"]').should(
      "contain.text",
      "E"
    );

    // Sort data
    cy.get('[aria-colindex="1"] > div').click();

    // Go to pagination page 2
    cy.get(":nth-child(4) > .page-link").click();

    // Get record "B" and replace to "BB" and date 01/02/2022 to 02/02/2022
    cy.get(
      '[aria-rowindex="8"] > .text-right > .actions > .btn-group > [data-cy=edit-row]'
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy=screen-field-date] input"
    )
      .should("have.value", "01/02/2022")
      .clear()
      .type("02/02/2022");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name=name]"
    )
      .should("have.value", "B")
      .type("B");
    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary"
    ).click();

    // Check after edit values are correct
    cy.get('[aria-rowindex="6"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/05/2022"
    );
    cy.get('[aria-rowindex="7"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/04/2022"
    );
    cy.get('[aria-rowindex="8"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/03/2022"
    );
    cy.get('[aria-rowindex="9"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/01/2022"
    );

    cy.get('[aria-rowindex="6"] > [aria-colindex="2"]').should(
      "contain.text",
      "E"
    );
    cy.get('[aria-rowindex="7"] > [aria-colindex="2"]').should(
      "contain.text",
      "D"
    );
    cy.get('[aria-rowindex="8"] > [aria-colindex="2"]').should(
      "contain.text",
      "C"
    );
    cy.get('[aria-rowindex="9"] > [aria-colindex="2"]').should(
      "contain.text",
      "A"
    );

    // Go to pagination page 2
    cy.get(":nth-child(3) > .page-link").click();

    // Check after edit values are correct
    cy.get('[aria-rowindex="1"] > [aria-colindex="1"]').should(
      "contain.text",
      ""
    );
    cy.get('[aria-rowindex="2"] > [aria-colindex="1"]').should(
      "contain.text",
      ""
    );
    cy.get('[aria-rowindex="3"] > [aria-colindex="1"]').should(
      "contain.text",
      "06/06/2022"
    );
    cy.get('[aria-rowindex="4"] > [aria-colindex="1"]').should(
      "contain.text",
      "02/02/2022"
    );
    cy.get('[aria-rowindex="5"] > [aria-colindex="1"]').should(
      "contain.text",
      "01/10/2022"
    );

    cy.get('[aria-rowindex="1"] > [aria-colindex="2"]').should(
      "contain.text",
      "F"
    );
    cy.get('[aria-rowindex="2"] > [aria-colindex="2"]').should(
      "contain.text",
      "H"
    );
    cy.get('[aria-rowindex="3"] > [aria-colindex="2"]').should(
      "contain.text",
      "GG"
    );
    cy.get('[aria-rowindex="4"] > [aria-colindex="2"]').should(
      "contain.text",
      "BB"
    );
    cy.get('[aria-rowindex="5"] > [aria-colindex="2"]').should(
      "contain.text",
      "New value"
    );
  });
});
