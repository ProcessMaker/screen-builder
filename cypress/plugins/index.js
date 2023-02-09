const { lighthouse, prepareAudit } = require('@cypress-audit/lighthouse');
const { pa11y } = require("@cypress-audit/pa11y");

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  // include any other plugin code...
  on("before:browser:launch", (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
  });
  on("task", {
    lighthouse: lighthouse(),
    pa11y: pa11y()
  });
  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
