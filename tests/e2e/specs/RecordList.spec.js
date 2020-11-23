
describe('Record list', () => {

  beforeEach(() => {
    cy.server();
    cy.visit('/');
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
      .should('contain.text', 'Invalid default value');
  });

  it('Add row with default values', () => {
    cy.loadFromJson('record_list.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=firstname]').type('Patricia');
    cy.get('[data-cy=preview-content] [name=lastname]').type('Smith');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=add-row]').click();
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] [name=fullname]').type('{home}Miss ');
    cy.get('[data-cy=preview-content] [data-cy=screen-field-form_record_list_1] [data-cy=modal-add] button.btn-primary').click();
    cy.assertPreviewData({
      'firstname': 'Patricia',
      'lastname': 'Smith',
      'form_record_list_1': [
        {
          'fullname': 'Miss Patricia Smith',
          'date': new Date().toISOString().substr(0,10),
        },
      ],
      'fullname': ' ',
      'date': new Date().toISOString().substr(0,10),
    });
  });
});
