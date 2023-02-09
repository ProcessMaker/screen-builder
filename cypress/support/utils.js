import path from "path";

export const validateImage = (downloadedFilename) => {
  const downloadsFolder = Cypress.config('downloadsFolder')

  if (!downloadedFilename) {
    throw new Error("Filename wasn't provided");
  }

  downloadedFilename = path.join(downloadsFolder, downloadedFilename)

  // ensure the file has been saved before trying to parse it
  cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
    .should((buffer) => {
      // by having length assertion we ensure the file has text
      // since we don't know when the browser finishes writing it to disk

      // Tip: use expect() form to avoid dumping binary contents
      // of the buffer into the Command Log
      expect(buffer.length).to.be.gt(1000)
    })
}
