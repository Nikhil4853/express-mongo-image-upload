const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post('/generate-qr/:data', async (req, res) => {
    const { data } = req.params;


    try {
        // Generate QR code as a buffer
        const qrCodeBuffer = await QRCode.toBuffer(data, {
            width: 256,
            height: 256,
            color: {
                dark: "#000000",
                light: "#ffffff"
            }
        });

        // Send the QR code as an image response
        res.set('Content-Type', 'image/jpg');
        res.send(qrCodeBuffer);
    } catch (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send('Error generating QR code.');
    }
});

app.listen(port, () => {
    console.log(`QR code generator API listening at http://localhost:${port}`);
});
