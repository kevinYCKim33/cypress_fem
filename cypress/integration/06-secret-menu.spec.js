/// <reference types="cypress" />

const restaurants = [
  'Chick-fil-A',
  'McDonalds',
  'In-N-Out',
  'KFC',
  'Jack In The Box',
  'Jamba Juice',
  'Starbucks',
  'Dairy Queen',
  'Burger King',
  'Chipotle',
  'Taco Bell',
  'Five Guys',
  'Sonic',
  'Subway',
  'Panera Bread',
];

const properties = [
  'name',
  'whereToOrder',
  'description',
  'secret',
  'ingredients',
  'popularity',
  'price',
  'howToOrder',
];

const ratings = [1, 2, 3, 4, 5, 6, 7];

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
  });

  it('should exist have the title on the page', () => {
    cy.get('h1').should('contain', 'Secret Menu Items');
  });

  // being programmatic; just means you can run a loop to make cypress tests
  for (const property of properties) {
    it(`should have a column for ${property}`, () => {
      cy.get(`#${property}-column`);
    });

    it(`should have a column for showing the ${property} column`, () => {
      cy.get(`#show-${property}`);
    });

    it('should hide the column when the checkbox is unchecked', () => {
      cy.get(`#show-${property}`).click();
      cy.get(`#${property}-column`).should('be.hidden');
    });
  }

  describe('Restaurant Filter', () => {
    beforeEach(() => {
      cy.get('#restaurant-visibility-filter').as('restaurant-filter');
    });

    for (const restaurant of restaurants) {
      it(`should only display rows that match ${restaurant} when selected`, () => {
        // regular dropdown
        cy.get('@restaurant-filter').select(restaurant);
        // hmm it didn't really select chick fil-a
        // but the table order did go through though...
        cy.get('td[headers="whereToOrder-column"]').should('contain', restaurant);
      });
    }
  });

  describe('Ratings Filter', () => {
    beforeEach(() => {
      cy.get('#minimum-rating-visibility').as('rating-filter');
    });

    for (const rating of ratings) {
      it.only(`should only display items with a popularity above ${rating}`, () => {
        // ratings is the slider
        cy.get('@rating-filter').invoke('val', rating).trigger('change');
        cy.get('td[headers="popularity-column"]').each(($el) => {
          expect(+$el.text()).to.be.gte(rating);
        });
      });
    }
  });
});
