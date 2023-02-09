const { lighthouse, prepareAudit } = require('cypress-audit');

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  // include any other plugin code...
  on("before:browser:launch", (_browser, launchOptions) => {
    prepareAudit({ args: Array.isArray(launchOptions) ? launchOptions : [] });
  });
  on("task", {
    lighthouse: lighthouse()
  });
  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
