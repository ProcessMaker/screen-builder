import moment from 'moment';
import Screens from '../fixtures/webentry.json';
import InterstitialScreen from '../fixtures/interstitial_screen.json';

describe('Task component', () => {
  it('In a webentry', () => {
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

  it('Task inside a Request', () => {
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

  it('Completes the Task', () => {
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
    cy.route('PUT', 'http://localhost:8080/api/1.0/tasks/1').then(function() {
      cy.get('@windowAlert').should('have.been.calledOnce')
        .and('have.been.calledWith', 'Task Completed Successfully')
        .then(function() {
          cy.route(
            'GET',
            'http://localhost:8080/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
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

  it('Progresses to the interstitial screen', () => {
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
    cy.route('PUT', 'http://localhost:8080/api/1.0/tasks/1').then(function() {
      cy.get('@windowAlert').should('have.been.calledOnce')
        .and('have.been.calledWith', 'Task Completed Successfully')
        .then(function() {
          cy.route(
            'GET',
            'http://localhost:8080/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition,nested',
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
});
