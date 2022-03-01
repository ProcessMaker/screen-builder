describe('File Download', () => {
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
    cy.loadFromJson('file_download.json', 0);
  });

  it('Displays a file to download', () => {
    uploadFile();
    // Mock file download
    cy.route('/api/1.0/files/1/contents', 'avatar.jpeg').as('download');
    // Assert standard file download configuration has an image to download
    cy.get(':nth-child(3) > .row > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"]').contains('avatar.jpeg');
    // Assert file download using _parent configuration has an image to download
    cy.get('.page > :nth-child(1) > :nth-child(1) > :nth-child(2) > [data-cy="1-avatar"]').contains('avatar.jpeg');        
  });

  it('Downloads the file', () => {
    uploadFile();
    // Mock file download
    cy.route('/api/1.0/files/1/contents', 'avatar.jpeg').as('download');
    // Assert the image is downloadable
    cy.get('[data-cy="1-avatar"] > .btn').click();
    cy.wait('@download').then((xhr) => {
      expect(xhr.response.body).to.equal('avatar.jpeg');
    });
  });
});

function uploadFile() {
  cy.get('[data-cy=mode-preview]').click();
  // Upload single file should show the uploaded file name
  cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
    message: 'The file was uploaded.',
    fileUploadId: 1,
  }));
  cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-file_upload_1] input[type=file]', 'avatar.jpeg', 'image/jpg');
    
  // Mock file info
  cy.route('/api/1.0/requests/1/files?id=*', 
    {
      id: 1, 
      file_name: 'avatar.jpeg', 
      name: 'avatar',
    }
  ).as('getFileInfo');
}