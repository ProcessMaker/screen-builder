import moment from 'moment';
import Screens from '../fixtures/webentry.json';

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
      'http://localhost:8080/api/1.0/tasks/1?include=data,user,requestor,processRequest,component,screen,requestData,bpmnTagName,interstitial,definition',
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
});
