# ProcessMaker Screen Builder

`@processmaker/screen-builder` is a VueJS powered Screen Builder that produces compatible JSON for our vue-form-renderer.

- [Project setup](#project-setup)
- [Testing](#testing)

## Project setup

Clone the repository and `cd` into the `screen-builder` directory:

```bash
git clone git@github.com:ProcessMaker/screen-builder.git
cd screen-builder
```

Install dependencies using NPM, then run the local development server:

```bash
npm i
npm run serve
```

## Testing

Unit tests are set up using jest and end-to-end tests are set up using Cypress. Tests can be run locally with the following commands:

```bash
# Run the Jest unit test suite
npm test

# Open Cypress to run the end-to-end (e2e) test suite
npm run open-cypress
```
