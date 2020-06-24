import '@4tw/cypress-drag-drop';

Cypress.Commands.add('setPreviewDataInput', (input) => {
  cy.get('#screen-builder-container').then((div) => {
    div[0].__vue__.previewInput = input;
  });
});

Cypress.Commands.add('assertPreviewData', (expectedData) => {
  cy.get('#screen-builder-container').then((div) => {
    const data = div[0].__vue__.previewData;
    expect(data).to.eql(expectedData);
  });
});

Cypress.Commands.add('setMultiselect', (selector, text) => {
  cy.get(`${selector}`).click();
  cy.get(`${selector} span:contains("${text}"):first`).click();
});

Cypress.Commands.add('setVueComponentValue', (selector, value) => {
  cy.get(selector).then((div) => {
    div[0].__vue__.$emit('change', value);
  });
});
