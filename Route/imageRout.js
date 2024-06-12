const express = require("express");
const router = express.Router();
const { uploadImage, matching, upload } = require('../controllers/image');

router.get('/m', matching);
router.post('/i', upload.single("img"), uploadImage);

module.exports = router;
