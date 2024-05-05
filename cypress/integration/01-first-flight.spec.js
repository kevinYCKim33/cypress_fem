/// <reference types="cypress" />

describe('Create a New Item', () => {
  // runs before each test
  beforeEach(() => {
    cy.visit('/jetsetter'); // base url provided in cypress.json; localhost:3000/jetsetter
  });

  // In Cypress, in the absence of failure, the test passes
  it('should have a form', () => {
    cy.get('form').should('exist');
  });

  it('should have the words "Add Item"', () => {
    cy.contains('Add Item');
  });

  it('should put stuff in an input field', () => {
    cy.get('[data-test="new-item-input"]').type('Good attitude');
  });
});

// npx cypress open <== what you should do to run in browser
// npx cypress run <== what your CI/CD should do to run in headless mode
