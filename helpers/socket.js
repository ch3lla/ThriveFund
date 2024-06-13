const socketIO = require('socket.io');

let io;

const startSocketServer = (server, corsOptions) => {
  io = socketIO(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

const notifySocketAfterSuccessfulPayment = (fundraiserId, newAmountRaised, donorName, donorAmount, anonimity) => {
  if (anonimity !== "anonymous") {
    io.emit('paymentReceived', { fundraiserId, newAmountRaised, donorAmount });
  } else {
    io.emit('paymentReceived', { fundraiserId, newAmountRaised, donorName, donorAmount });
  }
};

module.exports = { startSocketServer, notifySocketAfterSuccessfulPayment };