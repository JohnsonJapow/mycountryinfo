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
      body: [{
        name: { common: 'Germany', official: 'Federal Republic of Germany' },
        maps: {
          googleMaps: "https://goo.gl/maps/mD9FBMq1nvXUBrkv6",
          openStreetMaps: "https://www.openstreetmap.org/relation/51477",
        },  
        population: 83240525, 
        area: 357114,
        continents: ["Europe"],
        region: ['Europe'],
        subregion:['Western Europe'],
        capital:['Berlin'],
        currencies: {
          EUR: {
            name: 'Euro',
            symbol: '€'
          }
        },
        flags:{png:'https://flagcdn.com/w320/de.png'},
        coatOfArms:{svg:'https://mainfacts.com/media/images/coats_of_arms/de.svg'}
      }]
    })
    .as('getCountry');
    
    cy.get('input[name="txt"]').type('Germany{enter}');
    cy.wait('@getCountry');
    
    cy.get('[data-testid="cypress-country-info"]', { timeout: 10000 }).should('exist').within(() => {
      cy.get('h1').should('contain', 'Germany');
      cy.get('p').eq(0).should('contain', 'Official Name: Federal Republic of Germany');
      cy.get('p').eq(1).should('contain','Capital: Berlin');
      cy.get('a').first().should('have.attr', 'href', 'https://goo.gl/maps/mD9FBMq1nvXUBrkv6');
      cy.get('a').last().should('have.attr', 'href', 'https://www.openstreetmap.org/relation/51477');
      cy.get('p').eq(2).contains('Currency: Euro (€)').should('exist');
      cy.get('p').eq(3).should('contain', 'Population: 83,240,525'); // Using eq to get the third paragraph
      cy.get('p').eq(4).should('contain', 'Area: 357,114 sq km'); // Using eq to get the fourth paragraph
      cy.get('p').eq(5).should('contain','Region: Europe, Western Europe');
      cy.get('p').eq(6).should('contain','Continent: Europe');
      cy.get('img').first().should('have.attr', 'src', 'https://flagcdn.com/w320/de.png');
      cy.get('img').last().should('have.attr', 'src', 'https://mainfacts.com/media/images/coats_of_arms/de.svg');
    });
  });
});
