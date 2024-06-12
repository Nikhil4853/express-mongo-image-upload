const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/mydatabase';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema
const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    image: Buffer
});

// Create a model
const Image = mongoose.model('Image', imageSchema);

// Route to upload an image
app.post('/upload', upload.single('file'), (req, res) => {
    const newImage = new Image({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.buffer
    });

    newImage.save()
        .then(savedImage => {
            res.status(201).json({ id: savedImage._id });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

// Route to download an image
app.get('/image/:id', (req, res) => {
    Image.findById(req.params.id)
        .then(image => {
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }
            res.set('Content-Type', image.contentType);
            res.send(image.image);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
