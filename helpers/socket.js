const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();

/* const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://thrivefund.vercel.app'],
  },
});
 */
// Listen for WebSocket connections and handle events
const handleConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

const notifySocketAfterSuccessfulPayment = (fundraiserId, newAmountRaised, donorName, donorAmount, anonimity) => {
    if (anonimity){
        io.emit('paymentReceived', { fundraiserId, newAmountRaised, donorAmount });
    }
  io.emit('paymentReceived', { fundraiserId, newAmountRaised, donorName, donorAmount });
};

/* const startSocketServer = (port) => {
  server.listen(port, () => {
    console.log(`Socket server started on port ${port}`);
  });
};
 */
const startSocketServer = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*', // Allow connections from any origin
    },
  });

  handleConnection(io);

  return io;
};


module.exports = { startSocketServer, notifySocketAfterSuccessfulPayment };