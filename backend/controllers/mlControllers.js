const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const wav = require("wav");

const filePaths = path.join(__dirname, "../public/sounds/", "sound.wav");
const scriptPath = path.join(__dirname, "/python-files/featureExtraction.py");

const { WaveFile } = require("wavefile");

const featureExtraction = async (req, res, next) => {
  try {
    const { recording } = req.body;

    const wavData = Buffer.from(recording, "base64");
    const wavFilePath = path.join(
      __dirname,
      "../public/sounds/",
      "received.wav"
    );

    fs.writeFileSync(wavFilePath, wavData);

    const convertToWav = require("./convert_to_wav");

    const inputFilePath = path.join(
      __dirname,
      "../public/sounds/",
      "received.wav"
    );
    const outputFilePath = path.join(
      __dirname,
      "../public/sounds/",
      "received1.wav"
    );

    convertToWav(inputFilePath, outputFilePath, (err) => {
      if (err) {
        console.error("Conversion failed.");
      } else {
        // Process the WAV file using the feature extraction script
        exec(
          `python3 ${scriptPath} ${outputFilePath}`,
          (err, stdout, stderr) => {
            if (err) {
              console.log("Error extracting feature:", err);
              res.status(500).json({ error: "Error extracting feature" });
            } else {
              // Continue with any further processing...
              res.send(stdout);
            }
          }
        );
      }
    });
  } catch (err) {
    console.log("Error processing file:", err);
    res.status(500).json({ error: "Error processing file" });
  }
};

const installPythonPackage = (req, res, next) => {
  try {
    // const packageName = req.body.packageName;
    const packageName = req.body.packageName;

    const installCommand = `pip3 install ${packageName}`;

    exec(installCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing Python package: ${error.message}`);
        res.status(500).send("An error occurred during package installation.");
        return;
      }

      if (stderr) {
        console.error(`Error installing Python package: ${stderr}`);
        res.status(500).send("An error occurred during package installation.");
        return;
      }

      res.status(200).send("Package installed successfully.");
      console.log(`Successfully installed Python package: ${packageName}`);
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { featureExtraction, installPythonPackage };
