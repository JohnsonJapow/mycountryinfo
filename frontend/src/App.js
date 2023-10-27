import React, { useState } from 'react';
import './App.css';

function App() {
  const [country, setCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountryInfo = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/country/${country}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCountryInfo(data);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };
// Function to display the first available currency
const displayCurrency = (currencies) => {
  if (!currencies) return 'N/A';
  const firstCurrencyKey = Object.keys(currencies)[0];
  const firstCurrency = currencies[firstCurrencyKey];
  return `${firstCurrency.name} (${firstCurrency.symbol})`;
};
  return (
    <div className="App">
      <div className="box">
        <form name="search" onSubmit={fetchCountryInfo}>
            <input 
                type="text" 
                className="input" 
                name="txt" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country..."
            />
        </form>
        <i className="fas fa-search"></i>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {countryInfo && (
        <div>
          <h1>{countryInfo.name.common}</h1>
          <p>Official Name: {countryInfo.name.official}</p>
          <p>Capital: {countryInfo.capital ? countryInfo.capital[0] : 'N/A'}</p>
          <p>Currency: {displayCurrency(countryInfo.currencies)}</p>
          <p>Population: {countryInfo.population.toLocaleString()}</p>
          <p>Area: {countryInfo.area.toLocaleString()} sq km</p>
          <p>Region: {countryInfo.region}, {countryInfo.subregion}</p>
          <img src={countryInfo.flags.png} alt="Country Flag" />
          <img src={countryInfo.coatOfArms.svg} alt="Country Coat of Arms" style={{ width: '100px' }} />
        </div>
      )}
    </div>
  );
}

export default App;