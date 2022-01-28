import moment from 'moment';
import Screens from '../fixtures/webentry.json';
import SingleScreen from '../fixtures/single_line_input.json';
import InterstitialScreen from '../fixtures/interstitial_screen.json';

describe('Task component', () => {
  let echoMock;
  it.skip('In a webentry', () => {
    cy.server();

    cy.visit('/?scenario=WebEntry', {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, 'WebSocket').callsFake((url) => ({
          url,
          onclose: null,
          onopen: null,
          close(){},
          send(){},
        }));
        win.Echo = {

        };
      },
    });
    cy.wait(2000);
  });

  it.skip('Task inside a Request', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8080/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        created_at: moment().toISOString(),
        completed_at: moment().toISOString(),
        due_at: moment().add(1, 'day').toISOString(),
        user: {
          avatar: '',
          fullname: 'Assigned User',
        },
        screen: Screens.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
          user: {
            avatar: '',
            fullname: 'Requester User',
          },
        },
        process: {
          id: 1,
          name: 'Process Name',
        },
      }
    );

    cy.visit('/?scenario=TaskAssigned', {
      onBeforeLoad(win) {
        // setup request-id=1
        const requestIdMeta = win.document.createElement('meta');
        requestIdMeta.setAttribute('name', 'request-id');
        requestIdMeta.setAttribute('content', '1');
        win.document.head.appendChild(requestIdMeta);
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, 'WebSocket').callsFake((url) => ({
          url,
          onclose: null,
          onopen: null,
          close(){},
          send(){},
        }));
      },
    });

    cy.wait(2000);
    cy.get('[data-cy=screen-field-firstname]').should('be.visible');
    cy.get('[data-cy=screen-field-lastname]').should('be.visible');
  });

  it.skip('Completes the Task', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        created_at: moment().toISOString(),
        completed_at: moment().toISOString(),
        due_at: moment().add(1, 'day').toISOString(),
        user: {
          avatar: '',
          fullname: 'Assigned User',
        },
        screen: Screens.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
          user: {
            avatar: '',
            fullname: 'Requester User',
          },
        },
        process: {
          id: 1,
          name: 'Process Name',
        },
        request_data: {
          firstname: 'John',
          lastname: 'Doe',
        },
      }
    );

    cy.visit('/?scenario=TaskAssigned', {
      onBeforeLoad(win) {
        // setup request-id=1
        const requestIdMeta = win.document.createElement('meta');
        requestIdMeta.setAttribute('name', 'request-id');
        requestIdMeta.setAttribute('content', '1');
        win.document.head.appendChild(requestIdMeta);
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, 'WebSocket').callsFake((url) => ({
          url,
          onclose: null,
          onopen: null,
          close(){},
          send(){},
        }));
        cy.stub(win, 'alert').as('windowAlert');
      },
    });

    cy.wait(2000);
    cy.get('.form-group').find('button').click();
    cy.route('PUT', 'http://localhost:8081/api/1.0/tasks/1').then(function() {
      cy.get('@windowAlert').should('have.been.calledOnce')
        .and('have.been.calledWith', 'Task Completed Successfully')
        .then(function() {
          cy.route(
            'GET',
            'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
            {
              id: 1,
              advanceStatus: 'completed',
              status: 'CLOSED',
            }
          );
          cy.reload();
        });
    });
    cy.get('#tab-form > .card').should('contain.text', 'Task Completed');
  });

  it.skip('Progresses to the interstitial screen', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        created_at: moment().toISOString(),
        completed_at: moment().toISOString(),
        due_at: moment().add(1, 'day').toISOString(),
        status: 'ACTIVE',
        user: {
          avatar: '',
          fullname: 'Assigned User',
        },
        screen: Screens.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
          user: {
            avatar: '',
            fullname: 'Requester User',
          },
        },
        process: {
          id: 1,
          name: 'Process Name',
        },
        request_data: {
          firstname: 'John',
          lastname: 'Doe',
        },
      }
    );
    cy.visit('/?scenario=TaskAssigned', {
      onBeforeLoad(win) {
        // setup request-id=1
        const requestIdMeta = win.document.createElement('meta');
        requestIdMeta.setAttribute('name', 'request-id');
        requestIdMeta.setAttribute('content', '1');
        win.document.head.appendChild(requestIdMeta);
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, 'WebSocket').callsFake((url) => ({
          url,
          onclose: null,
          onopen: null,
          close(){},
          send(){},
        }));
        cy.stub(win, 'alert').as('windowAlert');
      },
    });
    cy.wait(2000);
    cy.get('.form-group').find('button').click();
    cy.route('PUT', 'http://localhost:8081/api/1.0/tasks/1').then(function() {
      cy.get('@windowAlert').should('have.been.calledOnce')
        .and('have.been.calledWith', 'Task Completed Successfully')
        .then(function() {
          cy.route(
            'GET',
            'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
            {
              id: 1,
              advanceStatus: 'completed',
              component: 'task-screen',
              created_at: moment().toISOString(),
              completed_at: moment().toISOString(),
              due_at: moment().add(1, 'day').toISOString(),
              status: 'CLOSED',
              allow_interstitial: true,
              interstitial_screen: InterstitialScreen.screens[0],
              user: {
                avatar: '',
                fullname: 'Assigned User',
              },
              screen: Screens.screens[0],
              process_request: {
                id: 1,
                status: 'CLOSED',
                user: {
                  avatar: '',
                  fullname: 'Requester User',
                },
              },
              process: {
                id: 1,
                name: 'Process Name',
              },
              request_data: {
                firstname: 'John',
                lastname: 'Doe',
              },
            }
          );
          cy.reload();
        });
      cy.wait(2000);
      cy.get('.form-group > :nth-child(1) > div').should('contain.text', 'Please wait');
    });
  });

  /* DNAT = Display Next Assigned Task

   parentTask1                                           parentTask2
              \_______childTask1_______childTask2_______/
                        (DNAT)

   After childTask1 should redirect to childTask2
  */
  it('Task with display next assigned task checked with another pending task in same request should redirect to the next task of same request', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
        },
      }
    );

    cy.visit('/?scenario=TaskRedirect', {
      onLoad(win) {
        echoMock = win.Echo;
      },
    });

    cy.wait(2000);
    cy.get('.form-group').find('button').click();

    cy.route('PUT', 'http://localhost:8081/api/1.0/tasks/1').then(function() {
      let responseDataTask1 = {
        'status': 'CLOSED',
        'process_request_id': 2,
        'id': 1,
        'screen': SingleScreen.screens[0],
        'allow_interstitial': true,
        'interstitial_screen': InterstitialScreen.screens[0],
      };

      getTask(
        'http://localhost:8081/api/1.0/tasks/'+responseDataTask1['id']+'?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
        responseDataTask1
      );

      let responseDataTasks = {
        'status': 'ACTIVE',
        'taskId': 2,
        'process_request_id': 2,
      };

      getTasks(
        'http://localhost:8081/api/1.0/tasks?user_id=1&status=ACTIVE&process_request_id=1&include_sub_tasks=1',
        responseDataTasks
      );

      let responseDataTask2 = {
        'status': 'ACTIVE',
        'process_request_id': 2,
        'parent_request_id': 1,
        'taskId': 2,
        'screen': Screens.screens[0],
        'allow_interstitial': false,
        'interstitial_screen': null,
      };

      getTask(
        'http://localhost:8081/api/1.0/tasks/'+responseDataTask2['taskId']+'?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
        responseDataTask2
      );

      cy.wait(2000);
      cy.reload();
    });

    cy.socketEvent('ProcessMaker\\Events\\ProcessUpdated', {
      requestId: 1,
      event: 'ACTIVITY_ACTIVATED',
    });

    cy.url().should('eq', 'http://localhost:8081/tasks/2/edit');
  });

  /* DNAT = Display Next Assigned Task

   parentTask1                           parentTask2
              \_______childTask1_______/
                        (DNAT)

   After childTask1 should redirect to parentTask2
  */
  it('Task with display next assigned task checked in different process request should redirect to the next task of parent request', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
        },
      }
    );

    cy.visit('/?scenario=TaskRedirect', {
      onLoad(win) {
        echoMock = win.Echo;
      },
    });

    cy.wait(2000);
    cy.get('.form-group').find('button').click();

    cy.route('PUT', 'http://localhost:8081/api/1.0/tasks/1').then(function() {
      let responseDataTask1 = {
        'status': 'CLOSED',
        'process_request_id': 1,
        'id': 1,
        'screen': SingleScreen.screens[0],
        'allow_interstitial': true,
        'interstitial_screen': InterstitialScreen.screens[0],
      };

      getTask(
        'http://localhost:8081/api/1.0/tasks/'+responseDataTask1['id']+'?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
        responseDataTask1
      );

      let responseDataTasks = {
        'status': 'ACTIVE',
        'taskId': 2,
        'process_request_id': 2,
      };

      getTasks(
        'http://localhost:8081/api/1.0/tasks?user_id=1&status=ACTIVE&process_request_id=1&include_sub_tasks=1',
        responseDataTasks
      );

      let responseDataTask2 = {
        'status': 'ACTIVE',
        'process_request_id': 1,
        'taskId': 2,
        'screen': Screens.screens[0],
        'allow_interstitial': false,
        'interstitial_screen': null,
      };

      getTask(
        'http://localhost:8081/api/1.0/tasks/'+responseDataTask2['taskId']+'?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
        responseDataTask2
      );

      cy.wait(2000);
      cy.reload();
    });

    cy.socketEvent('ProcessMaker\\Events\\ProcessUpdated', {
      requestId: 1,
      event: 'ACTIVITY_ACTIVATED',
    });

    cy.url().should('eq', 'http://localhost:8081/tasks/2/edit');
  });

  /* DNAT = Display Next Assigned Task

   parentTask1                           parentTask2
              \_______childTask1_______/

   After childTask1 (Not DNAT) should redirect to tasks list
  */
  it('Task with display next assigned task unchecked should redirect to tasks list', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
        },
      }
    );

    cy.visit('/?scenario=TaskRedirect', {
      onLoad(win) {
        echoMock = win.Echo;
      },
    });

    cy.wait(2000);
    cy.get('.form-group').find('button').click();

    cy.route('PUT', 'http://localhost:8081/api/1.0/tasks/1').then(function() {
      let responseDataTask1 = {
        'status': 'CLOSED',
        'process_request_id': 1,
        'id': 1,
        'screen': SingleScreen.screens[0],
        'allow_interstitial': false,
        'interstitial_screen': null,
      };

      getTask(
        'http://localhost:8081/api/1.0/tasks/'+responseDataTask1['id']+'?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
        responseDataTask1
      );

      cy.wait(2000);
      cy.reload();
    });

    cy.socketEvent('ProcessMaker\\Events\\ProcessUpdated', {
      requestId: 1,
      event: 'ACTIVITY_ACTIVATED',
    });

    cy.url().should('eq', 'http://localhost:8081/tasks');
  });

  /* DNAT = Display Next Assigned Task

   parentTask1_____________________endEvent
     (DNAT)

   After parentTask1 and not pending tasks should redirect to same request
  */
  it('Process without pending task should redirect to request', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        screen: SingleScreen.screens[0],
        process_request: {
          id: 1,
          status: 'ACTIVE',
        },
      }
    );

    cy.visit('/?scenario=TaskRedirect', {
      onLoad(win) {
        echoMock = win.Echo;
      },
    });

    cy.wait(2000);
    cy.get('.form-group').find('button').click();

    cy.route('PUT', 'http://localhost:8081/api/1.0/tasks/1').then(function() {
      let responseDataTask1 = {
        'status': 'CLOSED',
        'process_request_id': 1,
        'id': 1,
        'screen': SingleScreen.screens[0],
        'allow_interstitial': true,
        'interstitial_screen': InterstitialScreen.screens[0],
      };

      getTask(
        'http://localhost:8081/api/1.0/tasks/'+responseDataTask1['id']+'?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
        responseDataTask1
      );

      getTasks('http://localhost:8081/api/1.0/tasks?user_id=1&status=ACTIVE&process_request_id=1&include_sub_tasks=1');

      cy.wait(2000);
      cy.reload();
    });

    cy.socketEvent('ProcessMaker\\Events\\ProcessUpdated', {
      requestId: 1,
      event: 'ACTIVITY_ACTIVATED',
    });

    cy.url().should('eq', 'http://localhost:8081/requests/1');
  });

  /* DNAT = Display Next Assigned Task

   parentTask1                           endEvent
              \_______childTask1_______/
                       (DNAT)

   After childTask1 and not pending tasks should redirect to parent Request
  */
  it('Subprocess without pending task should redirect to parent request', () => {
    cy.server();
    cy.route(
      'GET',
      'http://localhost:8081/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
      {
        id: 1,
        advanceStatus: 'open',
        component: 'task-screen',
        screen: SingleScreen.screens[0],
        process_request: {
          id: 2,
          status: 'ACTIVE',
          parent_request_id: 1,
        },
      }
    );

    cy.visit('/?scenario=TaskRedirect', {
      onLoad(win) {
        echoMock = win.Echo;
      },
    });

    cy.wait(2000);
    cy.get('.form-group').find('button').click();

    cy.route('PUT', 'http://localhost:8081/api/1.0/tasks/1').then(function() {
      let responseDataTask1 = {
        'status': 'CLOSED',
        'process_request_id': 2,
        'parent_request_id': 3,
        'id': 1,
        'screen': SingleScreen.screens[0],
        'allow_interstitial': true,
        'interstitial_screen': InterstitialScreen.screens[0],
      };

      getTask(
        'http://localhost:8081/api/1.0/tasks/'+responseDataTask1['id']+'?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
        responseDataTask1
      );

      getTasks('http://localhost:8081/api/1.0/tasks?user_id=1&status=ACTIVE&process_request_id=1&include_sub_tasks=1');

      cy.wait(2000);
      cy.reload();
    });

    cy.socketEvent('ProcessMaker\\Events\\ProcessUpdated', {
      requestId: 1,
      event: 'ACTIVITY_ACTIVATED',
    });

    cy.url().should('eq', 'http://localhost:8081/requests/3');
  });
});

function getTask(url, responseData) {
  cy.route(
    'GET',
    url,
    {
      id: responseData['id'],
      advanceStatus: 'completed',
      component: 'task-screen',
      status: responseData['status'],
      allow_interstitial: responseData['allow_interstitial'],
      interstitial_screen: responseData['interstitial_screen'],
      screen: responseData['screen'],
      process_request: {
        id: 1,
        parent_request_id: responseData['parent_request_id'],
        status: responseData['status'],
      },
    }
  );
}
function getTasks(url, responseData = null) {
  if (responseData) {
    cy.route(
      'GET',
      url,
      {
        data:
        [
          {
            id: responseData['taskId'],
            advanceStatus: 'open',
            process_id: 1,
            process_request_id: responseData['process_request_id'],
            subprocess_request_id: 1,
            status: responseData['status'],
            completed_at: null,
            due_at: moment().add(1, 'day').toISOString(),
            due_notified: 0,
            process_request: {
              id: 1,
              status: responseData['status'],
            },
          },
        ],
      }
    );
  } else {
    cy.route('GET', url, {data:[]});
  }
}
