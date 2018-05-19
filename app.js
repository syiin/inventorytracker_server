require("dotenv").config({ path: "variables.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

app.use(cors());

// app.use(
//   cors({
//     origin: [
//       "https://abinvserver.herokuapp.com",
//       "https://abinvclient.herokuapp.com"
//     ],
//     credentials: true
//   })
// );

app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

app.use("/", routes);

app.set("port", process.env.PORT || 8888);
const server = app.listen(app.get("port"), () => {
  console.log(`SERVER ONLINE → PORT ${server.address().port}`);
});
