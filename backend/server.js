const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to set Cache-Control header
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/all-currencies', async (req,res)=>{
    console.log("Fetching all currencies");
    try{
        const allCountries=await axios.get(`https://restcountries.com/v3.1/all/`);
        if (allCountries.status !== 200) {
            res.status(allCountries.status).json({ error: "External API error." });
            return;
        }
        console.log("Sending data to frontend");
        // Extract all currencies
        // Create an array of objects with value and name properties
        let allCurrencies = allCountries.data.map(
                country => country.currencies ? 
                Object.entries(country.currencies).map(([code, { name }]) => ({ code, name })) : []
            )
            .flat() // Flatten the array of arrays
            .reduce((acc, { code, name }) => {
                if (!acc.some(c => c.code === code)) {
                  acc.push({ code, name });
                }
                return acc;
              }, []);
        console.log("Sending unique currencies data to frontend.");
        res.json(allCurrencies);
        } catch (error) {
            console.error("Error fetching all currencies:", error.message);
            res.status(500).json({ error: "Failed to fetch all currencies." });
        }
});

app.get('/api/country/:name', async (req, res) => {
    console.log("Fetching country:", req.params.name); 
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${req.params.name}`);
        if (response.status !== 200) {
            res.status(response.status).json({ error: "External API error." });
            return;
        }
        console.log("API response:", response.data); 
        console.log("Sending data to frontend:", response.data[0]);
        res.json(response.data[0]);
    } catch (error) {
        console.error("Error fetching country:", error.message); // This will log the error
        res.status(500).json({ error: "Failed to fetch country info." });
    }
});
app.get('/api/currency/:currency', async (req, res)=>{
    console.log("Fetching countries using the currency:", req.params.currency);
    try {
        const allCountriesUsingTheCurrency = await axios.get(`https://restcountries.com/v3.1/currency/${req.params.currency}`);
        if (allCountriesUsingTheCurrency.status !== 200) {
            res.status(allCountriesUsingTheCurrency.status).json({ error: "External API error." });
            return;
        }
        console.log("Sending country data to frontend.");
        res.set('Cache-Control', 'no-store'); // Prevent caching of this response
        res.json(allCountriesUsingTheCurrency.data);
    } catch (error) {
        console.error("Error fetching countries by selected currency:", error.message);
        res.status(500).json({ error: "Failed to fetch countries by selected currency." });
    }
})
// New route to fetch countries by continent
app.get('/api/continent/:continent', async (req, res) => {
    console.log("Fetching countries in continent:", req.params.continent);
    try {
        const allCountriesResponse = await axios.get(`https://restcountries.com/v3.1/region/${req.params.continent}`);
        if (allCountriesResponse.status !== 200) {
            res.status(allCountriesResponse.status).json({ error: "External API error." });
            return;
        }
        // Filter countries by the requested continent
        //const filteredCountries = allCountriesResponse.data.filter(country => 
        //    country.continents.includes(req.params.continent)
        //);
        console.log("Sending country data to frontend.");
        res.set('Cache-Control', 'no-store'); // Prevent caching of this response
        res.json(allCountriesResponse.data);
    } catch (error) {
        console.error("Error fetching countries by continent:", error.message);
        res.status(500).json({ error: "Failed to fetch countries by continent." });
    }
});
// The "catchall" handler for any request that doesn't match one above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
  });
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
