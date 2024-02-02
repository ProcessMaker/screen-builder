import { validateImage } from "../support/utils";

const downloadsFolder = Cypress.config("downloadsFolder");

function findTheFile(fileName) {
  cy.log("**find the image**");
  const mask = `${downloadsFolder}/*.jpeg`;

  cy.task("findFiles", mask).then((foundImage) => {
    expect(foundImage).to.be.a("string");
    cy.log(`found image ${foundImage}`);
    cy.log("**confirm downloaded image**");
    validateImage(fileName);
  });
}

describe("File Download", () => {
  beforeEach(function () {
    cy.visit("/");
    cy.window().then((win) => {
      // Add request-id header
      const requestIdMeta = window.document.createElement("meta");
      requestIdMeta.setAttribute("name", "request-id");
      requestIdMeta.setAttribute("content", "1");
      win.document.head.appendChild(requestIdMeta);
    });
  });

  it("Lists single file in download control", function () {
    uploadSingleFile();

    // The file should be listed in the file download control
    cy.get(
      ':nth-child(2) > .row > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"]'
    ).contains("avatar.jpeg");

    // The file using the `_parent` variable should be listed in the file download control
    cy.get(
      '.page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"]'
    ).contains("avatar.jpeg");

    // The file should be listed in the Record List file download control
    cy.get("[data-cy=add-row]").click();
    cy.get(
      '[data-cy=screen-renderer] > :nth-child(1) > .page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"]'
    ).contains("avatar.jpeg");
  });

  it("Can download a single file", () => {
    uploadSingleFile();
    // Mock file download
    cy.intercept("/api/1.0/files/1/contents", { fixture: "avatar.jpeg" }).as(
      "download"
    );

    // A standard file is downloadable
    cy.get(
      '.row > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"] > .btn'
    ).click();
    cy.wait("@download").then(() => {
      findTheFile("avatar.jpeg");
    });

    // A Loop file is downloadable
    cy.get(
      '[icon="fas fa-redo"] > :nth-child(1) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"] > .btn'
    ).click();
    cy.wait("@download").then(() => {
      findTheFile("avatar.jpeg");
    });

    // A Record List file is downloadable
    cy.get("[data-cy=add-row]").click();
    cy.get(
      '[data-cy=screen-renderer] > :nth-child(1) > .page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"] > .btn'
    )
      .eq(0)
      .click();
    cy.wait("@download").then(() => {
      findTheFile("avatar.jpeg");
    });
  });

  it("Lists multiple files in download control", () => {
    uploadMultiFile();

    // The files should be listed in a standard multiple file download control
    cy.get(".col-sm-6 div")
      .as("file_upload_1")
      .should("include.text", "avatar.jpeg");
    cy.get(".col-sm-6 div")
      .as("file_upload_1")
      .should("include.text", "file1.jpeg");

    // The files should be listed in a Record List multiple file download control
    cy.get("[data-cy=add-row]").click();
    cy.get(".modal-body").eq(0).should("include.text", "avatar.jpeg");
    cy.get(".modal-body").eq(0).should("include.text", "file1.jpeg");
  });

  it("Can download multiple files", () => {
    uploadMultiFile();
    // Mock the first file download
    cy.intercept("/api/1.0/files/1/contents", { fixture: "avatar.jpeg" }).as(
      "download"
    );
    // Mock the second file download
    cy.intercept("/api/1.0/files/2/contents", { fixture: "file1.jpeg" }).as(
      "downloadFile1"
    );
    cy.wait(1000);
    // The first file should be downloaded
    cy.get(
      `.row > :nth-child(1) > :nth-child(1) > [icon="fas fa-redo"] > :nth-child(1) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"] > .btn`
    ).click();
    cy.wait("@download").then(() => {
      findTheFile("avatar.jpeg");
    });

    // The second file should be downloaded
    cy.get(
      '.row > :nth-child(1) > :nth-child(1) > [icon="fas fa-redo"] > :nth-child(2) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="2-file1"] > .btn'
    ).click();
    cy.wait("@downloadFile1").then(() => {
      findTheFile("file1.jpeg");
    });

    // Assert Record List multiple files are downloadable
    cy.get("[data-cy=add-row]").click();
    // The first file should be downloaded
    cy.get(
      '[data-cy=screen-renderer] > :nth-child(1) > [name="record_page"] > :nth-child(1) > [icon="fas fa-redo"] > :nth-child(1) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"] > .btn'
    )
      .eq(0)
      .click();
    cy.wait("@download").then(() => {
      findTheFile("avatar.jpeg");
    });

    // The second file should be downloaded
    cy.get(
      '[data-cy=screen-renderer] > :nth-child(1) > [name="record_page"] > :nth-child(1) > [icon="fas fa-redo"] > :nth-child(2) > .container-fluid > :nth-child(1) > .page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="2-file1"] > .btn'
    )
      .eq(0)
      .click();
    cy.wait("@downloadFile1").then(() => {
      findTheFile("file1.jpeg");
    });
  });
});

function uploadSingleFile() {
  cy.loadFromJson("single_file_download.json", 0);
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
    "[data-cy=preview-content] [data-cy=screen-field-file_upload_1] input[type=file]",
    "avatar.jpeg",
    "image/jpg"
  );

  // Mock file info
  cy.intercept("/api/1.0/requests/1/files?id=*", {
    id: 1,
    file_name: "avatar.jpeg",
    name: "avatar"
  }).as("getFileInfoFile1");
}

function uploadMultiFile() {
  cy.loadFromJson("multiple_file_download.json", 0);
  cy.get("[data-cy=mode-preview]").click();

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
    "[data-cy=preview-content] [data-cy=screen-field-file_upload_1] input[type=file]",
    "avatar.jpeg",
    "image/jpg"
  );
  cy.intercept("/api/1.0/requests/1/files?id=1", {
    id: 1,
    file_name: "avatar.jpeg",
    name: "avatar"
  }).as("getFileInfo");

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
    "[data-cy=preview-content] [data-cy=screen-field-file_upload_1] input[type=file]",
    "file1.jpeg",
    "image/jpg"
  );
  cy.intercept("/api/1.0/requests/1/files?id=2", {
    id: 2,
    file_name: "file1.jpeg",
    name: "file1"
  }).as("getFileInfo");
}
