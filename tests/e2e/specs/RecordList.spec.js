
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

  it('Recordlist pagination when deleting items should go to previous page if no records in current page', () => {
    cy.loadFromJson('record_list_single_input.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    //Add 7 rows
    for (let i = 1; i <= 7; i++) {
      cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();
      cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=name]').type(i);
      cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary').click();
    }

    //Go to pagination page 2
    cy.get(':nth-child(4) > .page-link').click();

    //Delete record 7
    cy.get('[aria-rowindex="7"] > .text-right > .actions > .btn-group > [data-cy=remove-row]').click();
    cy.get('[data-cy=modal-remove] .btn-primary').click();

    cy.get('.table-column')
      .should('contain.text', '6');

    cy.get('[data-cy=table-pagination]')
      .should('be.visible');

    //Delete record 6
    cy.get('[data-cy=remove-row]').click();
    cy.get('[data-cy=modal-remove] .btn-primary').click();

    //Assert we see page 1
    cy.get('[data-cy=table-pagination]')
      .should('be.not.visible');

    for (let i = 1; i <= 5; i++) {
      cy.get('[aria-rowindex="'+i+'"] > .table-column')
        .should('contain.text', i);
    }
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
