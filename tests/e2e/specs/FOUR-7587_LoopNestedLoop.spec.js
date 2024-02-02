describe("FOUR-7587 Loop Nested Loop", () => {
  // initial data to test the screen
  const initialData = {
    businesses: [
      {
        legalStructure: {
          id: 5,
          coreCode: "170",
          isActive: true,
          bizChexCode: "05",
          businessType: "Corporation",
          requiredDocs: [
            {
              file: null,
              document: {
                id: 15,
                label:
                  "Recent Statement of Information (Domestic Stock Corporation) filed with Secretary of State",
                coreCode: "recentStatementInfo"
              },
              required: true
            },
            {
              file: null,
              document: {
                id: 16,
                label: "Certificate of Status (if available)",
                coreCode: "statusCertificate"
              },
              required: false
            },
            {
              file: null,
              document: {
                id: 17,
                label: "Corporate Resolution",
                coreCode: "corporateResolution"
              },
              required: true
            }
          ]
        }
      }
    ]
  };

  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.console, "log").as("consoleLog");
        cy.stub(win.console, "error").as("consoleError");
      }
    });
  });

  it("Test render of screen with Loop>Nested>Loop", () => {
    cy.loadFromJson("FOUR-7587_LoopNestedLoop.json", 1);

    // set initial data to test the screen
    cy.setPreviewDataInput(initialData);
    cy.get("[data-cy=mode-preview]").click();
    // Check no errors in console
    cy.get("@consoleError").should("not.to.be.called");
  });
});
