const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Quote = require("./models/Quotes");
const app = express();
const port = 4000;

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

  })
  .then(() => {
    console.log("Motivation quotes inserted successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/quotes", require("./routes/quotes"));
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));

app.use(express.static(path.join(__dirname, "../uploads")));
app.use("/api", require("./routes/products"));
// `app.use("/api", require("./routes/products"));` 제거

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
