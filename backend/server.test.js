const request = require('supertest');
const express = require('express');
const axios = require('axios');
const app = require('./server');

jest.mock('axios');


describe('API endpoints', () => {
  describe('/api/all-currencies', () => {
    beforeEach(() => {
      axios.get.mockReset();
    });
    describe('Given a right resquest',()=>{
      beforeEach(() => {
        const mockApiResponse = {
          status: 200,
          data: [
            {
              currencies: { EUR: { name: 'Euro', symbol: '€' } }
            },
            {
              currencies: { USD: { name: 'United States Dollar', symbol: '$' } }
            },
            {
              currencies: { AUD: { name: 'Australian dollar', symbol: 'A$' } }
            }
          ],
        };
        axios.get.mockResolvedValue(mockApiResponse);
      });
      it('should fetch all currencies', async () => {
        const response = await request(app).get('/api/all-currencies');
        const expectedCurrencies = [
            { code: 'EUR', name: 'Euro' },
            { code: 'USD', name: 'United States Dollar' },
            { code: 'AUD', name: 'Australian dollar' }
        ];
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expectedCurrencies);
        expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all/');
      });
    });
    describe('Given an error from external API', () => {
        beforeEach(() => {
          axios.get.mockRejectedValue({
            response: {
              status: 404,
              data: { error: "External API error." }
            }
          });
        });
        it('should handle external API errors', async () => {
        const response = await request(app).get('/api/all-currencies');
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "External API error." });
      });
    });
  
    describe('Given an internal server error', () => {
      beforeEach(() => {
        axios.get.mockRejectedValue(new Error('Failed to fetch all currencies.'));
      });
      it('should handle internal server errors', async () => {
        const response = await request(app).get('/api/all-currencies');
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch all currencies.' });
      });
    });
  });
  beforeEach(() => {
    axios.get.mockReset();
  });
  describe('/api/country/:name', () => {
    describe('Given a right request',()=>{
      const mockFranceData = {
        status: 200,
        data: [
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
          }
        ]
      };
      beforeEach(() => {
        axios.get.mockResolvedValueOnce(mockFranceData);
      });
      it('should fetch country information for France', async () => {
      const country = 'france';
      const response = await request(app).get(`/api/country/${country}`);
      const expectedCountry = [
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
          }
        ];
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expectedCountry);
        expect(axios.get).toHaveBeenCalledWith(`https://restcountries.com/v3.1/name/${country}`);
      });
    });
    describe('Given an error from external API',()=>{
      beforeEach(() => {
        axios.get.mockRejectedValue({
          response: {
            status: 404,
            data: { error: "External API error." }
          }
        });
      });
      it('should handle external API errors', async () => {
        const country = 'france';
      const response = await request(app).get(`/api/country/${country}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: "External API error." });
    });
    });
    describe('Given an internal server error',()=>{
      beforeEach(() => {
        axios.get.mockRejectedValue(new Error('Failed to fetch country info.'));
      });
      it('should handle internal server errors', async () => {
        const country = 'france';
        const response = await request(app).get(`/api/country/${country}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch country info.' });
      });
    });
  });
  beforeEach(() => {
    axios.get.mockReset();
  });
  describe('/api/region/:region', () => {
    describe('Given a correct request', () => {
      const mockRegionData = {
        status: 200,
        data: [
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
          }
        ]
      };
  
      beforeEach(() => {
        axios.get.mockResolvedValue(mockRegionData);
      });
  
      it('should fetch countries by continent', async () => {
        const region='europe';
        const response = await request(app).get(`/api/region/${region}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockRegionData.data);
        expect(axios.get).toHaveBeenCalledWith(`https://restcountries.com/v3.1/region/${region}`);
      });
    });
  
    describe('Given an error from external API', () => {
      beforeEach(() => {
        axios.get.mockRejectedValue({
          response: {
            status: 404,
            data: { error: "External API error." },
          },
        });
      });
  
      it('should handle external API errors', async () => {
        const region = 'europe'; // example continent
        const response = await request(app).get(`/api/region/${region}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "External API error." });
      });
    });
  
    describe('Given an internal server error', () => {
      beforeEach(() => {
        axios.get.mockRejectedValue(new Error('Failed to fetch countries by region.'));
      });
  
      it('should handle internal server errors', async () => {
        const region = 'europe'; // example continent
        const response = await request(app).get(`/api/region/${region}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch countries by region.' });
      });
    });
  });
  beforeEach(() => {
    axios.get.mockReset();
  });
  describe('/api/currency/:currency', () => {
    describe('Given a correct request', () => {
      const mockCurrencyData = {
        status: 200,
        data: [
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
          }
        ]
      };
  
      beforeEach(() => {
        axios.get.mockResolvedValue(mockCurrencyData);
      });
  
      it('should fetch countries by currency', async () => {
        const currency = 'EUR'; // example currency code
        const response = await request(app).get(`/api/currency/${currency}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockCurrencyData.data);
        expect(axios.get).toHaveBeenCalledWith(`https://restcountries.com/v3.1/currency/${currency}`);
      });
    });
  
    describe('Given an error from external API', () => {
      beforeEach(() => {
        axios.get.mockRejectedValue({
          response: {
            status: 404,
            data: { error: "External API error." },
          },
        });
      });
  
      it('should handle external API errors', async () => {
        const currency = 'EUR'; // example currency code
        const response = await request(app).get(`/api/currency/${currency}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "External API error." });
      });
    });
  
    describe('Given an internal server error', () => {
      beforeEach(() => {
        axios.get.mockRejectedValue(new Error('Internal Server Error'));
      });
  
      it('should handle internal server errors', async () => {
        const currency = 'EUR'; // example currency code
        const response = await request(app).get(`/api/currency/${currency}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch countries by selected currency.' });
      });
    });
  });
  
});
module.exports = app;
