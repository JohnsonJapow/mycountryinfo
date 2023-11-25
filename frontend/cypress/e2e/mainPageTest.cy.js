describe('Main Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should render the title "Please enter a country name"', () => {
    cy.get('[data-testid="cypress-title"]')
      .should('exist')
      .and('contain', 'Please enter a country name');
  });

  it('should display the burger menu on the left side of the screen', () => {
    cy.get('[data-testid="cypress-burgermenu"]').should('exist');
  });

  it('should allow typing into the search input', () => {
    const inputText = 'Germany';
    cy.get('input[name="txt"]')
      .type(inputText)
      .should('have.value', inputText);
  });

  it('should show error message when fetching country information fails', () => {
    // Stubbing a network request to simulate a failed response
    cy.intercept('GET', '/api/country/*', { statusCode: 500 }).as('getCountry');
    
    cy.get('input[name="txt"]').type('InvalidCountry{enter}');
    cy.wait('@getCountry');
    
    cy.get('[data-testid="cypress-error"]')
      .should('exist')
      .and('contain', 'Failed to fetch data. Please try again.');
  });

  it('should display country information when a valid country name is submitted', () => {
    cy.intercept('GET', '/api/country/Germany', {
      statusCode: 200,
      body: {
        name: { common: 'Germany', official: 'Federal Republic of Germany' },
        maps: {
          googleMaps: "https://www.google.com/maps/place/Germany",
          openStreetMaps: "https://www.openstreetmap.org/relation/51477",
        },  
        population: 83240525, 
        area: 357114,
        continents: ["Europe"],
        region: ['Europe'],
        subregion:['Western Europe'],
        
      },
    })
    .as('getCountry');
    
    cy.get('input[name="txt"]').type('Germany{enter}');
    cy.wait('@getCountry');
    
    cy.get('[data-testid="cypress-country-info"]')
      .should('exist')
      .and('contain', 'Federal Republic of Germany');
  });
});
