describe("FOUR-2164 Loop FileUpload", () => {
  // initial data to test the screen
  const initialData = {};

  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.console, "log").as("consoleLog");
        cy.stub(win.console, "error").as("consoleError");
      }
    });
    cy.window().then((win) => {
      // Add request-id header
      const requestIdMeta = window.document.createElement("meta");
      requestIdMeta.setAttribute("name", "request-id");
      requestIdMeta.setAttribute("content", "1");
      win.document.head.appendChild(requestIdMeta);
    });
  });

  it("Test render of screen with Loop>FileUpload", () => {
    cy.loadFromJson("LoopFileUploadScreen.json", 0);

    // set initial data to test the screen
    cy.setPreviewDataInput(initialData);
    cy.get("[data-cy=mode-preview]").click();
    // Check no errors in console
    cy.get("@consoleError").should("not.to.be.called");

    // Upload file 1
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    ).as("uploadFile1");
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy='screen-field-fileLoppPaola'] input[type=file]",
      "file1.jpeg",
      "image/jpg",
      0
    );
    cy.wait("@uploadFile1");

    // Upload file 2
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    ).as("uploadFile2");
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy='screen-field-fileLoppPaola'] input[type=file]",
      "file2.jpeg",
      "image/jpg",
      1
    );
    cy.wait("@uploadFile2");

    // Upload file 3
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 3
      })
    ).as("uploadFile3");
    cy.uploadFile(
      "[data-cy=preview-content] [data-cy='screen-field-fileLoppPaola'] input[type=file]",
      "file3.jpeg",
      "image/jpg",
      2
    );
    cy.wait("@uploadFile3");
    // Check global variable
    cy.window().then((win) => {
      const expected = {
        "loop_1.0.fileLoppPaola": [
          {
            id: 1,
            file_name: "file1.jpeg",
            mime_type: "image/jpg",
            name: "file1.jpeg",
            fileType: "image/jpg"
          }
        ],
        "loop_1.1.fileLoppPaola": [
          {
            id: 2,
            file_name: "file2.jpeg",
            mime_type: "image/jpg",
            name: "file2.jpeg",
            fileType: "image/jpg"
          }
        ],
        "loop_1.2.fileLoppPaola": [
          {
            id: 3,
            file_name: "file3.jpeg",
            mime_type: "image/jpg",
            name: "file3.jpeg",
            fileType: "image/jpg"
          }
        ]
      };
      const current = JSON.parse(
        JSON.stringify(win.PM4ConfigOverrides.requestFiles)
      );
      expect(current).to.deep.equal(expected);
    });
  });
});
