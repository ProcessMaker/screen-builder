import path from "path";

/**
 * This method is responsible to add a control inside the screen
 * @param controlName: control's label
 * @return nothing returns
 */
export function addControl(controlName) {
  cy.window().then((win) => {
    win.testing.addControlByLabel(controlName);
  });
}

/**
 * This method is responsible to add a control inside the loop
 * @param numLoop: num of loop
 * @param control: control's selector
 * @return nothing returns
 */
export function addControlInsideLoop(numLoop, control) {
  cy.get(control).drag(
    "[data-cy=screen-element-container] .column-draggable div"
  );
  cy.get("[data-cy=screen-element-container]").last().click();
}

/**
 * This method is responsible to preview the screen
 * @return nothing returns
 */
export function previewScreen() {
  cy.get('[data-cy="mode-preview"]').should("be.visible");
  cy.get('[data-cy="mode-preview"]').click();
  cy.get('[id="showDataInput"]').should("be.visible");
}

/**
 * This method is responsible to select preview the screen "Web or Mobile"
 * @return nothing returns
 */
export function previewScreenWebMobile(mode) {
  const selectorMode = '[data-cy="device-screen-mode-button"]'.replace(
    "mode",
    mode
  );
  cy.get(selectorMode).should("be.visible").click();
  cy.get(selectorMode).should("have.class", "btn btn-secondary");
}

/**
 * This method is responsible to add a control inside the table
 * @param numColumn: num of column
 * @param control: control's selector
 * @return nothing returns
 */
export function addControlInsideTable(numColumn, control) {
  const column =
    '[data-cy=screen-element-container] >* div[class^= "column-draggable"]:nth-child(numColumn)'.replace(
      "numColumn",
      numColumn
    );
  cy.get(control).drag(
    '[data-cy=screen-element-container] >* div[class^= "column-draggable"]:nth-child(2)'
  );
  cy.get("[data-cy=screen-element-container]").last().click();
}

/**
 * This method is responsible to go to designer mode
 * @return nothing returns
 */
export function goToDesigner() {
  cy.get('[data-cy="mode-editor"]').should("be.visible");
  cy.get('[data-cy="mode-editor"]').click();
  cy.get('[id="screen-container"]').should("be.visible");
}

/**
 * This method is responsible to wait until elemnt is visible
 * @param selector: selector of element like: ([data.cy="id2"])
 * @param maxAttempts: # to try , 10 by default
 * @param attempts: it is not change
 * @return nothing returns
 */
export function waitUntilElementIsVisible(
  selector,
  maxAttempts = 10,
  attempts = 0
) {
  if (attempts > maxAttempts) {
    throw new Error("Timed out waiting for report to be generated");
  }
  cy.wait(500);
  cy.get("body").then(($body) => {
    if ($body.find(selector).length <= 0) {
      waitUntilElementIsVisible(selector, maxAttempts, attempts + 1);
    }
  });
}

export const validateImage = (downloadedFilename) => {
  const downloadsFolder = Cypress.config("downloadsFolder");

  if (!downloadedFilename) {
    throw new Error("Filename wasn't provided");
  }

  const filename = path.join(downloadsFolder, downloadedFilename);

  // ensure the file has been saved before trying to parse it
  cy.readFile(filename, "binary", { timeout: 15000 }).should((buffer) => {
    // by having length assertion we ensure the file has text
    // since we don't know when the browser finishes writing it to disk

    // Tip: use expect() form to avoid dumping binary contents
    // of the buffer into the Command Log
    expect(buffer.length).to.be.gt(1000);
  });
};
