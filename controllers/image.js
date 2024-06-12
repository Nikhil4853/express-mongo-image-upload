const multer = require('multer');
const imageModel = require('../models/imageScan.model');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const faceapi = require('face-api.js');
const canvas = require('canvas');

const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });

const loadModels = async () => {
    const { Canvas, Image, ImageData } = canvas;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./node_modules/face-api.js/weights');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./node_modules/face-api.js/weights');
    console.log('Face detection and landmark models loaded');
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const img = await canvas.loadImage(req.file.buffer);
        const detections = await faceapi.detectAllFaces(img, faceDetectionOptions).withFaceLandmarks();
        const faceData = detections.map(detection => detection.detection.box);

        const newImage = await imageModel.create({
            profileImgURL: req.file.originalname,
            contentType: req.file.mimetype,
            image: req.file.buffer,
            faceData: faceData
        });

        await newImage.save();
        res.status(201).send('Image uploaded successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading image.');
    }
};

const matching = async (req, res) => {
    res.send("go");
};

module.exports = { uploadImage, matching, upload, loadModels };
