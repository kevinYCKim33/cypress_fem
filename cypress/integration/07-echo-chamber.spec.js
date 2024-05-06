/// <reference types="cypress" />

// testing what the url should be
describe('Initial Page', () => {
  beforeEach(() => {
    cy.task('reset'); // what's this do??
    // check out plugins/index.js
    // resets the database via prisma
    cy.visit('/echo-chamber');
  });

  it('should have the title of the application in the header', () => {
    cy.get('[data-test="application-title"]').should('contain', 'Echo Chamber');
  });

  it.only('should have the title of the application in the window', () => {
    cy.title().should('contain', 'Echo Chamber'); // title as in at the header
  });

  it('should have a "Sign In" button', () => {
    cy.get('[data-test="sign-in"]');
  });

  it('should have a "Sign Up" button', () => {
    cy.get('[data-test="sign-up"]');
  });

  it('should navigate to "/sign-in" when you click the "Sign In" button', () => {
    cy.get('[data-test="sign-in"]').click();
    // yes the url should say echo-chamber/sign-in
    cy.location('pathname').should('contain', 'sign-in');
  });

  it('should navigate to "/sign-up" when you click the "Sign Up" button', () => {
    cy.get('[data-test="sign-up"]').click();
    // yes the url should say echo-chamber/sign-up
    cy.location('pathname').should('contain', 'sign-up');
  });
});
