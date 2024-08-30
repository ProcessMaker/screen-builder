
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
  it("Element destination type is summaryScreen", () => {
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
          type:"summaryScreen",
          value: null
        }
      }],
      method: "processCompletedRedirect"
    });
    cy.url().should("eq", "http://localhost:5173/requests/1");
  });
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
  it("Element destination type is customDashboard", () => {
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
          type: "customDashboard",
          value: "http://localhost:5173/home/customize-ui/dashboards/eHEXsFrIwmClHoTRnMvOdMKSPbR3HalSFxaIHYxNh67UrtloUiuDBh5N8NrMoQVP"
        }
      }],
      method: "processCompletedRedirect"
    });
    cy.url().should("eq", "http://localhost:5173/home/customize-ui/dashboards/eHEXsFrIwmClHoTRnMvOdMKSPbR3HalSFxaIHYxNh67UrtloUiuDBh5N8NrMoQVP");
  });
  it("Element destination type is externalURL", () => {
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
          type: "externalURL",
          value: "http://localhost:5173/about"
        }
      }],
      method: "processCompletedRedirect"
    });
    cy.url().should("eq", "http://localhost:5173/about");
  });
  it("Element destination type is anotherProcess", () => {
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
    cy.intercept(
      "POST",
      "http://localhost:5173/api/1.0/process_events/4?event=node_1",
      {}
    );
    cy.intercept(
      "GET",
      "http://localhost:5173/api/1.1/tasks?user_id=1&process_request_id=undefined&page=1&per_page=1&status=ACTIVE",
      {
        "data": [
            {
                "id": 585,
                "uuid": "9ce21eaf-0991-495c-9f11-2e47b409acd5",
                "user_id": 1,
                "process_id": 7,
                "process_request_id": 194,
                "subprocess_request_id": null,
                "element_id": "node_117",
                "element_type": "task",
                "element_name": "Form Task 222",
                "status": "ACTIVE",
                "element_index": 0,
                "subprocess_start_event_id": null,
                "completed_at": null,
                "due_at": "2024-09-01T16:45:13+00:00",
                "due_notified": 0,
                "initiated_at": null,
                "riskchanges_at": "2024-08-31T18:45:13+00:00",
                "created_at": "2024-08-29T16:45:13+00:00",
                "updated_at": "2024-08-29T16:45:13+00:00",
                "version_id": 63,
                "version_type": "ProcessMaker\\Models\\ScreenVersion",
                "is_self_service": 0,
                "self_service_groups": [],
                "token_properties": [],
                "is_priority": false,
                "is_actionbyemail": false,
                "user_viewed_at": null,
                "advanceStatus": "open",
                "draft": null,
                "assignable_users": [
                    3
                ],
                "can_view_parent_request": false,
            }
        ]
      }
    );
    cy.visit("/?scenario=TaskRedirect", {});

    cy.get(".form-group").find("button").click();

    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        endEventDestination: {
          type: "anotherProcess",
          value: '{"calledElement":"ProcessId-4","processId":4,"startEvent":"node_1","name":"subprocess"}'
        }
      }],
      method: "processCompletedRedirect"
    });
    cy.wait(1000);
    cy.url().should("eq", "http://localhost:5173/tasks/585/edit");
  });
});
