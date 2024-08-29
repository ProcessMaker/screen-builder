
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
describe("On Task Completed (Submitting Task) ", () => {
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
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
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

    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
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

    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
    });
    cy.url().should("eq", "http://localhost:5173/");
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

    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
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
          type: 'externalURL',
          value: "http://localhost:5173/about",
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
        nodeId: 'node_2',
        tokenId: 2,
        userId: 1,
      }],
      method: "redirectToTask"
    });
    cy.url().should("eq", "http://localhost:5173/about");
  });
  it("Element destination type is taskSource case 1(redirect to task list if the next user is not assigned to the same user)" , () => {
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination",
      {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        allow_interstitial: false,
        elementDestination: {
          type: "taskSource",
          value: "taskSource",
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
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks?user_id=1&process_request_id=1&page=1&per_page=1&status=ACTIVE",
      {
    "data": [
        {
            "id": 585,
            "uuid": "9ce21eaf-0991-495c-9f11-2e47b409acd5",
            "user_id": 3,
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
            "process_request": {
                "id": 194,
                "uuid": "9ce21e35-087d-45dd-b1ed-f2874307e293",
                "process_id": 7,
                "process_collaboration_id": null,
                "collaboration_uuid": null,
                "user_id": 1,
                "parent_request_id": null,
                "participant_id": null,
                "callable_id": "ProcessId",
                "status": "ACTIVE",
                "name": "processTL",
                "do_not_sanitize": [],
                "errors": null,
                "completed_at": null,
                "initiated_at": "2024-08-29T16:43:53+00:00",
                "created_at": "2024-08-29T16:43:53+00:00",
                "updated_at": "2024-08-29T16:45:13+00:00",
                "process_version_id": 129,
                "signal_events": [],
                "case_title": "Case #182",
                "case_number": 182,
                "case_title_formatted": "Case #<b>182<\/b>",
                "process": {
                    "id": 7,
                    "uuid": "9cdc0e74-0e60-4a33-a6e6-71c96b6b7330",
                    "process_category_id": "2",
                    "user_id": 1,
                    "description": "test",
                    "name": "processTL",
                    "cancel_screen_id": null,
                    "request_detail_screen_id": null,
                    "status": "ACTIVE",
                    "is_valid": 1,
                    "package_key": null,
                    "pause_timer_start": 0,
                    "deleted_at": null,
                    "created_at": "2024-08-26T16:24:52+00:00",
                    "updated_at": "2024-08-29T16:43:37+00:00",
                    "updated_by": 1,
                    "start_events": [
                        {
                            "id": "node_91",
                            "name": "Start Event",
                            "config": "{\"web_entry\":null}",
                            "ownerProcessId": "ProcessId",
                            "eventDefinitions": [],
                            "ownerProcessName": "ProcessName",
                            "allowInterstitial": "false",
                            "interstitialScreenRef": "1"
                        }
                    ],
                    "self_service_tasks": [],
                    "signal_events": [],
                    "conditional_events": [],
                    "properties": {
                        "manager_id": "undefined"
                    },
                    "is_template": 0,
                    "case_title": null,
                    "launchpad_properties": null,
                    "asset_type": null,
                    "alternative": "A",
                    "has_timer_start_events": false,
                    "projects": "[]"
                }
            },
            "process": {
                "id": 7,
                "uuid": "9cdc0e74-0e60-4a33-a6e6-71c96b6b7330",
                "process_category_id": "2",
                "user_id": 1,
                "description": "test",
                "name": "processTL",
                "cancel_screen_id": null,
                "request_detail_screen_id": null,
                "status": "ACTIVE",
                "is_valid": 1,
                "package_key": null,
                "pause_timer_start": 0,
                "deleted_at": null,
                "created_at": "2024-08-26T16:24:52+00:00",
                "updated_at": "2024-08-29T16:43:37+00:00",
                "updated_by": 1,
                "start_events": [
                    {
                        "id": "node_91",
                        "name": "Start Event",
                        "config": "{\"web_entry\":null}",
                        "ownerProcessId": "ProcessId",
                        "eventDefinitions": [],
                        "ownerProcessName": "ProcessName",
                        "allowInterstitial": "false",
                        "interstitialScreenRef": "1"
                    }
                ],
                "self_service_tasks": [],
                "signal_events": [],
                "conditional_events": [],
                "properties": {
                    "manager_id": "undefined"
                },
                "is_template": 0,
                "case_title": null,
                "launchpad_properties": null,
                "asset_type": null,
                "alternative": "A",
                "has_timer_start_events": false,
                "projects": "[]"
            },
            "user": {
                "id": 3,
                "uuid": "9cdee13e-7aff-4d09-9322-0257e4a4996f",
                "email": "homero@simpsom.com",
                "firstname": "homero",
                "lastname": "simpsom",
                "username": "homero",
                "status": "ACTIVE",
                "address": null,
                "city": null,
                "state": null,
                "postal": null,
                "country": null,
                "phone": null,
                "fax": null,
                "cell": null,
                "title": "none",
                "birthdate": null,
                "timezone": "UTC",
                "datetime_format": "m\/d\/Y H:i",
                "language": "en",
                "meta": null,
                "connected_accounts": null,
                "is_administrator": true,
                "is_system": 0,
                "expires_at": null,
                "loggedin_at": "2024-08-28T02:09:33+00:00",
                "active_at": "2024-08-28T02:25:55+00:00",
                "remember_token": null,
                "created_at": "2024-08-28T02:05:56+00:00",
                "updated_at": "2024-08-28T02:06:05+00:00",
                "deleted_at": null,
                "delegation_user_id": null,
                "manager_id": null,
                "schedule": null,
                "force_change_password": 0,
                "avatar": null,
                "password_changed_at": "2024-08-28 02:05:56",
                "preferences_2fa": null,
                "fullname": "homero simpsom"
            },
            "draft": null,
            "assignable_users": [
                3
            ],
            "can_view_parent_request": false
        }
    ],
    "meta": {
        "filter": "",
        "sort_by": "due_at",
        "sort_order": "asc",
        "count": 1,
        "total_pages": 1,
        "in_overdue": 0,
        "current_page": 1,
        "from": 1,
        "last_page": 1,
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "http:\/\/processmaker.test\/api\/1.0\/tasks?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "path": "http:\/\/processmaker.test\/api\/1.0\/tasks",
        "per_page": 15,
        "to": 1,
        "total": 1
    }
}
    );
    
    
    cy.visit("/?scenario=TaskRedirect", {});
    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 2,
      }],
      method: "redirectToTask"
    });
    cy.url().should("eq", "http://localhost:5173/tasks");
  });
  it("Element destination type is taskSource case 2(redirect to previous page if the next task is not assigned to the same user)" , () => {
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination",
      {
        id: 1,
        advanceStatus: "open",
        component: "task-screen",
        allow_interstitial: false,
        elementDestination: {
          type: "taskSource",
          value: "taskSource",
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
    initializeTaskAndScreenIntercepts(
      "GET",
      "http://localhost:5173/api/1.1/tasks?user_id=1&process_request_id=1&page=1&per_page=1&status=ACTIVE",
      {
        "data": [
            {
                "id": 585,
                "uuid": "9ce21eaf-0991-495c-9f11-2e47b409acd5",
                "user_id": 3,
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
                "process_request": {
                    "id": 194,
                    "uuid": "9ce21e35-087d-45dd-b1ed-f2874307e293",
                    "process_id": 7,
                    "process_collaboration_id": null,
                    "collaboration_uuid": null,
                    "user_id": 1,
                    "parent_request_id": null,
                    "participant_id": null,
                    "callable_id": "ProcessId",
                    "status": "ACTIVE",
                    "name": "processTL",
                    "do_not_sanitize": [],
                    "errors": null,
                    "completed_at": null,
                    "initiated_at": "2024-08-29T16:43:53+00:00",
                    "created_at": "2024-08-29T16:43:53+00:00",
                    "updated_at": "2024-08-29T16:45:13+00:00",
                    "process_version_id": 129,
                    "signal_events": [],
                    "case_title": "Case #182",
                    "case_number": 182,
                    "case_title_formatted": "Case #<b>182<\/b>",
                    "process": {
                        "id": 7,
                        "uuid": "9cdc0e74-0e60-4a33-a6e6-71c96b6b7330",
                        "process_category_id": "2",
                        "user_id": 1,
                        "description": "test",
                        "name": "processTL",
                        "cancel_screen_id": null,
                        "request_detail_screen_id": null,
                        "status": "ACTIVE",
                        "is_valid": 1,
                        "package_key": null,
                        "pause_timer_start": 0,
                        "deleted_at": null,
                        "created_at": "2024-08-26T16:24:52+00:00",
                        "updated_at": "2024-08-29T16:43:37+00:00",
                        "updated_by": 1,
                        "start_events": [
                            {
                                "id": "node_91",
                                "name": "Start Event",
                                "config": "{\"web_entry\":null}",
                                "ownerProcessId": "ProcessId",
                                "eventDefinitions": [],
                                "ownerProcessName": "ProcessName",
                                "allowInterstitial": "false",
                                "interstitialScreenRef": "1"
                            }
                        ],
                        "self_service_tasks": [],
                        "signal_events": [],
                        "conditional_events": [],
                        "properties": {
                            "manager_id": "undefined"
                        },
                        "is_template": 0,
                        "case_title": null,
                        "launchpad_properties": null,
                        "asset_type": null,
                        "alternative": "A",
                        "has_timer_start_events": false,
                        "projects": "[]"
                    }
                },
                "process": {
                    "id": 7,
                    "uuid": "9cdc0e74-0e60-4a33-a6e6-71c96b6b7330",
                    "process_category_id": "2",
                    "user_id": 1,
                    "description": "test",
                    "name": "processTL",
                    "cancel_screen_id": null,
                    "request_detail_screen_id": null,
                    "status": "ACTIVE",
                    "is_valid": 1,
                    "package_key": null,
                    "pause_timer_start": 0,
                    "deleted_at": null,
                    "created_at": "2024-08-26T16:24:52+00:00",
                    "updated_at": "2024-08-29T16:43:37+00:00",
                    "updated_by": 1,
                    "start_events": [
                        {
                            "id": "node_91",
                            "name": "Start Event",
                            "config": "{\"web_entry\":null}",
                            "ownerProcessId": "ProcessId",
                            "eventDefinitions": [],
                            "ownerProcessName": "ProcessName",
                            "allowInterstitial": "false",
                            "interstitialScreenRef": "1"
                        }
                    ],
                    "self_service_tasks": [],
                    "signal_events": [],
                    "conditional_events": [],
                    "properties": {
                        "manager_id": "undefined"
                    },
                    "is_template": 0,
                    "case_title": null,
                    "launchpad_properties": null,
                    "asset_type": null,
                    "alternative": "A",
                    "has_timer_start_events": false,
                    "projects": "[]"
                },
                "user": {
                    "id": 3,
                    "uuid": "9cdee13e-7aff-4d09-9322-0257e4a4996f",
                    "email": "homero@simpsom.com",
                    "firstname": "homero",
                    "lastname": "simpsom",
                    "username": "homero",
                    "status": "ACTIVE",
                    "address": null,
                    "city": null,
                    "state": null,
                    "postal": null,
                    "country": null,
                    "phone": null,
                    "fax": null,
                    "cell": null,
                    "title": "none",
                    "birthdate": null,
                    "timezone": "UTC",
                    "datetime_format": "m\/d\/Y H:i",
                    "language": "en",
                    "meta": null,
                    "connected_accounts": null,
                    "is_administrator": true,
                    "is_system": 0,
                    "expires_at": null,
                    "loggedin_at": "2024-08-28T02:09:33+00:00",
                    "active_at": "2024-08-28T02:25:55+00:00",
                    "remember_token": null,
                    "created_at": "2024-08-28T02:05:56+00:00",
                    "updated_at": "2024-08-28T02:06:05+00:00",
                    "deleted_at": null,
                    "delegation_user_id": null,
                    "manager_id": null,
                    "schedule": null,
                    "force_change_password": 0,
                    "avatar": null,
                    "password_changed_at": "2024-08-28 02:05:56",
                    "preferences_2fa": null,
                    "fullname": "homero simpsom"
                },
                "draft": null,
                "assignable_users": [
                    3
                ],
                "can_view_parent_request": false
            }
        ],
        "meta": {
            "filter": "",
            "sort_by": "due_at",
            "sort_order": "asc",
            "count": 1,
            "total_pages": 1,
            "in_overdue": 0,
            "current_page": 1,
            "from": 1,
            "last_page": 1,
            "links": [
                {
                    "url": null,
                    "label": "&laquo; Previous",
                    "active": false
                },
                {
                    "url": "http:\/\/processmaker.test\/api\/1.0\/tasks?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": null,
                    "label": "Next &raquo;",
                    "active": false
                }
            ],
            "path": "http:\/\/processmaker.test\/api\/1.0\/tasks",
            "per_page": 15,
            "to": 1,
            "total": 1
        }
      }
    );
    
    
    cy.visit("/?scenario=TaskRedirect", {
      onBeforeLoad: function (window) {
        sessionStorage.setItem('sessionUrlSelfService', "http://localhost:5173/about");
      } 
    });
    cy.get(".form-group").find("button").click();
    
    cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
      params: [{
        nodeId: 'node_2',
        tokenId: 2,
        userId: 2,
      }],
      method: "redirectToTask"
    });
    cy.url().should("eq", "http://localhost:5173/about");
  });
});
