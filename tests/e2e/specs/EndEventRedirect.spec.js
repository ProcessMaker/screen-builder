
import SingleScreen from "../fixtures/single_line_input.json";

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
describe("End Event Redirect (Process completed) ", () => {
  it("Element destination type is taskList", () => {
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

    cy.get(".form-group").find("button").click();

    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        endEventDestination: {
          type:"taskList",
          value:"http://localhost:5173/tasks"
        }
      }],
      method: "processCompletedRedirect"
    });
    cy.url().should("eq", "http://localhost:5173/tasks");
  });
  it("Element destination type is processLaunchpad", () => {
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

    cy.get(".form-group").find("button").click();

    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        endEventDestination: {
          type:"processLaunchpad",
          value: "http://localhost:5173/process-browser/7?categorySelected=-1"
        }
      }],
      method: "processCompletedRedirect"
    });
    cy.url().should("eq", "http://localhost:5173/process-browser/7?categorySelected=-1");
  });
  it("Element destination type is homepageDashboard", () => {
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

    cy.get(".form-group").find("button").click();

    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        endEventDestination: {
          type: "homepageDashboard",
          value: "http://localhost:5173/home/customize-ui/dashboards/eHEXsFrIwmClHoTRnMvOdMKSPbR3HalSFxaIHYxNh67UrtloUiuDBh5N8NrMoQVP"
        }
      }],
      method: "processCompletedRedirect"
    });
    cy.url().should("eq", "http://localhost:5173/home/customize-ui/dashboards/eHEXsFrIwmClHoTRnMvOdMKSPbR3HalSFxaIHYxNh67UrtloUiuDBh5N8NrMoQVP");
  });
});
