require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
process.noDeprecation = true;

const routes = require("./routes/Routes");

const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.URL,
  })
);

app.use("/api", routes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Mongo DB Connected and server Started at PORT 8000....!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
