# Colour Picker Slider Project

This project is a web-based tool for dynamically selecting and saving colours using a vertical colour selector and an adjustable slider. The selected colours are stored persistently in a `data.json` file hosted in a GitHub repository.

## Features

- **Vertical Colour Selector:** Allows users to select a colour dynamically by hovering over or clicking the gradient.
- **Adjustable Slider:** Adjusts the lightness of the selected colour.
- **Save Button:** Records the selected colour persistently in a hosted JSON file.
- **GitHub API Integration:** Updates and stores data in `data.json` using a secure proxy server.

---

## Project Structure

```
project/
├── client/                     # Frontend Code
│   ├── index.html              # Main HTML file
│   ├── style.css               # Optional external styles
│   ├── script.js               # Frontend JavaScript logic (optional split)
├── server/                     # Proxy Server Code
│   ├── server.js               # Node.js server for GitHub API
│   ├── package.json            # Node.js dependencies
│   ├── .env                    # Secure storage for GitHub token
├── data.json                   # JSON file for storing selected colours
├── README.md                   # Project overview and instructions
├── .gitignore                  # Ignored files (e.g., node_modules, .env)
```

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Frontend Deployment
1. Add the `index.html` file and associated assets to the `client/` directory.
2. Deploy the `client/` folder to GitHub Pages:
   - Go to **Settings > Pages**.
   - Select the branch (e.g., `main`) and root directory.
   - Save changes. Your frontend will be accessible at `https://YOUR_USERNAME.github.io/YOUR_REPO`.

### 3. Proxy Server Deployment
1. Navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Add a `.env` file with the following content:
   ```env
   GITHUB_TOKEN=your_personal_access_token
   ```
3. Start the server locally:
   ```bash
   node server.js
   ```
   The server will run at `http://localhost:3000`.
4. Deploy the server to a hosting service (e.g., Render, Vercel, or Heroku):
   - Follow the platform-specific instructions for Node.js app deployment.
   - Add the `GITHUB_TOKEN` as an environment variable in the platform's settings.

---

## Usage

1. **Access the Webpage:**
   - Open the GitHub Pages URL hosting the `index.html` file.
2. **Select a Colour:**
   - Hover over or click the vertical colour picker to choose a colour.
   - Adjust the lightness using the slider.
3. **Save the Selection:**
   - Click the **Select** button to save the colour.
   - The selected colour will be added to the `data.json` file in the GitHub repository.

---

## Data Flow

1. **Frontend Interaction:**
   - The user selects a colour and clicks "Select."
   - A `POST` request is sent to the proxy server with the selected colour.
2. **Proxy Server Role:**
   - Fetches the current `data.json` file from GitHub.
   - Updates the file with the new colour and pushes it back.
3. **Persistent Storage:**
   - The `data.json` file in the GitHub repository is updated with the new colour selection.

---

## Example `data.json`

After multiple colour selections, the file might look like this:

```json
{
    "selectedColours": [
        "rgb(255, 0, 0)",
        "rgb(0, 128, 0)",
        "rgb(75, 0, 130)"
    ]
}
```

---

## Development Notes

### Important Files
- **`index.html`**: Main user interface.
- **`server.js`**: Proxy server for securely interacting with the GitHub API.
- **`data.json`**: Stores the list of selected colours.

### Security
- The GitHub token (`GITHUB_TOKEN`) must be stored securely in the `.env` file and never exposed in the frontend.
- Ensure the proxy server is deployed securely on a platform supporting environment variables.

---

## Future Enhancements
- Add user authentication for personalised colour selections.
- Include a visual history of selected colours in the UI.
- Add support for exporting selected colours as a downloadable file.

---

## License
This project is open-source and available under the MIT License.

