import '@4tw/cypress-drag-drop';

Cypress.Commands.add('setPreviewDataInput', (input) => {
  cy.get('#screen-builder-container').then((div) => {
    div[0].__vue__.previewInput = input;
  });
});
