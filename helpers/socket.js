const socketIO = require('socket.io');

let io;

const startSocketServer = (server, corsOptions) => {
  io = socketIO(server, {
    cors: {
      origin: corsOptions.origin, // specify the origin for CORS
      methods: ["GET", "POST"], // specify allowed methods
      credentials: true // allows cookies to be sent
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

const notifySocketAfterSuccessfulPayment = (fundraiserId, newAmountRaised, donorName, donorAmount, anonimity) => {
  console.log('Notifying socket after successful payment');
  if (anonimity == "anonymous") {
    io.emit('paymentReceived', { fundraiserId, newAmountRaised, donorAmount });
  } else {
    io.emit('paymentReceived', { fundraiserId, newAmountRaised, donorName, donorAmount });
  }
};

module.exports = { startSocketServer, notifySocketAfterSuccessfulPayment };