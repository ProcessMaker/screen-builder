const { lighthouse, prepareAudit } = require('cypress-audit');

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));
  // cypress-audit: Setup the lighthouse plugin
  on("before:browser:launch", (_browser, launchOptions) => {
    prepareAudit({ args: Array.isArray(launchOptions) ? launchOptions : [] });
  });
  on("task", {
    lighthouse: lighthouse((lighthouseReport) => {
      const keys = Object.keys(lighthouseReport.lhr.categories);
      const results = keys.map((key) => {
        return `${key}: ${lighthouseReport.lhr.categories[key].score * 100}`;
      });
      // cy.postGithubComment("## " + results.join("\n"));
      const url = lighthouseReport.artifacts.URL.requestedUrl;
      // get title from search params from url
      const title = new URL(url).searchParams.get("title");
      const header = `## lighthouse test\n**${title}**\n\n`;
      const report = `${header}${results.join("\n")}`;
      cy.postGithubComment(report);
    })
  });
  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js',
  });
};
