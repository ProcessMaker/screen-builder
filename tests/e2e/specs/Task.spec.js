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

  it('In a Process Task', () => {
    cy.server();

    cy.visit('/?scenario=TaskAssigned', {
      onBeforeLoad(win) {
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
  });
});
