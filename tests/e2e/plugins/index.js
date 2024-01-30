const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const { pa11y } = require("@cypress-audit/pa11y");
const globby = require("globby");

module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);
  // include any other plugin code...
  on("before:browser:launch", (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
  });
  on("task", {
    lighthouse: lighthouse(),
    pa11y: pa11y(),
    // a task to find one file matching the given mask
    // returns just the first matching file
    async findFiles(mask) {
      if (!mask) {
        throw new Error("Missing a file mask to search");
      }

      console.log("searching for files %s", mask);
      const list = await globby(mask);

      if (!list.length) {
        console.log("found no files");

        return null;
      }

      console.log("found %d files, first one %s", list.length, list[0]);

      return list[0];
    }
  });
  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
