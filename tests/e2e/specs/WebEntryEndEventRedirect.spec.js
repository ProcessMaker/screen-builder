import SingleScreen from "../fixtures/single_line_input.json";

function initializeTaskAndScreenIntercepts(method, url, response) {
  cy.intercept(method, url.replace(",screen,", ",").replace(",nested,", ","), response).as('getTask');
  cy.intercept(method, url.replace(/\?.*$/, "/screen?include=screen,nested"), response.screen).as('getScreen');
}

describe("End Event Redirect (Process completed)", () => {
  beforeEach(() => {
    // Reset the intercepts and the state before each test
    cy.visit("/?scenario=TaskWebEntry", {});
  });

  it("Element destination type is summaryScreen and process was opened from webEntry", () => {
    const taskUrl = "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination";

    initializeTaskAndScreenIntercepts("GET", taskUrl, {
      id: 1,
      advanceStatus: "open",
      component: "task-screen",
      allow_interstitial: false,
      elementDestination: {
        type: "taskList",
        value: "http://localhost:5173/tasks",
      },
      user: {
        id: 1,
      },
      screen: SingleScreen.screens[0],
      process_request: {
        id: 1,
        status: "ACTIVE",
      },
    });

    // Interact with the UI
    cy.get('.form-group > .btn').click();

    // Emit socket event and verify the URL change
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [
        {
          endEventDestination: {
            type: "summaryScreen",
            value: null,
          },
        },
      ],
      method: "processCompletedRedirect",
    })
    cy.wait(1000);
    // This code will execute after the socket event is finished
    cy.url().should("eq", "http://localhost:5173/?scenario=TaskWebEntry");
   
  });
});
