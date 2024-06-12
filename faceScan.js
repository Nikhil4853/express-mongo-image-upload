const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const sharp = require('sharp');
const cv = require('opencv4nodejs');
const path = require('path');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.json());

// In-memory storage for faces
const faceDatabase = [];

app.post('/face_recognition', async (req, res) => {
    try {
        const { image_url } = req.body;

        if (!image_url) {
            return res.status(400).json({ error: 'No image URL provided' });
        }

        // Check if image URL already exists in the database
        const existingFace = faceDatabase.find(face => face.image_url === image_url);
        if (existingFace) {
            // Implement matching logic here
            return res.json({ message: 'Match found' });
        }

        // Download image
        const response = await axios.get(image_url, { responseType: 'arraybuffer' });
        if (response.status !== 200) {
            return res.status(response.status).json({ error: 'Failed to download image' });
        }

        const imageBuffer = Buffer.from(response.data, 'binary');
        const image = await sharp(imageBuffer).resize(150).toBuffer();
        const mat = cv.imdecode(image);

        // Face detection and recognition with OpenCV
        // Implement OpenCV face detection and recognition here

        // Store the new image in the database
        faceDatabase.push({ image_url });

        return res.json({ message: 'Face detected and stored' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
