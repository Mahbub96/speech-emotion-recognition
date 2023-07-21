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

app.listen(process.env.PORT, () => {
  console.log(`successfully running on port ${process.env.PORT}`);
});
