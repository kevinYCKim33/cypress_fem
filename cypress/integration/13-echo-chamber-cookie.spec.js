/// <reference types="cypress" />

import '../support/commands-complete';

const user = {
  email: 'first@example.com',
  password: 'password123',
};

export const decodeToken = (token) => JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
export const encodeToken = (token) => Buffer.from(JSON.stringify(token)).toString('base64');

describe('Signing in with a seeded database', () => {
  beforeEach(() => {
    cy.task('seed'); // comes from plugins;
    cy.visit('/echo-chamber/sign-in');
    cy.signIn(user);
  });

  it('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('should set a cookie', () => {
    cy.getCookie('jwt').then((cookie) => {
      const value = decodeToken(cookie.value);
      expect(value.email).to.equal(user.email);
    });
  });
});

// pre-login cause you already proved that you can log in
// with the above test
describe('Setting the cookie', () => {
  beforeEach(() => {
    cy.task('seed');
    cy.setCookie('jwt', encodeToken({ id: 999, email: 'cypress@example.com' }));
    cy.visit('/echo-chamber/sign-in');
  });

  // you visited sign-in, but since you were signed in (via cookies)
  // you got redirected to /echo-chamber/posts
  it('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it('show that user on the page', () => {
    cy.contains('cypress@example.com');
  });
});

describe('Setting the cookie with real data', () => {
  let theUser = {}; // proves scoping does work...
  beforeEach(() => {
    cy.task('seed');
    // no stubbing, the real deal
    // no intercept, just pure actual request
    cy.request('/echo-chamber/api/users')
      .then((response) => {
        // dang getting the first user via destructuring
        const [user] = response.body.users;
        cy.setCookie('jwt', encodeToken(user)).then(() => {
          theUser.email = user.email;
        });
        // .then(() => user);
      })
      .as('user');
    cy.visit('/echo-chamber/sign-in');
  });

  it('should be able to log in', () => {
    cy.location('pathname').should('contain', '/echo-chamber/posts');
  });

  it.only('show that user on the page', () => {
    // I think you do need the @user
    // since it returns => user way at the end
    // could've also manually put in user.email? via scoping??
    // cy.get('@user').then((user) => {
    cy.contains(`Signed in as ${theUser.email}`);
    // });
  });
});
