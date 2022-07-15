const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'https://coloury.unsignd.me/',
    methods: ['GET', 'POST'],
  },
});

http.listen(3000, () => {
  console.log('connected.');
});

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
