
const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Join Event Room
    socket.on('joinEventRoom', (eventId) => {
      socket.join(eventId);
      console.log(`📦 Socket ${socket.id} joined event room: ${eventId}`);
    });


    socket.on('volunteerJoined', ({ eventId, volunteer }) => {
      console.log(`📣 Volunteer ${volunteer.name} joined event ${eventId}`);
      socket.to(eventId).emit('newVolunteer', volunteer); 
    });


    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
