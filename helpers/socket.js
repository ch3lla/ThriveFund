const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();

const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://thrivefund.vercel.app'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const notifySocketAfterSuccessfulPayment = (fundraiserId, newAmountRaised) => {
  io.emit('paymentReceived', { fundraiserId, newAmountRaised });
};

const startSocketServer = (port) => {
  server.listen(port, () => {
    console.log(`Socket server started on port ${port}`);
  });
};

module.exports = { startSocketServer, notifySocketAfterSuccessfulPayment };