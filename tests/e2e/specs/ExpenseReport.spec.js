import moment from "moment";
import Screens from "../fixtures/Expense_Report_Launcher_Main_13_screen.json";
import Task from "../fixtures/Expense_Report_Launcher_Main_13_task.json";

// Helper function to initialize intercepts for tasks and screens
function initializeTaskAndScreenIntercepts(method, url, taskResponse, screenResponse) {
  cy.intercept(method, url.replace(",screen,", ",").replace(",nested,", ","), taskResponse);
  cy.intercept(method, url.replace(/\?.*$/, "/screen?include=screen,nested"), screenResponse);
}

// Variables for the URLs
const taskUrl = "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination";
const scriptExecuteUrl459 = "http://localhost:5173/api/1.0/scripts/execute/459";
const scriptExecuteUrl458 = "http://localhost:5173/api/1.0/scripts/execute/458";
const scriptExecuteUrl461 = "http://localhost:5173/api/1.0/scripts/execute/461";

describe("Expense Report", () => {
  
  it("Verify Expense Report loaded", () => {
    // Step 1: Set the viewport to simulate an iPad 2 device
    cy.viewport('ipad-2');

    // Step 2: Initialize intercepts for task and screen API responses
    initializeTaskAndScreenIntercepts("GET", taskUrl, Task, Screens);

    // Step 3: Intercept the API request for report search results (script 459)
    cy.intercept('POST', scriptExecuteUrl459, {
      "output": {
        "searchResults": [
          { "value": 263, "content": "ert" },
          { "value": 281, "content": "asdsad" },
          { "value": 278, "content": "qddd" },
          { "value": 276, "content": "qweccc" },
          { "value": 271, "content": "eqwe" },
          { "value": 270, "content": "qq2" },
          { "value": 268, "content": "qwe" },
          { "value": 267, "content": "we" },
          { "value": 264, "content": "qq2" },
          { "value": 246, "content": "rep1" },
          { "value": 262, "content": "we" },
          { "value": 261, "content": "ee" },
          { "value": 260, "content": "yu" },
          { "value": 259, "content": "rty" },
          { "value": 258, "content": "ww" },
          { "value": 257, "content": "qq" },
          { "value": 249, "content": "rep2" },
          { "value": 0, "content": "Create new report" }
        ]
      }
    });

    // Step 4: Intercept the API request for receipts (script 458)
    cy.intercept('POST', scriptExecuteUrl458, {
      "output": {
        "receipts": null,
        "page": 1,
        "text": "1 - 0",
        "prev": 0,
        "next": 2,
        "top": 0,
        "total": true,
        "collectionId": ""
      }
    });

    // Step 5: Intercept the API request for reports (script 461)
    cy.intercept('POST', scriptExecuteUrl461, {
      "output": {
        "report": [
          {
            "id": 281,
            "data": {
              "reportName": "asdsad",
              "requestStatus": "New",
              "expensesCount": 0,
              "reportDate": "OCT 04",
              "requestStatus_style": "New"
            }
          },
          {
            "id": 278,
            "data": {
              "reportName": "qddd",
              "requestStatus": "New",
              "expensesCount": 0,
              "reportDate": "OCT 04",
              "requestStatus_style": "New"
            }
          },
          {
            "id": 276,
            "data": {
              "reportName": "qweccc",
              "requestStatus": "New",
              "expensesCount": 0,
              "reportDate": "OCT 04",
              "requestStatus_style": "New"
            }
          },
          {
            "id": 271,
            "data": {
              "reportName": "eqwe",
              "requestStatus": "New",
              "expensesCount": 0,
              "reportDate": "OCT 03",
              "requestStatus_style": "New"
            }
          },
          {
            "id": 270,
            "data": {
              "reportName": "qq2",
              "requestStatus": "New",
              "expensesCount": 0,
              "reportDate": "OCT 03",
              "requestStatus_style": "New"
            }
          }
        ],
        "page": 1,
        "text": "1 - 3",
        "prev": 0,
        "next": 2,
        "top": "3",
        "total": true,
        "exp": null
      }
    });

    // Step 6: Visit the mobile version of the page
    cy.visit("/?scenario=TaskMobile");

    // Step 7: Assert that the screen renderer container is visible
    cy.get("[data-cy=screen-renderer-container]").should("be.visible");

    // Step 8: Assert that the screen renderer is visible
    cy.get("[data-cy=screen-renderer]").should("be.visible");

    // Step 9: Assert that the mobile logo is visible
    cy.get("[class=imgLogoMobile]").should("be.visible");

    // Step 10: Assert that the Bg-Report section is visible
    cy.get("[custom-css-selector=Bg-Report]").should("be.visible");

    // Step 11: Assert that Bg-Report has 6 child elements
    cy.get("[custom-css-selector=Bg-Report]")
      .children()  // Get all direct child elements
      .should('have.length', 6);  // Assert the child count is 6
  });
});
