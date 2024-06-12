const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
dotenv.config();

const app = express();
app.use(express.json());

const FINIX_API_URL = process.env.FINIX_API_URL;
const FINIX_VERSION = process.env.FINIX_VERSION;
const FINIX_API_USER = process.env.FINIX_API_USER;
const FINIX_API_PASSWORD = process.env.FINIX_API_PASSWORD;

app.post('/paymentLink', async (req, res) => {
  try {
    const response = await axios.post(
      FINIX_API_URL,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Finix-Version': FINIX_VERSION,
        },
        auth: {
          username: FINIX_API_USER,
          password: FINIX_API_PASSWORD,
        },
      }
    );
  const Data={
    merchant_id:JSON.parse(response.config.data).merchant_id,
    amount_details: JSON.parse(response.config.data).amount_details
  }
    console.log( Data)
    // console.log( JSON.parse(response.config.data).merchant_id)
    // console.log( JSON.parse(response.config.data).amount_details)
    // console.log(response.data)
    const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(Data), {
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
  } catch (error) {
    console.error('Error creating payment link:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
