import express from 'express';
import axios from 'axios';
import path from 'path';
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to set Cache-Control header
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.get('/api/all-currencies', async (req,res)=>{
    console.log("Fetching all currencies");
    try{
        const allCountries=await axios.get(`https://restcountries.com/v3.1/all/`);
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
              }, []
        );
        console.log("Sending unique currencies data to frontend.");
        res.json(allCurrencies);
        } catch (error) {
            if (error.response) {
                console.error("External API error:", error.message);
                res.status(error.response.status).json({ error: "External API error." });
            } else {
                console.error("Internal Server Error:", error.message);
                res.status(500).json({ error: "Failed to fetch all currencies." });
            }
        }
});

app.get('/api/country/:name', async (req, res) => {
    console.log("Fetching country:", req.params.name); 
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${req.params.name}`);
        console.log("API response:", response.data); 
        console.log("Sending data to frontend:", response.data[0]);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            console.error("External API error:", error.message);
            res.status(error.response.status).json({ error: "External API error." });
        } else {
            console.error("Error fetching country:", error.message);
            res.status(500).json({ error: "Failed to fetch country info." });
        }
    }
});
app.get('/api/currency/:currency', async (req, res)=>{
    console.log("Fetching countries using the currency:", req.params.currency);
    try {
        const allCountriesUsingTheCurrency = await axios.get(`https://restcountries.com/v3.1/currency/${req.params.currency}`);
        console.log("Sending country data to frontend.");
        res.set('Cache-Control', 'no-store'); // Prevent caching of this response
        res.json(allCountriesUsingTheCurrency.data);
    } catch (error) {
        if (error.response) {
            console.error("External API error:", error.message);
            res.status(error.response.status).json({ error: "External API error." });
        } else {
            console.error("Internal Server Error:", error.message);
            res.status(500).json({ error: "Failed to fetch countries by selected currency." });
        }
    }
})
// New route to fetch countries by continent
app.get('/api/region/:region', async (req, res) => {
    console.log("Fetching countries in region:", req.params.region);
    try {
        const allCountriesResponse = await axios.get(`https://restcountries.com/v3.1/region/${req.params.region}`);
        console.log("Sending country data to frontend.");
        res.set('Cache-Control', 'no-store'); // Prevent caching of this response
        res.json(allCountriesResponse.data);
    } catch (error) {
        if (error.response) {
            console.error("External API error:", error.message);
            res.status(error.response.status).json({ error: "External API error." });
        } else {
            console.error("Internal Server Error:", error.message);
            res.status(500).json({ error: "Failed to fetch countries by region." });
        }
    }
});
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));
// The "catchall" handler for any request that doesn't match one above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
  });
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
export default app;
