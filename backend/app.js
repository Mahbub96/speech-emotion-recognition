const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const upload = require("multer")();
require("dotenv").config();
const os = require("os");

// internal imports
const machineLearningRoute = require("./routers/mlRoutes");
const cluster = require("cluster");

const app = express();
const numCpu = os.cpus().length;

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

// use cluster module
if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
} else {
  app.listen(process.env.PORT, () =>
    console.log(
      `app running on port ${process.env.PORT} and pid:${process.pid}`
    )
  );
}

// app.listen(process.env.PORT, () => {
//   console.log(`successfully running on port ${process.env.PORT}`);
// });
