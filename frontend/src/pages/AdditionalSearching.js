import { useState } from 'react';

function AdditionalSearching (){

    const[countriesOfRegion,setCountriesOfRegion]=useState({});
    const [selectedRegion, setSelectedRegion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const displayCurrency = (currencies) => {
        if (!currencies) return 'N/A';
        const firstCurrencyKey = Object.keys(currencies)[0];
        const firstCurrency = currencies[firstCurrencyKey];
        return `${firstCurrency.name} (${firstCurrency.symbol})`;
    };
    const fetchCountriesByRegion = async (region) => {
        
        setLoading(true);
        setError(null);
    
        try {
          const response = await fetch(`/api/region/${region}`);
          const data = await response.json();
    
          if (response.ok) {
            setCountriesOfRegion(prevCountries => ({
                ...prevCountries,
                [region]: data
            }));
          }else {
            setError(data.message || 'An error occurred');
          }
        } catch (err) {
          setError("Failed to fetch data. Please try again.");
        }
    
        setLoading(false);
    };
    const displayCountryInfo = (country) => {
      // Assuming 'country' is the full country object from the list
      setSelectedCountry(country);
    };
    const regions=[
        {lable:'Antarctic',value:'Antarctic'},
        {lable:'North America',value:'North America'},
        {lable:'Europe',value:'Europe'},
        {lable:'South America',value:'South America'},
        {lable:'Asia',value:'Asia'},
        {lable:'Oceania',value:'Oceania'},
        {lable:'Africa',value:'Africa'}
    ];
    const handleContinentChange = (e) => {
        const newRegion = e.target.value;
        setSelectedRegion(newRegion);
        if (newRegion !== 'Select a region') {
            fetchCountriesByRegion(newRegion);
        }
    }
    return (
          <div className="box">
            <div className="container">
              <div className="list-container">
                <h2>Please select a region</h2>
                <select onChange={handleContinentChange} value={selectedRegion} className='input'>
                  <option value='Select a region'> -- Select a region -- </option>
                  {regions.map((c) => (
                    <option key={c.value} value={c.value}>{c.lable}</option>
                  ))}
                </select>
                {loading && <p>Loading...</p>}
                {error && <p data-testid="cypress-error">Error: {error}</p>}
                {!loading && !error && selectedRegion !== 'Select a region' && countriesOfRegion[selectedRegion] && (
                  <ol>
                    {countriesOfRegion[selectedRegion]?.map((country, index) => (
                      <li className='pointer' key={country.name.common + index} onClick={() => displayCountryInfo(country)}>
                        <p>{country.name.common} - Capital: {country.capital || 'N/A'}</p>
                      </li>
                    ))}
                  </ol>                       
                )}
              </div>  
              {selectedCountry && (
                <div data-testid="cypress-country-info" className="country-info">
                  <h1>{selectedCountry.name.common}</h1>
                    <p>Official Name: {selectedCountry.name.official}</p>
                    <p>Capital: {selectedCountry.capital ? selectedCountry.capital[0] : 'N/A'}</p>
                    <a href={selectedCountry.maps?.googleMaps} target='_blank'>Goolgle Map: {selectedCountry.name.common}</a>
                    <br></br>
                    <a href={selectedCountry.maps?.openStreetMaps} target='_blank'>Street Maps: {selectedCountry.name.common}</a>
                    <p>Currency: {displayCurrency(selectedCountry.currencies)}</p>
                    <p>Population: {selectedCountry.population?.toLocaleString() ?? 'N/A'}</p>
                    <p>Area: {selectedCountry.area?.toLocaleString() ?? 'N/A'} sq km</p>
                    <p>Region: {selectedCountry.region}, {selectedCountry.subregion}</p>
                    <p>Continent: {selectedCountry.continents?.join(', ') ?? 'N/A'}</p>
                    <img src={selectedCountry.flags?.png} alt="Country Flag" />
                    <img src={selectedCountry.coatOfArms?.svg} alt="Country Coat of Arms" style={{ width: '100px' }} />
                </div>
              )}
            </div>
          </div>
      );
}
export default AdditionalSearching;