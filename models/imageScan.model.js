const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profileImgURL: String,
    contentType: { type: String },
    image: Buffer,
    faceData: Array,
    encodedImg: String
});

const ImageModel = mongoose.model('imageFaceScan', userSchema);

module.exports = ImageModel;
