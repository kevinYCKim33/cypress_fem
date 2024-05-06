/// <reference types="cypress" />

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');

    cy.get('#minimum-rating-visibility').as('rating-filter');
    cy.get('#restaurant-visibility-filter').as('restaurant-filter');
  });

  it.only('should set the range and verify it', () => {
    // invoke => start thinking in jQuery
    // really weird way to say it'll be 7
    cy.get('@rating-filter').invoke('val', '7').trigger('input'); // interestingly the below test will pass w/o trigger, but
    // the minimum rating will stay at 1;
    // trigger('input') is like saying .addEventListner('input', (e) => {})
    cy.get('@rating-filter').should('have.value', '7');
  });

  it('should check the checkbox and verify it', () => {
    // again checks all the checkboxes
    cy.get('input[type="checkbox"]').as('checkbox').check().should('be.checked');
    // ^ chaining also works
    // cy.get('@checkbox').should('be.checked');
  });

  it('should select an option from the select and verify it', () => {
    cy.get('@restaurant-filter').select('Five Guys');
    cy.get('@restaurant-filter').should('have.value', 'Five Guys');
  });
});
