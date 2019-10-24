const mongoose = require("mongoose");
const app = require("./app");
const socketio = require("socket.io");
const http = require("http");

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb://ec2-52-79-169-52.ap-northeast-2.compute.amazonaws.com/space";
const env = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 4000;

let mongoURL = MONGO_URL;
if (env !== "production") mongoURL += `_${env}`;

const server = http.createServer(app);
const io = socketio(server, {
  path: "/chat"
});

mongoose.connect(mongoURL).then(() => {
  server.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
  });
});
