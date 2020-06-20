const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const db = require("./config/keys").mongoURI;

var cors = require("cors");

app.use(cors());

const productRoutes = require("./routes/product");

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`DB CONNECTED`);
  })
  .catch(() => {
    console.log(error);
  });

const port = process.env.port || 7000;

app.use("/api", productRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`App is running at ${port}!`);
});
