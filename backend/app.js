const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const { spawn, exec } = require("child_process");
const upload = require("multer")();
require("dotenv").config();

// internal imports
const machineLearningRoute = require("./routers/mlRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/v1/machine-learning", machineLearningRoute);

// final error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    errors: {
      msg: err.message,
    },
  });
});

// const pythonScriptPath = `${__dirname}/controllers/python-files/global_model_loader.py`;

// const pythonProcess = spawn("python", [pythonScriptPath]);

// pythonProcess.stdout.on("data", (data) => {
//   console.log("Python script output:", data.toString());
//   // You can send the data to the client if needed:
//   // res.send(data.toString());
// });

// pythonProcess.stderr.on("data", (data) => {
//   console.error("Python script error:", data.toString());
// });

// pythonProcess.on("close", (code) => {
//   console.log(`Python script process exited with code ${code}`);
//   // You can perform further actions here if needed.
// });

app.listen(process.env.PORT, () => {
  console.log(`successfully running on port ${process.env.PORT}`);
});
