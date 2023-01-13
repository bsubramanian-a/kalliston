const express = require("express");
const router = express.Router();
const { getPackages, addPackage, updatePackage, deletePackage} = require('../controllers/PackageController');
const { verifyToken } = require('../middleware/AuthJWT');

router.get('/get-packages',[verifyToken],getPackages);
router.post('/add-package',[verifyToken],addPackage);
router.put('/update-package:/id',[verifyToken],updatePackage);
router.delete('/delete-package:/id',[verifyToken],deletePackage);

module.exports = router;