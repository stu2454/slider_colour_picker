require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
app.use(cors());

const app = express();
app.use(bodyParser.json());

const GITHUB_API_URL = 'https://api.github.com/repos/stu2454/contents/slider_colour_picker/server/data.json';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

//test if token is available
console.log('Loaded GitHub Token:', GITHUB_TOKEN ? 'Exists' : 'Not Found');


// Route to handle saving selected colours
app.post('/save-colour', async (req, res) => {
    const { selectedColour } = req.body;

    if (!selectedColour) {
        return res.status(400).json({ message: 'No colour provided.' });
    }

    try {
        console.log('Attempting to fetch data.json from GitHub...');
        const response = await fetch(GITHUB_API_URL, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        console.log('HTTP status:', response.status); // Logs the status code
        console.log('Response headers:', response.headers.raw()); // Logs headers
        console.log('Response body:', await response.text()); // Logs body content

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

        console.log('Update response status:', updateResponse.status); // Logs status of the update request
        console.log('Update response body:', await updateResponse.text()); // Logs the response body

        if (!updateResponse.ok) {
            throw new Error(`Failed to update data.json: ${updateResponse.statusText}`);
        }

        res.status(200).json({ message: 'Colour saved successfully!' });
    } catch (error) {
        console.error('Error saving colour:', error);
        res.status(500).json({ message: 'Failed to save colour.' });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the Colour Picker Proxy Server!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
