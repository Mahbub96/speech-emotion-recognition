const multer = require("multer");
const path = require("path");

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public", "sounds"),
  filename: (req, file, cb) => {
    console.log(file);
    const fileName = `${new Date().getTime()}.wav`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
