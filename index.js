const http = require('http');
const app = require('./app');
const connectDB = require('./lib/connectDB');
const io = require('./io');

const server = http.createServer(app);
io(server);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
  });
})
  .catch((e) => console.error(e));
