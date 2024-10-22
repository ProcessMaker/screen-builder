import ClipboardManager from "../../../src/store/modules/ClipboardManager";

describe("Clipboard backward compatibility", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("FOUR-19630: Check clipboard with a screen from a previous version", () => {
    ClipboardManager.saveToLocalStorage([]);
    cy.loadFromJson("UUID_compatibility.json", 1);

    // for each control, check if it can be added to the clipboard
    cy.get('.control-item').each(($el, index) => {
      cy.wrap($el).click({ force: true });
      cy.get('[data-cy="addToClipboard"]').click({ force: true });
      cy.get('[data-cy="addToClipboard"]').should("not.exist").then(() => {
        // Verify it was added to the clipboard storage
        const content = ClipboardManager.loadFromLocalStorage();
        expect(content.length).to.equal(index + 1);
      });
    });

    // Go to second page
    cy.get('[data-test="page-dropdown"] button').click({force: true});
    cy.get('[data-test="page-popup"]').click({force: true});
    cy.wait(1000);
    const elementsAddedFromMainPage = 17;

    // check if each control in the second page can be added to the clipboard
    cy.get('.control-item').each(($el, index) => {
      cy.wrap($el).click({ force: true });
      cy.get('[data-cy="addToClipboard"]').click({ force: true });
      cy.get('[data-cy="addToClipboard"]').should("not.exist").then(() => {
        // Verify it was added to the clipboard storage
        const content = ClipboardManager.loadFromLocalStorage();
        expect(content.length).to.equal(elementsAddedFromMainPage + index + 1);
      });
    });
  });
});
