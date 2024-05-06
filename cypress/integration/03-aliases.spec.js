/// <reference types="cypress" />

// alias also works for network requests;
// not just DOM elements

describe('Aliases', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
    // alias in beforeEach a good idea
    // remember beforeEach runs on a fresh page here
    // can't store variables that don't exist yet at that start
    cy.get('[data-test="items"]').as('allItems');
    cy.get('[data-test="items-unpacked"]').as('unpackedItems');
    cy.get('[data-test="items-packed"]').as('packedItems');

    cy.get('[data-test="filter-items"]').as('filterInput');
  });

  it('should hold onto an alias', () => {
    cy.get('@unpackedItems').find('label').first().as('firstItem'); // alias on alias!
    // had a11y set up where clicking on label checks off the checkbox

    // invoke aha moment
    // const getName = () => {
    //  return 'Jane Lane'
    // }
    // cy.wrap({ name: getName }).invoke('name').should('eq', 'Jane Lane'); // true

    cy.get('@firstItem').invoke('text').as('text'); // invoke??
    // he didn't really go over invoke...
    // cy.get('@firstItem').find('input[type="checkbox"]').click();
    cy.get('@firstItem').click(); // this also works; probably cleaner and more descriptive
    // as it shows you don't have to click exactly on the checkbox for it to move over

    // won't work
    // cy.get('@packedItems').find('label').first().should('include.text', '@text'); // literally tries to find @text [x]

    // what is this .then clause here??
    // I think a bit of a contrived way of holding onto the 'Toothbrush' text as a variable
    // and then using it for a later test
    // Kinney says this might be a bit contrived...
    cy.get('@text').then((text) => {
      console.log('text is: ', text); // "text is:   Toothebrush"
      // declare it should be at the top of the list
      cy.get('@packedItems').find('label').first().should('include.text', text);
    });
  });

  it('should filter the items shown on the page', () => {
    cy.get('@filterInput').type('iPhone');

    cy.get('@allItems').should('contain.text', 'iPhone');
    cy.get('@allItems').should('not.contain.text', 'Hoodie');
  });
});
