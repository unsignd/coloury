const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

http.listen(80);

const colorList = ['brue', 'reed', 'oringe', 'puple'];
const roomList = [];

/*
  Room Object:
  {
    roomCode: string;
    users: [..., {
      nickname: string;
      colorId: colorList;
      socketId: socket.id;
    }];
  }
*/

io.on('connection', (socket) => {
  socket.on('create_room', () => {
    if (roomList.length === 1000000) {
      socket.emit('alert', 'Room is full. Please try again later.');
      return false;
    }

    while (true) {
      let roomCode = Math.floor(Math.random() * 1000000);
      roomCode = `${'0'.repeat(6 - roomCode.toString().length)}${roomCode}`;

      if (!roomList.find((room) => room.roomCode === roomCode)) {
        roomList.push({
          roomCode,
          users: [],
        });

        socket.emit('successed', roomCode);
        break;
      }
    }
  });

  socket.on('join_room', (roomCode) => {
    if (roomList.find((room) => room.roomCode === roomCode)) {
      socket.emit('successed', roomCode);
    } else {
      socket.emit('alert', 'Room is not exist. Please try again later.');
    }
  });

  socket.on('scan_nickname', (nickname, roomCode) => {
    if (nickname === undefined || nickname === '' || nickname.length > 16) {
      socket.emit('alert', "Nickname isn't suitable. Please try again.");
      return false;
    }

    if (
      roomList.find((room) => room.roomCode === roomCode).users !== undefined &&
      roomList
        .find((room) => room.roomCode === roomCode)
        .users.find((user) => user.nickname === nickname)
    ) {
      socket.emit('alert', 'Nickname is already used. Please try again.');
      return false;
    }

    if (
      roomList.find((room) => room.roomCode === roomCode).users.length === 4
    ) {
      socket.emit('alert', 'Room is full. Please try again later.');
      socket.emit('back');
      return false;
    }

    socket.emit('scan_successed', nickname);
  });

  socket.on('join', (roomCode, nickname) => {
    if (
      roomList.find((room) => room.roomCode === roomCode).users.length === 4
    ) {
      socket.emit('alert', 'Room is full. Please try again later.');
      socket.emit('back');
      return false;
    }

    roomList
      .find((room) => room.roomCode === roomCode)
      .users.push({
        nickname: nickname.substr(0, 16),
        colorId: 0,
        socketId: socket.id,
      });

    io.sockets.emit(
      'update_room_property',
      roomList.find((room) => room.roomCode === roomCode)
    );
  });

  socket.on('check_room_valid', (roomCode) => {
    if (!roomList.find((room) => room.roomCode === roomCode)) {
      socket.emit('alert', 'Room is not exist. Please try again later.');
      socket.emit('back');
      return false;
    }
  });
});
