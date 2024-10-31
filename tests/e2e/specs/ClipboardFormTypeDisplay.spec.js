import ClipboardManager from "../../../src/store/modules/ClipboardManager";

describe("Clipboard Form Type Display", () => {
  before(() => {
    // Visit the home page and load the JSON data before the tests
    cy.visit('/');
    cy.loadFromJson('displayScreenNext.json', 0, 'display');
  });

  const checkAddToClipboardNotExist = (childIndex) => {
    cy.get(`:nth-child(${childIndex}) > [data-cy="screen-element-container"]`)
      .click({ force: true });
    cy.get('[data-cy="addToClipboard"]').should("not.exist");
  };

  it("Verify add clipboard button does not exist in display mode", () => {
    // Verify that the button does not exist for specific child elements
    checkAddToClipboardNotExist(2);
    checkAddToClipboardNotExist(3);
    checkAddToClipboardNotExist(2); // This seems redundant; if necessary, ensure it's intentional
  });
});