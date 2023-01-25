const express = require("express");
const router = express.Router();
const multer = require('multer');
const { createCoach, coachLogin, coachForgetPassword, coachUpdateProfile, getAllUsers, checkOTP, checkOTPForget, coachChangePassword, coachUpdateProfilePic, getCoach, coachUpdateCoverImage, coachDeleteCoverImage } = require('../controllers/UserController');
const { checkCoachAlreadyExist } = require('../middleware/UserAuth');
const { verifyToken } = require('../middleware/AuthJWT');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("dest", file);
        cb(null, "public/coach/images");    
    },
    filename: (req, file, cb) => {
        console.log("filename", file);
        const ext = file.mimetype.split("/")[1];
        cb(null, `file-${file.fieldname}-${Date.now()}.${ext}`);
    },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
    console.log("multerFilter", file);
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
        fileSize: 1000000
    },
});

router.get('/',getAllUsers);
router.post('/create-coach',[checkCoachAlreadyExist],createCoach);
router.post('/coach-login',coachLogin);
router.post('/coach-otp',checkOTP);
router.get('/coach-login',getCoach);
router.get('/get-coach/:id',getCoach);
router.post('/coach-forget',coachForgetPassword);
router.post('/coach-otp-forget',checkOTPForget);
router.post('/coach-change-password',[verifyToken],coachChangePassword)
router.put('/coach-update-profile',[verifyToken],coachUpdateProfile);
router.post('/coach-update-profile-pic',[verifyToken, upload.single("image")],coachUpdateProfilePic);
router.post('/coach-update-cover-image',[verifyToken, upload.single("image")],coachUpdateCoverImage);
router.delete('/coach-delete-cover-image',[verifyToken], coachDeleteCoverImage);

module.exports = router;