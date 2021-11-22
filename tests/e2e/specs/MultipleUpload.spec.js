
describe('Multiple Upload', () => {

  beforeEach(() => {
    cy.server();
    cy.visit('/');
    cy.window().then(win => {
      // Add request-id header
      const requestIdMeta = window.document.createElement('meta');
      requestIdMeta.setAttribute('name', 'request-id');
      requestIdMeta.setAttribute('content', '1');
      win.document.head.appendChild(requestIdMeta);
    });
  });

  it('Upload a Single File', () => {
    cy.loadFromJson('multiple_upload.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Upload single file should show the uploaded file name
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-filesingle] input[type=file]', 'avatar.jpeg', 'image/jpg');
    cy.get('[data-cy=avatar-jpeg] .uploader-file-name').should('include.text', 'avatar.jpeg');

    // The global variable should store the uploaded item
    cy.window().its('PM4ConfigOverrides.requestFiles.filesingle')
      .then(fileValue => {
        expect(fileValue[0].file_name).to.equal('avatar.jpeg');
      });
    // The download control should have the file to download
    cy.get('[data-cy=1-avatar-jpeg]').should('contain.text', 'avatar.jpeg');


    // Upload another file, it should replace the file displayed in the control
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 2,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-filesingle] input[type=file]', 'file1.jpeg', 'image/jpg');
    cy.get('[data-cy=file1-jpeg] .uploader-file-name').should('include.text', 'file1.jpeg');
    cy.waitUntil(() => cy.window().then(win => win.PM4ConfigOverrides.requestFiles.filesingle[0].file_name === 'file1.jpeg'));
    cy.window().its('PM4ConfigOverrides.requestFiles.filesingle')
      .then(fileValue => {
        expect(fileValue[0].file_name).to.equal('file1.jpeg');
      });
    // The download control should have the new file ready to download
    cy.get('[data-cy=2-file1-jpeg]').should('contain.text', 'file1.jpeg');
  });

  it('Upload multiple files', () => {
    cy.loadFromJson('multiple_upload.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Upload one file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-filemultiple] input[type=file]', 'avatar.jpeg', 'image/jpg');
    // The file should be listed in the multiple upload control
    cy.get('[data-cy=preview-content] [data-cy=screen-field-filemultiple]')
      .find('[data-cy=1] .uploader-file-name')
      .should('include.text', 'avatar.jpeg');
    // The file should be listed in multiple download control
    cy.get('[data-cy=1-avatar-jpeg]').should('contain.text', 'avatar.jpeg');

    // Add a new file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 2,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-filemultiple] input[type=file]', 'file1.jpeg', 'image/jpg');
    // The file should be listed in multiple upload control
    cy.get('[data-cy=preview-content] [data-cy=screen-field-filemultiple]')
      .find('[data-cy=2] .uploader-file-name')
      .should('include.text', 'file1.jpeg');
    // The file should be listed in multiple download control
    cy.get('[data-cy=1-avatar-jpeg]').should('contain.text', 'avatar.jpeg');

    // Remove the last file
    cy.route('DELETE', '/api/1.0/files/2', JSON.stringify({
      message: 'File deleted',
    }));
    cy.get('[data-cy=preview-content] [data-cy=screen-field-filemultiple]')
      .find('[data-cy=2] [title=Delete]')
      .click();
    //The row of file 2 sould not exist, but file 1 should exist
    cy.get('[data-cy=preview-content] [data-cy=screen-field-filemultiple]')
      .find('[data-cy=2] .uploader-file-name')
      .should('not.exist');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-filemultiple]')
      .find('[data-cy=1] .uploader-file-name')
      .should('exist');
    // The file should not be listed in multiple download control
    cy.get('[data-cy=2-file-jpeg]').should('not.exist');

    // Remove the first file
    cy.route('DELETE', '/api/1.0/files/1', JSON.stringify({
      message: 'File deleted',
    }));
    cy.get('[data-cy=preview-content] [data-cy=screen-field-filemultiple]')
      .find('[data-cy=1] [title=Delete]')
      .click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-filemultiple]')
      .find('[data-cy=1] .uploader-file-name')
      .should('not.exist');
    // The file should not be listed in multiple download control
    cy.get('[data-cy=2-avatar-jpeg]').should('not.exist');
  });

  it('Upload files in record lists', () => {
    cy.loadFromJson('multiple_upload.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [data-cy=screen-field-members] [data-cy=add-row]').click();

    // Upload single file should show the uploaded file name
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-map] input[type=file]', 'avatar.jpeg', 'image/jpg');
    cy.get('[data-cy=avatar-jpeg] .uploader-file-name').should('include.text', 'avatar.jpeg');
    // The global variable should store the uploaded item
    cy.window().its('PM4ConfigOverrides.requestFiles')
      .then(requestFiles => {
        const firstMapFileVar = Object.keys(requestFiles).find(x => x.startsWith('members.map'));
        const rowId = firstMapFileVar.split('members.map.')[1];
        expect(requestFiles['members.map.' + rowId][0].file_name).to.equal('avatar.jpeg');
      });
    // The download control should have the file to download
    cy.get('[data-cy=1-avatar-jpeg]').should('contain.text', 'avatar.jpeg');

    // Upload a file in multiple file mode
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-pictures] input[type=file]', 'avatar.jpeg', 'image/jpg');
    // The file should be listed in multiple upload control
    cy.get('[data-cy=preview-content] [data-cy=screen-field-pictures]')
      .find('[data-cy=1] .uploader-file-name')
      .should('include.text', 'avatar.jpeg');
    // The file should be listed in multiple download control
    cy.get('[data-cy=1-avatar-jpeg]').should('contain.text', 'avatar.jpeg');

    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 2,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-pictures] input[type=file]', 'file1.jpeg', 'image/jpg');
    // The file should be listed in multiple upload control
    cy.get('[data-cy=preview-content] [data-cy=screen-field-pictures]')
      .find('[data-cy=2] .uploader-file-name')
      .should('include.text', 'file1.jpeg');
    // The file should be listed in multiple download control
    cy.get('[data-cy=1-avatar-jpeg]').should('contain.text', 'avatar.jpeg');


    // Remove the last file
    cy.route('DELETE', '/api/1.0/files/2', JSON.stringify({
      message: 'File deleted',
    }));
    cy.get('[data-cy=preview-content] [data-cy=screen-field-pictures]')
      .find('[data-cy=2] [title=Delete]')
      .click();
    //The row of file 2 should not be listed, but file 1 yes
    cy.get('[data-cy=preview-content] [data-cy=screen-field-pictures]')
      .find('[data-cy=2] .uploader-file-name')
      .should('not.exist');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-pictures]')
      .find('[data-cy=1] .uploader-file-name')
      .should('exist');
    // The file should not be listed in multiple download control
    cy.get('[data-cy=2-file-jpeg]').should('not.exist');
  });

});
