/* eslint-disable no-param-reassign */

describe("Date Picker", () => {
  beforeEach(() => {
    // Set date to midnight January 1, 2024.
    // The timezone is UTC. We set it to UTC in package.json `TZ=UTC`
    cy.clock(new Date(2024, 0, 0, 0, 0, 0), ['Date']);
    cy.visit("/");
    cy.openAcordeon("collapse-1");

    // Set the User's timezone to Los Angeles. This is what DatePicker will use
    cy.window().then((win) => {
      win.ProcessMaker.user.timezone = "America/Los_Angeles";
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
    // Choose today. In Los Angeles, that would be December 31, 2023
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .selectable.today"
    ).click();
    // Set time to 8:15 PM Los Angeles time
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .vdpHoursInput"
    ).type("8");
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .vdpMinutesInput"
    ).type("{moveToEnd}15");
    cy.get(
      "[data-cy=preview-content] [data-cy='screen-field-form_date_picker_1'] .vdp12HourToggleBtn"
    ).then((toggle) => {
      // Change to AM/PM - Time is now 8:15 PM, Los Angeles time
      if (toggle.is(".vdp12HourToggleBtn")) {
        cy.get(toggle).click();
      }
    });

    cy.assertPreviewData({
      // 8:15 PM on December 31, 2023 in Los Angeles is 04:15 (4:15am) the next day (January 1, 2024) in UTC
      form_date_picker_1: "2024-01-01T04:15:00.000Z"
    });
  });
});
