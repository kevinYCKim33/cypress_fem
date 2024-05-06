/// <reference types="cypress" />

const pokemon = [
  { id: 1, name: 'Bumblesaur' },
  { id: 2, name: 'Charmer' },
  { id: 3, name: 'Turtle' },
];

describe('Pokémon Search', () => {
  beforeEach(() => {
    cy.visit('/pokemon-search');

    cy.get('[data-test="search"]').as('search');
    cy.get('[data-test="search-label"]').as('label');

    // just intercept the call;
    // don't respond with anything
    cy.intercept('/pokemon-search/api?*').as('api');
  });

  it('should call the API when the user types', () => {
    cy.get('@search').type('bulba');
    cy.wait('@api');
  });

  it('should update the query parameter', () => {
    cy.get('@search').type('squir');
    cy.wait('@api');
    /*
    https://example.com/page?search=term&category=books, 
    window.location.search // '?search=term&category=books'
    */
    cy.location('search').should('equal', '?name=squir');
  });

  it('should call the API with correct query parameter', () => {
    cy.get('@search').type('char');
    cy.wait('@api').then((interception) => {
      expect(interception.request.url).to.contain('name=char');
    });
  });

  it('should pre-populate the search field with the query parameter', () => {
    cy.visit({ url: '/pokemon-search', qs: { name: 'jolteon' } });
    // /pokemon-search?name=char
    cy.get('@search').should('have.value', 'jolteon');
  });

  it('should render the results to the page', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    cy.get('@search').type('lol');

    cy.wait('@stubbed-api');

    cy.get('[data-test="result"]').should('have.length', 3);
  });

  it('should link to the correct pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    cy.get('@search').type('lol');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').each(($el, index) => {
      const { id } = pokemon[index];
      expect($el.attr('href')).to.contain('/pokemon-search/' + id);
    });
  });

  it('should persist the query parameter in the link to a pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');

    cy.get('@search').type('lol');
    cy.wait('@stubbed-api');

    cy.get('[data-test="result"] a').each(($el) => {
      expect($el.attr('href')).to.contain('name=lol');
    });
  });

  it.only('should bring you to the route for the correct pokémon', () => {
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    // under cypress/fixtures/bulbasaur.json
    cy.intercept('/pokemon-search/api/1', { fixture: 'bulbasaur.json' }).as('individual-api');

    // type bulbasaur in
    cy.get('@search').type('bulba');
    // wait for the list of pokemons to come back
    cy.wait('@stubbed-api');

    // click on the first search result
    cy.get('[data-test="result"] a').first().click();
    // wait for the bulbasaur api to come back
    cy.wait('@individual-api');

    // the url should be /pokemon-search/1
    cy.location('pathname').should('contain', '/pokemon-search/1');
  });

  it('should immediately fetch a pokémon if a query parameter is provided', () => {
    // actually mocking out the response
    cy.intercept('/pokemon-search/api?*', { pokemon }).as('stubbed-api');
    cy.visit({ url: '/pokemon-search', qs: { name: 'bulba' } });

    cy.wait('@stubbed-api').its('response.url').should('contain', '?name=bulba');
  });
});
