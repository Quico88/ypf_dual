const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, function () {
  console.log(`Server app listening on port ${PORT}`);
});
