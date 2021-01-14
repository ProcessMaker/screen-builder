
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
});
