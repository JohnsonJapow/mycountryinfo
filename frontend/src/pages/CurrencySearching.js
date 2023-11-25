import React,{ useState,useEffect } from 'react';
function CurrencySearching(){
    // This should be the list of all currencies
    const [allCurrencies, setAllCurrencies] = useState([]);

    // This should be the selected currency, a string, not an array
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const displayCurrency = (currencies) => {
        if (!currencies) return 'N/A';
        const firstCurrencyKey = Object.keys(currencies)[0];
        const firstCurrency = currencies[firstCurrencyKey];
        return `${firstCurrency.name} (${firstCurrency.symbol})`;
    };
    const displayCountryInfo = (country) => {
        // Assuming 'country' is the full country object from the list
        setSelectedCountry(country);
      };
    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };
    useEffect(() => {
        // Fetch the list of all currencies when the component mounts
        const fetchAllCurrencies = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/all-currencies`);
                const data = await response.json();
                if (response.ok) {
                    setAllCurrencies(data);
                } else {
                    setError(data.message || 'An error occurred while fetching currencies.');
                }
            } catch (err) {
                setError('Failed to fetch currencies. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllCurrencies();
    }, []);
    useEffect(() => {
        // Fetch countries by currency when a new currency is selected
        if (!selectedCurrency) {
            setCountries([]);
            return;
        }

        const fetchCountriesByCurrency = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/currency/${selectedCurrency}`);
                const data = await response.json();
                if (response.ok) {
                    setCountries(data);
                } else {
                    setError(data.message || 'An error occurred while fetching data.');
                }
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCountriesByCurrency();
    }, [selectedCurrency]);

    return (
        <div className='box'>
            <div className='container'>
                <div className='list-container'>
                    <h2>Search by Currency</h2>
                    <select value={selectedCurrency} onChange={handleCurrencyChange} className='input'>
                        <option value="">-- Select a currency --</option>
                        {allCurrencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                                {currency.name}
                            </option>
                        ))}
                    </select>
                    {loading && <p>Loading...</p>}
                    {error && <p data-testid="cypress-error">Error: {error}</p>}
                    <ol>
                        {countries.map((country, index) => (
                            <li key={index} className='pointer'onClick={() => displayCountryInfo(country)}>
                                <p>{country.name.common} - Capital: {country.capital || 'N/A'}</p>
                            </li>
                        ))}
                    </ol>
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
                        <p>Continent:{selectedCountry.continents?.join(', ') ?? 'N/A'}</p>
                        <img src={selectedCountry.flags?.png} alt="Country Flag" />
                        <img src={selectedCountry.coatOfArms?.svg} alt="Country Coat of Arms" style={{ width: '100px' }} />
                    </div>
                )}
            </div>
        </div>
    );
}
export default CurrencySearching;