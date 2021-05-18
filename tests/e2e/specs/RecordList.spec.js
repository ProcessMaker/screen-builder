
describe('Record list', () => {

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

  it('Invalid default values', () => {
    cy.loadFromJson('record_list_invalid.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=firstname]').type('Patricia');
    cy.get('[data-cy=preview-content] [name=lastname]').type('Smith');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=fullname]').type('{home}Miss ');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=fullname]').should('have.value', 'Miss Patricia Smith');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=date]').parent()
      .should('contain.text', 'Must be a valid Date');
  });

  it('Add row with default values', () => {
    cy.loadFromJson('record_list.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    const today = new Date().toISOString().substr(0,10);
    cy.get('[data-cy=preview-content] [name=firstname]').type('Patricia');
    cy.get('[data-cy=preview-content] [name=lastname]').type('Smith');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=fullname]').type('{home}Miss ');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary').click();
    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        'firstname': 'Patricia',
        'lastname': 'Smith',
        'form_record_list_1': [
          {
            'fullname': 'Miss Patricia Smith',
            'date': today,
            'row_id': record_row_id,
          },
        ],
      });
    });
  });

  it('FileUpload in record lists', () => {
    cy.loadFromJson('record_list_fileupload.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();

    // Upload first file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file1"] input[type=file]', 'avatar.jpeg', 'image/jpg');

    // Upload second file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 2,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file2"] input[type=file]', 'record_list_fileupload.json', 'application/json');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)').click();

    // Check the file is rendered in the record list
    cy.get('[data-cy=preview-content] table tbody tr td').should('contain.text', '1');
    cy.get('[data-cy=preview-content] table tbody tr td').should('contain.text', '2');

    // Edit record and check the uploaded files are displayed
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file1"]').should('contain.text', 'avatar.jpeg');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file2"]').should('contain.text', 'record_list_fileupload.json');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Cancel)').click();

    // Verify the data structure
    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        'form_record_list_1': [
          {
            'file1': 1,
            'file2': 2,
            'row_id': record_row_id,
          },
        ],
      });
    });
  });

  it('Required FileUpload in record lists', () => {
    cy.loadFromJson('record_list_fileupload_required.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();

    // Upload first file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 1,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file1"] input[type=file]', 'avatar.jpeg', 'image/jpg');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file2"]').should('contain.text', 'required');

    // Upload second file
    cy.route('POST', '/api/1.0/requests/1/files', JSON.stringify({
      message: 'The file was uploaded.',
      fileUploadId: 2,
    }));
    cy.uploadFile('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-file2"] input[type=file]', 'record_list_fileupload_required.json', 'application/json');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button:contains(Ok)').click();

    // Check the file is rendered in the record list
    cy.get('[data-cy=preview-content] table tbody tr td').should('contain.text', '1');
    cy.get('[data-cy=preview-content] table tbody tr td').should('contain.text', '2');

    // Edit record and check the uploaded files are displayed
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file1"]').should('contain.text', 'avatar.jpeg');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-file2"]').should('contain.text', 'record_list_fileupload_required.json');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button:contains(Cancel)').click();

    // Verify the data structure
    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data).to.eql({
        'form_record_list_1': [
          {
            'file1': 1,
            'file2': 2,
            'row_id': record_row_id,
          },
        ],
      });
    });
  });
});
