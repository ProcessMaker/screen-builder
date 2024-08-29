import moment from "moment";
import Screens from "../fixtures/webentry.json";
import SingleScreen from "../fixtures/single_line_input.json";
import InterstitialScreen from "../fixtures/interstitial_screen.json";

function initializeTaskAndScreenIntercepts(method, url, response) {
  cy.intercept(
    method,
    url.replace(",screen,", ",").replace(",nested,", ","),
    response
  );
  cy.intercept(
    method,
    url.replace(/\?.*$/, "/screen?include=screen,nested"),
    response.screen
  );
}
describe("Redirect Task ", () => {
  it("On Task Completed (Submitting Task) - taskList", () => {
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination",
      {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        allow_interstitial: false,
        elementDestination: {
          type: 'taskList',
          value: 'http://localhost:5173/tasks',
        },
        user: {
          id: 1
        },
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: "ACTIVE"
        }
      }
    );

    cy.visit("/?scenario=TaskRedirect", {});

    cy.wait(2000);
    cy.get(".form-group").find("button").click();

    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
    });
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:5173/tasks");
  });
  it("On Task Completed (Submitting Task) - processLaunchpad", () => {
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination",
      {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        allow_interstitial: false,
        elementDestination: {
          type: 'processLaunchpad',
          value: "http://localhost:5173/process-browser/7?categorySelected=-1",
        },
        user: {
          id: 1
        },
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: "ACTIVE"
        }
      }
    );

    cy.visit("/?scenario=TaskRedirect", {});

    cy.wait(2000);
    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
    });
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:5173/process-browser/7?categorySelected=-1");
  });
  it("On Task Completed (Submitting Task) - homepageDashboard", () => {
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination",
      {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        allow_interstitial: false,
        elementDestination: {
          type: 'homepageDashboard',
          value: "http://localhost:5173",
        },
        user: {
          id: 1
        },
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: "ACTIVE"
        }
      }
    );

    cy.visit("/?scenario=TaskRedirect", {});

    cy.wait(2000);
    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
    });
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:5173/");
  });
  it("On Task Completed (Submitting Task) - customDashboard", () => {
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination",
      {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        allow_interstitial: false,
        elementDestination: {
          type: 'customDashboard',
          value: "http://localhost:5173/home/customize-ui/dashboards/eHEXsFrIwmClHoTRnMvOdMKSPbR3HalSFxaIHYxNh67UrtloUiuDBh5N8NrMoQVP",
        },
        user: {
          id: 1
        },
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: "ACTIVE"
        }
      }
    );

    cy.visit("/?scenario=TaskRedirect", {});

    cy.wait(2000);
    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
    });
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:5173/home/customize-ui/dashboards/eHEXsFrIwmClHoTRnMvOdMKSPbR3HalSFxaIHYxNh67UrtloUiuDBh5N8NrMoQVP");
  });

});

function getTask(url, responseData) {
  initializeTaskAndScreenIntercepts("GET", url, {
    id: responseData.id,
    advanceStatus: "completed",
    component: "task-screen",
    status: responseData.status,
    allow_interstitial: responseData.allow_interstitial,
    interstitial_screen: responseData.interstitial_screen,
    screen: responseData.screen,
    process_request: {
      id: 1,
      parent_request_id: responseData.parent_request_id,
      status: responseData.status
    },
    user_request_permission: responseData.user_request_permission
  });
}
function getTasks(url, responseData = null) {
  if (responseData) {
    cy.intercept("GET", url, {
      data: [
        {
          id: responseData.taskId,
          advanceStatus: "open",
          process_id: 1,
          process_request_id: responseData.process_request_id,
          subprocess_request_id: 1,
          status: responseData.status,
          completed_at: null,
          due_at: moment().add(1, "day").toISOString(),
          due_notified: 0,
          process_request: {
            id: 1,
            status: responseData.status
          }
        }
      ]
    });
  } else {
    cy.intercept("GET", url, { data: [] });
  }
}
