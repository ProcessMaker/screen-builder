import "@cypress/code-coverage/support";

Cypress.on("uncaught:exception", (error) => {
  const isInvalidViteHmrSocket =
    error.message.includes("Failed to construct 'WebSocket'") &&
    error.message.includes("ws://localhost:undefined/");

  return !isInvalidViteHmrSocket;
});
