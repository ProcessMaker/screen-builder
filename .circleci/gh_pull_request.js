const https = require('https')

async function main() {
  // curl --location --request GET "https://api.github.com/repos/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/pulls?head=$CIRCLE_PROJECT_USERNAME:$CIRCLE_BRANCH&state=open" -u $GH_USER:$GH_TOKEN
  // get pull request from github API
  const CIRCLE_PROJECT_USERNAME = process.env.CIRCLE_PROJECT_USERNAME;
  const CIRCLE_PROJECT_REPONAME = process.env.CIRCLE_PROJECT_REPONAME;
  const CIRCLE_BRANCH = process.env.CIRCLE_BRANCH;
  const GH_USER = process.env.GH_USER;
  const GH_TOKEN = process.env.GH_TOKEN;
  const basicToken = Buffer.from(`${GH_USER}:${GH_TOKEN}`).toString('base64');
  const url = `https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls?head=${CIRCLE_PROJECT_USERNAME}:${CIRCLE_BRANCH}&state=open`;
  // get pull request from github API
  const input = await new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'curl/7.64.1',
        Authorization: `Basic ${basicToken}`,
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });
  });
  const pr = JSON.parse(input);
  console.log(pr[0].comments_url);
}
main();
