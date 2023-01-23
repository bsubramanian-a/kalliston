const express = require("express");
const router = express.Router();
const { coachUpdateMediaImage, coachDeleteMediaImage, getCoachMedias } = require('../controllers/MediaController');
const { verifyToken } = require('../middleware/AuthJWT');
const multer = require('multer');
import fs from 'fs';

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("dest", file);
        const path = `public/coach/images`
        fs.mkdirSync(path, { recursive: true })
        cb(null, "public/coach/images");
    },
    filename: (req, file, cb) => {
        // console.log("filename", file);
        const ext = file.mimetype.split("/")[1];
        cb(null, `file-${file.fieldname}-${Date.now()}.${ext}`);
    },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
    // console.log("multerFilter", file);
    if (file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "webp" || file.mimetype.split("/")[1] === "gif") {
        cb(null, true);
    } else {
        cb(new Error("Not an image File!!"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 10000000
    },
});

router.get('/get-coach-medias',[verifyToken], getCoachMedias);
router.post('/update-media-image',[verifyToken, upload.single("image")], coachUpdateMediaImage);
router.delete('/delete-media-image/:id',[verifyToken], coachDeleteMediaImage);

module.exports = router;