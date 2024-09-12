
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
                "pinnedControls": [
                    {
                        "id": "nodeType_181",
                        "icon": "http:\/\/processmaker.test\/js\/img\/start-event.27ee6b1c.svg",
                        "rank": 10,
                        "type": "processmaker-modeler-start-event",
                        "items": [
                            {
                                "id": "processmaker-modeler-start-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/start-event.27ee6b1c.svg",
                                "rank": 10,
                                "type": "processmaker-modeler-start-event",
                                "label": "Start Event",
                                "control": true,
                                "bpmnType": "bpmn:StartEvent"
                            },
                            {
                                "id": "processmaker-modeler-message-start-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/message-start-event.e2d5addf.svg",
                                "rank": 11,
                                "type": "processmaker-modeler-message-start-event",
                                "label": "Message Start Event",
                                "control": true,
                                "bpmnType": "bpmn:StartEvent"
                            },
                            {
                                "id": "processmaker-modeler-conditional-start-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/conditional-start-event.485aa22f.svg",
                                "rank": 12,
                                "type": "processmaker-modeler-conditional-start-event",
                                "label": "Conditional Start Event",
                                "control": true,
                                "bpmnType": "bpmn:StartEvent"
                            },
                            {
                                "id": "processmaker-modeler-signal-start-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/signal-start-event.4239bcab.svg",
                                "rank": 13,
                                "type": "processmaker-modeler-signal-start-event",
                                "label": "Signal Start Event",
                                "control": true,
                                "bpmnType": "bpmn:StartEvent"
                            },
                            {
                                "id": "processmaker-modeler-start-timer-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/timer-start-event.c354a032.svg",
                                "rank": 14,
                                "type": "processmaker-modeler-start-timer-event",
                                "label": "Start Timer Event",
                                "control": true,
                                "bpmnType": "bpmn:StartEvent"
                            }
                        ],
                        "label": "Start Event",
                        "bpmnType": "bpmn:StartEvent"
                    },
                    {
                        "id": "nodeType_180",
                        "icon": "http:\/\/processmaker.test\/js\/img\/generic-intermediate-event.96b0ece1.svg",
                        "rank": 20,
                        "type": "processmaker-modeler-intermediate-catch-timer-event",
                        "items": [
                            {
                                "id": "processmaker-modeler-intermediate-catch-timer-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/intermediate-timer-event.e880bbcc.svg",
                                "rank": 21,
                                "type": "processmaker-modeler-intermediate-catch-timer-event",
                                "label": "Intermediate Timer Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-intermediate-signal-catch-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/intermediate-signal-catch-event.ce6fe9b6.svg",
                                "rank": 22,
                                "type": "processmaker-modeler-intermediate-signal-catch-event",
                                "label": "Intermediate Signal Catch Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-intermediate-signal-throw-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/intermediate-signal-throw-event.2f50ec9d.svg",
                                "rank": 23,
                                "type": "processmaker-modeler-intermediate-signal-throw-event",
                                "label": "Intermediate Signal Throw Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-intermediate-message-catch-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/intermediate-message-catch-event.6c9df16a.svg",
                                "rank": 24,
                                "type": "processmaker-modeler-intermediate-message-catch-event",
                                "label": "Intermediate Message Catch Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-intermediate-message-throw-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/intermediate-message-throw-event.43b59c5e.svg",
                                "rank": 25,
                                "type": "processmaker-modeler-intermediate-message-throw-event",
                                "label": "Intermediate Message Throw Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-intermediate-conditional-catch-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/intermediate-conditional-catch-event.638dee5a.svg",
                                "rank": 26,
                                "type": "processmaker-modeler-intermediate-conditional-catch-event",
                                "label": "Intermediate Conditional Catch Event",
                                "control": true
                            }
                        ],
                        "label": "Intermediate Event",
                        "bpmnType": "bpmn:IntermediateCatchEvent"
                    },
                    {
                        "id": "nodeType_184",
                        "icon": "http:\/\/processmaker.test\/js\/img\/end-event.484eed9c.svg",
                        "rank": 30,
                        "type": "processmaker-modeler-end-event",
                        "items": [
                            {
                                "id": "processmaker-modeler-end-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/end-event.484eed9c.svg",
                                "rank": 31,
                                "type": "processmaker-modeler-end-event",
                                "label": "End Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-message-end-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/message-end-event.6b25bec9.svg",
                                "rank": 32,
                                "type": "processmaker-modeler-message-end-event",
                                "label": "Message End Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-error-end-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/error-end-event.be1352e7.svg",
                                "rank": 33,
                                "type": "processmaker-modeler-error-end-event",
                                "label": "Error End Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-signal-end-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/signal-end-event.e6feb2d5.svg",
                                "rank": 34,
                                "type": "processmaker-modeler-signal-end-event",
                                "label": "Signal End Event",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-terminate-end-event",
                                "icon": "http:\/\/processmaker.test\/js\/img\/terminate-end-event.53b2871d.svg",
                                "rank": 35,
                                "type": "processmaker-modeler-terminate-end-event",
                                "label": "Terminate End Event",
                                "control": true
                            }
                        ],
                        "label": "End Event",
                        "bpmnType": "bpmn:EndEvent"
                    },
                    {
                        "id": "nodeType_185",
                        "icon": "http:\/\/processmaker.test\/js\/img\/task.9eaeba47.svg",
                        "rank": 40,
                        "type": "processmaker-modeler-task",
                        "items": [
                            {
                                "id": "processmaker-modeler-task",
                                "icon": "http:\/\/processmaker.test\/js\/img\/task.9eaeba47.svg",
                                "rank": 41,
                                "type": "processmaker-modeler-task",
                                "label": "Form Task",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-manual-task",
                                "icon": "http:\/\/processmaker.test\/js\/img\/manual-task.166f9f35.svg",
                                "rank": 42,
                                "type": "processmaker-modeler-manual-task",
                                "label": "Manual Task",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-script-task",
                                "icon": "http:\/\/processmaker.test\/js\/img\/script-task.8d648d88.svg",
                                "rank": 43,
                                "type": "processmaker-modeler-script-task",
                                "label": "Script Task",
                                "control": true
                            },
                            {
                                "id": "processmaker-modeler-call-activity",
                                "icon": "http:\/\/processmaker.test\/js\/img\/sub-task.255eb842.svg",
                                "rank": 44,
                                "type": "processmaker-modeler-call-activity",
                                "label": "Sub Process",
                                "control": true
                            }
                        ],
                        "label": "Task",
                        "bpmnType": [
                            "bpmn:Task",
                            "bpmn:UserTask",
                            "bpmn:GlobalTask",
                            "bpmn:SubProcess"
                        ]
                    }
                ]
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
        "request_data": {
            "_user": {
                "id": 1,
                "firstname": "Admin",
                "lastname": "User",
                "email": "admin@processmaker.com",
                "username": "admin",
                "avatar": "",
                "fullname": "Admin User"
            },
            "_request": {
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
                "process_version_id": 143,
                "startEventId": "node_91",
                "startEventName": "Start Event",
                "alternative": "A"
            }
        },
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
                                            "image": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlQAAAG6CAYAAADOPthGAAAgAElEQVR4Aex9B5dcxbW1\/5mx\/Rk\/Y+NEekSDydHYGIxxzjZOPMfnZ4OEkBBRAqGcA0ggEUzG2DgARoioCT3TPR3Ot05V7apTdevevj0zLc1MH9aqNYCk0fS5oXbtvc8+H\/jABz7wASI6gfQfrYBWQCugFdAKaAW0AlqBWVWA8ZQCqlmVTv+QVkAroBXQCmgFtAJaAVsBBVR6J2gFtAJaAa2AVkAroBWYYwUUUM2xgPrHtQJaAa2AVkAroBXQCiig0ntAK6AV0ApoBbQCWgGtwBwroIBqjgXUP64V0ApoBbQCWgGtgFZAAZXeA1oBrYBWQCugFdAKaAXmWAEFVHMsoP5xrYBWQCugFdAKaAW0Agqo9B7QCmgFtAJaAa2AVkArMMcKKKCaYwH1j2sFtAJaAa2AVkAroBVQQKX3gFZAK6AV0ApoBbQCWoE5VkAB1RwLqH9cK6AV0ApoBbQCWgGtgAIqvQe0AloBrYBWQCugFdAKzLECCqjmWED941oBrYBWQCugFdAKaAUUUOk9oBXQCmgFtAJaAa2AVmCOFVBANccC6h\/XCmgFtAJaAa2AVkAroIBK7wGtgFZAK6AV0ApoBbQCc6yAAqo5FlD\/uFZAK6AV0ApoBbQCWgEFVHoPaAW0AloBrYBWQCugFZhjBRRQzbGA+se1AloBrYBWQCugFdAKKKDSe0AroBXQCmgFtAJaAa3AHCuggGqOBdQ\/rhXQCmgFtAJaAa2AVkABld4DWgGtgFZAK6AV0ApoBeZYAQVUcyyg\/nGtgFZAK6AV0ApoBbQCCqj0HtAKaAW0AloBrYBWQCswxwoooJpjAfWPawW0AloBrYBWQCugFVBApfeAVkAroBXQCmgFtAJagTlWQAHVHAuof1wroBXQCmgFtAJaAa2AAiq9B7QCWgGtgFZAK6AV0ArMsQIKqOZYQP3jWgGtgFZAK6AV0ApoBRRQ6T2gFdAKaAW0AloBrYBWYI4VUEA1xwLqH9cKaAW0AloBrYBWQCuggErvAa2AVkAroBXQCmgFtAJzrIACqjkWUP+4VkAroBXQCmgFtAJaAQVUeg9oBbQCWgGtgFZAK6AVmGMFFFDNsYD6x7UCWgGtgFZAK6AV0AoooNJ7QCugFdAKaAW0AloBrcAcK6CAao4F1D+uFdAKaAW0AloBrYBWQAGV3gNaAa2AVkAroBXQCmgF5lgBBVRzLKD+ca2AVkAroBXQCmgFtAIKqPQe0ApoBbQCWgGtgFZAKzDHCiigmmMB9Y9rBbQCWgGtgFZAK6AVUECl94BWQCuw5CtwtEm087UeLXu+R799uke3PGXXr57q0q+ejNcvn+wSr188EdbPH+\/Szx\/vmPWzxzv0s0N23XywQ1g\/Pdihnz7WoZ88Fr7yv\/\/4sTb9+FGxDrTpxwfa9CNe++364f428fqBXI+06ftufe+RGTLr4Rn6rlz7Zug7+1pmfXtvi\/za06JvYe1u0jdza1eTvmHWNH19Z1g37Zymm3ZM09eSdeOOKbpxe1hf3T5FvG7gtW2KrsfaOkXXu\/WVLVNkV4O+stmu6zY3yKxNDbphS4O+t2uK1v+1Re9P95b8fagfcGlXQAHV0r6++um0AiNdgfEZoj8+26Ov7OvRVbvtunJXj7Cu2NklrMt3dunyHV26zK1Lt3fp0u0dsy7Z1iFeF7t10dYOmbWlTReK9YXNbeJ1Aa9NbTp\/0wydv9Guz2+coc9vmKHzxDp3\/Qydu75F5\/B6qEVnY61r0dnrWnTWuiad9WCTznywSf\/N64GwznigSWesnabT3TptzTTxOvX+sE65b4rsmqbP3TdFn7vXrs\/eO0WfvWeKPuPWp+9uEK9PYd3VoJN5rW7QJ1dP+vWJOyeJ10m8Vtn18ZUTxOu\/3PrYHROEdeKKCTpxxbhZH719nHj9P17Lx+kjYn142Rh98o5x+tX+KRpvKrAa6Yd2EX94BVSL+OLpj64V0AqUV+DQEaIbHyG6ek8AUymoumKXBVQAUzlAdcl2C6Y8qNraoYszgApgygCqTRZQXcCAyoGqHKA6LwFUHlQZMGUBFYMprCKgalpA5cBUCqpOuX\/aACoDphygMmAqAlQWTHlQdVeDPtUPUDkwJUFVOaCaoI+usGBKAioJqhhQ8frQsjH61MpxevndbvmF1V\/RCizQCiigWqAXRn8srYBWYPYVOHCY6Jo9FkwxoLrasVMMqMBO8deInSphqBhQXSoZKoAp\/irZqS2WnZIMlQFUjqFipopBVRVDJQEVGCqAKclSWXbKgSlmqCSgyjJUU56hAqACO\/WZexr0GcdQGZaqBFCBnSpjqMBSgZ3ir5ahsixVKUPlwBQA1YduG6P\/un2cnnyjPfsbQP+kVuA4VEAB1XEouv6VWgGtwPAq8I8xomv3MaDqGXYqZagiQDUgQ2UkPwGoUrnvQiH3WcmvbSW\/TW0DpgYBVGeBpcpIfgZQGckvgKqUnYL0x5JfP4aKARUvI\/mVACqW\/gCqwEzxVyP5rZqskPwGY6gYUPH65MpxemNcmarhPSn6nee7Agqo5rui+v20AlqB41aBdpfoZ08SXbM3BlQRQyVYqjoMFfuovNzHHqoSyY\/BFWS\/4KEKPqqc5Mf+KemhkgxVFlA5H1UBUK2JWSoJpuCjgocKDFXwUAWGqgpQAUxJhurjDKhWWQ9VjqH6mPFQ9WGolo8buc8wVA5MMaA64bYx+tLGxnG7l\/Qv1goMWgEFVINWTH+\/VkArsGArcPAI0RcZTDlAlWOpJEMF2a\/KQ1UbUElDesaUnkp+525gQ3p\/U3ok+TlTOiS\/M9YWPVQAU\/wVHirPUrF3yi0p+Xn\/FLNUkqG6S5jSnSEdwAoslWGoKk3pAVCxId34qIQhnc3p3kMlAdWtY3TCrWP0\/FudBXu\/6Q+mFZAVUEAlq6H\/rhXQCizqCvz2mRRQBR9Vakg3YMr5qOYFUEmGypnSjSG9xJTeD1BZhip0+RkPVQ1AdZrwUBlQlUh+3OnHoEoCKnioqhiqUsnPMVQ5U3rwURVN6WmXX4GhcoDqp\/umF\/U9qT\/86FRAAdXoXGv9pFqBJV2BTo\/ohkckoBKynzClX5WJTTCAqsSUnmOocrEJX5CAyjFUBVO6iExgc\/ogkl8BUDkPFaIT4KGSgCqS+9IuPw+qZtHll4lNyEl+MKXnuvw8oJKmdMlQsex36xh9\/v5J4mur\/2gFFnoFFFAt9CukP59WQCtQqwL\/mbRgKkh+eUB1pfBQXelyqKoYqlxsAgCVNKVfuKWT91BV5lBZD5XxUT0ksqhgSF\/X8pEJlYBKdPmdKrOofA7VYF1+JoOqkEPVCKb0DKDKMVSD5FClsh97qBhQfez2cQ39rPUE6G863hVQQHW8r4D+\/VoBrcC8VOBvRwU7ZTxUAlAlWVTwUdXJoarLUEWm9ILk57r8BEPFkl\/\/HKqWD\/Y0gKrMlL7WhnqCpYKPqspDJU3pg3qo4J8yXX6u02\/WgGqZ8FBxFpVjqQCoPnTrGB2eUIpqXh4S\/SZDrYACqqGWV7+5VkArcKwqAEAVGKoQm1Cry29HzaR0EZsQ5VA5U7oM9jyf09Irc6hihoqT0k2n30AMlTWmA0zxVw+oHEPVLzahFFCt5rT0TFK6CPZEbEKV5MdMlQ\/1dEnpPthTSn4ZQMUslQKqY\/UU6d8zlwoooJpL9fTPagW0AgumAhJQGVBVFuwpJL+UocLYGf5aOnpGxiZs7fjRM+yh4hyqGFCF0TPo8pPjZ1IPlRw9A1M6M1NYUVL6Wh49E3KoZLgnAFXOlD7rLj8GVhg9g7EzyKFaGXKo\/qts9IwEVbLLTwIq6aFypnQFVAvmEdMfpE8FFFD1KZD+slZAK7A4KiABlY1NCB1+MtwTch8iEziLKuehkqAqzaGCh8oyVBZUIYOqAKhkl59ISrddfjFDVcyhCl1+cpZfyKFys\/xkDpXo8rOmdBufgBwqdPnlJL9CUnrio0ojE3KSXymgQmRCZpbfR5zsF8l9zkP1wVuPKkO1OB7Bkf8pFVCN\/C2gBdAKLI0K5ABVvxyqK2RswhC6\/Izk5wAVGCqMnsnFJuQAFdgp46GSsQlJUrpnqCSgcrP8cjlUOUCF2ISsKV3kUGE4sgz2hIdKAqpawZ7SQyUZKg+oVPJbGk\/o0v8UCqiW\/jXWT6gVGIkKAFAZdqoiKT2KTZCjZ2YFqITkl\/VQBcnPJKULhqpubEIEqKQp3Uh+JQyV81FZU\/p0NHomx1DVyqGSgKog+U1kR89YQDWeHY7sYxNksKf0UDnJTxmqkXh8l8SHVEC1JC6jfgitgFYAgKquKR3sVJnkBw+VjE3ALD8eP2NkPzEcubTLL4lNiD1U5UnpGD0TAaoCQxUAVWRKB6BKYxNkFtU9CPcMOVRgqDgtHSwVB3piZSW\/lXb0TI6hqpNDhbgEE+wpAZVjqKyHSmf66RO+8CuggGrhXyP9CbUCWoEaFagCVEhJ56\/IoSoAqp1dkqZ0eKhygAoeKplDJYM94aPKSX4xoBIeqvUztsPvoRadXbPL7\/S1DlCVxSakgEqMnqmS\/DygKunyM\/P8ylgqYUoHQ3XiilkkpXvJjz1UCqhqPAL6W45zBRRQHecLoH+9VkArMD8VkICq0OVXlkM1YLAnGKosoJKSXyYpPZX8pCn9nPU2LqHKQyVN6dztxx1+SElnYBUxVM5HVZmULhiqWpLf6snKYM\/y2IRxqgJUEUOVZFAxO\/VBE5uggGp+nhL9LsOsgAKqYVZXv7dWQCtwzCogARWGI3N3H1bEUrnxM4hNkLIfWCpIfrlgTyn5XbQl7vK7gIGVD\/Zsk5nnJ2Q\/mNKthyqW\/IqAqn9SOliqLKAypvRpypnS687y8zlUwkP1CZlD1TfYc6LSQyUBlZH9CqBKGapj9hDpXzSnCiigmlP59A9rBbQCC6UCAFQMpixD1aNrkEUlZvlB8rPDkbvkwVRiSr9sO2dRdcxKYxMkoPKyn2SoHKAadJZfMYcqSUp3HirDUBmWqlrym3MO1eqG90+VDkdOPFQ8EBkLo2c+KjOoMrEJHlRluvzUQ7VQnjD9OfpVQAFVvwrpr2sFtAKLogIAVMGUns+hMj4qMFQ1JL8cQwXJrzQp3Ul+KTvF\/qnYQzUYQ4XoBJNDJYM9xSy\/fknpuS4\/JKUXcqjKAJWb5WdiExJAVTc2ISSli9EzElBFXX4q+S2Kh3DEf0gFVCN+A+jH1woslQrkAJXPoRIMVQ5QGZYqGT0Dhkqa0pmp8uwUd\/qJLj82omeT0kuCPQeNTTAeKhebUPBQ9QFU\/SQ\/AKpCl58EVELyy83yK\/dQTdT2UH24FFDpLL+l8pwu5c+hgGopX139bFqBEaqABFQFU7oAVFFSusyhSgBVlYdqIIZqAEBVJfnVNaVHY2dcsKec5VfFUFUCqjJT+iobmwBAVcVQ\/T+W+zKz\/D7ixs8gKZ2\/stSHpV1+I\/QgL+KPqoBqEV88\/dG1AlqBUAEDqPZZ\/xQ8VDCk83BkDEguBVSJh6oKUHmWKmGoTFwCy32+yy+Y0k2X34YZik3pNjYBXX45QBXlUEmGSialS4bq\/mk6DV1+GUCFWX4yNgFdfpWSn2Co4tiEOIcK\/in+ihyqul1+BVO6A1YKqMJ9rv+2cCuggGrhXhv9ybQCWoEBKgCGKiSlBw+V7PCD5JfLobp8R8iiAqCSkh9iE7KAaosdjIwMqgs2OTBVyVDV9VDZbj8MRw6z\/NxwZAmoXKgnDOlRdMK9UwSGSnb51ZL8ShgqM89vZUhKlwwVTOnVgEp4qDLBnpqUPsBDoL\/1uFZAAdVxLb\/+5VoBrcB8VQCAypvSzfiZDKhyhvR+w5EBqHKm9Cygcl1+hp3KmNLNLL8+DFUuNuGsB5sElgqyX8GULnOo5Cy\/msGeKUOFlHTzNZOUHjFUzpQOyW9QhopH0KDLTyW\/+Xoa9PscjwoooDoeVde\/UyugFZj3ChQA1R6inCk9ik0YsMsvZ0qHMV0mpUPyk11+AFTo8ssFe1ZJfgBTITLBhnumOVSnRgyVyKCSY2c4MT0J9mRQBQ+VB1QiKR1jZwyYcl1+YKcYTAFQFRmqYEqXHqrsLL+sKV2HI8\/7w6LfcCgVUEA1lLLqN9UKaAWOdQWKgCqEesI\/BbkPPiru7vM5VM6U7mU\/l0MlJb8UUPkMKpb7pOSXYagG9VDZ8TOBnUJkggdUJR6qyJSeYagg+UlABcmvykPVD1Bhlt98MFQnOGAVTOna5Xesnyf9+wavgAKqwWumf0IroBVYgBUoAqog90WAiuf5IYeqossPsQk5ya+qyw\/sVOqhYobq\/ILk199DxUOSveQnhyPL0TPCQyUZKumjMp1+wkOVA1RgqPwsv7vKgz2Rlv7xii6\/fqZ0ZFF5yU96qKIcKgVUC\/CR0x8pqYACqqQg+p9aAa3A4qxAAVAZD5VlqaQpPYApBlaCoSrp8pMMVZUpndkq3+VXNnpGAKog+c0QuvxyHiqAqUqGSnioIobKdfnlcqgkoIKHqgCo5iWHaoBZfhJQieiEwxMKqBbnUzlaP7UCqtG63vpptQJLtgI5QCVjEwCqAKj4K2b5Xe7AlJf7dvDYmbmPnpEeqnQ4sgz2PNcNR\/YeqodaxMzUWev6SX5u9IxkqIQpPcdQVcUmVAGqSPKTs\/ykf2plGDsTYhNiQPVRl0UFDxXYKXyFMZ1lP5b8bJefJqUv2Qd3CX0wBVRL6GLqR9EKjHIFAKhkbAJM6QBTBQ8Vgyr4qLLBnhZUpbP8guRnByODnWKGCstLfmIwMgzpBkxtYLnPSn4FQGXAlAVVpQyVHz3TpNPXTJslx86AqUpjE3KACh6qHKDyw5FFbIIxpjtQFRnSOT5BzPL72ApkUY0TgBSCPQGoZJdfLin9hFt5OLIyVKP8bC+Wz66AarFcKf05tQJagcoKMKC6FoORk8iEnIeKc6gMS8XslFuXFXKo+gGqNsGYDiBlZD8p+ZUAKstQ1fBQydiExEOFDj8GVAymsDyY6iP5WdmvQankJ7v8eCiyWSLYMxo905ehCl1+DKoMsFo+TjlA9SEp+WlSeuX9rr+48CqggGrhXRP9ibQCWoFZVAAMFedQISkdDBVLf2CpEJsggz1zs\/z6SX4mi2pLYKgwxy8GVDNkzOgCVCEpPXioWhUeqkTyS5LSPaASHirJUoGd6uehShkqBlTemA4fVQZQ5YYjF7v8YsmvjKGKwJTwT33w1jH67VNdWvFij25\/sWvXC126XazlL3Rp+fPxWvZ8l5Y936Flz9l123Mduu3ZeN36TId4\/VmsPz3ToT893XarQ3\/6S5v+T66n2vR\/T7Xpj8n636faxOsPT2LNmH\/\/\/RMzlK7fPTFDv3t8hn77xAz9lr+69ZvHZ8isQy36zaEW\/Vqugy369cEW\/Q\/WYy36H7dueaxFtzwa1q8ebdItjzaJv\/7qgF2\/PNAkrF8caNIv9of18\/1N8uuRJv3skWm7Hp6mn7l188PTxOuWA9N097Mteu6tDvV6yhzKV5UCKlkN\/XetgFZg0VYAgCpIfiI2YQ95QCVlPy\/3lTJUHarb5SdlP3T6FTxUG2YIsl8OUHkPlZf8YkB1ZsJQnbG2Oin91ExsQl3JD4Aqy1C5HKocoJKSX+jymyiX\/JaFYE\/2UZk5fgJQseR3ybauZxN9zMXOkGrPzGIVAA4SbTsMtE7kWZZopUw7aMyF9by1KApiddfLR13geq0NEm0EgJlRlOOCyroy72kQQHBV1MUnMyDYZIe5zsxc1EWVTBu6Mu01+9zqcbrzmSZNtBRY8YtTAdWi3T70B9cKaAVkBQCofFL6nnxsQgSoanT5VQEqyH34atgpMcvPACozeqZN6QZtAJXxUQWGqgioQmSC6fJzDFVISi+a0gsbtAFVLuCTAz3FsuNnwuac81D1BVSrJk2oZ1Ww50dXFD1U2Jylhyo1pNscKguoJKMIiVY2EVTFXOSS7XOMogRUJoh1YwDAUqKF5427MtGZORdAhdmLuSYCnxt27xThen1GACpcs6xM63xvJ4kgVgmocM0kqwhAlbtmXqYVIJiZxbPunaBXj2rjgAIq+UbWf9cKaAUWbQWKgEowVGXDkWFIh4+q4KGKGaqqYM88Q9X2kh8AFRgqu0H3G47cjBmPAqByDJVkPESXX5Xkl5vlV8l2ZEzp9RmqCkC1bIw+vGyceGOGKR0dfgj2LGOoJKACQ8UxF5du65BvJNjaoQCogkQrg1gh0wYAPFMAwBJQyZgLA6g8o5gwVIlE6xlFeb1Esr0BVJ6hmiZkh3kQLNLtU4aqClAV0u0lQyWbCPxA63ECoPLNBMvHyYNgc834uo2Z68ZA+L9WjNOh19uL9v0xHz+4Aqr5qKJ+D62AVuC4V4ABVZkpHf4pyU7NJTZBSkiSneKN2bNUOQlp4wzBQ5UDVGA7bEq6i04QpvRI8nvAgqkzeHMu81CZzVmMnymwU8x6BFN6JaCS8pFgPACqcvKRHI58IgzpHJsgNmfEJZivYvSMkf6MMT0wVHVyw3KMYg5QSYaqFFAl1+u89RYAc3emZKf4evlrlrleUvKrul4FhioZF1TFUEGiPRmeN9dMgLiLXCOBYajuyHdmVgEqec3gfWMQfOrdE\/TGCHdkKqA67tuA\/gBaAa3AfFSgyFAFyS8CVDIpvS9D1aXKYM+tHe\/JAZjC5uzlIyP5OcYj2aBZOjLykcuh6geocvP8YExHh18k+dX0UKHLD4DKsx0yKb0EUBkJyXT6TRKDKikfAVDlNmcvH3HHn2Q8MHbG51CNlXqoJEMFya\/sellQFboywSjC75b1UJVIfoahSrLDvOQnssPk9TKgykddxB6qUslPAqp74vmLYKgg+eUAFcBUFHORkWhzvrfcNcsyVAIEM6i65IHJ+XicF+X3UEC1KC+b\/tBaAa1AWoEioIolP4CqKNizL6CKJT8kpVcxVGaDzszyw3DkmKHqH5uQy6EqbM5CQkJkQj+2I0pKv2fKmJwLm7MHVG4EjQNV0pOT5lBJQAU\/zonOQ5WXj6zBGUyH91GJ2ASW\/IyHajaet21C8tvKgMrKfhEAdtfrAga\/DgDDQ9XvehUkv3WJTJs0EgAAS1ax9Jo5Uzp8VDmZ1lwzHmx9V4MAhLO+NxnG6kAVWMUioMpLfgyCDaiSHioJqNw1e\/S10ZT+FFClb2X9b62AVmBRVsBIfvtcZIIYO2PS0neL2ASXPyUlv0FjEySgumiLZT2wQUvG4\/xNwUOV36BrMFRilh\/Gz8CUzpuykZAyGVQGUDk\/TnVswlR5DpUHVJPELAe6xkrloxKGKgeoPEPVZ3NmH5X3UM0VULlrZWRa2eXnAXC7FqCSpnTTSCA9VJKhEl1+AQQXGwkiQOU9VFMFD5UHVHfPXqY1Eu18eqgkoHKs4pc2jiZLpYBqUW4d+kNrBbQCaQWqGCqwU8ZDJSU\/uUELQ7oJ+KwYPeMB1VZhcs5u0CGHKj96JmaoBu3y82yHAFSR5DcPgMp7cgSgiiSkvsGeju2QLJUI9oz8OHJzThgqMIuziU0IHioh+YnrVZBpRW5Y3EQQX6++Eq0AVBIE47p5mTbTSABDOtgpNqZLDxVkWjBUYKf89UoCWSMQLAFVFgRPVJrS+12zj68Yp1GMqFJAlb6V9b+1AlqBRVkBw1Ah1DNlqESw51UZhirXho+usWqTc9igwVDhq\/dQyc1ZeKhsDlW8QfcDVClD5bvGJKC6f5rgyUGmUT+GqtSPkzBUWU9OX0CV35w9Q7U85FBB7guGdDvPzzJUdpC1zw7LjgrqGM8buvwg0WYBlRtmXQBTiectB6ik7w0MlTSlI4uKWSksACqY0mW6fcRQOd+bAVT3iZgL3+FnGwlKr9kApnQj+WW7\/Fy6vYy7gNyXet5Eur28bm+OoDldAdWi3Dr0h9YKaAXSCgzKUBVyjSo2aN+CH\/lxrCE9lfzMBp2RkFKGKhfsOSfGQ4AqbNB1YxPAdsCULv04uVl+kYcq8eNID1UtU3pG8jOxCSLcc06Sn4tNMKBKSn4ZQGU8VA4AV0m0lZKf6PKTpvQ6gKoAgOfJlG6ulwxjlQxVCaDKmdI9CM5cMwOmxDV7+s1O+ogu+f9WQLXkL7F+QK3AaFSgCKhCl5+c5ZdjqMB6FGf5xab0NIcKYKrMkyM3aORQxSbn\/h4qaUqPGKoHmuQZKmFKBzvVz0Pl\/TiZ2AQvHwmGio3OYKgAqAp+nBryUTrLT8pH\/O9gqZBBFXmo6jYRbLc5VAWGqk9XZo5VjK+XZRQLgOohF3HBXqo+gApyXzlDFcdcFCU\/K\/3VYqhkZyaGWfsuP9uVic5MGNORbg9AZUYFuaiLHKAqu2ZPHR49Y7oCqtHYa\/RTagWWfAWKgCp0+UUeKgxF3tUjACkj+SUeqirJz3uoBOOBoMiCKV1KSBtCDlU9yS\/uGItyqJIxJtigwU4ZQFURmyAB1Ww3Z\/hykLiNzRksFRgqmNL7bc4eTAmmg2f5xQxVLzvM2sYm5IdZe8lPeN6i2ATPKNbzvAFQ5STas6QpfU7BnlPEYCoPqIIpvdCZKSQ\/AGDpeTMxFwlDBTDF1y0FVFWdmRJMSbmPQbACqiX\/ytUPqBXQCizVCuQAVXY4cpmHKiv5VedQ8aYMlgreqblIfsUNOgZUkR9HMlRr4lwjgKqChFQS7AlABcnPM1SrG1Ql+VmGyo6eqdOCLwFVVabRMCQ\/gGDDJqadmS6EtX9sQgmjKBgqZhHBUuUkv\/4M1RRJz1sZoMI1qwJUpaxiX99bGGg9yDX7kGgkUEC1VN+0+rm0AlqBJV8BCajMPL89PcoCqkyXn+8cEyxVxFAlEhI2Z4CpguSXpKTDjyMNziwlMdNh2I4kJNIbnAXbAbnPgyoTEula8CuT0u0GbTZpwXhIhgoeqsLmXCL5fUJmGiWbc5HtCJlGfnO+fZwgH0HykzlUBlCJzZkZqitcR6a\/VgMMR\/YM1ZYQxCqT0gOrWJ1DhWsmR6HkTuAAACAASURBVM\/AlB4He9oZjP5aMfj1ALg40BoAWLKKhS6\/fsGed7scKgOCXW6YlGnlNUsYKjCKgaEKgEoyVLhm\/NVfN9mZKZjFpw6rh2rJv3T1A2oFtAJLswISUF1juvyEh0p0+V3pANVcgiJzgAqSX6FrTHb5bQjDduua0qWHKr9Bx+yUjE3IbdBVc+HQgt\/XlF7w40yYlPS0ayyV\/OTmDIYKG3OVfGQBVc+Ge2Lu4gCAyl8vE+wZ54ZJRlEyVGkTgQVTJSBY5lAZD1UVoCrmUOV8bwVAxeyi6fRrROOCCiBYAKqc5IdRQV6mzZjSLbCy8xdz10wCKnndJBBWhmppvmf1U2kFtAIjUAEGVJjlB4bKhHoKMAUvlc80qsihihgqN2wXJmds0Dn5KAZUHBRpwz3zpvQ4NiHX5ZcDVAysLONRn6HCBg1AlWOoIPl5QFVjczaenJUBUBXZDteCn8zyA9sRASppSndsxwdvtbP8TBBrDVO6HD1T2UQgu\/wqktIlqygZxTIflbxeklUMDFURUBUZqjAYuSj5WUCVSn5SpvVJ6RmGSgKqHKiChwq+NwVU9V+eakqvXyv9nVoBrcACrkCRoao2pcuk9HkxpWeCIs0YkxJTOuQjKfl5QOU9OU3KbdBVm3OO7ch5ciSgKt2cpeQnOsakyRkbNDxUElCVjp4Rkt9HRAt+xHY4yS8CVIns168rEwA4SH7F3LAg97VJMlSQafk6YfFQZH+9pEybMFTeQ5XmUBnZrw+gkknpQqINwZ4D5FCJa4YGAmlKB6CS1wysIrr8+gGqqJEgkvy0y28Bvy71R9MKaAW0AuUVMIDKjZ5JGSoZmwB2qi6gqst4MDOFhUG7+IrNOWI7jIdKbNAPtcib0ksAVWRylh4qkUElAVU9ya\/+6BlISPHmHJvSi5tzhqESbfgRQyX9OGWAale+y6+KUawCVPKaFQBw1XBkeb3Wtcj73jKxCQYAew9VOaDiJoLompUBqrsbZvaiYRTdHD\/JKoKhwvUyANjlUIFRZDAFQJXzveUYqiyrKK+ZAqoPfICITih\/TemvaAW0AlqBhV8BMFTGP+WS0r0pXczyi3KoakhIMim9SkLCxsxfAaRkrlFfya+E8ZAMVeShMoCqaHCWgCoX7AkJKcdQ5SQ\/bM5Rx1hkcO4PqAzbkaRuY3OWDBXYDtmCH8UmuOvljellTQQlEm2uiaCMoYKHKgLBoong3Ida5BlFCahEIwGuV5BoRXaYAMEFye9+J\/nJYE\/voRqAoXKSXyHY04EpA6gyHirPUiUybdb3JmVaD4I5NkFN6Qv\/rak\/oVZAK6AVyFSgykMlGSozzw9ZVBJQZWMTbLAnsx8GTCVJ6dJDFXWNyS6\/EsmPTennSQkp2aBt11gs+UUMVcJ4+LlwayzLETEdvDG7zTkHqBhclbEdmA0XsR01ARUkPykfGQlJjDFhhsqCqnEf6mkAVeKhkk0E1YDKXit5vQJDJWYvSg+Vv15hODIAFeQ+KdF62Q8slZT8JKDK5FDx6JnKgdYyO0wyVH70TLkp3bBUmRwqBLFauc8CYMlODcpQRSBYAqqIoVJAlXlN6f\/SCmgFtAILvwJgqIzc57r8cgwVuvzqmpxzDFXYoEs8OWVBkcKPYzfoEslPbtBSQnKenJyEVAtQZWfDWfnIRyfc1SDemNPNOWKoKuSjouQXYhOyfpxlY64FvxpQXSn8UwBUdT1UaCK4aGvIDWMwDFZRslRG9mOpz60ioJohE5sgGUUv0SZJ6amHqkSmLTBUAgCjiSD1UPnr5SQ\/aUoHCP5kHw8VujKLgCrItBx1ARAcs4pxdILMDmNWURmqhf\/O1J9QK6AV0ApkK1AEVPkcqroMlU3etsN2me2QjIffoEVSeo6hGnT0jPdQCQkJkl+OnZKjZ6oAlTSlY4MeXPJrhNEzkqGSXpzs6JkAqHwOVcJQ5XxUYfTMUdr7Wpdefp\/or1jvEf01u3r01\/fK10vv9Sha7\/boJbFefLdLZeuFd7v0wjsV6+0uvVCynn+7S1Xrube7FK23uvScW8++1aVa60iXnhXrmSMdeubNdHUL\/2\/1sy0qgmAHqEplWrCKFgxLRhHXTWMTsq8p\/Z9aAa2AVmDhV6AAqPaW5FDJpPTZeHK2dSgLqDKMB9iOnCm9H0NlTc751O3gySnGJuTYjlPuy7ThewnJyn1e8pOMh5CP+jFUuS4\/eHGqDM7MegBQwUMVsx1H6fBEd+HfgIv0J9z77zYVGarBgz1lBpUdPaOS3yK9JfTH1gpoBUa9AtJDZYM9A0OF\/Cl8Racf0rcRm3C58FGhayzX5Vcl+UlTusmgKvFQ5QCVNDkjeRsMFb56MPUAG9IzpnTpoXIt+DmGyoZExgbnSlN6qXwUm9Ll5pzzUBmWSjBUdfw4CqiG93TnAdUESd9b8ZpBpg3DrFOWShmq4V0z\/c5aAa2AVmCoFahkqESXH8BUXQ+VBFTINcoxVPDjSEAlJT+wVEVPTst6chJTOhgqACn+CtkPOVTG3LzWslRe8nOt99KULgFVzpTOQArLt9\/fxXP8wgiTnB8HGVSyBb9UPoIXR0QmSHaKWSowVGZzFh1jCqiG9+gMAqjgoQKjKK+ZZKish0pzqIZ31fQ7awW0AlqBIVagAKj2lEh+DK5qdPnV8VBFXX5S8pNdY3L0zMYQEmkZqniWX46h8iGRacdYrS6\/6TBoN2nBz3mocmNM+sYmsIdq1aQfPVMEVHn5CC34H\/Gm9ARQiY6xwxO9Id45o\/2tGVAVr1l9hioCVQ4EW8lPAdVo31n66bUCWoFFW4EcoLJdfkSQ+qQhvcBQCbmPu8cg+ckuvyqGKuoa84CKh+1WjZ7pB6iS2ISyLj+RaZTLoTKRCQmgkpIfOsYg+fmOsZKk9EKwZyWgCh1j2S4\/4aH68G1jxEvKR5yUroBqeI9lnqGKQTC6\/KpAcJGhUg\/V8K6afmetgFZAKzDECpQDqh7JHKpSyW82gGpryDWKuvxkbILzUOUlP45NcNEJyDTirz42IW9KZ8nvv0uCPXOm9BygkgwVAFWBoZKASs6Fk7EJq+JcI8l28L\/DmO7BVCL5SdlPSn4fEmyHSn7De3DKAFWVhyon+UmZVhmq4V0v\/c5aAa2AVmDoFSgCqmBKl4AKLJUJipTBnju7xKZ0ZBvVYaik5AcPlck0ygCqNCmdgz05IFKGROYkP3io4J9C+jZ8VKezh0oyVNKULkMiE4YqB6gMQ1XS5RcFezpAZTxUDlBVd\/lNmCwjD6qWj1PWjyN8VOj0swyVdvkN6wEqA1SFzsxo\/qKa0nPXQ4cj56qi\/08roBVYdBUoAiqiXLAn\/FMFyW8WgEqOMvmC9FD58TMzxMwUlhxjMqiHypjSM5IfjOlVpvQcQxWCIoMhHZKfN6ZLU3oZQyXHmGRzqPJ+HAAq9VAd30etjocqJ\/mF6xYCWZFBpab043tN9W\/XCmgFtAJzqkARUPXo6j1uiS4\/MFR1AVXdLr\/IQyUZqhJAZRmq\/knpYKgKgKpE8mNgBdmP86cwzy8dPSM9VL7DT7JTaZdfH0BVzlDlPVQAVCwfYXP+kGSofJefeqjm9GD0+cPlDFVgFQGocM1k1EXkefPjgjgpXU3pfUqvv6wV0ApoBRZmBQCossOR9\/S8MT0aPePGmcgcKkh+1phuZ\/nVSkp3DFWl5DeLLr8IULlOP8h9fZPSB8yhqvRQiRwqlv9gTP\/4qgnyc+GyDFVscEamUW5zzgOqMQ32HOIjVw6o7MiZnEybA1TqoSJSyW+IN6p+a62AVuDYVQCAKszyq\/ZQ1WOouNvPjp3pN3oGHiqZQ1VISi8Aqn4MVTClG4ZqUEBV4aGqYqik5Hfy6klCdAJ8VAFMxYZ0ZqmkKd0a0oPkJ0fPeEAluvykKV3KR9rlN7znKC\/5hXFBElBVdflJQKWS3\/Cul35nrYBWQCsw9AoUAVU+h6pU8hOG9H6xCT4pXXT5lQIq2eW3YYakj6q\/Kd3GJvgsqoyHqtKUfv\/U3HKojOxXDqgYWKUMlUxKR4efMTivsBJSkaEqkfw0h2rozwz\/BWUMVVWXHyRa0+3nYi4MoBLXTCW\/Y3L59C\/RCmgFtALzXwEGVNfuJZIMFTxUDKLkQnRCbvSMl\/y2W3aqmqHi2AQbnZAzpRuGSo6eKTBU\/br8AkPFXX5nFgBVmOUnO\/28h8pIfuyjCrP8MBw5x1AVTOllgCqS\/OLRM5Khqho9IxkqLyHJDCrhx1GGav6fF3zHPEMVWMUsQyVZReF7kyzVU4c1hwo11q9aAa2AVmBRVSDHUPkuPzanO1AFMGUkP+mhGqDLzzNUW9qE6AQJqCD7SUBlcqgKDFUs+VXFJhRM6SYpPQOoxOgZOX4GpvQqQAUPlQ\/2FF1+kPvwtVT2u0PIfiucIX1FlR+nfwu+5lAN71FMGSoLgvO+tyD5jYdGAslQiewwZaiGd830O2sFtAJagaFW4O9jgp3aKyITBJgyLJUbOzMXQBVm+YVgz1LJb46jZ6pN6Q5QrRFZVAyoXKffKY6hkrEJmOUnGarSYE8BqPrN8st1+WFzzslHkqFCUGTOlH7CrUfpTR09M7Rnp4yhKuRQFQZajxNft8j3ppLfBz5ARCcM7WrpN9YKaAW0AsegAm82LKAKkt+AHqoShqp2bMLmNgFUXeBGz\/BXZFCBoYqHI8cM1dlIS\/dJ6S0CoJLBnqHLLwAqn0MVxSaUe6hkDlUOUBljugRUMjZhlejyy+RQwUcVeag4IR0DkkWwp\/TjRJuzYzs+dvs4jTd1lt+wHqE8oAqm9GwjwTILpjwQhlQbMVQq+Q3rmun31QpoBbQCQ60Ab7nXPSxYKmRQicgEY0jf3SPLTvXoiiQp3funnEGd09KrABXkPpNBJYI9g+TXpkKn34YwIBmmdJuWPkODSn7GkM5J6WunqQpQcRbVIJJfvy6\/ODYh6fTLSH45tiPLUEn5yLEdX1g7ST3FU0N7dlLJDyC4LquIHCrpn9LRM0O7XPqNtQJaAa3AsanArc9LQFWDoZIeqpJZfhJQmeiErR1iyc\/4qKSHKsNQSQ+VGT3Tx5Q+a4aqDFBV5VDdO0V2\/EyDwFBJU7pkqBCdkPqnbJdfDKikKR2bcyWgWlbioXJsxx8OTh+bm2dE\/5YUUJU2EiQzGAvslJD7FFCN6M2kH1sroBVYOhV46m2iEOwZAFWuw8+wVAlDxbP8MM+vziw\/Hj1zEbr8BKCKGKqSpHQ7esZKfoahgtwXDUcOkl\/elN407JTs8DtNmNJtSrpNS08ZKjnLL01KlwzVJyH7lQV7Oskv56ECoJJsRzF1OwAq6cnhWX7Mejx3ZPSko2P5ROYlv3y6vTSlA1CBocLsReSHaZffsbyK+ndpBbQCWoF5rkC7S\/SrvziWak8+2JOBFFZVbEIAVF1Kk9LjLj9nTBeAyqSls3\/KLDvLLx2OnJvlV2SoQmyCBFQ8IJl9VDnJD5EJ+OrlvmQ4sjSlVwEqsFMc7ukZqig2oV9Sen5z7if5MZj62rapeb5D9NulFSgDVADB0vcGQOXBVGpKVw+VmtLTG0z\/WyugFVi8FXh9kuiG\/dzlFxgqzqNKWaordhU9VGCnQrDnLJPSM7P88pIfM1QzdM76lvFP5TxUPtSTU9IHTEo\/1SWlyy6\/XGwCJD\/EJsQMVSbY0wGqj3OwZwVDxfIfy305yQ+bMwMrbNDSlH7GPRN0ZFLNU8N+EssAlbxmOVYR2WG4ZoahcoBKk9KHfdX0+2sFtAJagWNUgSffsoDK51AlwZ5XOZYKpnT+KuW+AKg6laZ0lvy8MT3LUM14U3o5oHLhng9ZUGVYqkyXXyVDJWMTMl1+fkDyvVMEQCUlPwAq6aEyWVSQ+9z4mSqGCvP8ih4qB6rQ4VfixTGgysl8n141TqMoGR2jxyP6a1IPVU6mzaXbpyC4KPnpcOSo0PofWgGtgFZgsVbgmXeIvvloj9K09Hg4smWpcsORg+RXnOUXS34WVCEyAf4pE5nAKekyKV10+OUkvyJDlZf8QmxCkP1yXX4I9swxVDlAVclQCQ9VFOrphiP3A1TMcsjUbS\/5iRZ8ZjvOuneCXnm3u1hvu0X3c5cxVJD8steshFUES6UM1aK7DfQH1gpoBbQC1RV4v0l039+JvvLwMUhKdwyV8U85yc+Dqo0zNDsPVWJKd5Kf8VCtbdIZa\/OmdBjTbbCni0yo8FDVYqgEoIpjE+bmoQLT8ek7x+nPT0zTeEtlvuq7en5\/NQ+oWKa1sxezgEp2ZjofVZGhGr1mgg\/wPxrsOb83qH43rYBWYGFV4GiT6C9vEd3zMtHvnu7RLU\/Z9asne8Trl1hP9OiXT\/ToF1iPd+kXj3fp5+k61KWfmdWhmw+F9dODHfLrsQ795LF2tH78aJt+hHWgTT88MOPXD\/bPkF+PzND3sR5u0fcfnqGbdrcIRnPDPLkU9FPvn6Jv7W3Sd\/a2\/Pr23hbx+havPU36JtbuJn1Drl1N+nqybtrVpJt2urWjSV\/bMe3XjdunCeur26bJrin66tYpusGt67dOEdZXtkwRr+u2NOg6\/7VBX948RV\/e3KBv7JiiPx5q0sHX2zSm4Z3H5aGpI\/kZUFVISrfdmTkPlY1NUEB1XC6o\/qVaAa2AVkArUF6B96d7dPXGKdNlF+S2CWJTOMcV3HKgWf6H9Ve0AhUVyAMqOxz5xJoyrQdVakpXhqriXtNf0gpoBbQCx7UCjXaPbto5TZilFwAVd9hZQMWjXu5+rnVcf079yxdnBfKAKt+ZCd8bZFp8TQGVMlSL817Qn1oroBXQCizZCrS7Pfrxw03iDCjkQJ0kM6BWThiGCp11j7w6ep1VS\/biH6MPlgdUlqHy\/qmKzsz8QOsxeurw6N2L6qE6Rjet\/jVaAa2AVmCQCnS7RMuebtHJIrqg1Azu5uedctckPavJ4oOUeeR\/LwMqAHKbG+aCWFfYrkwPqqKB1vnsMKSkW4ZKAdXI31xaAK2AVkArsBAqcOezMySzoHwG1KpJkjP0zMgXMZD4zHsn6a2GdsothGu4GH6GPKAKDJUEVD6MVXb5yYHWUVK6AqrFcP31Z9QKaAW0Aku6AutfniGklUPu8x6qJKVcAiqEMl74wCSxXKj\/aAX6VSAPqMYJOVQm1DOR\/JCSbjxUGUClOVT9qq6\/rhXQCmgFtAJDr8Djb3QIieU5hgqyH8a+MKDyks2KINd8fVuDZhRUDf16Lfa\/IAVUHxP3ELNTnqGSoEqGsYp5fgj2VFP6Yr8r9OfXCmgFtAKLvAL\/PNql8x6YMoDKgKm7GhUeKtfhx8Z0SH5mMwxyzZ+f0DiFRX5LDP3HTwGVZTkdMGcQBVAlPFTo7uOv6PDDVwZTylAN\/bLpX6AV0ApoBbQCZRV4c7JH5zowhREwkqGC5PcJ76GyCeVm5IsDVNgMIdcwu7DqaQVVZTXX\/0+UB1RB8vMMlQBUZQOtGVTBmK5dfnp3aQW0AloBrcAxr8A7jR5dtmHaMFNG7ru74T1UvsvPjX5BbMLH3Qw9KfmlgIrZhY+tGKd9\/x49g\/Axv4iL9C\/MA6qYocJwZJjSPywlP+mhcoBKGapFejPoj60V0ApoBRZzBSZnenTDjmkyw4rvbnj\/FEzpHlBxFpXIoDKdfi6HKpX8TnQt79gIT141QS+\/owOHF\/N9MqyfvTagun2cEOwpTemaQxWujOZQhVrov2kFtAJagWNagU6X6Cf7m\/TZe6foM\/c0CEOKWfKDh8p3+a2etKNnfJdfGErsTel3BFN6KtWcde8kHZlQUHVML\/Ai+MvygKqP5FcWm6CSn46eWQT3vP6IWgGtwBKswO+faDkwxYDKgqoyyQ85VPBQRQwVOv0SU7phqMAsLBujyx+apMaMxikswVtp1h+JAZVnOA0gt6AcLGcKzA1LJQGVMKajy08lv1lfDv2DWgGtgFZAKzBoBVY9N0Ofu28qAVS2w08yVCe7sTPp6BkMRo5yqNyGCFM6JD9sgh9ZNkY\/2D1FU20FVYNer6X6+1OGyqal15\/lh+4+aUjX2ISlerfo59IKaAW0AgusAjv\/1TZg6nP3WkD1WcdOQfar6vILw5GD5AeG4cQKyU92Zt3+pHb+LbBb4rj9OGUMFUB5ylAZY3qZKV2T0lXyO253sv7FWgGtwEhW4Ju7mxlAFSS\/qmDP0OUX51B5UMWG9MSUbhmqMH\/ttLsmRrLu+qGLFUgZqrRTVAIqdPkx04ksqoihUg+VAqriLXZs\/k+7S\/TX93u06V89WvVSj1a8aNftL3bp9heKa\/kLXVr+PFaHlj3Pq2u\/PtehZc916DZez4Z16zMduvXZDvHXP4v1p6c79Ken237931\/a5NdTbfq\/p9r0x8z63yfbhPWHJ2eI1+95PRGv3z0xQ797fIZ+m6zfPD5DZh2aod8cavn160Mt+vVBu\/7nYIvMeqxF\/\/NYi27B10dbdItfTfrVo24daNKvDjTpl2794kCTzNrfpF\/sb9LP0\/VIk372yLRdD0\/Tz9y6+eFpunnfNP3h4DRtfLlFRybVwHtsnoTR+1t2VDBURQ\/VJMGYjpR0O8svMFR1TOm+M+u2MfrjoenRK7p+4mwF5gyopIdKGSoFVNm7bIj\/s9EmevCVHn1xT4+u2m3Xlbt6ZFeXrthp1+U7u3T5Drsu29ElXpdu7\/h1ybYO8bqY19YOXYS1pU0XuvWFzW3CumBTm3idv2nGro0z9Hm3ztswQ1jnrm8Rr3N4PdSis7HWtegst858sElY\/\/1Ak7DOWNskXqevnabT10zTaW6dev80YZ1y3xRhsYfEyx6m0yk258rNpayN3Jt1fffTJMmxHDKnBxuPMVxmpqmHE5g9zV+9fpL2\/muGej31nAzxkRjJb\/3qWJeefStefL\/Le547\/QCmfLCnv88DoAI7ZceGhKR09lDd\/PAU\/eVwx6\/Xx\/SgMJI3XMmHLgNUzFQxO+UZqmj0jGCoJKDSHCoFVCX32VD+99+OEn3jQI+u3tOjqx2YYlAFQHXFriKgApiSgApgCl8HBlQbZ+h8ACoBps5bP2PAlAFUD1lA5UHVHADVaWWA6t76gApt5GkuDwBV8JYwoMpsNpwm7bqgygCVkUaWB2kEoxV+sneKxpsKqobyUOg39RWQsQm5A4RhqDygiiU\/c1jIdPnd\/hf1S\/kC678UKtDPQ8Wg3ICq5eOUHjjxfoTshy4\/NaUXyqz\/Y74rcOBNomsYSGFlABUDKzBU\/BUsFUDVpdstS3XJdstOzZqhGgBQ1WWoznhAsFMJQxUBqvunDUNl2KkBGSqzyawuP7VbKWSSeByHGckh55w5QFU6\/DN6YYgTmEsCPn\/NBB3WHJ\/5fiz0+4kKsCm9jKHCwcGAqlX5Q4P1v8QequVqQBcV1n9NK5BnqMI95BmqAUfP\/OXw6KXza7BnencN6b9feJfoq\/sZUFEloLqiL6AqSn4GVEHu469b2mYZ2a+O5CcYqnMlQ5WR\/M42LJWQ+x4Ucp8DVGesnbayX0byO8WBKZb8BgVUkqHyreRuHAc2GQ+oVk2QaSd3SdKQ+nIMFbJ6\/OmLXxwZ0yWfvr6yuUHsfdN\/tALDqEAdhgr3OrOwuMf9\/e26\/JAhxPf2bQqohnGplsz3fOz16hyqLEMl35Fy9IzwUP37\/dF7USqgOgaPxcQM0XcPEl2zN2ao4J\/CVy\/7SQ\/VTuudCgyVBVSQ+vC1n+R3wWbrn7I+qsRDJQHVBiH5ZQCV9VAFQMU+Ku+fqmKo1hQ9VKl\/itOibft40u3k5prFEohjqTKACoZdbDbeXxINkA0nsBygQgdLjtK+7QmVUI7BYzOSf4UEVOEA4UzpySw\/c58no2fSDi0DqJ7S+3Ukb6aaH\/rdqS7FgDwO9pTvR3\/oLDlwfsgBqo8uH6POCDokFFDVvOnm8tt2vU70RQZTWBnJ76pdPeJ1ZU0P1aXOkC4lPw+qapnS28FDtTEY0tmYHpnS18emdMtQtbwh3QAqCapKTOl1JT+Zx5MadGNAFW8yOLVLhspLfkiRdoCKXx7SQ5V\/YQQfVTqr6tTVE\/Te1Ai+LebyEOifrVWBnOQHzyDf44X7PAFUuXtbGapapR\/p33T5+oYHVQDlYDlzkl904MyY0q9cPzmS9VRANeTLzs1hP3lcAKoSyQ\/G9P6mdPZQdU13n2enXJcfABU6\/PgrOvz4K7r8LuAuP+GhQnefBVMJoHLGdOOj6mNKDx6qYpcfd\/txlx9Lfqe6Lj9IfoaZcgGHdvxGzFAZT8ldDaoLqMBQeUB1x4QfrcDBh1UeKpjSfYu5eFnIJOBNf5sZ8p2j334UKwBAJe952+XXMIORDaBypvQcQ2UBVejy481QAdUo3kmDfeb1L89EgMoDcxjSXYefZ6gyjTvm\/ei6\/Hb\/czTfjwqoBrvvBv7d\/5kUYMpIftUeKmNKdyxVakgv6\/IrxiZ0+scmCED1eSH5RQyVBFMcnbDOLpb9EJkgJT+W\/mxkQjmgMqDqPmFKr+jyk\/KHB1N3NQgndrPR3DlZ2GhMZEJZl58bzcGnr9onMOcRkB0sN21rDHwv6B\/QCvSrAO55ACoj+2H0TIahSmVtsAsy2PNW9VD1K\/vI\/\/pEs0cXr7MsFRobcu9HD6jKktJvG6Oz7h3d0FgFVEN+lJ591wIqL\/kJhgreKbBTZR4qzqIKHirX5ZeR\/HI5VBeWmdIloBKSX2RKl4BKgKmz1jXprEwOFRiqXA5VXckvx1BhDIcHVasZVPWR\/Eq6\/LDhmJeFTJOWGSvScMlegQyg+uydo\/vSGPIjM9LfPpW5qwFVvpM1vbf\/9Lh6qEb6pqr54fe\/2jYsFd6RAOVS8vOASjBUMjKBpcAnD3dq\/o1L77cpoBryNT14pBxQ5XKoZGxCOUMVJD\/DTlUEe0L2k6Z0E+wpAJWU\/PoxVFXBngZQeZYqDvaMAFUi+c0p2HO19ZVIbwkkP3l6l8Z0nMDwwpAeqr6Sn6O0+cWh\/2gF5rsCdPAGoAAAIABJREFUn3axCQysYEpHsKf3UPkcqtDlF9\/fccPFn7SJYr4v05L9fvc+1xKgKr6PGExVAaqP3T5O6\/46mlIfbggFVKjEkL4+9mYi+YlOvxxDVfBQ9eny6weoch6qFFANIvnV6fLry1BVAKqqLj9sMFLy400GCdIMpCyYSjJ6ElO6BFQnMjOFJXNWyiht3xZ8dEh3jH7bUa4AABWzsuF+z7Ox0TSAqIPVNV24+1oZqlG+owb\/7Hc\/16JPrgr3kGeoJIufdPmduHycHnyxNfhftsT+hAKqIV9QBlTX7hWgqq\/k1yWAqjxDVUfym72H6ty0yw9jZ5yHKmWo\/lt2+PkcqqKHCmNn8NXnUGU9VA1icy78JHOR\/KQxnY2WMO0yqAJD5V8YAlBFXSzZnBUFVEN+dEby26f3PIMqMFT8tcDEJl1+3HThDwwAVMpQjeS9NJcP\/cJbHfrq1ql49Ix4PyKn7yPLx+i6TQ36x3ujlzmVq68CqlxV5vH\/gaEKHqrqpHQDpqQp3c3zMx6q7V26DEnpNT1UgzJUwUM1U5jlBzCFrzCml+ZQrQ2z\/CLJLw33dB1+3O2X81DBoCs9VH6TkTlUXgpJktJ500Fkgh89kzmBRS8MEZsgAZWYVTWPt4l+K62AqUAVoILkJ0EVDgxlhwVmX\/9PByHr3TXLChz6T5v+91CTrlrfoE\/fOUFsiTh51QRdsX6Slj3VNPMhdcxpKK4CqlCLofxbkaGqBlT9cqguM8ORqz1U\/WMTbAaVn+VXx5QeMVRxsOeZbjhyMKVPF4YjIzbBMFQVXX6lkp8L9zQyiBg9k9tk4KHCZuPBlI9MsGAq18USPFTF0TOmLdhLfuqhGsoDM+Lf1AMqEROCwwPu9SBtZ0zpmVl+\/6uAasTvKv34x6oCCqiGXOkiQyXS0uvM8hMdfmCnLhVz\/GYd7OlM6QyqSk3pmaT0EOwZohNShirnoYLUx19Z7vOSn5zld0+eocpJfthkIINEp3aec+a6\/D6+0g2QBUMlJBEAKumhgumyv+SngGrIj85IfnvkUOGet5JffiqA9FClDJW8t\/\/4+PRI1lI\/tFbgWFdAAdWQK14EVL0wIFkAKpuSzknpvXIPlZH84tEzOVN6jqGq6vL7vABVQfJr0TkyNqGCoaoDqKTkB1BVGD1zTzx6xp\/Ws6Nn8kZdf3qHt8R9xYbDoZ7zEez5wVsVUA350RnJb5+PTegPqMDCWv9U8AfyYUEZqpG8lfRDH4cKKKAactELgEp0+cnYhFJAJbv8GFDtsKb0QUfPzAeggneKv3r\/VE1TugRUGJBcAFRRWnqDsptLJtjTSyFJgnRO8sOGwyd4nOJzpnSYLuXYGSn5ffBWNaUP+dEZyW+fY6h8VyuCPZP73MSDRAxs3O6ugGokbyX90MehAgqohlz0AqDCHL89PZKxCRGgcsORr5CGdJb+jCG9vMsPo2cuqjPLT+RQydgEyVDxTD\/JUuUAlUxKDzlU1R6qKsmv1EMlPCV+g+FwT2lKd7EJVR4qCaiquvwAqFj6YyBlwBQb0p0p\/QRlqIb85Izmt08BlWnEWD1pgmz9wUHGg4CJjQBVzFD94aBKfqN5N+mnPtYVUEA15IoDUIXByDVGzzhAhdgEn5QuABV8VDnJTwKqOsGeEaCSsQk1JL+6sQnSlA5AZXxU2diEeJYf\/CTZLj8BqrzcF3mobPihl\/wyHirJUMFD1W+WnwKqIT84I\/rts6xs0oQR7vOiKd1HJogpAL97TAHViN5Oc\/rY7W6P3p3q0YvvdOmx\/3Rpz787tPfVDh18o0t\/e69LR5s6ID4tsAKqtCLz\/N8AVHVjE+olpXeKw5G3dSg3eiYXm5AORy7zUKUMFQzphqkadPSMG44MczpAVUH288b0IPmZ2IRZdfkVDekMrLDp5CS\/voBKGap5fkL028kKpL7BqKu1QvLDgSG9t9lD9TtlqGSJ9d8rKvD2VI\/W\/q1D\/\/N4m67dMUPnPdQiHjWGg\/Ppa5t0unuXn\/XANF2zZZp+d6hFO\/7ZofenFWApoKq4uebjl4qAqn6XX4Gh8rJfhy5xnX45hopZKbBUOUBVlZQuJb9zMl1+XvZzgAoPmhmMnAZ7yhwqAahSD9VsRs942U9Ifuj0KwxHlknpPocq+EzKGapxKvNQKUM1H0+Hfo+0AqnkJ4M9veSX5K1FHqpMbMLvFVClZdb\/FhVotnu07\/Uu\/fSxNuFwjcM0Ds94z5++1o4UM41FrmMb+YGn3deg7+9tEoeCjuo\/CqiGfOUBqILkhxwqImlKx2DkHEMVS35xl18uNiHX5cfA6oJNdklAZbKoNsTRCfwwmQeqBqAqeKjWNukMfuj4JCMAFZgpdPhlGao5dvlFgCoZjowuqLkwVMY\/pQzVkJ+Y0f72VYCqGBFSlPxsB2scWquS32jfU1Wf\/rHDXbpxb8fsDbwvSEB1Njq7cXh+gN\/p9r2eAirjfRUqwo3bp+nld0YvPV0BVdXdNg+\/BkAVJL\/BPVQmJd3lUbF36tLtXctQbe9QjqECOwX\/FFiqCFBtsuGe\/ADhIbKDkWcMmPKgih8qeKnWMf1rF7r8coDKnGLcSYa9U2bdP005UJVKflFS+j1TptOv0kMlGKrgLQmz\/NDpB0kk2nCcz0QyVAj21Byqebj59VsMXIGc5Ocz1yD5eVN6BlA5SRsNFyz5\/eZR9VANfCGW+B840ujRDx61I8pw2JaHazBU\/O7ndz7Cm+UhmZUGfn+DocK9C1aVD7i\/PdiiVmd0pEAFVEN+cACoigxVL8tQFUbPyGBPE5nguvxEuKcBVVurPVSVsQllDBUDqfUzptPPn1YSQAUq2Et+TvYDqAKgApgycp8M95yrKb0PoDJyiJT8+nioAKhgSi9Ifo6h0hyqIT84I\/rtsSnxIcL4p8wsP5tDVUvyU0A1ondOvY\/NY2IOvtmlK3bY\/QKHbj5sM6BC0DMAFSQ\/HJw9oOJ3uANUbNmwB+EG4b4Fm8qH3HPWNOjv744GW6WAqt59OOvfBUAVGKp8sGck+clZfiWACl1+UvKrMqUXANUm+\/BUMVTwUHF0Ak4qKUMlAZUBVV7ys9EJKaCqlPz8g+ke0LuDMZ07\/HyXnxwYKwBVqeQnANWgsQkFQOVGz2gO1awfCf2DFRXIdvmJ+92DKu5kXVXGUAV\/oGGotMuvouKj9Uvr\/8HxOx1CxE4KqNDxDUCFRqSUocIBGQxVKvlJQMWe1pPvnKBHX2sv+WIroBryJWZAde1eogCo6pvSczlUdpZf7KPihwMPiAFVg+ZQlSWlJx4qgCnu+pCSHx62MMvP6uzcDZIFVI6hMnKfo4yZNuaHck45VIlZF3Ifs1SQ\/PoBqtDlVz3LTwHVkB+cEf32n77HHiIgc9suv3gqwEnJfR6Z0pWhGtE7p\/pjt3tE977M6oa1i9j9ok1VgCqoEvZ9bw\/MsSkdgCpiqEzMR4P8AddlpZ185yRtf2Wm+gdd5L+qgGrIFxAMlZT8rtnjfFRi9EzEUMkcKpmUjpR09lFtC9EJeckv6ON5D1UJQyVzqBJAhdOK0dTLYhOk5CcAFQMrnGoiQ7qc5RcxVA2S8kfEULkH1nhLBEMFDxV\/jU7v\/EAnwYcmMkF4qIyPavm4maZuZL9l4+R9VNlgT01Kzz06\/3y\/R8uenqGfHmjRmpfadGRydPwTuXoM+v\/Se94CqrzkZ+7zkmBPGQmiHqpBr8LS+\/0b\/4UpG10TuYMDeASoNhW7\/IwywdMwHmwSH5iNlcO9y6Xk5xkqlqpdbpoHVKsm\/fuX78tD\/1m6TJUCqiE\/OwBUgaHKS34hKb1LzEwZdoqT0pO0dGtKD2Cqn+R34eY2GdOh6PKryqGSxnSZkh5OKzaXRDJUfHLxHioj+YUHDwxVKaBKPFRzYqjKktIFQyW7\/GDcZTAFQBUzVBZUISldR89UPyyHDnfp8+vtaZYHZPM1v2JTk\/75\/mj4J6qrU+9XU0DFBwlvSl896U\/99tBgh4BLhgo5VLi3WfK7Zb+a0utVf2n+rseP9Mw+grFlZs9wntsIUIkGpYLk50aM2Q7uacIoMYQzG4ZKdPl9cnXCULkDLQOqU++aoFfeW5rvBAVUQ36GioBqwC6\/AqBys\/wyOVQ4dcguPwAqdHIY86HzT5muDvcQee18rgxVDQ\/VqfdNkWepEkAVdfk5DxXkj5yHCp4S87UMUN2RZ6hwiudNx6wShgqAimMTPuQ9VDocWT46+\/\/ToYs32Y4geOkAoi\/bNE3\/UFAly1X67z42QXoGeRqAnAjgJT\/hoXKHhhON5Bd7qBRQlZZ7yf8Cd\/N99eHZAyqpRsjnmgHVKffxirv8cqZ0WC9wmOXD62UPNWiKdcgl9o8CqiFf0Bygugbz\/LKSX5dMp99O+xBwBlXdHKoqU3oBUAlTOrNSWLlgT5jSg+TXpLMetAOSpSm9ykOFzTXIfrbl1vio3FDkwE7VHz0jARW8JZD++EHGw9xP8isCKuuhgik9zaA64daj9PPHu\/SzQx2zbj7YIV4\/faxDPzGrTT9+1K4fHWjTj\/bb9cP9bfrB\/jZ9\/xG7vvfIDH33Ybu+s2+Gvs1rb4u+vadF39rTpG\/tbtI3ee1q0jfMmqav75ymm3ZO09d22HXjjim6cfsUfXX7FN3Aa9sUXb9tir66bYq+uXOaVj7TpFePDu9E+MThLn1hY4twf8gXL5oQvvCQgqo6rxpvSs8AquheT2XtnKTtDgoKqOpUfun9nnaX6JanemY\/YaWjL0PFOVRuL5AMFTr8+LmG5GcAVSY2AYfeyJTuZGkJqFgJ+PMTzSVXdAVUQ76kDKhSU\/rVAlAh3DN4qACoinKfHY7sDOkyNqHClF6LoZoFoMpJfthIWe7xD57wUQUwZRkqmNJ9UrofO2MBVSp\/oI0cGj2kkOJGY6WQHJjCQ83sFBgqI\/fx5tOHoUolP+ldY+o8os8BWP0Laoa4azJIpwxKnTzGvjP3smLgCfBpIibgMUNtwNrdZdvqI+bCbbKpBGTknxXjdM3GBv31nflNMX7izS5duMlmlxm\/xbqWlX9lAKA7xV6yQUFVv9cNAJUZt+SuMe533Of+wMDXO\/FQqeTXr8Kj8+uPHu4RgqJhHYlN6cFni9gEZBIyoJLvKoAq+V7n93lkSmfJz8V9RIBqVZinyvcn7BUnrRynN8aHd9A7HldaAdWQq15gqPZyl18wpQNQBQ9Vr+Ch8sGeYjgy6+BYhXBP0eVXC1DJLr9akl\/c5cdACovBlAdUIikdICGAqjxDFViqYErH5oLTDzYYC6isVs+bjdxoTnLsFDYcBlJYuU0nZai8IX3ZGEHyk4CKR88UABX8apzpAkDlasvMH2IowOQAlBogKk9\/iYEfgBOdNKgHA0wJKq2vxrFy3rMQUrMBGJc9OU2cRzPXfxhMXbzZspsAiywR4PPgmoeXboPOWtOg18bm4S8XP\/z7TaIN\/+zRzY936bq9Xbpylz2M4LkxESPyALJNdMXiWcG1c17D9PoZb6F7Nvx1RJL0ugCO\/XOQac4I9344UJjuVtGMUQtQ5SS\/3P3tvIG3HFAPlbhdRuJfOUvzGwdiQBUxVG72a3QIZPuHPwC2bP4gh3rywQ8+WfFOx4FPBnviHR0BKtEUhEOseRctG6fv7JpaUtdDAdWQL2cBUIGd4q9Zyc9StN6UXieHyjFUOQ8VOvwKkp8LcTM5VGUMlUtIL0p+9iFjhqUg+ZmNxGZQlcUmRB4qGZsgNhb2kqQMFR7WCFBluvw49+SkJKNnUMkPgAqSH0CVkf6cj8qbO7eEkx7qnG7IhkJH12Qajppuvi5V3hg+wVChNhUM1ScSGUiycTgVcgcjf7Yf7JmizhxQ1ZNHunZchQeMyCpzDQqCoYKsC3\/QeQ9M0Svz4KmabhOt+muPrtrtNg6X34ZnJwAqF4bLQMotyOOSWTTXDoBKPB9BDuegW7vRxM9EOGAMAqhg6EVkSASYhcH3ZHioapvSJ0ia0n+hpvQhv+UX3rc\/9KZ7LnaXSH4poNrsJmfwoQEHBxwYxHseh2V5OIgAVY6higBVYKj4XfSJleNLyqCugGrIz8KcAVUhNiFsDhFDlch+ZRuFN6XL0TMSUEmGqg+gMjSw6\/4AKxExVELuA1vBDyJONthQwMD4B5PBlMvjwYmdwRRWCqg+6UCVZKjqxCbgtFQl+RUAlTCle4ZKyH0FQCVPfDUAFdcJtUKdTH0g+SGnSEp+YqPlz20kP5iUmWJ38RBgqAAWb3tydh6Gx97o0lXb3VzIKkCF9mpvXLUZS8ysnXEfM1Wzp\/tfGyf69qN204gAVSYUl2WOsiDcsudEAmIpg6SACtlskm2Uz4KZfYZrKurB9z6beg2YchlsDKj8\/Z4BVHUkP4xW8tf89nH6xSPKUA35Nb\/gvv2PDtkDu5H8dklTusyhCgfBnORnDg3m8GcZKuORZSYd97HLE5Tv7azkVwGo+F30+yUUPKuAasiPQhFQ1ejyy2wK5rQtJL\/+OVTW0wPJr5CULk7gEUu1Pszy4wcKC\/4Yu4GEE7kBVaCDHdOC1lrJUKHN1gAq1+UH5sIDKg8a4qT0QpefyzkBrVy20UDuY3aqyFAFoAFA5cfOsJdK5FDl2CkO9kwBla+1k\/ywERu5iMEUfAluPhY8VNiAsfmeCsmP2SkweL42LvhRACr5+eVnLjBUt9ucLQCq\/7d8jP5yeDBP1VPcgr29Y6M4HCjnz4fPhq4geMLs9bbAgUGyf+HeOUlnr2nM6nR6pEH0zQN2yDiDKQCqyC8iDiI5QNWXoUokW3sN7bORfSbEAFlcT5zmJUjO3f8GVJnrGw4SqFM2h8rP8pv04Nnf3ytY4g33NkvZCqiG\/JJfYN\/+nSkbHo1n44oIUHXMHFioGQXJTxyQ+D437\/uIoQrBnriX\/f0rDgF4NxsbQgSoQkQN3rFn3DOxwCo4+x9HAdXsa1frTxYBld0IjDG9RPK7MsmhgnQBDVyeto3sJD0hnC8CX8gWm0ElpQzPUElAtUFq5wJQgVFxo2fg\/eGkdICBPKBypvRkQDI\/gOYhTJLSPaASJ\/Xakp9jZ6SHKvISuYdZbjj2FB9aywGowODYYM9iUrqU+3iWn5f8toaTHhgqzvqSQLXMQwXJFJsvQCheVgCd6SkQ8ideXPj8npkTHirPVjjTvQFULqz02o2Ttf1UBw\/36Is7wwwwnGo9oIKU6YC1Z9oyDBX\/3HydzrqfQVV9UDfdIfruY2HaADYN29RhGzqMATcBVJeUeKgKDNUmx7xlAVXLDA4HeAym3ZZ\/HhhMpYBKXlN5\/4Oh9RtSiczNtTIrYWK5fmAjcX9bf6ACqlov5yX6m7a\/GgCVPGTY\/WMwhsofoPmZNs91EVDx+9vI1VWAyjPmRUDFB9YX36r\/DljIl00B1ZCvThFQ1WCoJKCSsQliOLIEVWBK5Kkj3SjCRh8M08ih4g1RLvb7SM8Pn1SizQNGxZJTuQUHlhrG6TxiqCSgqpFDJU3Y8sQuNxkACgum6nX5AWjkABVYHCn5SUAVmdJLJL8YULmaOl8Cg1MpE0lABYbKbLhgqORLK\/Piwudn\/5hhqWBSlmwFuhiF0f7E5eO1Ov8OvtmjK3dYDxIDdtxPcpgqWEwAiiKgmvIMlf95V07QmfdN0t\/frfdCXfuKaOqQPsRd7BVJGjqc\/5CfFTwv8FDhWbko438zwbcZQGVZquCjwucFK1c8XMTzLPEMQO6TYNk2YzBDZWU\/sLLR\/Z74BT14FgyASn5DfqEvgm\/\/m6cTQJUyVOIAHjFU7hDo73P3rjrTvav4uZZdfrAk+MMev5dyHqokKd28b8XhjgHVslnaDxba5VBANeQrkgNUfXOoJKBKgj0RnQD\/VF2GChtgylDlQBUAlQFVTvaTm0e0gWQ9VEVTOjYTMC8AC3y6kQyVNebWz6GCfwobdAqoIIGhw0\/KYKmHajDJr8hQpZIfwIZ\/QYHxA5PTLzbBSX6oj62NfWmVM1QxoIrkHwGoGDDyi4yB4fI+L7NDR3p01S7rQzJApCag4pcvX3cwMfzz44WL62U8X3dM0LlmIn01qOJuvusfyQMq6xWJpwyA2UWrOJ4ZBlVVkp\/xT2UAFTLa4KOKDhk4XMjngRlaNucLL6FkqLyc63LYDCsLj5wAzfAMcs1QN3mfM0vl7++M5HfzPvVQDfk1v2C+fbdH9B3H4Hop3E3cKDJUSdRLkpSO+zs++AWGigEV7mH\/bhJRH7hX5TsY71yoAXgPfWdnY8HUcC4\/iAKquVSvxp8tAqq85IfYhMIpW0gXZoPAabtEwjAbRUbyKwNUkkWxG7+Q\/ASYKgNU8lRumImy2AQn90lABVBlJA+\/qTj6uMSUHp3YhdyHh1duNHiQWQ6BJIITvHmwYdYWGVR40KHv44HP+ai85JfUW4LWqA0ZHqoEUIHRMQAEBmYDRFy0hKxNRZcff3ZeuRwqEwvhPFQfWeZCS13y+3crWpcZTF2zmyfUxzPAcD8BNBoZzBlY8XkkQ2VlAXGCReu\/Y1f4enxm9URlAOnO192QccSO7IlN6RJUIcgwgCoRMyIaOCSTm\/MZyufDs7YAxu4ED5+JeRbczDMvjwjZm+99ef9jM\/InfPZR4foKQFWQ\/FC7pJM1d1jg666AqsaLeon8lnenib60L8Ty4JnA8+CZ2rLRM6LLT77z8Z4Hk44DMr\/D\/f0r7lnuTMU7mVlzvH89oBJ+Tn63nn\/\/5JK4AgqohnwZAajkcGQZ7Bl7QLj9Oz5l+5R0L19YpqCuKZ03Pize6OVmD3aKNw0GUwZQyS4\/uXHAoOg2TXio4AHCJooHTlLDRvaLAJVjLVwkABgYA6wS87WR+9yDClYGJ\/aC5Oc3mmQ4sgRUZjSHy2YSw5HTHCpmqwyYEvJYLPkdDR6qEskPYKPAUIlayheVMfMngArsjs\/nwoZbZkoXm6zcYCFr4nMBKPJn+vLm\/OnwiSP2fpQvY0hlKaBisIEXMGfWGFM6uoHESxcMFV87fuEy6MXPyT\/jaXfznK88U\/Xn52sAKncax89sT+XWiOvZ3ETygOxhPhNiEwZiqEKTBp4HC6hiiURuQulhAif8fJefyxurYKiwYflaisPCzQ8rQzXk1\/yC+fZ\/HxPPCOJEhMoBthbPMe59sy+4HKpCbIKT\/MwzLXKo+HCAQ4G5fwWgwvNtDrhCkvaAKpH8PrVynCZa85tPdzwuigKqIVe9CKiChwpgylOzu0IQG7J0ykbP4KThNwl34ihjqHKnbw+ohIcKDxNkP+mfik3pwQPkQYEzI3tQJaQObCbmhO5kIIAFD6g8mLIsVbq5SEDls3mkr0QCKjl2RkoiAlDh4QbY8OyUAVMWUAF4eIZKxCZ4hipjSvdt9wCqJcGefgMW6fKphwr1wUsLnjKuB9gLfxrE5\/am9GC+959PMFQs+X1xY\/F0yGMrbtofAL6RmgFEthS7\/AygkgyVG44MRsaeYgVD5UzphkV08+cAaq8vAXjGjC6DcROGyrC7okM2sFN8CLEMG66Z3FCwqQAkykNHylB5lsr5CmHa9QcMmHeN38QCKvgIuRaoB29EZjn20XuoAJiTzUkeHsBEer8cb1jiHjf3tQKqIb\/ZF+a3f\/ptC6j40G72F95TIsnPMrXy\/sd9z++siFH3DKzNG\/SsK7qQBwFU\/uBUNKXzoe6jy8bonYYCqoV5Vy2gnwqA6ou8EZjNoEdVHiozx8+Za\/mUXQaocl1L8iGRUoY8eVuWaoYYTHlAJRkqGZuQMFQBUNl2WgZSAFOSocoBKr+ZCDDFOTwMFgAYPAvjWsgBqCSASCW\/nIcKpyIv+YnNJkh+oRPKAypIYnx6ysQmwHPEIIRn+WFzRlcl11m+nEx9c4DKMVSyfqiZkckEswPQybUx9cGGKxiq6DSIHCoPqMLnZMBSYKhuHaMbtxYZqv9MkI8jANvDIB73mP+c7t6Rkh9\/LslQyVMsX0u+hvwz4zoxuwJwa0DfsjFqcdRz8s+1+8TpGwG5fAp3J3F0NMnDiGWoijlUVR6qFFB59hbNGlIKz8i3eBYMS5uc6AGoUoYKgAr3PJg8e7\/HXX4ePAs20jNUzkPl63n7OP1EPVTJnbR0\/\/Pgm0VAhecBzwIO4fwM4DABhup8\/76ykTleznbdq1AezH2cAioZiyIlPwH4jacTFgv3jmVAxUPnD08Un\/nFdqWUoRryFQOgqiv5pafsSPJzAYWSneKHw2\/sQhdPARU2QL9ZCEkjkvxqAaogcdQFVIMxVCGPx4CpVPJLmBneYMwmIxkqudkIQIW28vQUb0AVTNslgEpKflFsQi0PVX70jGeokg4au\/EGSt2Dzb6AKrTSW\/knzCwEQ8WsG5g3Boe\/yiRpv9kAoApjXPx9VmZKdwxVTvJj0IywVgOo+Jq5jkQvUznA99Hl45TBU8YbYg4mpR6qWC6PGSrhoSoxpRsW10h+M9HoIHlqT5nbHEMFQJXLY8NGBECFwwQkv5yHSkrcAFMGjMp7HF2djoHl+xkHhR\/uXlrjPYb8yl7U3\/7gkXBwh\/LBh\/RwKIq9kCmgkvd6lEMlABW8kXwvy8MS37s4CMSHvP4eKj6sHplUQLWob75j8cMDUEmGKuehws1vPFRCtigyVM5DVWVKdycPA6rAmvBGkfhDPENVlkMlT+Ke\/mV2qmYOlZT8BE2MdluwL9hUPGhIGCp+SL3cx8zMal7FUzs2G0ghnqGSHipxgscpHhsPAAezUxFDhY447opznXERoEK9UWs5y0+e+GBKzzFUWUAVy0LYdMHYgenxgNKNnklN6fic+HwRoLptjA682i48Ciz5fe8xK0HjZSxPtgDofA\/BIwYGk0FinqESL1yAXy8FTBAkv5v35QFAP8kPDJVhdmUzR42kdN+hmTwj8WEjRF9ACgeg8myj6PIDQ4UuP96AAKjKJL88Q2UZPXmdveznTv9gqHBgQCQI1\/SHe\/L1LFx0\/R+LvgJPvwOGisxoM2ZvJUNRVB82AAAgAElEQVSVNpcUAJV4ngGozlwXZvnxPZ0CKntYsgcm8552wcv+fRx5qOLRMzjYfXT5GL03pYBq0d+Aw\/4AOUBVJfmhKwMPQZGhAqASnhB4W+Cj2tL24Z688WFZua86hwqt4dIrgs0DGyYDKmwg5msSZgj5ChuJ8ZBIU7qQ\/fhhLANU6WndgyoDqGKjLh5ev9HI07t4oIPkF7xFElCloMOADxeCCTDFrA4npXvGBoBKMDcmyygZNmpqKoApamgYDXRHJqZ077OBv6zAUIXN1rIW\/WMT5Gc67\/4JYvCU++cfY0Q3PmJfyIjrMJEDjpGDTOABlQGKYUwFX3\/2gwE4MyCMTrAZhurSdQ16s4T6X\/lSUfIzPhGYb+VBRACqXFI6pMuCXJthqILk55LShRRuAZUI9nSAyvtNhOQHlhYHCn9tkTGWjFwycp87QPTzUDHLZ5Y4MIClUkCVu7uX5v\/713iOoUpGz4j9oh+gwjuf31X8nuIYkBRQ5br8CgyVODiZ961QAZid+vSqcZpuK6BamnflPH6qHKDKMVQMpLAYTHlAJTo0oIGnkl8a7IlNAg9LP0AFmjdsHMWTODq4sIEADOBBCzJHkzygyrSMmxO6HD3jOv1Mh5\/fWII8lJX8xOiZUg9VAqj8hiNM6TjFA1DJHCqwOB92YMr4pxw7ZQFVJodKAKrzN7VtUro\/8eUlP8hjtmYhswhMBsCIfGmlDFXu5RUzFsII6roXzedaNk4P\/XWm8m5\/bYLour1JbELGlI70cAbbuBf4NIvrjZ+ff3YwawYAihftZQ81Kk+pjx52gGpvsbHDPjuclB5O5GDWAAa5MzZ9VgyLywAR7GIFQ3Wek8OLOVTigBEdLop5bNF1lfd+wsrKawzJDwwVDg9gYqUh3R4YwmFBGarK23vJ\/eJYi+i6h5Ngz7qm9CSHCgwVN1zwM20BlWOonOKAQwEaZqIDE1hoF+Vipf3iu4gPqhc\/UGyMWYwXRz1UQ75qRUBV3AyC3Oe6\/MxJ254qIsmvT1I6jLb9ABWYBSn5AUxh0wCbwg9VP4ZK+oByYMowVFLyc4NhARY8Q1UXUAkPlQRU7MnJMlQ4vfNXf4IPZm0AKrBTVu5zXX4lgIpBFTZn1FsC12KXn0jYzhiZjUSWAFBTn5JNF2wdwJTcZFPJj4Ej5DRpSr983WQpOyUfCwZVN+yzzKhhdiRwlKZ0J2V6QOWuOX+OFFCZn1fEJly+vkHvTVefUI82ib5lQgvthuE7maQp3flFPJjiuBHu8JMSeUkOFV8\/y+LO2HgRt8HgwOH9UxUMFQ4YlqGKYxMYTGHh2sYHCTunUR4iDEslJBRcZ8tGTthUfMHAWskvBlTfq8gZk9dZ\/33xV4CDPTGaCfsKDug4kEvpHodusye4pHR0epv3fmGiQxzsKZ9t46ESjCruVVgvCoDKmdL5sPrjvUtDllZANeRnqApQXZ2Z5We7\/ARD5fKngsHWjtHI5VClMgYeFrnR48HxG76TpbBpRIDKbRweULkNM5X8cHqJNhEBDgqSn2SopOTXB1AVJBD2UYnYBP8AOykJDzKzNWBsAqAKmw4oaA+ootiEcZMonjJUdbv8AFSlhOrZPj75QSISsQmg1L00lLTWS\/YilYJS1sJ01YgWesPCLRujs+6doLcGaFN+bZzo2l1d2+VXBqgYKLrPZIC1OMVaQJV4qBygunhdfzCFx3TLv21SOmRzKfkZuVywu+GZSbr8qgBVIvnBI8bXkTcaw04JQGUlkcBQZZ8FeAnhoUrufwOqIOlWJKV\/cnXDNF+E+xyASpp+44w1BtLf3rE0NivcA\/q1ugL\/+1wVQ+VM6aYxI0lKT2IT+D3lJT8wryL5P3o\/8f0rvK446IGFBotq3kfo8ls+Thjtdc9zreoPtUh+VQHVkC8UAFXo8gunawZUHlQhg4rZKekFKZvl57r7cNrwYCrp9AOYwtd+gAqnkxQA8IOFh4tlv2rJz0kdCajyp3PnoSoYc\/sAKrAykEAkmOBNJmw01kfEgAqgqkryM+yNeMgBOiD7MZjygMrLfkUPVaHGKYWOjTjHUOUAFTZeBlTphitiE3KfXb7A2JSOz8if7dJ1k\/TmRIlxquJ5eHW8Rzfu61p\/HqQxL2ki2NNJfsJrIU+xXhJw1+vKjVM0OVPNTMkfqdcj+rWbVVaXobIeqrCReGaRn5U0lBWfixsLxPUzgEp2wPJmIzccRIgIeQRsLRhaD5RxXcWcRlxfBstFhipuwAgsbNzRaRkABlQihoIB1U4FVPIeWur\/vvc\/VgWRDBUYW+SxYb\/AoRv7Apow+P2P+9u86z2gihkqfoeHA4E4MKWxCU4liBpkfDTNOP3j\/cHfRwvxOiqgGvJVyQEqeKhwusaNb07YDkxJDxVO2t4LwvKFkzDM5uBMhnhIsEkYf0iFKZ0fnnTTsBtH7KHyDJUDApKhAsMCmYc3EWwkOVM6TjWQPE6RDJUHDXkPlWeoSiS\/k4Rmb2bEiQ4oz1BVeKgkQ+XHs5QkpXOXn9+Y003ZdflxfcH8AaDiJWW8aNiEXSAqOmjCxhsM3bzhmk0XG24poHIgUr7AHEPF7NytTzRpfA6JxAyqrttdDPYcyEPFEtadk3Tp+qm+Ml\/u8XxvmueV2RFO5tkRkh8mDWADsTLHbIYj5wCVey4AjDOACp44fh7MHL+apnTL4OVHz\/gDxJ2Wkc0BKtzfFkwlgEoZqtxttGT\/X7ND9OV9NtgTvlw0N8F\/y++uQg5VyXBkHKD9Pc2Mq2NbAagqPVQrJYMqPFQOUF2ybmn4p\/iGUkA15MeKAdW1e4OZlpkqACrPTjnpLwVUBlRVSH6Q\/fzGLrr8DJhy0oxkTnASgeRnAJVr7ZfyFACAB1Nu80gljuj0kialZxgqCagMqHKACj4qGw1gARW6\/CBx5RgqsDNgp6y3xI6eMV4iB6qqGCrpofKgyp+eLDvlWSqflF6TofKxCVYukoDK+G0g+bnYBLAZxrycpGnjpYV6wNwN2dN\/dveZT1o5SaffM0nXb52iO55u0Tvz1JbMoOpLu9wYowqGynT5OTYSgIF\/dv65r9k8GDOVPqaNNtEfnrWt4fJAAtkvBlQs+Ymu2CrJz4xninOoCs+F8BXaJo1qyQ\/XNADlKdv5WPDHFQEV3\/OGiXUxIbjf02sNQGVZqiBnG8lPGar09lny\/\/3rvwRAJfcRD6iEksH7g9kXBCPL3d7+XcUHP29Kt11+AFSSfTaSn2g6wTtZqgQ5hmrl080lcz0UUA35UoKhkjlU8H9IQIWTBOQ+7lbiTSEypctgT2myzTBUYKkApvDQ8IODhwfsFFgUw06JWX4GVInNI5L9HLtiQAHoYA+oit1N\/gHkDRYrAQyQPSyoCgZdAAgJqJBDhQ3GPLyOoTKbjZD7pEk7yCJh0\/GASsp+LvxSRgwY2U8Aqneme5RdUz16O12NHr1dstjLlK4jjR71XZM9E4bHgXjpepP\/X6NHjQHktEEehVfHenTtTsvigNUE2DZspZD8winWSgJf3DI9LyF+LP\/tet2yVX64eB8PFRjdtIEDz0l64IAEgs9YOGgY1lYAKgGQU6Y2J3kbucRL3SHQNspeE12t5n53zRfMwmKzgsQLjyA6WBlQfX27Sn6D3NtL4fe+9J4N5uXnAnsJ2No07gV7Aw7XsH1IUzo\/05ahspIfDgfh2Q6HATCqEaCSjLl4z35q1cSSGDmDe0YBFSoxpK85QJVjqACocMKWkh\/oWjwQ5pSRAVTYJMBOQR+Xm0W6YfBDhBO4+Zr4RPih8iyVkPwwuywPqOLuJpzQ0w1FMlTYWAKoahiTowFTaVJ6usHAP1Um+YkuqDJABWO68U8hWkAkiucYqiHdMovm274x2aMrtrbjYE8ACmdeBdNmGaoGXbtlmt7v0803aAE4R+uFd4nWvNKjXz7Zo28\/2qNv7O\/R1x+x66aHu\/Q1Xvu6xgPGPrAb93bpq3s7Zt2wt0M37OnQ9Vi72\/QVXrvadJ1bX97Vpi\/vnKEv7Zyha3fY9cUdM\/TF7TN0Da9tLbOu3toiXlfx2tKkK3lttuuKTU3idfmmabp84zRdxmvDNF26YZouWW8XHyZwz3uJGyG28KWI+9yzsNiwkJQuGhG+tk0B1aD31GL\/\/dzt95PHXdd4LjYhJ\/mlFgXnE8S73h6U8h4qsOc49NY1pf\/2saXDTvE9o4BqyE9OEVBVS37wgEhAxUDKLMNQxR1LWVP6FjujSQIqpKRbhiqZ5dcnKb0IqPKmdDATPiFa+kcKsQkhBRxyXwBTfSS\/pDUXLBU8VAWGym02AFP2FB9GsniGKho9Y8ezMEMFMGUYKm9KHxvynbM4vv2\/x3p09fY2MXODpgVzH7CEmcQmfGlrc97B1OKoUv2fEuN5eGPC5pSysXx\/Q\/LzgMrleYGh8tLK7eOkgKp+\/ZfS7\/zr+1YSx15iD+ShOaPgoXKSn2SorKTdEpJfDKhSyQ+SfjmgCh6qk1aO03izfkPKYrg2CqiGfJUAqNg7ZeeQWTOtYakysQkSUEH79gyVBFQVDBXkPgmoDK0LrdzN8YPkFzFUQvKLAgyFATcyVMuuJi\/59WGoRJcTU8YSUAVQNThD5SlmN4LFyyEOUMFngi4ouemYLrjl4wQPFTr8CoBKSH5DvnUWzbd\/Y6JHl26eiQGVkPz4pXs1M1NL7OU5jAsEQAWZ27BUaQ5VCUMV7u8gZ\/N9rYBqGFdqcXzPFS+w5GdjeCygime\/Yo+ADQQSN+wefEiSXk\/TaDGwKT3E1sjYhH6hwoujwvFPqYAqrse8\/5cEVCY6QQx2zXmoKiU\/4aGCIT3PUNl8ETwskPy8Vs6ASoKqMlO6k\/uKDFXwjMxK8ssAKgOq0Mlmuv2Chwp+knBiF0bdshwq4y9xbeWCoQJLZcCUk0UkQwVAhS6\/ckClDJV8WP7FnqrtM2bOI98TJqjUMVRf29WiyepAdvmtRvrfAahwz0tA5U\/9AlClhwZ7fyugGumbSHx4Tk7\/9qM1AVVZl588NItZfuyFxYG4SvI7SVguAKiWapSHAipx8w3jXwGopCm92kNlb37QtJEpXSSlIzYBBkMfmSCydVJAZeW+4iw\/aUovNd9GDFUeUBUkPwQaCrnPeGpc51c\/DxWf0uEniSWQPKCC5GfCLZ1hFxsObzRYKUMlARU8VBJQYfyMmeXnJb+jw7hdFvX3\/NdRZqpadvSMY6i+tK2pzNQAVzW95xlQ+S4\/cXiwkp8wpSf3tzSlf2VLY4CfQH\/rUqvAK0eJrt5lbSO+y6\/MQ+W7dl2XH+Zzpt5IntHpABU6eOsFe47TOfdNzktTykK8TgqohnxVioAqeKhkDpXvUkpzqOCfcl\/TQa91GSrpoYrYKdEqWzClp0np3pQePFSFHCoj+2W6\/OCnEWAqB6hsh1+fHKoyU7rwlkQdUCVJ6ZD88oDKjp5Bki98VHJA8pBvnUX57Y82e7TxlQ4te7pN+17t0NJySAz\/kiAqJMtQZQCV91BFgCpmqK7brIBq+FduYf8Njx\/pGR9uX0DlY15cM5IIcZYHZm40KgCqe4Lvz7OpbmoF5OjP3jVBrx5dGiGeuSuugCpXlXn8fwBUMikdDJUEVOjyg96dZaiEhyrK1RHTw02nnwuaTBmqL3BkwuYMQ5V0+rF+Dg3dy301GKqq0TOnZgCVoYsTD5UEVNnNRRjS8dDClB57qGxautlwxGYTWKqw6UhA1VfycwwVB3vqP1qB+a7ApzOjZ8BQFe\/zIkNl2dcwp5I9VAqo5vsqLc7vt+O1nmGqWN2AooE9At3fUCvw\/jeNJpHkZ\/2xAFS1TOluOPJp90zSM0c6i7N4NX9qBVQ1CzXb3wZAlZP8coCq0kNlJD83y0+Y0iH7zSY2QaZ5G7lPmNLPlZEJDlAha4h9Mlh8ckFnl01KzzBUyWBYw045MOVN6T6PJ8NQiTlRyDlJAZXsfooYKnRAOWAFyU\/KIjCl5yQ\/sFOmy09N6bN9FPTP1agADhHSlA5AhQDXcHAIgAoHBf7KzCvYVwVUNYo+Qr+FmaprdnXMlIdCl9+mdjzZwb3z7Xs+SPmYgMH2jTSHCj5XvJuNNL1ygj6\/tkF\/e3fpMlO4hRRQoRJD+loEVEHyy5vSix6qODYhjNFgIIWFE0cZQ9VP8sPJxHqoZvowVBWSX8noGWRQIZfIAyo3C6rKlI7NBQ9rKaCSZt1c6GEJoJIMFQAVuvwKkp8CqiE9KfptuQIAVCz5FXKoCnlrAVBBUrGAShkqvZvKK\/DvCaKvP5wZPZPLoWKbh0tKN40mbvqF9MLyuxumdH5Xw\/cH4H\/TjmkTMlz+Ey2dX1FANeRrWQBUe+PhyJ6l2tUj66OqAFSSoZJgKpOUzlQu6Fx0+UWmdDH8Fa2yxkMlGCoTm4AhmRFDFQAVn14iH1UJoEJSevQgpknpfghwSIw2YKoi2DM9tSOfp4qhwik+x1AFyc96qEyXn8iiOkEB1ZCfmNH+9lVdfpD8IibWjRmKAVWQs5mhumbj0pmVNtp3x\/x9+uk20X0vd\/0e4WMTEg8VInK8CiG6\/PhdXmCoBKA6b22D7n1+hniiwaj8o4BqyFe6AKj29Khq9IyR\/JwxvTB6RgAqMFNG7qvpoYoAlRiMLAEVz3DyHio5BLYEUEVgig3pJaZ0fviwmJ3yDJUcjoyTThKbAIYqnNhLOp\/KGKoSUzoAlWeoxEgEMFQyNiHu8lMP1ZAfnZH89gBU0T2PJozapvSYobp6gwKqkbyZanzo1yd69PNDHT+ODEpF5KFCFpUf+N2sHI7MLOufnmjRu\/M0O7TGx1gwv0UB1ZAvRQ5QwZSel\/x6xIZ0aUqvkvwwm2xgyc\/lUEkwlXqo2JCeN6UnDJXzUKELJJ1hVhg9c990AFSJKV0Ge\/Km0o+hwqkdXyVDle2AcqM5pM\/EA6qSpHTEJqiHasgPi377SPJLJW55j9v7PCP5rbAeKhwWmKFSQKU3Vr8KHGkQrXiuQ5eLUVL87gdDxcORcVjm9zkOx5Khunj9NN37wsy8DWHv9zMvxF9XQDXkq5IDVNUMVSL57XRjZzg2QXT5RTlUFQzVhZvblJf87PiZFFBZD1Xc5WdAlYhMOGtdMKQbyU+a0ksYKpb8IPuZ4ciQ+xJAJbv8qgAVxnHA\/MibTSqFfHxlPtgzlfz6Aiop+fkuP82hGvKjM5LfHgwVYhMMqEqT0n08yARlDw0rEoZqvTJUI3kzzeJDd3pEL73boztf6NAP9s\/QV3bO0MWb7MEast\/ZDzbp4g1NM6vyBw+3aM1LbeJpCfqPzvIb+j1QBFTBlO79U7vtEEsfnVDGUDnJ77K0w68GoOpnSod\/Kgeozma5z0l+fraT7PJD6JsBU03qz1BVS35gqQCoDEsVzTYLkh9O7RJQ4fSe22xg2jVdUGKAbLHLr8RD5QGVSn5Df3hG8C+oE5uQHhzSaJD03laGagRvpHn8yM020XvTPXq7YRePkJpuK4DKlVgZqlxV5vH\/AVDlcqhKJT\/poZIMlQFUbjiyAFVG9tsaskVKZ\/lxDhWb0eXYmTSDSprSSyW\/wFAVPFSzMKVz0i5WXYYKreQ5QGWS0lcKOaQkNsHIfuybwpKS3\/KSYE81pc\/j06HfKq1AeogwvsHVkzYtHV1+nqHKZK0ZyS9mqC5dpwxVWmf9b63AMCqggGoYVRXfE4CKc6jscORqhsoEe0pAVUhKd7EJAlAZY3oCqACqIPdhjp8HVMJDxUbEYEYMpnRvTCwwVP0AVTGHCpo7y33874OY0iP5wwV7eskvMepadmqS0OVnRs8IUzqCD\/t7qARDddsYIYsqJKWr5Cduc\/3XeaoAABXueQmocHjIMVTMvJqlgGqeroR+G63A4BVQQDV4zQb6ExJQ2eHIPaoypRcA1c4u8Tw\/Y0zfDh9VyJ+aly4\/MRw5dPnNkIlNAJiCQVF4qcqCPU\/nrBK3YEiHf8qAKTF+xqSl92GoqiS\/KDZBdvklDJVvK3cbjg\/3vH2c8h6qakClSekDPQb6m2tWQOZQwZReyca62AQAKhwYpCldGaqaxdffphWYYwUUUM2xgP3+OACVlPwGMqUDTLmvPIvJzGMSDBUkPySlg52SWVQFD5VkqITsFwBVqwCobEq66PxwPiqYFTF6JuehAkMFdsozVC7Yc7aSXwSoEimE2anCcGQPqOKsnkoPlWOoAjs1RpxHpf9oBea7AhJQhZiQRPLzB4dwf\/sDg09Kn\/AHBQVU832V9PtpBfIVUECVr8u8\/V8AqjB6Jh\/sCUO6HD1johMkoDJdfsWkdAAqH51QMssvl0N1vgBTMKbXy6EK0QlzBVR+9IzJn3Kpu26mmWGnqoI9V09SmRRiAVWx0w\/slDHvwj\/lMqgQ7JnLoZKxCQyu9B+twHxXIO3yY1D1ydIcquChShkqeW9f+qB6qOb7Oun30wrkKqCAKleVefx\/T7xFdC38Uy4lvZqhqsihygR7MpiChyrHULF3CtEJAFQXJKZ0GZ1wrjClGw9VkpSe7fKTsQklpnTJUFmWyqbsejDlZD9pSpen9dhTErr8cgyV8VEhQTqRRHjjqQJUGD3zkWXVkt+nVymgmsfHRL+Vq0DOQwXJz9\/rnonNxCaAgRVS9gVrFVDpDTZ4BTq9Hr021qN1L7Xo549M0w1bGmb9aO8UPfBii156e2kPOh68YhqbMJuaDfRn\/va+NaNLhqrKQ5VLSo+DPQfr8vNgarPt8POmdJmUnvVQ2eyRQYI9a0t+0kMl\/FNG9vMslQ31TBkqmctjNhppSpdZVELu47by3AnenOI5swcslezyWzZGYKlgSJcM1TUbGgPdB\/qbtQJ1KpBjqPzsSnT5eckvMFSQ\/E50kp\/0UCmgqlN5\/T2yAn97p0PXb23QiQDmy8cJ7L05dC4bo48sGzOhsf8+uvSHHsvaVP27MlRV1ZmHX2t3iW54xHX4yTl+e3rUL4cKkl\/WlJ7xUM1G8pPslM2gCl1+VaZ0GNILwZ5rm96QjqnkMKaDpYqCPeXomXumCBlU2FhSQGW7nvIM1Sf8yT10+aUZPR\/DCZ4zqFwOVT9AhaR0OXpm9TPNebg79FtoBeIKRKwsd7SartYyD1UAVDgw2Ps73NvsDVRAFddY\/6u8AjPdHi1\/qkmQjPndaN6P8rDJ\/+4YfB4ez8Bq2ZNNasxoNpUCqvJ7a95+Zd0\/JaCqjk0wXqqyYM9ZJKXXjU0I\/qlyQBVM6SE2QQKqMHqmGJsgxxVglp8xpktAVTLLL5L7XGxCQQaR7NSqeoAKLw3edNKXBtgpOcsPDBV\/\/ef7eiqbtwdEv5GvQE7y8wyV8wuG2ISiKR1yNg4LCqh8afVf+lSAwdR3d095SwTAFN6NkqHKvR9\/sneKZjhqfYT\/UUB1DC7+4QbR1\/YT1YlNuNJlUGVn+flgTyf7wT\/FSenbOlTmoQKogofKBHuWdPnJpPQ6OVQSUBnJz6Wlm9iENdMEdioCVInkF\/moPEuVSH7OmF7FUIWNhgFVOL1DDsEpPrfp1OnyM4DqtjH6+cPTx+Cu0b9iFCuQMlSRxF0h+fG9zfe5lfzcPD8nZZ+\/Rj1Uo3gvDfqZf3dw2oGpcP8YMJU07LDkJwEVDp3M4P\/60dF+NyqgGvSum+Xv3\/gvAKrAUBWS0t0IGgZTWF7u424\/yVBJMOVCPYPk1yEZmZAFVNJDJTr9SmMT1rUoMFSiw8+NnTHslB8904ehKgv29GCKO\/0SQJWMnqkb7InxMwBT\/DUFVPKl0c+U\/rnV43RkcrRPYbN8BPSP1ahAnqFKJD8nbZvmi1W2izW+v2PJ75z7FFDVKP1I\/5Y9\/5oxcyHtu9EBKjmaK\/FQSUDFB02\/bh2jv7wxumZ1BVTH6DHq9Yju+ZuITNhDVABUu+xMPw+mXKinB1U1YxMApvgrwBR\/jRgqB6g4NgEp6UH2c8OR11tjem6W31lyll+hy48BlfVSgaGCf8p2+NlZfj6LCsb0BFBlT+sVkh\/m+YGdQgYVn9wlSwVABclPAipPa2e6\/D61apyeeKN9jO4Y\/WtGsQI4SEiZ28vbhYiQouQXeQSdlH22AqpRvJVqf+Zur0df3DRlGndShtO\/Gx1LhQNnDlAhp++CNRO1\/+6l9hsVUB3DK9rsEK39e3VSusyhulympKfBno6hmk1Sei42AaBKxiaUm9LzHip0+SElvcyULkFV7aT0MslPbDIwpSM2wQMq0eWXY6iM3JfQ2ukL45S7xunZN0f35HUMH5OR+av+dbRLP3q4Rd\/c3aRv8NrVJMlQGXlbmtLhoZJdfglDBYYBHireED9z5wR9eVPDrC9tmiRev3xkmiZbyrSOzM1W8UGfebOd7YLme8cDqgqGKmracbNOX35nNN+VCqgqbrRh\/dKL7xF972C+y++KXT0y42cYTLnlYxO8h6pDl2S6\/HIeKsQmlDFU3OUHMFVgqNxwZEQnIIOKv6LLTw5HDqZ01+m3ZpoAqiKGynuoillUModKbi7sJcEojtSkWx7s6UI9+wAq+dLACQxdLB+\/Y9xsPu80dPMZ1vMwqt\/3ik3T5P2DiAu520rdzFABUKXBnidJQIW8Nczyy8QmgHXFIQHyzJ8f107VUb335Oe+4+lWlsGPAFUFQ5UDVMufHM17SwGVvLOO8b+\/9D7Rihd79PMnevTdR3v0rQM9+iav\/XZ9Y3+PeH39kbBuerhLWF\/b16Ub5drbpa+a1aEb9rq1p0PXy7W7Q1\/Z3bZrV5uuc+vLu9pk1s42fXnnDH1p5wxdu2OGLtnUojPXBUYKAOqabS3Cunpri7Cu2tKiq7Y06UqszU26cnOTrtgU1uWbpunyjdN0mVuXbpgmrEvWT5NdU3TJ+im6eP0UXcTroSm6UKwvrGuQWQ826AKxzn+gQXZN0vlrJ+nzWGsm6Tyxzr1\/gnidc\/8knXP\/BJ3N6z67Pr+GT\/STtPLpJo03FUgd48diZP46fg4AqOxBouG9g1Ly8wcImblmOlmLjQyTPF0AACAASURBVBeQbMBQRc0WkLGd5+X3B0fbQDwyN1qfD3rjNiv3BfY+9lDlDpwenC8L\/ilIfjyW60sbR9O3p4Cqz802yr880ezRVZumSAZoopPuz0+2iH1h+o9WQCswuwo8+nqH2EcY5lgWGzGyOVQibw1NF6lHMA+oQljthWsn6N0pfYBnd+WW1p+66MHJwFDVzOkDoOKvYDxlTt+5942mj0oB1dJ6Nubt03S6RN\/f2zSyQwSoIDesnKB7np+Zt79Pv5FWYBQrsOWVtgFUXuoWkl8qcZdJ21F4rdsQAagMu4BQRsdQnXnvBL02pjlqo3i\/5T4zM\/foEoUHTzbsgKHydogkNiECVM5D9d93K6DK1Vr\/34hW4LeHmt6zFAEqfzqeoJPunKCnDo+m+XBEbwv92EOowJ+fahEkP\/gG+av3Da52sQkwpYtn0DdeRB4qO04JGyE8VOwL\/PSd4\/SajgoZwlVcvN9SAqpclyhAub+PEkCV81ApoFq894P+5PNcgRVPz5D0cKBt28QSCIaKT8an3D1Jr+oLep6vgH67UaoAj6f6ySMxqPJgSnb5FYI9RWyCa7ywHqo4hwob4cmrJmj\/qxr7MUr3Vp3PKgEVPHjMUPk5fmxIT0zpPG4Gsl+eoRqv81cvud+jkt+Su6Rz+0BrXpohzn\/ygGq1nZsHucGAKmeIhdRw0YMNem9a\/Rhzq7z+6VGuwNuNHl2\/vVnLlJ52+TFLBckGDAMkP2yE\/HXHKyrRj\/I9VvbZI0AlPVQuNgFMZ5nkl2OozlDJr6zc+v9HpQL7Xu3QafeFtm3j4VjdIHQZGVAFuWGlOx07qeGK9Y3\/3963sElyVFf6J+w\/AmSMVxjZgBACIYEegEBC4mFsvNj74W+\/xbtee41tdvHaLOiBRtJoRjMjzYxG0oxGLwQCgd4vJMQbC701\/azurqq7eyPiRNyIjMyqrlF3V1ed+b78qjWa6so8UZl58txzz5UF5trMy1eFx7kFCKhJXDtZUfabxEOF0FpLqPRGeO2ja1uwx\/yVs4BARqjsJImCUEHp1O8T1ClrSlelSjv8dCOhmoVvBo9hYgQefrEvZ7vhxN2EKj0dL7pRBapSuafjaxflq\/eusvNv4hXgG4mAyLOvDOQjBz2pKgmVlt6zsnttXmVpSr92Qb49p5lA\/D6Nh0BGqIxCBWN6VDnR3NBCqGxsAj1U42HPfzWDCPzm1FAuunVV3ufCBQtCdWNe8kNsgpYZYIhN+SUL8s0fz2eg2wx+LXhIO4SAxinEkrv1UIFQBZUYEwHiQ01Qi6NKdc2C\/O13+ZCzQ8u4az62nVD55obJCBU9VLvmC8AdfesQ0EG\/GqqpWThlpxFKfrbLL3mogkKVXcQX5Q+vXZAT9Gq8dQvE3zSXCOx\/eiPvslUvI0zpKLuPUKi+fGJlLrHjQW8OASVUZY4Z1Cn4p0pSlUp+CzGHypb8qFBtbg34r2cAgZX1ofzZXb2Y1mwVKrRte\/9UUqkaClVGqNLsp6dfZpzCDHxFeAg7iMA\/Puhz4OI5WCFUrjFEx8+E89Cb0hdEG0UW6WncwdXbPR\/90YMmh8p6qK5N13MQKhjTE6FKwZ6x2895qKhQ7Z5vAPf0tBFYXh\/KV+7tSTacuFbyc6b0pcrTca5Q4UKOJ5qzb1yUX7zB8MDTXij+grlFwJ2j9\/TkrBuW3FYqVO\/ek8ruIFRa7tMbJEcmze3XZtMH3lby02s5NmtIL03p6PKzCtW5e0moNr0QfMPuReDrD627sReWUNmSn\/VwVEt+xVBW69vA08zFh5Y43mL3fkW451OAwJtm\/JPrsjUq1ZkVQqW5cL9d4IPMFCzdrtmFcQlVRqpG5FCxy2\/XLD939HQQ0Pl71z6+LmffvJoIVZgn1kWocDGPJb89uUJlCZVTqUJHyJVHl9j5dzoLxvfOPQK\/WxrIxbcsuw4\/eBidId14qLQx5P17l+S5V0mm5v4Ls0kALKGyDUZRnaoEe7aV\/BCbQA\/VJheB\/3x3InDrTzbknAOr8gFDqNJwVjWmF11+IdgT5YY\/ioZYX25wkQm27l6cfHriffW+FRkw93N3fmG411OBwDOv9OV9e31sQkaqjFJ87y+Ygj4Vi7XLdsISKv9gvCguKd16qK5eEKtQ1QiVjU1gyW+XfQm4u5tH4NgL\/UimLKF6\/z4\/8d4rVM1gwazkZwgVktLLpxqU\/Gyt\/cYnGKew+RXjO4hAQuDen284L2PKglty0SVn7lmSo88xBT0hxZ82g4AlVEjat11+qDhshlB9iB6qzSwB\/+1uQ0DjEc471IuECiW\/s\/evxC4\/S6ish8p1GcG7gVl+e5Z8sGdLlx9OPjzJqGGRg5R327dmtva31xd5aXkoPzs1lOfe6N5+8sZQ3Pb6UH5itmdfH4rbXhvKsy3bM68NpbG9OpRnRmxPvzqUcnvq1aE89eogbl+93w8t96Gf3qyuf\/fUKwN58uWurS9PvlxsL\/XliZbt8Zf60rU9Fv6\/vrrtd315rLa92JfH4rYhj73ot0df3BDdnnxpwzWvbFDC3rGTzRKqVoWqmOWH67q+xu6+LCmdpvQdW1B+8NYj8MIbA\/nggdVIqNoVqhElv0iocg+VPtnYcRc1QsWSxNavMz+hicAvF0Ru\/ulQ\/vL7Q\/nMPX67\/O6h6HbZ3QO57ORAPq3bXX771F0DcduJgVx6ou+2Tx7vi26f0O3Ovnwc2x0bcknYLr5jQy6+3W8XHdsQ3S48ti4X3pa2jx1dl4+a7YIj63LBkTU5H9vhNfmIbreuyXlh+\/AtPcH2oUM9wXbuwZ7o9sGDq27TUj42Pb+xuYcmfXAyD0+uzO+6elOZ30Wl6BzPG\/12lgsV1dFTS5Kp1OEaYH1cPujXP2TBBpCUa19CKq8PuEbooN0P71uQf3uoJ7+hob75Bd7iv2kjVGN7qCypCqNnqFBt8aLx1+88Ajc8uSGfvbMnl9\/ek8uO9eTTt63KBbesRoXK5lBZhcpeTFtN6c5HlXJLPrJ\/Uc7Tbd+inL9\/Uf7uu6vSp49q578Ec7QHp9ZEDv98KFfeN5Qr7m2SKUeoTo4mVJ884clUJFV3JlIFMqWvIFP6Oj6hWnOEypGqw2tyviFUIFUgU\/oaydShnpyrGwiVIVPwSOKhSQlVJFWhvL8ZQuXO\/5DS3mxOCWVHeLkwiqpQrm0JyVoCylyjd39nQa56uCcD7Z7hn21BICNU1g97Wh6qxW3Z92n7kN\/TPyLy9mnbMe7P9iBw41PrrYQKT6gZoTIKlRs9k10406iC7dl7fgoRqCOwuiHytUfEESklUxmhuserUw1CFVSqUqFSQnXpOApVUKcahCqoVB+7bV10yxWqdkLVpVA5MnUoqVOqUkGdGkWo4Jn0D1BeoXrv3lyZrs0R1OuAJVTaoKL+rSy+wYaMxptzUKhCrhEIlVWoUEJ6R1A7\/uu9K7LOJ7D6l\/st\/tuMUJlZfmMrVN82Zb84HJklv7d4mfjrdgMCe59ad2NnytEzUaFywZ71pPQuU\/puOHbu42wisDYQ+dsfi1x57+kRqktdyW8gYytURqW6KKhUF2rZL5T8ugiVK\/kVCpUnVD05r1LyA6EapVB9wKpTE5b8oFA5QoV5grbsZ+Z61ucK1gkV1CnbvAI\/jr7+9ckVRq5swylqCVUq0y7kFo4xPFS6ZohNYJffNiwcP2L6ELAKVTWHCrEJxYUUg5HjBbTwUE3fkXKP5gWBQz8TufI+T6iuLNQp9VDBP+Vf20t+nlCN8lD1o4fqkjaFqoNQfdR6qFDu6\/BQoeyXlfu07HdgNXokz7H+KROPshUeKuej2gShcupUcXO2hCozOX\/rlBx4it3BW33eKqGKSftGVYTnzXX5XbMgVQJs\/FOWUDGHaqtXjb9\/KhGwhMp6qOIsP0y7R5cfYhNwEUXJr\/BQTeXBcqdmHoGXV0T+\/AEQqqGMIlRqSI+m9JPBjB5M6V2EKhrTxzGlG2O6U6kyU7ov+Y2jUH1IPVTWR1WY0sumE++h8gG+NQ8VunqRPddmSo8KVbgGuBysWPoPZT\/jodKbc7xBhxJSeXOO5b4QABxLfkX56MxrFmSNpb8tPW+tQvWuSKjM2JkiW7CVAGcKFT1UW7po\/OXTiYAlVFah0osrPFTo8mkLFMxk4nDyTefRcq9mHYGbnhf5rKpTTqFKhOqK0N1XKlQgVJFUmU4\/ECpb8kOXX41Q1RSqi0oypT6qQKguOKodfqbLr6pQpQ4\/p04FQoWSHzr8rIcK3X2jTOldhMqd+6HLr0qowoNVTaECmUrXhdQBDLVjLEIVbtDXP7Y261\/bHT2+UcOR3Zox2HOsNaIpfSyYZvcf7X1qI5rSLaGyHqr3hLKfNaTGkh8UKvckmrr8ZhcxHtk0I\/Dff2QJlfFQtRGqEJvgCJUhU2pMh4dKoxNih19HbEJGqKKHKkUmqJfqtE3pBaGKHipjSv9AmITgCFUo+dUUqmRKT2G+UKatKR0PVHFaglGrnSkdanVQqZRIYbO5RpnJOShTXu1YkKpCFQjVF29fnuav3K7fNyVUIMGZQmW7\/IoyLdYrK9FmChVN6bv+i8ED2DwCVqFCyU87fpRQpafUvLvH58\/4HCp74YSsrz4J\/iEC243AwponU1ahQodf1uUXMqhqHqrY4adlv2BKt4TKZVGZ2ISPm5LfWITqaKlQNbv8XHRCzKHqUKhsyc\/GJhgPFVQq55\/qMKWjy69BqG70DSlOpaqU\/KxCZR+y4g06do35DuBRClV2gw4dY++7fkGW1xmjsFXnk\/VQJVVxwY2fiSR4XIUqkCrmUG3VavH3TjUCe59OChUIlfVSKKmC5O8UKuOhQpefvXjigjnVB82dm0kEfrYg8rn7rEKlJb+kUsVQT2NMR7AnSn6WUI1X8kumdORQocNvvGBP46HScE+U\/SKhWnOhntrxhzwqzaJCya+mUGWxCSMUKpzzrYTKNKVYhUqJFDYlUpFMteRQ4WEL1wdb8rNqR0aows1Zgz910gP\/bA0CdULVJMB2zXRNdKutl3b6nbuXHqqtWS3+1qlGoKZQlYRKJf9Y7oMZFSZUU\/KzF82pPmju3Ewi8PybHQqVLflVCJVLSt+EKb2alG67\/Gy4Z9HlBw+V5lFpoGdMSgeZKrr8WmMTrEJlSn4ujyqoVG7E1M2rPiW9UKishwqEKpb61T8VNjxQ6WvjOqA5VAWhwgNWUjvqHip7g46kqjClow3\/xcXBTH5np+GgMg9VVBQLU3oo0WLN4nqZLj8djvwO5lAx2HMavtQ7tQ+aQ4Wgv6qHCgoV5P5CoYolv9AdgifQnToefu78IuAI1f1WoUrqVGZKbyNUVQ9VPTbBmtJR9oNC1Rbs2eWhQpefGzuTEaoih8p2+bmkdD92xprSx1WoEqFakZJQWQ8VCBXIlL5iQLMv\/4NUjRg9E4I93TXCeKhcO35QO2qKx9u+9aaQUG3deW27\/BIJTjlUWC8lU12EysUmBFWROVRbt178zVOMgCVUkP8zhQqSPwhVh0KlBlQSqile7BnftU6FyoyesZ1+KPnVZvl1lfyiQnVns+RnCVWjy89GJpRdfkfCHL+CUMVSX0mmxklKH1Hyw0NUK6HCA5VRpxqEqlCo8JCVbs4jgj0tmQqKh6odbnOKhxIqlvy26vS1hKpmSreECllUbQoVFEUSqq1aLf7eqUZg3JJfJveHcRPwUOECaud1TfVBc+dmEgElVKWHKprSbcnPmNJBqE6ny2+kQmVLfoZQ1Up+bR6qklTBQ2VjE5BDpcGeCPd0JT+blm5n+e3TsTObGD1TPFSVHqroo6rkUNlrA0bP6M3ZKR6GUJ1x1YKo0mHVDr1JU6HaulPWEqpEglPJDw\/JUKd8Z2bwT5mSH4M9RRibsHXf013xm+3oGa9QpRbq3EOx7P0TpuSnF1CQqT9EgB9zqHbFus\/iTnYqVOMQqhYPVS2HqqZQ2S6\/i4\/5AckXmhwqV\/JrEKo8h6pJqIouv0N+QDIIVTSlm6T0LIeqolDlJX5PqFSVxqblvljyiwrVslhTus7xy8t9vuu3+ZCl6lTuoYLiAbXj969KsQlnWDIVykdvc4SKCtVWnbNthAokGATYEioY0mslWiXATErfqtXi751qBDSHyk2eN0+r1ZIfRs\/gQlqa0pmUPtXrPA8711Co7kseKnT44dUNRr576FLS0eGHsl\/s9KvEJiDYMxIqE5uQeagqOVTjzPJreqhSd58L9rSEyprSbWyCzaEK6lQthyp5qJZzD5WNTLHhnkahcmU\/cy2I6lR4yIIxPcuhsrlGxkNVKx9ZtYMK1daevRmhqpjSoVBFRfFqQ4CNQpVKtNrlN5\/ROVSotva7OvW\/vRnsmRQq95SK4cjmYuqeTEtC5U5EBntO\/YLP8A6OUqhgTLez\/JRMYSsJVc1D5XKojvflrSNUp6FQOUIVTOmGUGUKVUaoVmMDShqGnpf8soepMbr8cC0oCRWUaxAq2wFcUzxAqlDus4SKpvStPWktoap5qGrrNUqhYmzC1q4Zf\/uUItA0pXtCFdunC1O69U04eT88kfoTkYRqSpd5LnarSaiSQgUy1aZQtXuoQpdfSEuHQjWyy88qVKHsB4Vqs7EJ8E91KlRFbAJIlSpT2MrhyFahUiIVjemBSKHshy6\/zEcZmlOqZb9GUnrqGHM355C6HUtImYfK+6dIqLbvlLWEqtVDFfxu5Zq9wyhUds1Y8tu+9eMnTRECllDhAps9pRaEKnkngmcCF08qVFO0qvO5K01CZWb5mS6\/y7PYhLzsF8t9cfRMd2zCJabkpz+j7JfCPYvRMyYpfZQp\/SMh3LOVULnYhJ5EY3pQqcYdPYPzXYcjg0y5c996qJxCvZSH+5axCUWXH8p99uYMP46Wj0oPFdQp58epdvmpKZ0eqq06qy2hgqJo18uS4OR786Z0t2bW9xZyqJiUvlWrxd871QjYLj9\/gfUX14ZC1eKhyqV9KlRTvdgzvnPOQzVGDlUtNqGmUPnRM3VCVS35WUJVMaU7hcqY0v1w5OboGeejiknpuSkdKpUzpbeU\/MbNoUITihIqJVLYSlN6bZYflOrxSn46xqQjedsoVO0lPxKqrTp964RqUd4F8lvM8bNdfiWhQrAnFaqtWi3+3qlG4MbKcGQ8rcJDBck\/M6LuyRUqlvymepnnYueaCpUp+bUpVNZDtYlgTyVUruxnFCqoUy6HKialJ4WqJFReodqkh8oORz5o1KkJSn41QoUHKUuqcP63lvzGUKi6PFSZQlVRO3yXH5PSt+okrhOqVKYtFUWnUgUSzJJfvio0ped4zN1\/1RQq+6SKWX5KprDhqVQ9VA2F6tpFUYmYf4jAdiMwtkJVyaGCIf3TOhQ5bDVTOjxUIxWqSKg2ROMSsCmpUiKF7YIj7YTKl\/wqSem3hFl+llAZUzoyqNxg5EpsArp6LaGKD1E6GL2t5GevAdZDNZJQ5bEJMDnH8lHRNaYEy3aM0ZS+tWeSEiqUabOSn+3KLFQqkOAGoQpRFyz5be2a8bdPKQJND1WS\/l0OVemhaklK936J9FQzpYfL3ZphBByhCsORP3ufyJX3DqUW7PmZQKgu09iEu02XnyFTSqpAqC490ZdLj\/cFHX7RkH5nXzTUsxrsGU3pG4IsqrpClc\/ya+ZQ5bEJKPm5Acm25NemUFUIFXKoxidUOiA95NAFUlUbPWObVMoHrYYnpy02wZickbpNQrW1J22bQoU1q3moLKHSn1GqxZqx5Le1a8bfPqUIqEJVPrE6Y2p4UrWkypX8QKjKkh+CPalQTelKz\/5uoeR3pZIpR6jqJb\/MQxVKfl0KlRIqJVM1QpVM6f1oSHclvw4PVVeXX5NQ9eS8WxOpUiLlyFQwpNtgTzcUGcZ0DEcuu\/z2r8TzfVxTui\/55cGeXR4qqB3+IcuPncHNuWZKt54c3Jhtx5jPoaKHaqvO4DZChTJtjVDZMFasmVUVGZuwVavF3zvVCIyTQ4ULas1DVT6Juno7S35TveazunMgVKpOeYXKqFRtSemOUA2li1B1JqVbD1WbKd3GJphy36guPyVSlkw5daqc53ewmUOVlfwCoXKRCftXWnOoYpm\/LPnFpPRU8rfXAVf+11FUyKUzNoBEqMYp+aWwyPIGTQ\/V1p6xHz24VFg3chKMEm2MTFB1sdJIQELF0TNb+03dBb\/djp5Bl1+8uJqUZPinYmwCLqCMTdgFqzwfu2gJlVeoUskP+VOZOmWS0l2X38mB1DxUVqFyKpWW+rBZQnV7S2xCQag2p1AldcoSKoyeiZEJpuSHDCrnoSoVqn2GVLk5fvnoGWtKz0dPLWWjZ1DyOzPM9bSEyipUfiRVsgLggUtvzrhBo3xkS0dOoQp+HCpUW3v+1hWq1JUJUzrWyyqKjTVjbMLv\/Z6IvH1rl4y\/fVoRsCW\/GqFSg6pTqOCdMOMmmqZ0fxLqEw3\/EIHtRqBGqKKPyihU8FC58TO2y68gVLXYhHEIlWZQoewH\/5Sb43fbunSa0o+syVsyeiaU+zZDqFpN6Tj\/b\/BZVPHBKpb+vTplCRVU67EVKjPLD+qUI1Th5kyFamvPpIxQuRFiXqFCebZGqLxCFVTFSmcmR89s7Zrxt08pAuN2+WEwanwyLRQq3x3ic6j0BOQfIrDdCIBQWQ9VjVBlwZ7WQ1USKmdMr+dQRWN6m0LV5qEa0eXXJFRFl1+bh8oqVOqjKjxUtZKfNaVHVbos+aEpRQmV7fILD1bo+O0mVEmhsn6cmuJhu8ZgcKZCtbVnUkao7Cw\/2+VnFMWkUHlCBRKcl\/zm8x7A2ISt\/a5O\/W+3Hip\/gU1dfi6Hyjyh4unU+yaKHCompU\/9Ws\/6DoJQOf9UR5cfZvnZLj\/noSoIle\/y026\/dlM6OvwaKek2NsGW\/DZNqNbkvFtSuGfTlB48VJZQ3WwIVaXLr2xCqQV7otx3liVUIdzXeahsbMKeRTnzuiVp7\/JLikeVUBk\/DkpI9ubMLr+tPXMzQmUVqkConELVEpvgyrUVhYpdflu7ZvztU4qAVagsoYKXQi+sNtAveqjcRXSxkV+Ck29KD5e7NcMINAmV6fIbp+S3yWBP56MysQkNUnUsRSbEHKqGKT3PoepSqD6khnRrSq\/GJvSiOhVLfoFUlbP8agqV6\/Atcqh8U0quUDlSZcr\/3QpVnVDVcqigUJFQbd+JerqEqqZQkVBt3\/rxk6YIgbYcqjZCFUt+e8ITaTCls+Q3RYs6p7tiCRW6\/DSHSst+mSndzvIrSn4I9SxzqBCbAA8VSn4pNiEZ0vOk9ESqyhwqP3omJ1TjxiakHKqenKudfibYM5vl19Hlt2lC1apQje7ys7EJ6BqrEqqgduQeqjflxUUmpW\/VaW0JlW8iSAQYD8hYM5RpnTKFtHQqVHFpWPKLUMznDyMVKkj+FVO6eyo1hMrmlswnmjzqnUSgjVAh3DMjVTHc0wd7dsUm1Ep+IFS1kh8M6RdBobIlvxEKVY1QaXdf3IKHKmVRVWITDqwKOv3OtupUEZtQI1R4kEK535f8QmOKJVTWQwW1uvBVOnN6zKdL\/krcnGuECiU\/R6iyLj8Sqq06tyyhak1Kr3qo\/IBkKlRpZUioEhZz+ZP1UNW6\/FpLfrh4htwZq1DpBZN\/iMB2I2AJVRmbcIUp+cFD5V8NoTqZxs5YhaorhypTqEIOlXb5uc0RqjR6plSo3PiZjtEzyKFq9VC5cM+6h2qzhKq1yw8PVPp6fSr7QakeZUpPnX7jESqU\/JqEisGeW3U+ZYRqTA8Vcqja1oujZ7Zqtfh7pxoBJVS5SdWb0vGkClNqNKTHdmk1ouYeKipUU73UM79zSqg+h1DPMim9QqgapvQWD1UXobIK1SU2h2rsLr\/xR89YDxVyqKpJ6TY2YZOmdJz3UaEyTSnWS6lECpteB8b1UMUSklU8jCkdakdOqFjy28qTNyNUscsv5VBBUUS5L3X5tStUjE3YyhXj755aBNoUKlxYIflHQgUjanX0jH8KpUI1tcs90zvWqVAZH1UWm2Bn+VW7\/MaPTZjMlJ4TKmtK98ORO4I9nSm9Jy7c80Dho0JswukSqqhQFUnp8cFqnByqBdmsh8qa0hmbsLWnbZ1QJUXRkWAze7GNUDkSzGBPBntu7dd1un+79VDZkl8kVHhCLTJo8FSKED+W\/KZ7nedh72qEKuZQWUIV\/FMu2DMQqpqHypf9+jK2QtU2eua2dal1+XlTuidUFxxZk+ifOrwmIFPn3TpmDpU1pbcqVKtu9AyGI\/vz3Seljy755cGeUKc2W\/JzakfRgm9DIjOFKgZ7qkLFkt9WncNKqJBufzoeKkuoqFBt1Wrx9041ApZQtccmFJPmK7O7LKHSJxr+IQLbjUCTUKVZftaQniWlW0K1CYVq1OgZGNNdUvppmdI3n0OFUE8Xm7BJU3pnbIIxpWexCeF6EMt+GEcV\/TjjzPLLy0f25qwK1b8+NpBrnhnKNU\/rNvDbUwO55qmBXG23JwdyVbk90ZernujLt4vtW4\/3Bdv\/DT\/r6zcfw7Yh33zUb\/\/26IZg+9dHN+RfH\/Hb\/3lkQ+L28Ib8S9zW5V8e1m1DvvHwunzjx2n73z9eF93+14\/y7es\/Wpe4PbQuX39oXf7ZbWvyzw+tyT\/\/0G\/\/9MM1idsP1uSffrAm\/6jbg2n72oNr8rUHe377fk\/+wWz\/83s9+Yfv9URfdfvj6xers\/yshQNEGI0EtsvvjEqXHwnVdl\/9+HlTgUBbbAIurPBQISUZT6blxdMSKpb8pmJp524nugiVNaVn8\/xsbELhocLoGadQnRiIi0w43pfY4XdnX6wpPSv5WQ9VIFRu\/Eyjyw8K1XqLQlWU\/Bpdfqnkd05NpeqITagpVPG81zmeZpYnsqjK0r9TqIouP6jW1pCOkh9uzKP8OJZQ6eiZTxzvy2UV8htnL54IAaxlCKtdL5cZ5tdMCS+2vInAqIk6Ksisl1UUVU2MimIYYu2bCLQj069Z5BKTEAAAIABJREFUlhnmGgg04iKslwliHZcA19YLlYToebthWc4KY4JsE0FOgL3nDdfw5npVYhOs5+3qNMi6Ldjz3L2Lc3f90QNml99cLns66KaHakXcRTWMoGglVKWHyj2N0kOVkOVP240ACFV19Iwt+Zkcqsuth6ogVD4pve6hqilUl9zRz2\/Sm4hNQMmvepM2sQm4STtTuvVQ2Rt0JTbhbI1MmCQ2ASX\/YpYfuvxqw5HtDRrDkUGorCkdasfvj5jlpwrVJ48PxDURFAQ45oYFQtWIuCgIlSXAGaGyBDjMXGybu+jWKpRo3Xo1CJWPucBapYiLkBlW5IYpES67MrFesWFo34rYmIusRItrdQcBrhEqJNtrua9a8rsmXc+VAG+GBJNQbffVj583FQg0S34FocIFtZpD5cM98SRqJeKpODjuxFwhAEKVRs+0lPwMobqs7Qbt5vi1qB539gWEyt6g611+CPb08Qn2Jj1esGdHya9QPWoKld6YcXOeiFBZxcPM84NSHRUqYwOwhArKdTeh8uU+l0F11SmBjyoZ098MhMpHXOiawfMGQgXya\/1uDUXRzF3M1qpjTJBVqDTmQslUjfxO4nmLYawVz5udvQjPW41QQVG0CtV7sGYm5qJGqKBQgUxh3bBmSn4jAS58b7bk11yvU8KS31xdenmwQMASKkjKmULVQajwhANCZS+a+P18JQLbhUAXobIlv6zLLxAqd5MuFCqU\/BqqhyFUNjahS\/Fw5b6ihGRv0LWbNEpIrTlUVqEy5b5M8QiEKpIqVTqw3aSGdG9K13Penvf2Bm1LSGXJzylUITYBN2jcmNN1QUtIHW34bbEJwZSuCtUnnEKVZ4ZpuQ8lPxCqxlpZhaoo0WK99FVDWC\/S0qwtzwalyuWFOTLVQqiKJoIYwmrGBKVk+2YQqybbo+x39v5VR4Br64Xrs85ezBSqxqigShBrY\/aiibownrcsKb0yyy+qVJU1SwT4lDCHaruuevycqULAEqo2UzouqO4pB+3SyJ5hUvpUrec874wlVFCpkJKurzCmI9hzVA6VJ1SbGI48osvPBXsaUmU9OSBUNjahJFS2hJTKSCnYE4oHykd4zVQqkKl9IFOjCRX8U\/BRWrXDKVS4FiDs19ygoXbgYavmoaqV\/OzN+e3fCgqVVROLBgJ0ZDYI1Z3G82YVKrtWgVDZBoIaAb4ghLBirWx5VhUqr1KZVHtDqFCidREXoeSH9QKZequaCKJNwzQR5IpiEXVh1ys2EhSxCdcsSCzRFh4qKFTW98ZZfvN8JZ7jY28zpcPsqCenI1RlbELwUOFpFBdOSMRzDCkPfYcQsITKJ6Wn4cggU3iNpGoMhapRRmrcpCtGZ+vJsV1+t60LFA+rUJ1vPTmF4tGqUB1KBme9OccbtPXkOIXKqx5dJT8oHo0SUuHLKRUqX\/LTG3SY7RkmJ+TXhXqXX1I7kskZN2dLqNSU7jxUHYSqplCh5IfyrL7aEm1ToUJ51hvTkWyPsl9GqGzMRSRTa6IxFzWFCoTKzV3s8FA5UmXLtPtWXNSFUxUriqJdL6iKkQBbQpUpVPnsxazkF4M9F8RaOBwRNllUo0p+JFQ7dBHkx+4sApZQtSlUOEHtxVTlfd1w4YT5lIRqZ9dznj+9i1BlJb8sh2oo0ZNTqB61m7R2m9kuv1rJz5WQouqRRs\/UVI+POtVjXUComgpV0eUXVI9GUrq9SZeeHBud0HKD1nJSW8kP53+mUEGpLiMTzPQEd22wN2j14WDLbs5NQuXUjjDL721BoXK5YfBPtayVkt9Lj\/ezjkxdL6xZjVBhTFCcvRhyw6zfDSRY1ak2hapUFJVYqZKY1ERDgE0TAZREq1DVSn7WQ6VrhU2JFMgURoVhzeI1e0xC5R+MQ5dfKPnV1gyjZ5zvrTLQmh6qeb4Sz\/Gx3\/jURnwCsn4Kq1DpyYkTU1\/xVOo8VKbkB1lfSRX\/EIHtRsASKlfyu3co1WDPYEpvlPxabtK1MlJUPSplpMYN2ipUR4tW\/JGz\/OqKR7pJr4pTPdo8VJWk9C6TM877eJM2SekZobKjZ4rYBKt44AYNtQMPXFnXWFuXnxmOXPNQwZDuy32+NKtrhfVy5NcSYLtWJjah5qEqy7OOUNmSn1WogqI4XsmvO+YCw6xrhMp6qCKZCh1+llDBomHXC9dtXLvhd7PXcCXAWC97LceatZX86jlUjE3Y7usfP28KEKgpVCr\/48Ian3gqXX72ZNQTERdNfaLhHyKw3QhYQlUOR9ZSH1SqWO6726tTUaG6qzYceVBNSofioQoVVKqLrS\/HlvyM4lGqHlHx0Bv0kTUZqVBZxaNlOHLmyTldU\/o4Jb+RpvTu0TOt5aNCoUIOVW29utTEuFbaTABSZQhVgwDb9arkUDk10ZZoxyj5OQJsMqhq5VkoVTCmlyVaS6hQosV1OhIqS4DNg3Aec9Fe8qsRqppC1bpmcfQMCdV2X\/\/4eVOAgJrS866fvNsneqjCyZlOzNQlAmkfhIoK1RQs7BzuQpNQJQ8VyFTpobp8DF+O9VCVJT9bQkIrfmdQZMND5TvHUPKzRudqCalR8mua0sft8rM36FbFw96grY\/SlpAKU3q0ARj12l4b3A3alPzUlI4SEjxUtuSXcqiaXX5RpWrLobIdmdZDZQlVIL\/VLr8KobIlv9p61TxUDUJlSn7ZelUURVyf7XqBUOm6QU10pKplvaBQjcoNe1dUqZIpHesVPW8tpnTre6OHag4vwDxkkXG6\/Fw9vlSo9uQmVP9kk3JLiC0R2G4ELKHyJT9DqEyXXzZ6xhIq04ZflpHU4AyTMxQP9wrFQ18rN+muNvyaKb1LoWp0+W0iNsHmGuEGbT05uEFbxaNxg7aKRxySnjrGUEayhArXBZSQutSOd1QzqE5JNKW7ENahz6AatzxrS36RUOVNBG0KlXre4J3Ca1VRbFGoxl6v0vMWGgmgUNVKtCDAllC5ZPsWRRGEypf8OpLSDaFyVQd43kIOFUjVKIWKHqrtvvrx86YCAVvy809AyeyIE9QSKpyYZxZJ6cgvQb19Kg6OOzFXCFhCVZb8bGyCqlSp7DeZ6gFSFUtILYTKG52TMb2z5NcyzqRV8QjBnmjFrwZ7WkN6kZRuFQ\/coC2hcuc\/unwNmcI1IPpxTKin2gCahCrZAXB9wI1ZfTn+5hxe7Vy4WPJDUnoe7BnVKRPCCv9UJL+WULWQX3ioarEJIFKe\/HbnUJUeKiVUOoZG1SkoVHH0jOnK1ByqvNxX78psXS+blG4JVUVRtAoVCLB63pq+t0Khao1NWIhBrE5VDCW\/8\/ez5DdXF18erEfAKlSWUOmFFRdUS6jaSn54EsUFk\/gSge1GQAnV5+4TsaNnunKoXNdYZT5cvFG7MlI9h6pKqKyHKnb5tc+G8zfp0DVmPTlFbIIlVOgcQ5cfyJS+glDh5oxX5FA5o7PJobIKVRehcud\/y+gZR6o6Sn7xulAJiayZnLOSnwn2VIIED5VLST+Z+91qIayOVJkOP9dIAFJ1e1IU2xQqZ0w3JT+sV60868lUMzbhwyBThvyCVGG9xi35jbVeCGI2qfZKgHMSDIUqVBlsDpXtygxhrDVVsS07DKTqC7cvb\/fpPxWfx1l+U7EMO7cTllD5E7bpocoIVZT6g4cKJ6M7EdNTzc4dET95XhFoKlRp9IxVqGpJ6Rhloq8gVGMZnXGDrpCp2IZfdPnlqgeGI\/thu6M8ORmh2kTJb+KuMaNQ2a4xJVKbUahQ8sMDV1OhCuNnKi34KTbBz\/MDoUJK+qjybCK\/xpTetV7FLL+ROVQdBBjqVFKokucNhArEF68gwCj5xRJtDGPNk9L\/xMYmjPBQ+TVL\/lfXWGSiLjwBzocjY81qBFjVxRoJ\/taPe3N5GSKhmstlTwdtCVWpUKFzxBIqPOlYuVgl\/vgkGmru6RP4ExHYHgQahOq+5KGqdfkh18h2jY17k67FJtSCIq3RGa34OaEaZUpPs\/ysJ6cRFNmiUNmOMShU8OSkEtLKiFEmS1K7BiRSld+gbckvWgE6FKqaHwdKhxrScw+VKdGarkyQ30YOVVHy8yXavvO7wfPmx8748TMNz5tRqFqDPTdFqFJsQlQVjYdKSVUroTLBnrp2zj9lTOmoKMSkdFPyw3U7EirjgW2W+yqEqhiOjCYCS6isKf3nbwy256Sfsk8hoZqyBdnu3ekiVDhBIflb6VgJlSNVmULl53WpRMw\/RGC7EbCECjlUseR3T3P0zKiSH27SDV+OLSNVFKo82DPNhwOhioqHHbZbyTVClx9Kfo5Q2bDIFoUKSoe7OVc8VCBUY5WQrOJhfFSp9L8k6qeM1wOjdqQHrfwG3egac3PhvIcKaoe9OY\/T5WfXSn\/Wcl\/0UaHTz6yVdmeCAHeV\/FrJb7Fefq18ya812b5Yr1p0QplDZdWp1vWyHiqnKIZZfl2ECtfvMC4IJNgqVPoz1CmrKCbfm1cVyzW77PDSdp\/6U\/N5JFRTsxQ7syNKqHDSVhUqXFBxckap319E8xORXX47s4r8VEXAEiqY0mOwZxuhsl1+k3SOmZt0lkPV5qEqOsd811hKSm+W\/IqkdOvJMb6cbPSMUTygdjh1KpjSQaiSQpVKSFb1KB+o9MEqPlSNGZsA5Xrckh9uzk6hajGld5f8BtWk9C5FsUaoLPkFAYaHysUmWELV0uWH8qwr99m1sqn2IZAVJLgkVFgrd42OCpVXp+JaWUJlTemFjyopiuPlUGHNGgQ4NhI0CZWGfD72Yn9uL0gkVHO79P7ANSm9k1DB5FgaG\/GEY7Jm7BPNnMPKw98BBJqEKi\/5IYMq6\/Ibg1DVcqiSL2cjzocDoWrcoK2HqkqofKinkqlNESqreJiSX2ZyrgR7xpt0vEEnQtXo8sP533Jz9iUkVanyGJX8QatboTrDJqUHT45VqMqSnyVUKNFahQrqVEOhirEJfs2aClVSE2tjguwwa6xVc73qyfapRJtKfvBQZes1lqLoS7QxgLlS9nuPPgjjIbi8dncoiijRgkxFhSrEJsBH1VamvfbR+fRO4XJHQgUk5vS1WfLLa\/P6lGpLfknqX5QyKR0nIUt+c\/pl2uHDrhGqqFCZHKpOU3rFl2NLfu4mXZT8EJ2QEaqKQuVu0taTUyn5NW\/QSaGyJb\/GDXoEoRo3h8qpHqpyYLOmdKNQZZ6c8HAFXyXIlL7aEpLenOMN2gZ7BsXD5lA5hSp2+b055nDk0R2Zca1MZpgr0RbJ9lahQtkPhMompTdzw7oJVerK7MWuzCzZvkKo8MCrr7aKEBUqa0o312urKGbrNcaoIL2Wv8uu1xiE6mvfW5WN+bROxSsfCVWEYj5\/aBKqossPJyiecuIsv9xD5dQpM0xzPtHkUe8kAiBUWu5DsCcIVaZOteVQFcGetVb8MikdN2jryandoNsVj9Gm9MxDFUp+tTLSuIpHvEEbhUpvztUbtCVURvEoy0feQ+VVqhqh6kxKNyWkrOQXCFWbQoVuzLYuvxr5jcn2hlAlRTEpVCBUIFN4hTEdCpUjVJso+bm5i1ryK8p+KPk535uWZrGZYda2RIv1cmtmCVX0UPkHYZRoc0KVwljR5ddcs9Sx7Up+rTlUp+Ss6xZk35NrO3nqT81nk1BNzVLszI40gz0LharwUNkLKRWqnVkzfmodARAqR6Y0j+reoVRN6ZZQ2ZJfQahqZSQQqmrJz96kreIRSn6lQpU8OXUPVS0oEm34yKFCplFmcM6CIlcaXWO1kh9u0I2SH87\/MocqeCl9yS88XBUG56RQdc\/yg8nZKlSu5DfCQ6VECiU\/S34vtYb0ossPhApqoiO\/QU2MMRchNqFcL5ApO3rGEqpyvUZ5qOKaWc9bR5dfRqhCl58lwV2et3EJVevomUKh0i6\/91y3IKpK\/XZhWD8h5\/BvSajmcNHtITuFav+K91G5J9b8STWW\/EYoVL72niR9+xn8mQhsBwJNQpU8VFkO1d2nn5S+WZOz3pyhUkW1w5X8xleoOm\/QpuRn1Y4uxaO1a8wqHlCoK4QKN+msw28TXX7Rj2MVKpNrpN19PjbhTbn+mYEc\/flQjvysuR3+2VAOv4BtILe+YLeh3PrTgdxS2Q49P5ByO\/j8QA4+15eDz+mr\/\/nAc33Jtp\/05ebKtv\/Zvvhtw7xuyL5n8u2mZzYkbk9vyE1Pb8heuz21Ifqgq5ten+12w5PrUtuuf2Jd7LbniTWJ2+Nrsufxddnz+JpcZ7fH1uS6x9bkO+X26JqoF8pu1zzak2se0b9bkwNPr8mjL27IkDyqcVkjoWpAMl9\/sfepDYlPrKFGj6dV+CgyDxW6\/MLTqKpUeBKFrE8P1Xx9h6blaBuEyuRQ2eHIGDuDV5tDZctIUD3GNaXbsh+yjew4E1dGMh6qpFCFtPSqKb3Dk2M7x0K3mDU4g1ih068RFGlKfrVZfg3Fo1Lyi6Z0NKlUR8\/UFSq04luDcy3XSEt+Ly7y7j0t5xn3ox0BEqp2bObi\/4z0UBnJ3z2RwkNVECpVqEio5uIrM7UHqYRKR8+kkl8q+2UeKqNQXW5Hz9gSUtd8OOQa6esdftCuKyW1lfyMOqWkCgqVez2SK1RNk3MypUcvlRIpS6YO9qQ1NqHL5GwIFR6iaiW\/s4I6ZbvGUPp3hMqQKTxgwZNTmtLhxwGZiiqVy6Iq2vCNKZ2EampPO+6YQYCEyoAxjz+CUDmVqlbyM6ZUSPzZRdTEJpBQzeM3aHqOuaFQtXmoDKHCfDinUpkOv2R0Ht05Fn05hlDBmH7hsXwwss008gqVJ1Q1Xw7CIkGkaiW\/qofKeHJQ8rM5VDVT+lgK1YguPxicm8nbdYUKZAoeKqtOlV1+JFTTc55xT9oRIKFqx2Yu\/g8IVa0lF5I\/nlBLQkVT+lx8RXbNQdYIVTSmjwj2tGU\/GJ1hSh+75GcIFUp+bvRMoVCBVPk2\/FEKVVHyC0npMKWnNvz6cGSU+2qEKjM5F11+KPfHMSZdOVSFQtUkVEm97opNaBCqYEpXHxUJ1a45Ded6R0mo5nr5xRke4aGyGSeQ\/v0FNW\/BhUJlCRVN6XP+RZqCw7clv8bomRE5VFCoQKaSQtUXm0OFLr9kSk8lP1WlsIFQ2dlwpSl9PA9VXvJDl5+LTZgw2LOmUKHk57rGClM6HqjeipJflVBVgj2tQkUP1RScXNyFsRAgoRoLptn9R20KlSVUekFVdUovqPBOaDKyDfKDVwIXzNlFjEc2rQhAoXJjZ1xsQr3L761ISgehQrkPr5FQ2WBPF5uwITClb06hKgiVVagsoTKm9MyYHpLSba5RJFQjgiLdcHTjocwIFbyUeh3QoEiTlK4KFVSqeF0wGXXOR2WH7Rr\/FFQqm5T+9m+9KS8uznli5LSedNyvDAESqgyO+fsPbdeFQuXbqH1sAp5UreRfNaUbD5UL99S8Eg5Hnr8v0hQcMQhVMqWPkUNlTenjzvLLTOlm9ExQqFxQpCVUoeRX5hpZD5VL3x6jyw8+KpjSbVBkV7DnZkt+jkx1zYWzhGpkya\/uobLGdCVSbvv2KUG4J2ITWPKbgpOLuzAWAiRUY8E0u\/\/IKlTIpYH8ny6qZigqYxNm98uwy4+si1CpKoXoBMQl6CtM6XY+XIxOOOEN6bbkh\/TtmkIFdUpfkb7tTOnFLD8oVLbk106o1uS8W4yPqm04cksOVdewXeuhgik9PkiZ0TOITbGjTDCCypX\/jVqd2QD0YetajJ8pkrft6BlHphaahIoeql1+Rs7f7pNQzd+aZ0fcTErvDvb8o4JQxfboMLeLJb8MXv7HNiLgCNX9eWzCyKR0q1BtIjbBJqVj\/ExGqNqS0ovYBO3ucx1+R8xg5MNr4lO31+S8W3sZoXLz\/CypwhgTQ6hsyW88QuWH7ToyVR20u+TmeapCja1GqM68rn30DOZ86vXBXSMsodKfoVDZYM+YlK4lP+ZQbeOpxI+aEAESqgmBm5W3tSlU1kNVTi7PTOkm2BMXTZb8ZuXbsbuOo6lQGQ+V7fJrGz1zcphGmYzIoYqE6s6mKb1R8rOjZ0YQKjscOZIqo1BNakqveqhMDlWpUEV1OialF40pxk9Zux7EB62KQlUjVLHkZwlVzKFil9\/uOhPnd29JqOZ37d2RNwlVU6FCl098Og1G1FLeB6HSCyb\/EIHtRkAJVR7s2eKh6sihanb51XOoUPJTdWqkQmVjE1qS0rtKflkOlTWlH+r5IbtQqWBMv3lVzglZVF0KlY1KAaHCg1QkVG2mdDvLL3io0KRSM6XbawNM6Zo\/5XxURp0646qF5KFiyW+7TyF+3mkiQEJ1mgDu9rfbkl\/VlB6fUI3cj84eM7fLGdK1k+damtJ3+3dit+5\/s+SXCFVbUnrmoZqw5Fd2+DkPVSz5pWDPemzCqByq3EOVlfw0If3gqjhjOsiUGYzsQj07hu3CM+m8VG05VJXz3zWnoPQf\/FN2nh\/UKX31XX7BlB6uDV0KFQzpNjaBpvTdekbO336TUM3fmmdHfKOZ5deeQ5V7KDKJP3T5+YtnMp5mH8L\/IALbgMAvFzoUKpNDlcUmWA\/VyYFEQ7qmpkdT+kDUjO4M6cf7Yst9qlTVCBVIlc2hcrEJRcnvo8XoGVvyqyalW4XKxSasepXKEKq31ENlCJWNTchIVdHl1yRUIdjTRicUHiqU\/N5RKfm986pT8soyPVTbcArxI04TARKq0wRwt7\/dDkdG1481p8bYBGtINU+led5MMJyy5Lfbvxa7cv+X1r0hfVRswmdCye8y7fI7OXBbrcsPSem2yw\/BnpFU3dGMTYA5XcM9G4TKlPwmSkrPDOk9qY2eQbmvMXZm\/2qKSNm3Il0KVSz5WUI15uiZVkIFQ7pGqxhCBTKlrzWF6r17FmStT0K1K0\/KOdtpEqo5W\/DycJslvxXJYhPgoQiEStUpp1DtWRTnoYIpnV1+JbT87x1A4KsP2S6\/oWx29IxVqGqEqoxNgH\/KqVQ2KT3kULnRM0VsgsYlYCu7\/EYqVJZQZQOSV92AZKtOWUI1bg5VIzZhHEKlwZ7lsPQsn85bAbTUh00JVSRVmYcqkSqEe37pzpUd+CbxI4nA5hEgodo8ZjP1ji5TOmb5uRwaKFQloULJL3TzOH8EFaqZ+o7spoM5\/HNLqEyXnw5KDp1+l9suv0KlqhEqO8sPZT9rSkfJT19dqS\/LoVoX9U7BP2UzqMbLoTIZVFrusyW\/FkJlSVWXKR2K9HtvWpbMlB6iE9I8v7zk78p9psvPJaV3Eqp8ll\/pocoUKqNSgVDd+uzabvoKcl\/nGAESqjlefD10LfnFURShjXoshQoX0PJJlEnpc\/6N2tnDf3lF5C++J+LGzyiJClvNlO5KfsFD1TXLzxIqlPy6CFUkVSj5tShUvuS3uRyqD7cpVAeMQmWM6TVChckIllDhnIdCFUt+NywLunyth6qWQwXFGjaAhik9XBtsl592+ukGUpWV\/L59Ss65cUHe7LHct7NnFT99XARIqMZFakb\/Xc2UHp9Wi9ETmREVJT8QKlfyo4dqRr8mu+qwjv4ChCpXqECqMoUqeKi6CFXNQ6WEyvmoWjxUSEp3Jb9OhSrv8muW\/DoUqtDlp51+uqkyhU3LfaNKfslDZcZNmWBPkKqRSemFKb1GqLT7N5b7gocKJT+QKeuhgjp14On1XfXd487ONwIkVPO9\/mJLfnhidU+pkP2Dh0rJVEaooFBlHioSqjn\/Ok3F4aue8Y3HJfmnCpUKo2esQrVZU3pNobo4lPzQ4ddmSkfZr6ZQNQlVMRy5TaEyhApkyhEqE5vgfFT7VpIx3QR7QqHqzKEypvTkpfRD0q2HalxCVapTllCpUvX3D6xOxfeJO0EExkWAhGpcpGb031lTuidU6Wm16qHCUFQQKniooFCFJ9EZhYuHtUsQWO2LfO2RVPKDf8qpVLbLryj51TxUqlBd2hab0BbsGYcjp04\/F5tgDOnjeahyQoXhyJqYrh1+kwxHRsnPKlRRlTYKFc5\/3+m7HMfOND1UnlSh5Nfs8qsPR64SquChUjK1PmCpb5ecbtzNgAAJ1Zx\/FWzJDxfYmkKVDUatJKX7AL9FP6eLpvQ5\/1ZNx+GvD0Ru+4XIn33XEyuU\/PQ1qlQ2NqEa7NmdlJ4M6X1nSLeRCVGhsqNnGoRqkyW\/NoXKlPsyU\/r+FVFlalSXXxehcqOnbigIlU1KDzEq7YRKAz5Tya80pVsP1R\/vWZCbn6IJfTrOIO7FZhEgodosYjP278c2pQe5H2ZU7ezRCyieRkmoZuyLMUOH83pP5MBPRf7mIU+sQKb0Ncuh0jBPsyE2YVxTOsiULfnZ2ATX6dcgVLkpPZb8DutgZD8c2Y6eaVWoLKEK\/inroRp3lh9KfrHDz8QmoOxvS\/8+QmWUQpUTKmdKN1lU6qX6zJEluerhVXl9harUDJ16c3coJFRzt+T5AWvJD11+tuQXL6xFDhUuprFVGiU\/F5vA0TM5uvyvaUNgcU3k56dEnnsjbT95XaR9G8pPXq9vz74+lMb22lCezbaBPPNac3v6tYG47dWBPN22vTKQp4vtqVcGMs725CsDidvLA3kybE+8PJCR20sDeaKyPf5SXx7\/Xfv22O\/6Um6P\/q4vrduLfXnu1b6srJNETdt5wv2ZDAESqslwm5l3qSm9RqjQPq3+CeehKHOo4KGCKR2EirEJM\/Pd4IEQASJABIjA+AiQUI2P1Uz+y2aXXzKlZ23T6PJrMaVjCCpao2cSLB4UESACRIAIEIEWBEioWoCZl79uzvIbQahMUrprlUYOFRWqefnK8DiJABEgAkSgggAJVQWUeforq1D5Lj9PqKKHKphSoyG1k1Cxy2+evjs8ViJABIgAEUgIkFAlLObypzaFyhIq66GKgX4mHdmOmHAt0YxNmMvvEg+aCBABIjDPCJBQzfPqi0gzh6pQqIouvwahQsnvO2kAqrZF8w8RIAJEgAgQgXlCgIRqnla7cqxtClXs8mtpcFmNAAAYuUlEQVQr+VGhqqDJvyICRIAIEIF5RYCEal5XPhy3zaEqPVQYPYHhqPBR+TC\/RTnzuiXB3C7b5UeFas6\/VDx8IkAEiMAcIkBCNYeLbg95pEJVlPxisCdyqFDyY5efhZU\/EwEiQASIwJwhQEI1ZwteHu7ILj8QKoyeKbv8MH6GhKqElv9NBIgAESACc4QACVVlsQfDobzZG8rzrw\/koX8fyH2\/Gsg9v+zL93\/rx0S8vDyU\/nA2xiWMJFTOQ9UcjOoyqIJKVXb5aacf\/xABIkAEiAARmCcESKjCaq9uDOX4L\/ry9z\/ckM\/ftS4XHvXDSTGM9IMHV+WDB1ZFB47q6yeOrspf3dOT\/c9syG8Wdi+5Ug\/V+\/etuPEz1Vl+xXBU2+Vnp8vTQzVPlw0eKxEgAkSACJQIzD2hevrVofyPH27Ix29fl48eXZcLjqyJm\/huJr1\/6FBPzj3Yc0TqnDDJ\/ez9K46IOBKyd1kuv21Vjr+wIRuD3UWumh6qFXEdfnuXxY2eQckPo2dMyc8RKniovpMmytOUXp5m\/G8iQASIABGYdQTmllA99\/pQvvLAhlx0bEMuPLYuH7sNhGrdEKo1gUJ1ripUB1flnKBSvT8QKh0s\/N69PrtJu+IuvGVFbnt+XdZ3CbGyClXZ5Ved5QdCBVN6ZTgyS36zftng8REBIkAEiECJwNwRqlNrQ7nmqYF8\/M4Nufj2DbnodiVUG4ZQtSlUTUKlZAokRJPFlVC5iIHrl+QLd6zKbxYGJd5T999ND1VdobKRCS42gYRq6taSO0QEiAARIAI7h8BcEarn3xjKXz3Ql0\/c2ZdL7giEShWq29bd5kt+VqHq5QrVgaZChZIfCJWOaXHkY8+SfOCmZTn83PrOre4Yn9wkVM2k9LNuWHJE0UUmXL8kGaFCyY9dfmOgzX9CBIgAESACs4rA3BCqH744kM\/f3ZdPHO\/Lx0tCVVOoDqsp3RKqniv3acnv7JtXRT1USaHyqo4Nwnz39Uty5p4lUZ\/R1Y+sycaUilW25Fea0nE8jlAFD1XModqz6I5NO\/zKLj96qGb1csHjIgJEgAgQgTYE5oJQnfzVQC490ZdPHvdbRqhcya\/NQ5UTKu3ug4cKpnRX8gseKpi4E+nwhEoJx9cf7LWtwY7+vSVUKF9mpnSUMUMOVTy2MHoGhOoPqVDt6Dryw4kAESACRGBnEZh5QvXwS0O58u6BfOqugSNUqlA1Sn6ZKT14qJxCZU3peZcfTOko+f3J3hXXFaceKiUdup1pVByNFfi3H\/Vk2uKrbJdfJFQ3rYiWMEEQfcnPlzJjbEI4ttroGZrSd\/ak5qcTASJABIjA9iMw04TqVwtD+fy9A\/n0XQP51AlPqFSlahCq26xCZQmVVajUlN6TttgEVXVgSneEak+TUCnROPb8dHmqagqVdi1GQgWFqoxNgCndlPz+4NoF0WNkyW\/7T2R+IhEgAkSACOwsAjNLqFQJ+sr3B\/Lpk4FQ3ZXKfhmhauvyq3ioXMkv5FBBoUJsQiQgwZTujNuZQuXJxpnXLchPX5seQ5VVqEoPlY1NgOqmr1VTusmhokK1syc1P50IEAEiQAS2H4GZJVSHXhjKZXfnhMqpUyMVqtDlVxKqQ77kp0npakp3hCoY06HoZAqVlvyK0SxOvbl6Qc65aUn+8oFB3L783YF8+bt9+U\/39+Uv7u\/Ll+7z25\/f25c\/0+2evnzRbRvyp3f77QsnN0S3z59cl8\/d5bfPnlgX3a48sSZXHF+TK+5ck89gu6Mnl9\/ek8t0O9aTT+t226pccMvqeEnppUIVDPe1kh8Vqu0\/kfmJRIAIEAEisLMIzCShem1V5DP3DOXyu4dyWVCoLg0lv9JDpVlUGpvQCPZseKj8yBkt+UVChRwqUyKDhyqqOLEklsphv3\/1gpx\/ZN2XIp1ylpcj1TT\/8Ts2XLTDJbebeIdjPt5B9\/VjRxFEulaku6\/JebekUmVMeQ+jc2Cqd8Rw\/4rrVsTomeihMsdTksTooTJk0RnTnSl9kSW\/nT2f+elEgAgQASKwQwjMJKH65hNDR6igUKkhXbv80OmXdfnVcqiOrMlH3OgZa0pPhApkRIlIMqXDQxXM2yY2wccK5ITqXdcsuP1Rbxf2C\/4uLUlGQmXzsgyh0sysOCoH43IMCUTCuyNUqq6NQaiqJb9y9AxKfh2mdCpUO3Q282OJABEgAkRgxxCYOUL18orI5+9LhEoVKiVUjrhoua8s+QWFSlWqSFAOb5JQha44q+b4HKqU1aRdfmrafufVC6IK1RlXnZIP39rz+6WRDiHWATlZlvS5RPcwIgdqWlKo1uV8EKpAApGfBVJ1LgiVGZ3jSWEoXYbhyFahctEJNy6LBpVCdYN\/Cv4wV9IMCpwljfRQ7dj5zA8mAkSACBCBHUJg5gjVvueHcsW9nlCh5BcJ1YmWYM8sKb1t9EwK9oRC5YI9zSw\/NXGDfIB0aLCnJxuBUF2TCJX+v4ZCFYJHa4TKzR005cmY7A5CBSI4dsnPB5Si5FcqVEoQQRLtccVyZjg2V\/JzpnRf8iOh2qGzmR9LBIgAESACO4bATBEqnUf8X34gcoX6pyoeKi2tQQEqR88kD5UlVKnkV5bM1JQek9L3hvl3QdGBkoOkdBCqd6lCZQjVO759Si65Q0uRyUOlZT\/noQpp7tl+jij5nR9KftFDdUtPMg9VQ6Fa8eb6oFBVCRVKfiZfC4QqU6joodqxk5gfTASIABEgAjuPwEwRquffFLkyqFNqSr\/s7qGLTYCHCl1+Vv0pVZ8LoPY0PFS5QgVCNb6HKhi2TclPCZWa3EsP1ShC5cp+NQ9VUfL7EAjVoZ6cezAEkx5YFVXYsGXxDzepJ8zP8kOuFkp+70GXX\/RQFV2M3\/EKnKpTVKh2\/sTmHhABIkAEiMD2IjBThOrYL8SV+2zJT3OoQKgurXmogjcpKVRtw5G9sbvR5RdKfhiObEtjuUK14D1UhUL17j2LjlCBVEFBs6Sv5qFKpvR2D5UlVKXChrIliKHL0zKEKuZqdQR7WoVKPWLOJ8Zgz+09g\/lpRIAIEAEiMBUIzBShuuppVag8qbIKlSala1mtWvILwZ6jTemBUAWFpzbLD34jV\/Krdfldu5iZ0lWhUjVHlTNsrsNPu\/xQ8itjE8wgZ5joo6pmPFRa9tNyH7r8SoUKA57bFKoGoQolPy33lf4wW9LU42GX31Sc29wJIkAEiAAR2EYEZopQ\/c2PSkI1cDlUUKi0kw4KUPQmOUJVyaFqlPz8YGTkOJVEBCWyqFDVCJWSjaLk53xUt2+M3+UXfFRJoVpLXX7wUN1ay6EyhNCSwv0rI4M93Sw\/lPwMoWoEl3L0zDaeuvwoIkAEiAARmCYEZoZQ9foif\/G9vOQHD1WmUAX1R3OebCmtUfIzmU7e2K2z\/FYbs\/xc1IAJwmwnVHUP1du\/dUouOLqeCJXZP5A+u5\/N2IQU7KmmdM3P0rgERCYkhSrkaBkP1dn7fWxC7FbcTMmPSenTdB5zX4gAESACRGCHEZgZQvXmmsgX7vem9OShSgqVG44csp5QTotEJYtNaBk9UwRjxpJfEZvgTNzGuJ3FJlQUKiVUmhtlS36nG+wZu\/xQ8jsYTOmhyy8b8DyGQqUksWFKv27Rj9ZBDpXzUKXw0h3+XvPjiQARIAJEgAhsKwIzQ6he74lceV\/q8tPYBJuU\/qmQlA6PEtSfixqjZ+qxCc6DVChUUdnZ6zvjyhwq9RolQpXIBoI9tdynhEpVJHQgYv9iUnrpoWrkUDVLfg2FSjv8ii6\/mocKxnQtX6KECV9YVN5Q8gujZ9LxpS6\/99+wuK1fYn4YESACRIAIEIGdRmBmCNVrPZHPQaG6B0npPjZBS35QqBoeKtflt9Gc5ec8VKl05tLGs3KZ9x41YxOWJJnSi6T0FoXqw7esRYXqk3f2pV2hyucOwpQek9LhoaqW\/HIPVY1Q+RyqkKmlZcyuYE+MnimCS9WUfsXR5Z3+XvPziQARIAJEgAhsKwIzQ6gW1kS++N1gSg+EKk9K9+NdlFApYYkKVZjllzxUVqEyhAolv5DhhJIfCBW64qyS0zBthw64UqFS31Oj5Gf2MZYmRwR7fgRdfjClI4cKJb8D3liPDCp3DKHk59LSax6qG3T8zFKWAF8L9sRoHSVUVz3S29YvMT+MCBABIkAEiMBOIzAzhEpN6X\/1YDClVwhVLTbhkts3pDvY0xCqMA8PXX4gVCiTgVCphyopVEvyH4PHSFPSlWwomSoJ1cdu28hKfplCZUp+FxlClWb5pZIfTOlxlh88VAj2HJGUbmf5xeMpcqhSCrxX39LxaQ6VP8afvDrY6e81P58IEAEiQASIwLYiMDOESlH7+0eCKb1S8gOhUiVopCn9CIYj9ySGY6pCVXioEIr5XuOhioRqz5I0gj0rJb8zvr3g1DLroYKPCioaFCpLqFJswrrYHKrztFRZlvzaFKqb8+HIvuQX\/GCm5Ie0dCVTkVDBQxUJoydUXz6xsq1fYH4YESACRIAIEIFpQGCmCNV1z\/qSn4Z6fubupindltVAVpoKle3yS7P8zjUlP\/UfIYeqs+QXfEY++LJuStdSmSV7SqaqhMoEkCKENHqoDqcypZYPoVCp2R2xCTYpvbvLr\/BQhZKfJVNZyc94qN53w6L8emE4Dd9r7gMRIAJEgAgQgW1FYKYI1fFfpZR0JVXWQ6Up6UhKV8LSTqgSOVG1JylUwdR986pEQ7dGJjjfkSchviMulPxUoQoqDpLEkSJuS37vuWE5ECo\/IBkeL6uilQpVg1Bh\/iBM6fBQaakvbJZQ1TxUrmOxxUPlYhOQlI5IiFKh+s6iHHt+fVu\/vPwwIkAEiAARIALTgsBMEaqXV0zJzyhUscsvjHixZKVVoWokpSdCFefg7VuRtmBPVXRAqNRnBNP2O69ZzDxUGnEAsoeyn+4f9jEjfsZDVS353ZpKlVmwp4tN8MGeH0RKuhJDNaQ3cqgKhSp4qBoKFbr8vrMoH9i7JCde2JiW7zT3gwgQASJABIjAtiMwU4RK0fvbHw3limhKH4gOR46EqiPYs9Hl15aUDkKyf0WiqpMlpRemdFMS+4Nrm6NnlDhlJb\/g8UIOlapTSaGqxyY0PFQhLV3VNShUMUfLdPopoSrN9e+9aVnUE6amdFXc4J9qBHsGQvWnd6zIszShb\/uJyw8kAkSACBCB6UJg5gjV8V9LJFQYPdM5y8\/lUK2LK6PdVhq8TZdfUHnUf2RLflCoYhAmuvycKb2SQxU6\/c646pRouU\/zsTJCFUfPpLIkCNWFRqGqdflpbIKWKWvBnp5Q9QRdik5lM16wSA5vKhSqG5bdfoJQvW\/vslx8y4p87fs9+eFv+0LH1HSd0NwbIkAEiAAR2BkEZo5QvdET+dID3j9lPVSalG5Laq6UdseGuKT0kEXlTd7WlF4hVEGhykplJllcSVLshMtM6YvyrqLL7we\/6curq2K2oby6WtlWhvJq2F5ZGUq2LQ\/llY7t5eWh1LaXlocyclsaykvF9vrqUNaZirAzZys\/lQgQASJABKYWgZkjVIr0\/ud9Uvrld6dZflYFgj8pKj9mnEssnxXdcq7L7+CqfOBAXaGKuU2BUDkPVTZ6Jh+OfOmtS1P7peCOEQEiQASIABEgAptDYCYJ1cqGyF9+z8cmXHZyILHkpynpZVJ6OcvvqFWoKrEJgVCVCpUlVK481sihCoQqlPwe\/vf+5laK\/5oIEAEiQASIABGYWgRmklAp2vf+RlxsAkzpqlAhh6qhUB2zs\/zy2AR0yzkPkhq6i9EzSBcvCZXLasoUqgX5g2sX5Z3XLMg\/fn91ar8Q3DEiQASIABEgAkRg8wjMLKEaDkX+5fGhqEKlXX6u5BfUKReceUfqnlNDeqPLL5T8kEPlcpzC6BaY0qORu+iKcx4qjU0oPFTa5XfBzUtyqkcr9+a\/qnwHESACRIAIEIHpRWBmCZVCvvz\/cya\/8uAwEKq+XBpyqBrBnscsoQolv0YOlc9xaihUGu5pTOn56JlFl0WFYM9371mU51+jo3t6TwfuGREgAkSACBCByRCYaUKlkGjY5xfv8z6qRpdfdTiyJVS2yy\/M8itM6UhKR8lPU8VrXX5nXb8o3\/81wy8n+5ryXUSACBABIkAEphuBmSdUCv+vF0W+dH+Hh6pW8nOZTmk4Mkp+2dgWTUoPCpUSKj96xhOqPypGz5z4GcnUdJ8K3DsiQASIABEgApMjMBeESuF5ZUXkPz8wcF1+mSm97PI7Yrr8bkkKVTkLDwnjdjgyCJV2+XlT+qKcu29JfsyOvsm\/oXwnESACRIAIEIFdgMDcECpdi4U1kW88Nohz8lpzqI6siU0d\/9ChMMevGNvyfgxHzjxUS+II1fVLcumRZfntAj1Tu+A84C4SASJABIgAETgtBOaKUAGp+34zlM+e7Msl6qEKCpUbPXPUjJ5pBHv2BIOFa8ORdfTMH4fZdzqe5apH1mR1g918wJyvRIAIEAEiQARmGYG5JFS6oL0NkeufGcjlJ\/pujl+KTViX81WhaiFUmIWHkh9m+amH6oP7V+S\/fbcnv3yTRGqWTxoeGxEgAkSACBCBEoG5JVQAYnFd5NafDuSvH\/DhnnH0TDClp2DPPDZBk9KRQ3XRravyzUfW5BdvsLwHXPlKBIgAESACRGCeEJh7QmUX+9cLQzn2Ql+++eiGfPnedbn09nW54PCaINzzw4d6cuHhnnzueE\/+7sE12fPkhjz9KkmUxZA\/EwEiQASIABGYRwRIqDpWfX0g8mZvKK+uDOXl5aG8vjqU5fWhaAo7\/xABIkAEiAARIAJEAAiQUAEJvhIBIkAEiAARIAJEYEIESKgmBI5vIwJEgAgQASJABIgAECChAhJ8JQJEgAgQASJABIjAhAiQUE0IHN9GBIgAESACRIAIEAEgQEIFJPhKBIgAESACRIAIEIEJESChmhA4vo0IEAEiQASIABEgAkCAhApI8JUIEAEiQASIABEgAhMiQEI1IXB8GxEgAkSACBABIkAEgAAJFZDgKxEgAkSACBABIkAEJkSAhGpC4Pg2IkAEiAARIAJEgAgAARIqIMFXIkAEiAARIAJEgAhMiAAJ1YTA8W1EgAgQASJABIgAEQACJFRAgq9EgAgQASJABIgAEZgQARKqCYHj24gAESACRIAIEAEiAARIqIAEX4kAESACRIAIEAEiMCECJFQTAse3EQEiQASIABEgAkQACJBQAQm+EgEiQASIABEgAkRgQgRIqCYEjm8jAkSACBABIkAEiAAQIKECEnwlAkSACBABIkAEiMCECJBQTQgc30YEiAARIAJEgAgQASBAQgUk+EoEiAARIAJEgAgQgQkRIKGaEDi+jQgQASJABIgAESACQICECkjwlQgQASJABIgAESACEyJAQjUhcHwbESACRIAIEAEiQASAAAkVkOArESACRIAIEAEiQAQmRICEakLg+DYiQASIABEgAkSACAABEiogwVciQASIABEgAkSACEyIAAnVhMDxbUSACBABIkAEiAARAAIkVECCr0SACBABIkAEiAARmBABEqoJgePbiAARIAJEgAgQASIABEiogARfiQARIAJEgAgQASIwIQIkVBMCx7cRASJABIgAESACRAAIkFABCb4SASJABIgAESACRGBCBEioJgSObyMCRIAIEAEiQASIABAgoQISfCUCRIAIEAEiQASIwIQIkFBNCBzfRgSIABEgAkSACBABIEBCBST4SgSIABEgAkSACBCBCREgoZoQOL6NCBABIkAEiAARIAJAgIQKSPCVCBABIkAEiAARIAITIkBCNSFwfBsRIAJEgAgQASJABIAACRWQ4CsRIAJEgAgQASJABCZEgIRqQuD4NiJABIgAESACRIAIAAESKiDBVyJABIgAESACRIAITIgACdWEwPFtRIAIEAEiQASIABEAAiRUQIKvRIAIEAEiQASIABGYEAESqgmB49uIABEgAkSACBABIgAESKiABF+JABEgAkSACBABIjAhAiRUEwLHtxEBIkAEiAARIAJEAAiQUAEJvhIBIkAEiAARIAJEYEIESKgmBI5vIwJEgAgQASJABIgAECChAhJ8JQJEgAgQASJABIjAhAiQUE0IHN9GBIgAESACRIAIEAEgQEIFJPhKBIgAESACRIAIEIEJESChmhA4vo0IEAEiQASIABEgAkCAhApI8JUIEAEiQASIABEgAhMiQEI1IXB8GxEgAkSACBABIkAEgAAJFZDgKxEgAkSACBABIkAEJkSAhGpC4Pg2IkAEiAARIAJEgAgAARIqIMFXIkAEiAARIAJEgAhMiAAJ1YTA8W1EgAgQASJABIgAEQACJFRAgq9EgAgQASJABIgAEZgQARKqCYHj24gAESACRIAIEAEiAARIqIAEX4kAESACRIAIEAEiMCECIFT\/QUTexo0Y8DvA7wC\/A\/wO8DvA7wC\/A5v\/Dvw\/TXcbHvKogS8AAAAASUVORK5CYII=",
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
