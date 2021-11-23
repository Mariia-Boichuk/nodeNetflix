require("dotenv").config();
var cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRouter = require("./routes/auth.route");
const PORT = process.env.PORT;
const app = express();
///const authRouter = require("./routes/auth.route");

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log("connected to mongo ");
});

const pathToFile = path.join(__dirname, "logger.txt");
if (!fs.existsSync(pathToFile)) {
  fs.appendFileSync("logger.txt", "", "utf-8");
}
const myStream = fs.createWriteStream(pathToFile, { flags: "a" });
app.use(morgan("combined", { stream: myStream }));
app.use(cors());
app.use(express.json());
app.use("/netflix/api", authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.status && err.message) {
    res.status(err.status).json({
      message: err.message,
    });
    return;
  }
  res.status(500).json({
    message: "Internal server error",
  });
});

app.get("/testapi", (req, res) => {
  console.log("conncted to testapui");
  res.status(200).json({
    note: "ik note",
  });
});

app.listen(PORT || 8080, () => console.log("listening" + PORT));
