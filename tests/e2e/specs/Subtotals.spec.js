
describe('Subtotals implementations', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('Simple using calculated properties and defualt values', () => {
    cy.loadFromJson('subtotals_with_loops.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=count]').eq(0).type('3');
    cy.get('[data-cy=preview-content] [name=cost]').eq(0).type('123');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(0).should('have.value', '369');

    cy.get('[data-cy=preview-content] [name=count]').eq(1).type('3');
    cy.get('[data-cy=preview-content] [name=cost]').eq(1).type('4');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(1).should('have.value', '12');

    cy.get('[data-cy=preview-content] [name=count]').eq(2).type('5');
    cy.get('[data-cy=preview-content] [name=cost]').eq(2).type('6');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(2).should('have.value', '30');

    // Add a new row
    cy.get('[data-cy=preview-content] [data-cy="loop-loop-add"]').click();

    cy.get('[data-cy=preview-content] [name=count]').eq(3).type('4');
    cy.get('[data-cy=preview-content] [name=cost]').eq(3).type('5');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(3).should('have.value', '20');

    // Check final result
    cy.assertPreviewData(
      {
        'loop': [
          {
            'count': '3',
            'cost': '123',
            'subtotal': 369,
          },
          {
            'count': '3',
            'cost': '4',
            'subtotal': 12,
          },
          {
            'count': '5',
            'cost': '6',
            'subtotal': 30,
          },
          {
            'count': '4',
            'cost': '5',
            'subtotal': 20,
          },
        ],
        'total': 431,
      });
  });

  it('Simple using calculated properties and defualt values with Currency Inputs', () => {
    cy.loadFromJson('subtotals_with_loops_currency.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=count]').eq(0).type('3');
    cy.get('[data-cy=preview-content] [name=cost]').eq(0).type('123');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(0).should('have.value', '369,00');

    cy.get('[data-cy=preview-content] [name=count]').eq(1).type('3');
    cy.get('[data-cy=preview-content] [name=cost]').eq(1).type('4');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(1).should('have.value', '12,00');

    cy.get('[data-cy=preview-content] [name=count]').eq(2).type('5');
    cy.get('[data-cy=preview-content] [name=cost]').eq(2).type('6');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(2).should('have.value', '30,00');

    // Add a new row
    cy.get('[data-cy=preview-content] [data-cy="loop-loop-add"]').click();

    cy.get('[data-cy=preview-content] [name=count]').eq(3).type('4');
    cy.get('[data-cy=preview-content] [name=cost]').eq(3).type('5');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(3).should('have.value', '20,00');

    // Check final result
    cy.assertPreviewData(
      {
        'loop': [
          {
            'count': 3,
            'cost': 123,
            'subtotal': 369,
          },
          {
            'count': 3,
            'cost': 4,
            'subtotal': 12,
          },
          {
            'count': 5,
            'cost': 6,
            'subtotal': 30,
          },
          {
            'count': 4,
            'cost': 5,
            'subtotal': 20,
          },
        ],
        'total': 431,
      });
  });

  it('Simple using calculated properties and defualt values with Decimal', () => {
    cy.loadFromJson('subtotals_with_loops_decimal.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=count]').eq(0).type('3');
    cy.get('[data-cy=preview-content] [name=cost]').eq(0).type('123');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(0).should('have.value', '369');

    cy.get('[data-cy=preview-content] [name=count]').eq(1).type('3');
    cy.get('[data-cy=preview-content] [name=cost]').eq(1).type('4');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(1).should('have.value', '12');

    cy.get('[data-cy=preview-content] [name=count]').eq(2).type('5');
    cy.get('[data-cy=preview-content] [name=cost]').eq(2).type('6');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(2).should('have.value', '30');

    // Add a new row
    cy.get('[data-cy=preview-content] [data-cy="loop-loop-add"]').click();

    cy.get('[data-cy=preview-content] [name=count]').eq(3).type('4');
    cy.get('[data-cy=preview-content] [name=cost]').eq(3).type('5');
    cy.get('[data-cy=preview-content] [name=subtotal]').eq(3).should('have.value', '20');

    // Check final result
    cy.assertPreviewData(
      {
        'loop': [
          {
            'count': 3,
            'cost': 123,
            'subtotal': 369,
          },
          {
            'count': 3,
            'cost': 4,
            'subtotal': 12,
          },
          {
            'count': 5,
            'cost': 6,
            'subtotal': 30,
          },
          {
            'count': 4,
            'cost': 5,
            'subtotal': 20,
          },
        ],
        'total': 431,
      });
  });

  it('Using calculated fields', () => {
    cy.loadFromJson('subtotasl_calc_props.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    cy.get('[data-cy=preview-content] [name=amount]').type('123');
    cy.get('[data-cy=preview-content] [name=quantity]').type('3');
    cy.get('[data-cy=preview-content] [name=total_line]').should('have.value', '$ 369.00 USD');

    cy.get('[data-cy=preview-content] [name=amount_1]').type('4');
    cy.get('[data-cy=preview-content] [name=quantity_1]').type('3');
    cy.get('[data-cy=preview-content] [name=total_line_1]').should('have.value', '$ 12.00 USD');

    // Check final result
    cy.assertPreviewData(
      {
        'quantity': 3,
        'amount': 123,
        'total_line': 369,
        'quantity_1': 3,
        'amount_1': 4,
        'total_line_1': 12,
        'total_total': 381,
      });
  });

  it('Using calculated fields 2', () => {
    cy.loadFromJson('subtotasl_calc_props_currency.json', 0);
    cy.get('[data-cy=mode-preview]').click();

    cy.get('[data-cy=preview-content] [name=count_1]').type('4');
    cy.get('[data-cy=preview-content] [name=cost_1]').type('3');
    cy.get('[data-cy=preview-content] [name=subtotal_1]').should('have.value', '$ 12.00 USD');

    cy.get('[data-cy=preview-content] [name=count_2]').type('123');
    cy.get('[data-cy=preview-content] [name=cost_2]').type('3');
    cy.get('[data-cy=preview-content] [name=subtotal_2]').should('have.value', '$ 369.00 USD');

    cy.get('[data-cy=preview-content] [name=count_3]').type('12');
    cy.get('[data-cy=preview-content] [name=cost_3]').type('2');
    cy.get('[data-cy=preview-content] [name=subtotal_3]').should('have.value', '$ 24.00 USD');

    // Check final result
    cy.assertPreviewData(
      {
        'input_1': '',
        'input_2': '',
        'input_3': '',
        'cost_1': 3,
        'count_1': 4,
        'subtotal_1': 12,
        'cost_2': 3,
        'count_2': 123,
        'subtotal_2': 369,
        'cost_3': 2,
        'count_3': 12,
        'subtotal_3': 24,
        'total': 405,
      });
  });
});
