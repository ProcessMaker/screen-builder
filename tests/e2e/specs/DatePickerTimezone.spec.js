/* eslint-disable no-param-reassign */
import moment from "moment-timezone";
const timezoneTest = "America/Los_Angeles";
moment.tz.setDefault(timezoneTest);

describe("Date Picker", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.openAcordeon("collapse-1");
    cy.window().then((win) => {
      win.ProcessMaker.user.timezone = timezoneTest;
    });
  });

  it("DateTime type", () => {
    cy.get("[data-cy=controls-FormDatePicker]").drag(
      "[data-cy=screen-drop-zone]",
      "bottom"
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.setMultiselect("[data-cy=inspector-dataFormat]", "Datetime");
    cy.get("[data-cy=mode-preview]").click();
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] input"
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .selectable.today"
    ).click();
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .vdpHoursInput"
    ).type("8");
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .vdpMinutesInput"
    ).type("{moveToEnd}15");
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .vdp12HourToggleBtn"
    ).then((toggle) => {
      if (toggle.is(".vdp12HourToggleBtn")) {
        cy.get(toggle).click();
      }
    });

    cy.wait(500);

    let todayDateChanged = `${moment().format("YYYY-MM-DD")}T20:15:00`;
    let today = moment.tz(todayDateChanged, timezoneTest);

    cy.get('input[aria-label="New Date Picker"]').invoke('val')
      .then(dateVal => {
        let today2 = moment.tz(dateVal, timezoneTest);
        let todayA = today;
        let todayB = today;
        todayA = todayA.toISOString().substr(0,7);
        todayB = todayB.toISOString().substr(13,(today.toISOString().length-1));
        let datePicker = today2.toISOString();
        expect(datePicker).to.contains(todayA);
        expect(datePicker).to.contains(todayB);
      });
  });
});
