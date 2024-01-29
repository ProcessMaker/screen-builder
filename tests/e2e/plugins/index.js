const { lighthouse, prepareAudit } = require("cypress-audit");

module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);
  on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));
  // cypress-audit: Setup the lighthouse plugin
  on("before:browser:launch", (_browser, launchOptions) => {
    prepareAudit({ args: Array.isArray(launchOptions) ? launchOptions : [] });
  });
  on("task", {
    lighthouse: lighthouse()
  });
  return config;
};
