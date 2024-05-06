/// <reference types="cypress" />

const user = {
  email: 'first@example.com',
  password: 'password123',
};

describe('Sign Up', () => {
  beforeEach(() => {
    cy.task('reset'); // reset the prisma database
    // checkout plugins/index.js
  });

  it('should successfully create a user when entering an email and a password', () => {
    // Sign Up
    cy.visit('/echo-chamber/sign-up');
    cy.get('[data-test="sign-up-email"]').type(user.email);
    cy.get('[data-test="sign-up-password"]').type(user.password);
    cy.get('[data-test="sign-up-submit"]').click();
    // shouldn't you check for something??

    // Sign In (with the account you just created)
    cy.visit('/echo-chamber/sign-in');
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    cy.contains('Signed in as ' + user.email);
  });
});

describe('Sign In (Failure Mode)', () => {
  beforeEach(() => {
    cy.task('reset');
    cy.visit('/echo-chamber/sign-in');
  });

  it('should sign in with an existing user', () => {
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/sign-in');
    cy.contains('Signed in as ' + user.email).should('not.exist');
    cy.contains('No such user exists');
    // it won't exist, since you just cleared the database in the beforeEach action
  });
});

describe('Sign In', () => {
  beforeEach(() => {
    cy.task('seed'); // see seed.cjs triggered via plugins/index.js
    cy.visit('/echo-chamber/sign-in');
  });

  it('should sign in with an existing user', () => {
    cy.get('[data-test="sign-in-email"]').type(user.email);
    cy.get('[data-test="sign-in-password"]').type(user.password);
    cy.get('[data-test="sign-in-submit"]').click();

    cy.location('pathname').should('contain', '/echo-chamber/posts');
    // it works now since you cleared the db, and seeded via seed
    cy.contains('Signed in as ' + user.email);
  });
});
