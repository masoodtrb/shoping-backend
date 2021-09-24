// Masoud Torabi

context('Authenticate', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should log user into the application', () => {
    cy.get('[data-cy=logIn]')
      .should('be.visible')
      .click()
      .then(() => cy.get('#logInButton').click());
    cy.get('[data-cy=user]').contains('Doe');
    cy.get('[data-cy=logOut]').contains('Log Out');
  });

  it('should log user out of the application', () => {
    cy.get('[data-cy=logOut]')
      .click()
      .then(() => {
        cy.get('[data-cy=logOut]').should('not.be.visible');
        cy.get('[data-cy=user]').should('not.be.visible');
      });
  });
});
