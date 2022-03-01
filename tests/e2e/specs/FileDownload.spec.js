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
    it('Can download a single file', () => {
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
                name: 'avatar'
            }
        ).as('getFileInfo');
        // Mock download file
        cy.route('/api/1.0/files/1/contents', 'avatar.jpeg').as('download');
        
        // Assert file download control has an image
        cy.get('[data-cy="1-avatar"]').contains('avatar.jpeg');

        // Assert the image is downloadable
        cy.get('[data-cy="1-avatar"] > .btn').click();
        cy.wait('@download').then((xhr) => {
            expect(xhr.response.body).to.equal('avatar.jpeg');
        });
    });
});
