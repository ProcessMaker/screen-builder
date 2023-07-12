import {nodeControls} from './constants';

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
  cy.get(control).drag('[data-cy=screen-element-container] .column-draggable div');
  cy.get('[data-cy=screen-element-container]').last().click();
}

/**
 * This method is responsible to preview the screen
 * @return nothing returns
 */
export function previewScreen() {
  cy.get('[data-cy="mode-preview"]').should('be.visible');
  cy.get('[data-cy="mode-preview"]').click();
  cy.get('[id="showDataInput"]').should('be.visible');
}

/**
 * This method is responsible to select preview the screen "Web or Mobile"
 * @return nothing returns
 */
export function previewScreenWebMobile(mode) {
  let selectorMode = '[data-cy="device-screen-mode-button"]'.replace('mode',mode);
  cy.get(selectorMode).should('be.visible').click();
  cy.get(selectorMode).should('have.class', 'btn btn-secondary');
}

/**
 * This method is responsible to add a control inside the table
 * @param numColumn: num of column
 * @param control: control's selector
 * @return nothing returns
 */
export function addControlInsideTable(numColumn, control) {
  let column = '[data-cy=screen-element-container] >* div[class^= "column-draggable"]:nth-child(numColumn)'
    .replace('numColumn',numColumn);
  cy.get(control).drag('[data-cy=screen-element-container] >* div[class^= "column-draggable"]:nth-child(2)');
  cy.get('[data-cy=screen-element-container]').last().click();
}

/**
 * This method is responsible to go to designer mode
 * @return nothing returns
 */
export function goToDesigner() {
  cy.get('[data-cy="mode-editor"]').should('be.visible');
  cy.get('[data-cy="mode-editor"]').click();
  cy.get('[id="screen-container"]').should('be.visible');
}
