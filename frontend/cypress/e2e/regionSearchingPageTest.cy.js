describe('Additional Searching Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/region-search'); // Update the URL to match the route of your AdditionalSearching component
  });

  it('renders the select region dropdown', () => {
    cy.get('select').should('exist');
  });
  const mockCountries=[
    {
      name: { common: 'France', official: 'French Republic' },
          maps: {
          googleMaps: "https://goo.gl/maps/g7QxxSFsWyTPKuzd7",
          openStreetMaps: "https://www.openstreetmap.org/relation/1403916",
          },
          population: 67391582,
          area: 551695,
          continents: ['Europe'],
          region: ['Europe'],
          subregion: ['Western Europe'],
          capital: ['Paris'],
          currencies: {
            EUR: {
              name: 'Euro',
              symbol: '€'
            }
          },
          flags: { png: 'https://flagcdn.com/w320/fr.png' },
          coatOfArms: {svg:'https://mainfacts.com/media/images/coats_of_arms/fr.svg'}
        },{
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
    },
  ]
  it('selects a region and fetches countries', () => {
    // Mock the API response for the selected region
    cy.intercept('GET', '/api/region/Europe', {
      statusCode: 200,
      body: mockCountries,
    }).as('getCountriesByRegion');

    cy.get('select').select('Europe');
    cy.wait('@getCountriesByRegion');

    cy.get('ol').children().should('have.length', mockCountries.length); // Update the length to match the number of countries in your mock response
  });

  it('displays an error when fetching countries fails', () => {
    cy.intercept('GET', '/api/region/*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('getCountriesError');

    cy.get('select').select('Europe');
    cy.wait('@getCountriesError');

    cy.get('[data-testid="cypress-error"]').should('contain', 'Error: Internal Server Error'); // Make sure this testid is on the error element
  });
  
  it('displays country information when a country is selected from the list', () => {
    
    // Mock the API response for the selected region
    cy.intercept('GET', '/api/region/Europe', {
      statusCode: 200,
      body:mockCountries,
    }).as('getCountriesByRegion');

    cy.get('select').select('Europe');
    cy.wait('@getCountriesByRegion');
    // Make sure the list is populated before clicking on an item
    cy.get('ol').children().should('have.length.at.least', 1);
    cy.get('ol li').first().click();
    cy.get('[data-testid="cypress-country-info"]').within(() => {
      cy.get('h1').should('contain', 'France'); // Official name of the country
      cy.get('p').eq(0).should('contain', 'Official Name: French Republic');
      cy.get('p').eq(1).should('contain','Capital: Paris');
      cy.get('a').first().should('have.attr', 'href', 'https://goo.gl/maps/g7QxxSFsWyTPKuzd7');
      cy.get('a').last().should('have.attr', 'href', 'https://www.openstreetmap.org/relation/1403916');
      cy.get('p').eq(2).contains('Currency: Euro (€)').should('exist');
      cy.get('p').eq(3).should('contain', 'Population: 67,391,582'); // Using eq to get the third paragraph
      cy.get('p').eq(4).should('contain', 'Area: 551,695 sq km'); // Using eq to get the fourth paragraph
      cy.get('p').eq(5).should('contain','Region: Europe, Western Europe');
      cy.get('p').eq(6).should('contain','Continent: Europe');
      cy.get('img').first().should('have.attr', 'src', 'https://flagcdn.com/w320/fr.png');
      cy.get('img').last().should('have.attr', 'src', 'https://mainfacts.com/media/images/coats_of_arms/fr.svg');

      });
  });
});

