/* eslint-disable no-param-reassign */
import moment from "moment-timezone";

describe("Date Picker", () => {
  const timezoneTest = "America/Los_Angeles";

  it("DateTime type", () => {
    cy.visit("/");
    cy.window().then((win) => {
      win.ProcessMaker.user.timezone = timezoneTest;
    });

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

    const todayDateChanged = `${moment().format("YYYY-MM-DD")}T20:15:00`;
    const today = moment.tz(todayDateChanged, timezoneTest);

    cy.assertPreviewData({
      form_date_picker_1: today.toISOString()
    });
  });
});
