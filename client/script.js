// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Update the slider's gradient and thumb based on selected colour
function updateSlider(slider) {
    const darkColor = slider.dataset.selectedColor || 'rgb(0, 0, 0)';
    const lightColor = slider.dataset.lightColor || 'rgb(255, 255, 255)';
    const percentage = slider.value / slider.max;

    slider.style.background = `linear-gradient(to right, ${darkColor} ${percentage * 100}%, ${lightColor} ${percentage * 100}%)`;
    slider.style.setProperty('--thumb-color', darkColor);
}

// Initialise the slider with a default colour
function initialiseSlider() {
    const slider = document.querySelector('.slider');
    const defaultColor = 'rgb(128, 0, 128)'; // Default colour (purple)
    const [r, g, b] = defaultColor.match(/\d+/g).map(Number);
    const [h, s, l] = rgbToHsl(r, g, b);
    const lightColor = hslToRgb(h, s, Math.min(l + 30, 100));

    slider.style.setProperty('--dark-color', defaultColor);
    slider.style.setProperty('--light-color', `rgb(${lightColor[0]}, ${lightColor[1]}, ${lightColor[2]})`);
    slider.style.setProperty('--thumb-color', defaultColor);
    slider.style.background = `linear-gradient(to right, ${defaultColor} 0%, rgb(${lightColor[0]}, ${lightColor[1]}, ${lightColor[2]}) 100%)`;
    slider.dataset.selectedColor = defaultColor;
    slider.dataset.lightColor = `rgb(${lightColor[0]}, ${lightColor[1]}, ${lightColor[2]})`;
}

// Select a new colour from the colour picker
function selectColor(event) {
    const colourPicker = document.querySelector('.color-picker-bar');
    const rect = colourPicker.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const height = rect.height;
    const position = Math.max(0, Math.min(y / height, 1)); // Normalised position (0 to 1)

    // Generate the RGB colour from position
    const gradientColors = [
        [255, 0, 0],    // Red
        [255, 165, 0],  // Orange
        [255, 255, 0],  // Yellow
        [0, 128, 0],    // Green
        [0, 0, 255],    // Blue
        [75, 0, 130],   // Indigo
        [238, 130, 238] // Violet
    ];

    const stops = gradientColors.length - 1;
    const stopIndex = Math.floor(position * stops);
    const color1 = gradientColors[stopIndex];
    const color2 = gradientColors[Math.min(stopIndex + 1, stops)];
    const blend = (position * stops) - stopIndex;

    const r = Math.round(color1[0] + (color2[0] - color1[0]) * blend);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * blend);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * blend);

    const selectedColor = `rgb(${r}, ${g}, ${b})`;
    const [h, s, l] = rgbToHsl(r, g, b);
    const lightColor = hslToRgb(h, s, Math.min(l + 30, 100));

    // Update the slider's gradient and thumb
    const slider = document.querySelector('.slider');
    slider.style.setProperty('--dark-color', selectedColor);
    slider.style.setProperty('--light-color', `rgb(${lightColor[0]}, ${lightColor[1]}, ${lightColor[2]})`);
    slider.style.setProperty('--thumb-color', selectedColor);
    slider.dataset.selectedColor = selectedColor;
    slider.dataset.lightColor = `rgb(${lightColor[0]}, ${lightColor[1]}, ${lightColor[2]})`;

    updateSlider(slider);
}

// Dynamically update the thumb colour
function updateThumbColor(event) {
    const colourPicker = document.querySelector('.color-picker-bar');
    const rect = colourPicker.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const height = rect.height;
    const position = Math.max(0, Math.min(y / height, 1)); // Normalised position (0 to 1)

    // Generate the RGB colour from position
    const gradientColors = [
        [255, 0, 0], [255, 165, 0], [255, 255, 0], 
        [0, 128, 0], [0, 0, 255], [75, 0, 130], [238, 130, 238]
    ];
    const stops = gradientColors.length - 1;
    const stopIndex = Math.floor(position * stops);
    const color1 = gradientColors[stopIndex];
    const color2 = gradientColors[Math.min(stopIndex + 1, stops)];
    const blend = (position * stops) - stopIndex;

    const r = Math.round(color1[0] + (color2[0] - color1[0]) * blend);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * blend);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * blend);

    const selectedColor = `rgb(${r}, ${g}, ${b})`;

    // Update the slider thumb dynamically
    const slider = document.querySelector('.slider');
    slider.style.setProperty('--thumb-color', selectedColor);
}

// Save the selected colour to the backend
function saveSelectedColour(selectedColour) {
    console.log('saveSelectedColour called with:', selectedColour); // Debugging log
    fetch('http://localhost:3000/save-colour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedColour }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response from backend:', data); // Debugging log
            alert(data.message || 'Colour saved successfully!');
        })
        .catch(error => {
            console.error('Error saving colour:', error);
            alert('Failed to save the colour.');
        });
}

// Confirm selection and save the colour
function confirmSelection() {
    const slider = document.querySelector('.slider');
    const selectedColour = slider.dataset.selectedColor || 'rgb(128, 0, 128)'; // Fallback to default colour
    console.log('Selected Colour:', selectedColour);
    saveSelectedColour(selectedColour);
}

// Event listeners for page load
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const colourPicker = document.querySelector('.color-picker-bar');
    const selectButton = document.querySelector('.slider-container button');

    slider.addEventListener('input', () => updateSlider(slider));
    colourPicker.addEventListener('click', selectColor);
    selectButton.addEventListener('click', confirmSelection);

    initialiseSlider();
});
