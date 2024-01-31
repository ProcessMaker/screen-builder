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

  it("should convert the date from ther users timezone to UTC", () => {
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
    const todaysDate = moment();
    const todayDateChanged = `${moment
      .tz(todaysDate, "America/Los_Angeles")
      .format("YYYY-MM-DD")}T20:15:00`;
    const today = moment(todayDateChanged).utc();
    cy.log("today", today.toISOString());

    cy.assertPreviewData({
      form_date_picker_1: moment(today).toISOString()
    });
  });
});
