require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const GITHUB_API_URL = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/server/data.json';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Route to handle saving selected colours
app.post('/save-colour', async (req, res) => {
    const { selectedColour } = req.body;

    if (!selectedColour) {
        return res.status(400).json({ message: 'No colour provided.' });
    }

    try {
        // Fetch the current data.json file from GitHub
        const response = await fetch(GITHUB_API_URL, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data.json: ${response.statusText}`);
        }

        const fileData = await response.json();

        // Decode the existing content
        const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

        // Append the new colour to the array
        currentContent.selectedColours.push(selectedColour);

        // Encode the updated content back to Base64
        const updatedContent = Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64');

        // Push the updated content back to GitHub
        const updateResponse = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update selected colours',
                content: updatedContent,
                sha: fileData.sha, // Required to avoid conflicts
            }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update data.json: ${updateResponse.statusText}`);
        }

        res.status(200).json({ message: 'Colour saved successfully!' });
    } catch (error) {
        console.error('Error saving colour:', error);
        res.status(500).json({ message: 'Failed to save colour.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
