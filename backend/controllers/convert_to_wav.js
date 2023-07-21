const ffmpeg = require("fluent-ffmpeg");

const convertToWav = (inputFilePath, outputFilePath, callback) => {
  ffmpeg(inputFilePath)
    .output(outputFilePath)
    .on("end", () => {
      console.log("Conversion completed successfully.");
      callback(null);
    })
    .on("error", (err) => {
      console.error("Error converting file:", err.message);
      callback(err);
    })
    .run();
};

module.exports = convertToWav;
