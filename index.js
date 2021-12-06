const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));

app.use(cors());
dotenv.config({ path: "./config/config.env" });
app.use("/", require("./Router/index"));
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
