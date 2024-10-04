import "@4tw/cypress-drag-drop";
import { set } from "lodash";
import "cypress-wait-until";
import "@cypress-audit/lighthouse/commands";
import moment from "moment";

Cypress.Commands.add("setPreviewDataInput", (input) => {
  cy.get("#screen-builder-container").then(async (div) => {
    div[0].__vue__.previewInput =
      typeof input === "string" ? input : JSON.stringify(input);
    div[0].__vue__.updateDataInputNow();
  });
});

Cypress.Commands.add(
  "assertPreviewData",
  (expectedData, removeRowIds = true) => {
    cy.wait(500);
    cy.get("#screen-builder-container").then((div) => {
      const data = JSON.parse(JSON.stringify(div[0].__vue__.previewData));
      // recursively remove row_id from data
      if (removeRowIds) {
        const removeRowId = (obj) => {
          if (obj && typeof obj === "object") {
            if (Array.isArray(obj)) {
              obj.forEach(removeRowId);
            } else {
              delete obj.row_id;
              Object.values(obj).forEach(removeRowId);
            }
          }
        };
        removeRowId(data);
      }
      expect(data).to.eql(expectedData);
    });
  }
);

Cypress.Commands.add("setMultiselect", (selector, text, index = 0) => {
  cy.get(`${selector}`).click({ waitForAnimations: true });
  cy.get(`${selector} input`).clear().type(text);
  cy.get(
    `${selector} span:not(.multiselect__option--disabled) span:contains("${text}")`
  )
    .eq(index)
    .click();
});

Cypress.Commands.add("setVueComponentValue", (selector, value) => {
  cy.get(selector).then((div) => {
    div[0].__vue__.$emit("change", value);
  });
});

Cypress.Commands.add("setVueComponentProperty", (selector, property, value) => {
  cy.get(selector).then((div) => {
    set(div[0].__vue__, property, value);
  });
});

Cypress.Commands.add("socketEvent", (event, body) => {
  cy.window().then((win) => {
    win.Echo.eventMocks(event, body);
  });
});

Cypress.Commands.add("socketEventNext", (event, body) => {
  cy.window().then((win) => {
    win.Echo.eventMockNext(event, body);
  });
});
/**
 * Converts Cypress fixtures, including JSON, to a Blob. All file types are
 * converted to base64 then converted to a Blob using Cypress
 * expect application/json. Json files are just stringified then converted to
 * a blob (prevents issues with invalid string decoding).
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 * @return {Promise} Resolves with blob containing fixture contents
 */
function getFixtureBlob(fileUrl, type, c) {
  return type === "application/json"
    ? cy
        .fixture(fileUrl)
        .then(JSON.stringify)
        .then((jsonStr) => new Blob([jsonStr], { type: "application/json" }))
    : cy.fixture(fileUrl, "base64").then(Cypress.Blob.base64StringToBlob);
}

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name uploadFile
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 */
Cypress.Commands.add(
  "uploadFile",
  (selector, fileUrl, type = "", index = 0) => {
    return cy
      .get(selector)
      .eq(index)
      .then((subject) => {
        return getFixtureBlob(fileUrl, type).then((blob) => {
          return cy.window().then((win) => {
            const el = subject[0];
            const nameSegments = fileUrl.split("/");
            const name = nameSegments[nameSegments.length - 1];
            const testFile = new win.File([blob], name, { type });
            const dataTransfer = new win.DataTransfer();
            dataTransfer.items.add(testFile);
            el.files = dataTransfer.files;
            el.dispatchEvent(new Event("change", { bubbles: true }));
            return subject;
          });
        });
      });
  }
);

Cypress.Commands.add("assertComponentValue", (selector, expectedData) => {
  cy.get(selector).then((div) => {
    const data = div[0].__vue__.value;
    expect(data).to.eql(expectedData);
  });
});

/**
 * Compares the content of a control (the content must be a json string) with a provided json object
 */
Cypress.Commands.add("assertComponentValueAsJson", (selector, expectedData) => {
  cy.get(selector).then((div) => {
    const data = JSON.parse(div[0].__vue__.value);
    expect(data).to.eql(expectedData);
  });
});

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name uploadFile
 * @function
 * @param {String} filename - The screen filename to load
 */
Cypress.Commands.add("loadFromJson", (filename, index) => {
  return cy.readFile(`tests/e2e/fixtures/${filename}`).then((content) => {
    cy.window().then((win) => {
      win.exampleScreens = content.screens;
    });
    content.screens.forEach((screen) => {
      cy.intercept(`/api/1.0/screens/${screen.id}`, JSON.stringify(screen));
    });
    if (index !== undefined) {
      const screen = content.screens[index];
      cy.setVueComponentProperty(
        "#screen-builder-container",
        "$refs.builder.config",
        screen.config
      );
      cy.setVueComponentProperty(
        "#screen-builder-container",
        "computed",
        screen.computed
      );
      cy.setVueComponentProperty(
        "#screen-builder-container",
        "watchers",
        screen.watchers
      );
      cy.setVueComponentProperty(
        "#screen-builder-container",
        "customCSS",
        screen.custom_css
      );
      cy.get("#screen-builder-container").then((div) => {
        div[0].__vue__.$refs.builder.migrateConfig(screen.config);
      });
    }
  });
});

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name uploadFile
 * @function
 * @param {String} filename - The screen filename to load
 */
Cypress.Commands.add("mockComponent", (componentName) => {
  return cy.get("#screen-builder-container").then((div) => {
    div[0].__vue__.$root.constructor.component(componentName, {
      template: `<div>MOCK(${componentName})</div>`,
      data() {
        return {};
      }
    });
  });
});

Cypress.Commands.add("pickToday", { prevSubject: true }, (subject) => {
  cy.get(subject).find("input").click();
  cy.get(subject).find(".selectable.today").click();
});

Cypress.Commands.add("pickYesterday", { prevSubject: true }, (subject) => {
  const yesterday = moment().subtract(1, "days").format("YYYY-M-D");
  cy.get(subject).find("input").click();
  cy.get(subject).find(`[data-id="${yesterday}"]`).click();
});

Cypress.Commands.add("pickTomorrow", { prevSubject: true }, (subject) => {
  const tomorrow = moment().add(1, "days").format("YYYY-M-D");
  cy.get(subject).find("input").click();
  cy.get(subject).find(`[data-id="${tomorrow}"]`).click();
});

Cypress.Commands.add(
  "pickTodayWithTime",
  { prevSubject: true },
  (subject, hour, minute, period = "AM") => {
    cy.get(subject).find("input").click();
    cy.get(subject).find(".selectable.today").click();
    cy.get(subject).find(`.vdpHoursInput`).type(`${hour}`);
    cy.get(subject).find(".vdpMinutesInput").type(`{moveToEnd}${minute}`);
    cy.get(subject)
      .find(".vdp12HourToggleBtn")
      .then((toggle) => {
        if (
          toggle.is(".vdp12HourToggleBtn") &&
          !cy.get(".vdp12HourToggleBtn").contains("AM")
        ) {
          cy.get(toggle).click();
        }
      });
    // Ability to escape the datepicker since there's no close command
    cy.get("body").type("{esc}");
  }
);

Cypress.Commands.add(
  "selectOption",
  { prevSubject: true },
  (subject, option) => {
    cy.get(subject).click();
    cy.get(subject).find("input").clear().type(option);
    cy.get(subject)
      .find(
        `span:not(.multiselect__option--disabled) span:contains("${option}"):first`
      )
      .click();
  }
);

Cypress.Commands.add(
  "unselectOption",
  { prevSubject: true },
  (subject, option) => {
    cy.get(subject).click();
    cy.get(subject)
      .find(
        `span:not(.multiselect__option--disabled) span:contains("${option}"):first`
      )
      .click();
  }
);

Cypress.Commands.add("shouldNotHaveValidationErrors", (name, index = 0) => {
  cy.get(`[data-cy=preview-content] [data-cy=${name}]`)
    .eq(index)
    .should("not.have.class", "is-invalid");
});

Cypress.Commands.add("shouldHaveValidationErrors", (name, index = 0) => {
  cy.get(`[data-cy=preview-content] [data-cy=${name}]`)
    .eq(index)
    .should("have.class", "is-invalid");
});

Cypress.Commands.add("showValidationOnLoad", () => {
  cy.window().then((win) => {
    win.vueInstance.$children[0].$refs.renderer.showValidationOnLoad(true);
  });
});

Cypress.Commands.add("openAcordeon", (name) => {
  cy.get(`button[aria-controls='${name}']`).click({
    waitForAnimations: true,
    force: true
  });
});
Cypress.Commands.add("openAcordeonByLabel", (label) => {
  cy.get(`button`).contains(label).click({
    waitForAnimations: true,
    force: true
  });
});

Cypress.Commands.add("openAllAcordeon", () => {
  cy.openAcordeon("collapse-6");
  cy.openAcordeon("collapse-5");
  cy.openAcordeon("collapse-4");
  cy.openAcordeon("collapse-3");
  cy.openAcordeon("collapse-2");
  cy.openAcordeon("collapse-1");
});
