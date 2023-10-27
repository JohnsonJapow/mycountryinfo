const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

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
// The "catchall" handler for any request that doesn't match one above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + 'public','index.html'));
  });
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
