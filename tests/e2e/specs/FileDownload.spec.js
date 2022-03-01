describe('File Download', () => {
    // const files = [];

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
          cy.get('[data-cy=controls-FileUpload]').drag('[data-cy=screen-drop-zone]', 'bottom'); 
          cy.get('[data-cy=controls-FileDownload]').drag('[data-cy=screen-element-container]', 'bottom'); 
          cy.get(':nth-child(1) > [data-cy=screen-element-container]').click();
          cy.get('[data-cy=inspector-name]').type('file_upload_1');
        // cy.loadFromJson('file_download.json',0);
        cy.get('[data-cy=mode-preview]').click();
        // Upload single file should show the uploaded file name
        cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
            message: 'The file was uploaded.',
            fileUploadId: 1,
        }));
        cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-file_upload_1] input[type=file]', 'avatar.jpeg', 'image/jpg');
        
    });
    it('can download standard file', () => {
        cy.log('TEST DOWNLOAD');
        // cy.downloadFile('[data-cy=preview-content] [data-cy="screen-field-page1"] input[type=file]', 'avatar.jpeg', 'image/jpg');
        // Mock uploaded file
        // files.push(1);
        // cy.route('GET', '/api/1.0/requests/1/files');
        
        // Upload file
        // cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
        //     message: 'The file was uploaded.',
        //     fileUploadId: 1,
        // }));
        // cy.uploadFile('[data-cy=preview-content] [data-cy="screen-field-page1"] input[type=file]', 'avatar.jpeg', 'image/jpg');
        // Mock uploaded file
        // files.push({
        //     file_name: 'avatar.jpeg',
        // });
        // cy.wait('@uploadFile');
    });
});
