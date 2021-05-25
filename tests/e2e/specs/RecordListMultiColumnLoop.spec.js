describe('Record List', () => {

  beforeEach(() => {
    cy.visit('/');

    cy.server();
  });

  it('Recordlist with MultiColumn and Loop', () => {
    // Load screen
    cy.loadFromJson('record_list_multicolumn_loop.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    // Add a recordlist row
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-form_input_1"]').eq(0).type('1');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-form_input_1"]').eq(1).type('2');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-form_input_1"]').eq(2).type('3');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name="form_input_2"]').type('4');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [data-cy="screen-field-form_input_3"]').type('5');

    // Save row
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary').click();

    //Edit created row
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=edit-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-form_input_1"]').eq(0).type('1');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-form_input_1"]').eq(1).type('2');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-form_input_1"]').eq(2).type('3');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [name="form_input_2"]').type('4');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] [data-cy="screen-field-form_input_3"]').type('5');

    // Update row
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-edit] button.btn-primary').click();

    // Verify the data structure
    cy.get('#screen-builder-container').then((div) => {
      const data = div[0].__vue__.previewData;
      const record_row_id = data.form_record_list_1[0].row_id;
      expect(data.form_record_list_1).to.eql([
        {
          'loop_1': [
            {
              'form_input_1': '11',
            },
            {
              'form_input_1': '22',
            },
            {
              'form_input_1': '33',
            },
          ],
          'form_input_2': '44',
          'form_input_3': '55',
          'row_id': record_row_id,
        },
      ]);
    });
  });
});
