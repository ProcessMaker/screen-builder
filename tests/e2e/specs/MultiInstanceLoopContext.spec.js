import moment from "moment";
import Screens from "../fixtures/MultiInstanceLoopContext.json";

describe("FOUR-3375 FileUpload inside MultiInstance Task", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,requestData,loopContext,bpmnTagName,interstitial,definition,userRequestPermission,elementDestination",
      {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        created_at: moment().toISOString(),
        completed_at: moment().toISOString(),
        due_at: moment().add(1, "day").toISOString(),
        loop_context: "mi_output_var.1",
        user: {
          avatar: "",
          fullname: "Assigned User"
        },
        screen: Screens.screens[0],
        process_request: {
          id: 1,
          status: "ACTIVE",
          user: {
            avatar: "",
            fullname: "Requester User"
          }
        },
        process: {
          id: 1,
          name: "Process Name"
        },
        user_request_permission: [{ process_request_id: 1, allowed: true }]
      }
    );
    cy.intercept(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1/screen?include=screen,nested",
      Screens.screens[0]
    );

    cy.visit("/?scenario=TaskMultiInstance", {
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

  it("Test file upload", () => {
    // Check no errors in console
    cy.get("@consoleError").should("not.to.be.called");

    // Upload main file
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 1
      })
    ).as("uploadMainFile");
    cy.uploadFile(
      "[data-cy='screen-field-rootUpload'] input[type=file]",
      "avatar.jpeg",
      "image/jpg"
    );
    cy.wait("@uploadMainFile");

    // Upload file 1
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 2
      })
    ).as("uploadFile1");
    cy.uploadFile(
      "[data-cy='screen-field-fileLoppPaola'] input[type=file]",
      "file1.png",
      "image/png",
      0
    );
    cy.wait("@uploadFile1");

    // Upload file 2
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 3
      })
    ).as("uploadFile2");
    cy.uploadFile(
      "[data-cy='screen-field-fileLoppPaola'] input[type=file]",
      "file2.png",
      "image/png",
      1
    );
    cy.wait("@uploadFile2");

    // Upload file 3
    cy.intercept(
      "POST",
      "/api/1.0/requests/1/files",
      JSON.stringify({
        message: "The file was uploaded.",
        fileUploadId: 4
      })
    ).as("uploadFile3");
    cy.uploadFile(
      "[data-cy='screen-field-fileLoppPaola'] input[type=file]",
      "file3.png",
      "image/png",
      2
    );
    cy.wait("@uploadFile3");
    // Check global variable
    cy.window().then((win) => {
      const expected = {
        "mi_output_var.1.rootUpload": [
          {
            id: 1,
            file_name: "avatar.jpeg",
            mime_type: "image/jpg",
            name: "avatar.jpeg",
            fileType: "image/jpg"
          }
        ],
        "mi_output_var.1.loop_1.0.fileLoppPaola": [
          {
            id: 2,
            file_name: "file1.png",
            mime_type: "image/png",
            name: "file1.png",
            fileType: "image/png"
          }
        ],
        "mi_output_var.1.loop_1.1.fileLoppPaola": [
          {
            id: 3,
            file_name: "file2.png",
            mime_type: "image/png",
            name: "file2.png",
            fileType: "image/png"
          }
        ],
        "mi_output_var.1.loop_1.2.fileLoppPaola": [
          {
            id: 4,
            file_name: "file3.png",
            mime_type: "image/png",
            name: "file3.png",
            fileType: "image/png"
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
