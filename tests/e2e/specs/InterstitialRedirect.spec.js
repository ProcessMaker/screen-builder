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
 describe("Interstitial", () => {
   it("Load interstitial screen", () => {
     initializeTaskAndScreenIntercepts(
       "GET",
       "http://localhost:5173/api/1.1/tasks/1?include=data,user,draft,requestor,processRequest,component,screen,requestData,loopContext,bpmnTagName,interstitial,definition,nested,userRequestPermission,elementDestination",
       {
         "advanceStatus": "open",
         "id": 667,
         "element_name": "Form Task 11",
         "element_id": "node_92",
         "element_type": "task",
         "status": "ACTIVE",
         "due_at": "2024-09-02T16:12:01.000000Z",
         "process_request_id": 219,
         "is_self_service": 0,

         "user": {
             "id": 1,
             "firstname": "Admin",
             "lastname": "User",
             "email": "admin@processmaker.com",
             "username": "admin",
             "avatar": "",
             "fullname": "Admin User"
         },
         "requestor": {
             "id": 1,
             "uuid": "9cd28c78-f74c-4731-b0e5-aa5e49df3f7e",
             "email": "admin@processmaker.com",
             "firstname": "Admin",
             "lastname": "User",
             "username": "admin",
             "status": "ACTIVE",
             "address": null,
             "city": null,
             "state": null,
             "postal": null,
             "country": null,
             "phone": null,
             "fax": null,
             "cell": null,
             "title": null,
             "birthdate": null,
             "timezone": "America\/Los_Angeles",
             "datetime_format": "m\/d\/Y H:i",
             "language": "en",
             "meta": {
             },
             "connected_accounts": null,
             "is_administrator": true,
             "is_system": 0,
             "expires_at": null,
             "loggedin_at": "2024-08-30T14:01:18+00:00",
             "active_at": "2024-08-30T16:12:13+00:00",
             "remember_token": null,
             "created_at": "2024-08-21T22:58:58+00:00",
             "updated_at": "2024-08-23T15:06:58+00:00",
             "deleted_at": null,
             "delegation_user_id": null,
             "manager_id": null,
             "schedule": null,
             "force_change_password": 0,
             "avatar": "",
             "password_changed_at": null,
             "preferences_2fa": null,
             "fullname": "Admin User"
         },
         "process_request": {
             "id": 219,
             "uuid": "9ce415cb-08cd-49c9-aff5-b97fb8362346",
             "process_id": 7,
             "user_id": 1,
             "parent_request_id": null,
             "status": "ACTIVE",
             "do_not_sanitize": [
                 "interstitial_message",
                 " _user.fullname "
             ],
             "errors": null,
             "completed_at": null,
             "initiated_at": "2024-08-30T16:12:01+00:00",
             "created_at": "2024-08-30T16:12:01+00:00",
             "updated_at": "2024-08-30T16:12:01+00:00",
             "case_title": "Case #207",
             "case_number": 207,
             "callable_id": "ProcessId",
             "process_version_id": 143
         },
         "draft": null,
         "component": "task-screen",
      
         "loop_context": "",
         "definition": {
             "outgoing": {},
             "incoming": {},
             "id": "node_92",
             "name": "Form Task 11",
             "screenRef": "33",
             "allowInterstitial": "true",
             "interstitialScreenRef": "22",
             "assignment": "requester",
             "assignmentLock": "false",
             "allowReassignment": "false",
             "config": "{\"web_entry\":null}",
             "elementDestination": "{\"type\":\"taskSource\",\"value\":null}"
         },
         "bpmn_tag_name": "task",
         "allow_interstitial": true,
         "interstitial_screen": {
             "id": 22,
             "uuid": "9ca9bc5c-468e-4a11-8bb9-30a29494833d",
             "screen_category_id": "1",
             "title": "IDA - Dynamic Message - Interstitial Screen 7",
             "description": "IDA - Dynamic Message - Interstitial Screen",
             "type": "DISPLAY",
             "config": [
                 {
                     "name": "Retrieving Invoices - Interstitial Screen",
                     "items": [
                         {
                             "items": [
                                 [],
                                 [
                                     {
                                         "label": "Image",
                                         "config": {
                                             "icon": "fas fa-image",
                                             "name": "Interstitial",
                                             "event": "submit",
                                             "label": "Image",
                                             "value": null,
                                             "width": "297.21",
                                             "height": "220.61",
                                             "variant": "primary",
                                             "renderImage": false,
                                             "customCssSelector": "imgInterstitial"
                                         },
                                         "component": "FormImage",
                                         "editor-control": "FormImage",
                                         "editor-component": "FormImage"
                                     },
                                     {
                                         "label": "Rich Text",
                                         "config": {
                                             "icon": "fas fa-pencil-ruler",
                                             "label": null,
                                             "content": "<h3 style=\"text-align: center;\">{{interstitial_title}}<\/h3>",
                                             "interactive": true,
                                             "renderVarHtml": false,
                                             "conditionalHide": null
                                         },
                                         "component": "FormHtmlViewer",
                                         "editor-control": "FormHtmlEditor",
                                         "editor-component": "FormHtmlEditor"
                                     },
                                     {
                                         "label": "Rich Text",
                                         "config": {
                                             "icon": "fas fa-pencil-ruler",
                                             "label": null,
                                             "content": "<h5 style=\"text-align: center; padding: 20px 270px 20px 270px;\">{{interstitial_message}}<\/h5>",
                                             "interactive": true,
                                             "renderVarHtml": true,
                                             "customCssSelector": null
                                         },
                                         "component": "FormHtmlViewer",
                                         "editor-control": "FormHtmlEditor",
                                         "editor-component": "FormHtmlEditor"
                                     }
                                 ],
                                 []
                             ],
                             "label": "Multicolumn \/ Table",
                             "config": {
                                 "icon": "fas fa-table",
                                 "label": null,
                                 "options": [
                                     {
                                         "value": "1",
                                         "content": "2"
                                     },
                                     {
                                         "value": "2",
                                         "content": "8"
                                     },
                                     {
                                         "value": "3",
                                         "content": "2"
                                     }
                                 ],
                                 "customCssSelector": "fullbox"
                             },
                             "component": "FormMultiColumn",
                             "container": true,
                             "editor-control": "FormMultiColumn",
                             "editor-component": "MultiColumn"
                         }
                     ],
                     "order": 1
                 }
             ],
             "computed": [
                 {
                     "id": 5,
                     "name": "interstitial_title",
                     "type": "javascript",
                     "formula": "if(this.interstitial_title == null){\r\n    return \"We're getting the next task for you...\";\r\n}",
                     "property": "interstitial_title"
                 }
             ],
             "custom_css": "[selector='imgInterstitial']{\r\n     text-align: center;\r\n     padding-top: 10px;\r\n     padding-bottom: 30px;\r\n}\r\n[selector='fullbox']{\r\n     padding: 50px 10px 50px 10px;\r\n}\r\n[selector='text']{\r\n     max-width: 430px; \r\n     text-align: center;\r\n}",
             "created_at": "2024-07-08T15:23:18+00:00",
             "updated_at": "2024-08-21T22:59:40+00:00",
             "status": "ACTIVE",
             "key": null,
             "watchers": [],
             "translations": null,
             "is_template": 0,
             "asset_type": null,
             "projects": "[]"
         },
         "user_request_permission": [
             {
                 "process_request_id": 219,
                 "allowed": true
             }
         ],
         "elementDestination": {
             "type": "taskSource",
             "value": "taskSource"
         }
       }
     );
     initializeTaskAndScreenIntercepts(
       "GET",
       "http://localhost:5173/api/1.1/tasks/1/screen?include=screen,nested",
       {
         "id": 63,
         "screen_id": 33,
         "screen_category_id": 1,
         "draft": 0,
         "title": "first-form",
         "description": "test",
         "type": "FORM",
         "config": [
             {
                 "name": "first-form",
                 "items": [
                     {
                         "label": "Line Input",
                         "config": {
                             "icon": "far fa-square",
                             "name": "form_input_1",
                             "type": "text",
                             "label": "New Input",
                             "helper": null,
                             "dataFormat": "string",
                             "validation": null,
                             "placeholder": null
                         },
                         "component": "FormInput",
                         "editor-control": "FormInput",
                         "editor-component": "FormInput"
                     },
                     {
                         "label": "Submit Button",
                         "config": {
                             "icon": "fas fa-share-square",
                             "name": null,
                             "event": "submit",
                             "label": "New Submit",
                             "loading": false,
                             "tooltip": [],
                             "variant": "primary",
                             "fieldValue": null,
                             "loadingLabel": "Loading...",
                             "defaultSubmit": true
                         },
                         "component": "FormButton",
                         "editor-control": "FormSubmit",
                         "editor-component": "FormButton"
                     }
                 ],
                 "order": 1
             }
         ],
         "computed": [],
         "custom_css": null,
         "created_at": "2024-08-22 15:00:04",
         "updated_at": "2024-08-22 15:00:04",
         "status": "ACTIVE",
         "key": null,
         "watchers": [],
         "translations": null,
         "is_template": 0,
         "asset_type": null,
         "nested": []
       }
     );
     cy.visit("/?scenario=TaskRedirect", {});

     cy.get(".form-group").find("button").click();
     initializeTaskAndScreenIntercepts(
       "GET",
       "http://localhost:5173/api/1.1/tasks/2?include=data,user,draft,requestor,processRequest,component,requestData,loopContext,bpmnTagName,interstitial,definition,userRequestPermission,elementDestination",
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




     cy.socketEventNext("ProcessMaker\\Events\\RedirectTo", {
       params: [{
         nodeId: 'node_2',
         tokenId: 2,
         userId: 1,
       }],
       method: "redirectToTask"
     });
     cy.get("[data-cy=screen-field-Interstitial").should('exist')
   });
 });