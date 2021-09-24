// Masoud Torabi

context('Search', () => {
  before(() => cy.visit('http://localhost:3000/shoppy.html'));

  it('should search for product information', () => {
    cy.get('[data-cy=search]')
      .type('iPhone 11')
      .then(() => cy.get('[data-cy=searchButton]').click());
  });
  // More tests can be added here once the search functionality works
});
