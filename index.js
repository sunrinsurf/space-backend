const mongoose = require("mongoose");
const app = require("./app");
const socketio = require("socket.io");
const http = require("http");

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb://52.79.169.52/sunrinsurf";
const env = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 4000;

let mongoURL = MONGO_URL;
if (env !== "production") mongoURL += `_${env}`;

const server = http.createServer(app);
const io = socketio(server, {
  path: "/chat"
});

const auth = require('./db.json');
mongoose.connect(mongoURL, { ...auth, auth: { authdb: "admin" } }).then(() => {
  server.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
  });
})
  .catch(e => console.error(e))