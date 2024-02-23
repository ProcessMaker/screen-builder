describe("Multiple Upload", () => {
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

  it("Upload a Single File", () => {
    cy.loadFromJson("multiple_upload.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Upload single file should show the uploaded file name
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    );
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy=screen-field-filesingle] input[type=file]",
      "avatar.jpeg",
      "image/jpg"
    );
    cy.get("[data-cy=avatar-jpeg] .uploader-file-name").should(
      "include.text",
      "avatar.jpeg"
    );

    // Upload another file, it should replace the file displayed in the control
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    );
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy=screen-field-filesingle] input[type=file]",
      "file1.jpeg",
      "image/jpg"
    );
    cy.get("[data-cy=file1-jpeg] .uploader-file-name").should(
      "include.text",
      "file1.jpeg"
    );
  });

  it("Upload multiple files", () => {
    cy.loadFromJson("multiple_upload.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Upload one file
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    );
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy=screen-field-filemultiple] input[type=file]",
      "avatar.jpeg",
      "image/jpg"
    );
    // The file should be listed in the multiple upload control
    cy.get("[data-cy=preview-content] [data-cy=screen-field-filemultiple]")
      .find("[data-cy=1] .uploader-file-name")
      .should("include.text", "avatar.jpeg");
    // Add a new file
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    );
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy=screen-field-filemultiple] input[type=file]",
      "file1.jpeg",
      "image/jpg"
    );
    // The file should be listed in multiple upload control
    cy.get("[data-cy=preview-content] [data-cy=screen-field-filemultiple]")
      .find("[data-cy=2] .uploader-file-name")
      .should("include.text", "file1.jpeg");

    // Remove the last file
    cy.intercept(
      "DELETE",
      "/api/1.0/files/2",
      JSON.stringify({
        message: "File deleted"
      })
    );
    cy.get("[data-cy=preview-content] [data-cy=screen-field-filemultiple]")
      .find("[data-cy=2] [title=Delete]")
      .click();
    // The row of file 2 sould not exist, but file 1 should exist
    cy.get("[data-cy=preview-content] [data-cy=screen-field-filemultiple]")
      .find("[data-cy=2] .uploader-file-name")
      .should("not.exist");
    cy.get("[data-cy=preview-content] [data-cy=screen-field-filemultiple]")
      .find("[data-cy=1] .uploader-file-name")
      .should("exist");

    // Remove the first file
    cy.intercept(
      "DELETE",
      "/api/1.0/files/1",
      JSON.stringify({
        message: "File deleted"
      })
    );
    cy.get("[data-cy=preview-content] [data-cy=screen-field-filemultiple]")
      .find("[data-cy=1] [title=Delete]")
      .click();
    cy.get("[data-cy=preview-content] [data-cy=screen-field-filemultiple]")
      .find("[data-cy=1] .uploader-file-name")
      .should("not.exist");
  });

  it.skip("Upload files in record lists", () => {
    cy.loadFromJson("multiple_upload.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    cy.get(
      "[data-cy=preview-content] [data-cy=screen-field-members] [data-cy=add-row]"
    ).click();

    // Upload single file should show the uploaded file name
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    );
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy=screen-field-map] input[type=file]",
      "avatar.jpeg",
      "image/jpg"
    );
    cy.get("[data-cy=avatar-jpeg] .uploader-file-name").should(
      "include.text",
      "avatar.jpeg"
    );
    // The global variable should store the uploaded item
    cy.window()
      .its("PM4ConfigOverrides.requestFiles")
      .then((requestFiles) => {
        const firstMapFileVar = Object.keys(requestFiles).find((x) =>
          x.startsWith("map")
        );
        const rowId = firstMapFileVar.split("map.")[1];
        expect(requestFiles[`map.${rowId}`][0].file_name).to.equal(
          "avatar.jpeg"
        );
      });

    // Upload a file in multiple file mode
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    );
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy=screen-field-pictures] input[type=file]",
      "avatar.jpeg",
      "image/jpg"
    );
    // The file should be listed in multiple upload control
    cy.get("[data-cy=preview-content] [data-cy=screen-field-pictures]")
      .find("[data-cy=1] .uploader-file-name")
      .should("include.text", "avatar.jpeg");

    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    );
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy=screen-field-pictures] input[type=file]",
      "file1.jpeg",
      "image/jpg"
    );
    // The file should be listed in multiple upload control
    cy.get("[data-cy=preview-content] [data-cy=screen-field-pictures]")
      .find("[data-cy=2] .uploader-file-name")
      .should("include.text", "file1.jpeg");

    // Remove the last file
    cy.intercept(
      "DELETE",
      "/api/1.0/files/2",
      JSON.stringify({
        message: "File deleted"
      })
    );
    cy.get("[data-cy=preview-content] [data-cy=screen-field-pictures]")
      .find("[data-cy=2] [title=Delete]")
      .click();
    // The row of file 2 should not be listed, but file 1 yes
    cy.get("[data-cy=preview-content] [data-cy=screen-field-pictures]")
      .find("[data-cy=2] .uploader-file-name")
      .should("not.exist");
    cy.get("[data-cy=preview-content] [data-cy=screen-field-pictures]")
      .find("[data-cy=1] .uploader-file-name")
      .should("exist");
  });
});
