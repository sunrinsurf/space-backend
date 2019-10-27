const socketio = require("socket.io");
const http = require("http");
const app = require("./app");
const connectDB = require('./lib/connectDB');


const server = http.createServer(app);
const io = socketio(server, {
  path: "/chat",
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
  });
})
  .catch((e) => console.error(e));
