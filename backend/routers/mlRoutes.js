const express = require("express");

const {
  featureExtraction,
  installPythonPackage,
} = require("../controllers/mlControllers");

const router = express.Router();

router.post("/feature-extraction", featureExtraction);
router.post("/install-package", installPythonPackage);

module.exports = router;
