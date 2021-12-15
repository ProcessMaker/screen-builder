import '@4tw/cypress-drag-drop';
import { set } from 'lodash';
import 'cypress-wait-until';

Cypress.Commands.add('setPreviewDataInput', (input) => {
  cy.get('#screen-builder-container').then((div) => {
    div[0].__vue__.previewInput = typeof input === 'string' ? input : JSON.stringify(input);
  });
});

Cypress.Commands.add('assertPreviewData', (expectedData) => {
  cy.get('#screen-builder-container').then((div) => {
    const data = div[0].__vue__.previewData;
    expect(data).to.eql(expectedData);
  });
});

Cypress.Commands.add('setMultiselect', (selector, text, index = 0) => {
  cy.get(`${selector}`).click();
  cy.get(`${selector} input`).clear().type(text);
  cy.get(`${selector} span:not(.multiselect__option--disabled) span:contains("${text}")`).eq(index).click();
});

Cypress.Commands.add('setVueComponentValue', (selector, value) => {
  cy.get(selector).then((div) => {
    div[0].__vue__.$emit('change', value);
  });
});

Cypress.Commands.add('setVueComponentProperty', (selector, property, value) => {
  cy.get(selector).then((div) => {
    set(div[0].__vue__, property, value);
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
function getFixtureBlob(fileUrl, type) {
  return type === 'application/json'
    ? cy
      .fixture(fileUrl)
      .then(JSON.stringify)
      .then(jsonStr => new Blob([jsonStr], { type: 'application/json' }))
    : cy.fixture(fileUrl, 'base64').then(Cypress.Blob.base64StringToBlob);
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
Cypress.Commands.add('uploadFile', (selector, fileUrl, type = '') => {
  return cy.get(selector).then(subject => {
    return getFixtureBlob(fileUrl, type).then(blob => {
      return cy.window().then(win => {
        const el = subject[0];
        const nameSegments = fileUrl.split('/');
        const name = nameSegments[nameSegments.length - 1];
        const testFile = new win.File([blob], name, { type });
        const dataTransfer = new win.DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return subject;
      });
    });
  });
});

Cypress.Commands.add('assertComponentValue', (selector, expectedData) => {
  cy.get(selector).then((div) => {
    const data = div[0].__vue__.value;
    expect(data).to.eql(expectedData);
  });
});

/**
 * Compares the content of a control (the content must be a json string) with a provided json object
 */
Cypress.Commands.add('assertComponentValueAsJson', (selector, expectedData) => {
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
Cypress.Commands.add('loadFromJson', (filename, index) => {
  return cy.readFile(`tests/e2e/fixtures/${filename}`).then((content) => {
    content.screens.forEach(screen => {
      cy.route(`/api/1.0/screens/${screen.id}`, JSON.stringify(screen));
    });
    if (index !== undefined) {
      const screen = content.screens[index];
      cy.setVueComponentProperty('#screen-builder-container', '$refs.builder.config', screen.config);
      cy.setVueComponentProperty('#screen-builder-container', 'computed', screen.computed);
      cy.setVueComponentProperty('#screen-builder-container', 'watchers', screen.watchers);
      cy.setVueComponentProperty('#screen-builder-container', 'customCSS', screen.custom_css);
      cy.get('#screen-builder-container').then(div => {
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
Cypress.Commands.add('mockComponent', (componentName) => {
  return cy.get('#screen-builder-container').then((div) => {
    div[0].__vue__.$root.constructor.component(componentName, {
      template: `<div>MOCK(${componentName})</div>`,
      data() {
        return {};
      },
    });
  });
});

Cypress.Commands.add('pickToday', { prevSubject: true }, (subject) => {
  cy.get(subject).find('input').click();
  cy.get(subject).find('.day.today').click();
});

Cypress.Commands.add('pickYesterday', { prevSubject: true }, (subject) => {
  cy.get(subject).find('input').click();
  cy.get(subject).find('.day.today').prev().click();
});

Cypress.Commands.add('pickTomorrow', { prevSubject: true }, (subject) => {
  cy.get(subject).find('input').click();
  cy.get(subject).find('.day.today').next().click();
});

Cypress.Commands.add('pickTodayWithTime', { prevSubject: true }, (subject, hour, minute, period='AM') => {
  cy.get(subject).find('input').click();
  cy.get(subject).find('.day.today').click();
  cy.get(subject).find('[data-action="togglePicker"]').click();
  cy.get(subject).find('[data-action="showHours"]').click();
  cy.get(subject).find(`[data-action="selectHour"]:contains(${hour})`).click();
  cy.get(subject).find('[data-action="showMinutes"]').click();
  cy.get(subject).find(`[data-action="selectMinute"]:contains(${minute})`).click();
  cy.get(subject).find('[data-action="togglePeriod"]').then(toggle => {
    if (!toggle.is(`:contains(${period})`)) {
      cy.get(toggle).click();
    }
  });
  cy.get(subject).find('[data-action="close"]').click();
});

Cypress.Commands.add('selectOption', { prevSubject: true }, (subject, option) => {
  cy.get(subject).click();
  cy.get(subject).find('input').clear().type(option);
  cy.get(subject).find(`span:not(.multiselect__option--disabled) span:contains("${option}"):first`).click();
});

Cypress.Commands.add('unselectOption', { prevSubject: true }, (subject, option) => {
  cy.get(subject).click();
  cy.get(subject).find(`span:not(.multiselect__option--disabled) span:contains("${option}"):first`).click();
});
