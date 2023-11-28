import { useState } from 'react';

function MainSearching(){
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
        console.log(data);
        if (data.error) {
            setError(data.error);
        } else {
            setCountryInfo(data[0]);
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
    return(
        <div  data-testid="cypress-title" className='box'>
            <div className="search-container">
                <h2>Please enter a country name</h2>
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
            </div>
            {loading && <p>Loading...</p>}
            {error && <p data-testid="cypress-error">Error: {error}</p>}
            {countryInfo && (
                <div data-testid="cypress-country-info">
                    <h1>{countryInfo.name.common}</h1>
                    <p>Official Name: {countryInfo.name.official}</p>
                    <p>Capital: {countryInfo.capital ? countryInfo.capital[0] : 'N/A'}</p>
                    <a href={countryInfo.maps?.googleMaps} target='_blank'>Goolgle Map: {countryInfo.name.common}</a>
                    <br></br>
                    <a href={countryInfo.maps?.openStreetMaps} target='_blank'>Street Maps: {countryInfo.name.common}</a>
                    <p>Currency: {displayCurrency(countryInfo.currencies)}</p>
                    <p>Population: {countryInfo.population?.toLocaleString() ?? 'N/A'}</p>
                    <p>Area: {countryInfo.area?.toLocaleString() ?? 'N/A'} sq km</p>
                    <p>Region: {countryInfo.region}, {countryInfo.subregion}</p>
                    <p>Continent: {countryInfo.continents?.join(', ') ?? 'N/A'}</p>
                    <img src={countryInfo.flags?.png} alt="Country Flag" />
                    <img src={countryInfo.coatOfArms?.svg} alt="Country Coat of Arms" style={{ width: '100px' }} />
                </div>
            )}
        </div>
    )
}
export default MainSearching;
