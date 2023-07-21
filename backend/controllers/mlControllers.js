const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const filePaths = path.join(__dirname, "../public/sounds/", "sound.wav");
const scriptPath = path.join(__dirname, "/python-files/featureExtraction.py");

const featureExtraction = (req, res, next) => {
  try {
    const { recording } = req.body;

    // Decode Base64 to binary data
    const binaryData = Buffer.from(recording, "base64");

    // Create a unique filename for the WAV file
    const fileName = `${new Date().getTime()}.wav`;
    const audioPath = path.join(__dirname, "../public/sounds/", fileName);

    fs.writeFile(audioPath, binaryData, (err) => {
      if (err) {
        console.error("Error writing WAV file:", err);

        res.status(500).json({ error: "Error writing WAV file" });
      } else {
        console.log("WAV file saved:", audioPath);
        // Perform any further processing on the saved WAV file here
        const filePath = audioPath;
        exec(`python3 ${scriptPath} ${filePath}`, (err, stdout, stderr) => {
          console.log(stdout);
          // res.json(stdout);
        });

        res.json({
          message: "Audio file successfully received and saved as WAV",
        });
      }
    });

    // const scriptPath = req.body.recordingUri;

    // let output = "";
    // const pythonProcess = spawn("python3", [scriptPath, filePath]);

    // pythonProcess.stdout.on("data", (data) => {
    //   const result = data.toString().trim();
    //   output += result;
    //   // res.send(result);
    // });

    // pythonProcess.stderr.on("data", (data) => {
    //   console.error(`Error executing Python script: ${data}`);
    //   res.status(500).send("An error occurred.");
    // });

    // pythonProcess.on("close", (code) => {
    //   console.log("Python script execution finished.");
    //   res.json(output);
    // });
  } catch (err) {
    next(err);
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
