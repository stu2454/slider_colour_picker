require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const GITHUB_API_URL = 'https://api.github.com/repos/stu2454/slider_colour_picker/contents/server/data.json';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

//test if token is available
console.log('Loaded GitHub Token:', GITHUB_TOKEN ? 'Exists' : 'Not Found');


// Route to handle saving selected colours
app.post('/save-colour', async (req, res) => {
    console.log('Incoming request to /save-colour');//debugging log
    console.log('Request body:', req.body); //debugging log

    const { selectedColour } = req.body;

    if (!selectedColour) {
        return res.status(400).json({ message: 'No colour provided.' });
    }

    try {
        console.log('Using GitHub API URL:', GITHUB_API_URL);
    
        const response = await fetch(GITHUB_API_URL, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });
    
        console.log('HTTP status:', response.status);
    
        if (!response.ok) {
            console.error('GitHub API Error:', await response.text());
            throw new Error(`Failed to fetch data.json: ${response.statusText}`);
        }
    
        const fileData = await response.json();
        console.log('Fetched file data:', fileData);
    
        const currentContent = JSON.parse(
            Buffer.from(fileData.content, 'base64').toString('utf-8')
        );
    
        currentContent.selectedColours.push(req.body.selectedColour);
    
        const updatedContent = Buffer.from(
            JSON.stringify(currentContent, null, 2)
        ).toString('base64');
    
        const updateResponse = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update selected colours',
                content: updatedContent,
                sha: fileData.sha,
            }),
        });
    
        if (!updateResponse.ok) {
            console.error('Error updating data.json:', await updateResponse.text());
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
