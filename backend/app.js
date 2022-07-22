const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

http.listen(80);

const colorList = ['Brue', 'Uwu', 'Oringe', 'Puple'];
const roomList = [];
const spot = [
  {
    x: 1,
    y: 1,
  },
  { x: 74, y: 1 },
  { x: 1, y: 74 },
  { x: 74, y: 74 },
];
const bullet = {
  id: 0,
  damage: 10,
  speed: 10,
};

/*
  Room Object:
  {
    roomCode: string;
    isStart: boolean;
    timeout: number;
    remainSpot: Array<number>;
    users: [..., {
      nickname: string;
      colorId: number;
      x: number;
      y: number;
      isDead: boolean;
      angle: number;
      hp: number;
    }];
    bulletList: [...]
  }

  Bullet Object:
  {
    x: number;
    y: number;
    from: string;
    to: string;
    damage: number;
    speed: number;
  }
*/

io.on('connection', (socket) => {
  socket.on('create_room', () => {
    if (roomList.length === 1000000) {
      socket.emit('alert', 'Room is full. Please try again later.');
    } else {
      while (true) {
        let roomCode = Math.floor(Math.random() * 1000000);
        roomCode = `${'0'.repeat(6 - roomCode.toString().length)}${roomCode}`;

        if (!roomList.find((room) => room.roomCode === roomCode)) {
          roomList.push({
            roomCode,
            isStart: false,
            timeout: 30,
            remainSpot: [0, 1, 2, 3],
            users: [],
            bulletList: [],
          });

          socket.emit('successed', roomCode);
          break;
        }
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
    if (
      nickname === undefined ||
      nickname === '' ||
      nickname.length > 16 ||
      nickname.replace(' ', '') === ''
    ) {
      socket.emit('alert', "Nickname isn't suitable. Please try again.");
    } else if (
      roomList.find((room) => room.roomCode === roomCode).users !== undefined &&
      roomList
        .find((room) => room.roomCode === roomCode)
        .users.find((user) => user.nickname === nickname)
    ) {
      socket.emit('alert', 'Nickname is already used. Please try again.');
    } else if (
      roomList.find((room) => room.roomCode === roomCode).users.length === 4
    ) {
      socket.emit('alert', 'Room is full. Please try again later.');
      socket.emit('back');
    } else {
      socket.emit('scan_successed', nickname);
    }
  });

  socket.on('join', (roomCode, nickname, colorId) => {
    if (!roomList.find((room) => room.roomCode === roomCode)) {
      socket.emit('alert', 'Room is not exist. Please try again later.');
    } else if (
      roomList.find((room) => room.roomCode === roomCode).users.length === 4
    ) {
      socket.emit('alert', 'Room is full. Please try again later.');
      socket.emit('back');
    } else if (
      roomList.find((room) => room.roomCode === roomCode).users !== undefined &&
      roomList
        .find((room) => room.roomCode === roomCode)
        .users.find((user) => user.nickname === nickname)
    ) {
      socket.emit('alert', 'Nickname is already used. Please try again.');
      socket.emit('back');
    } else {
      roomList
        .find((room) => room.roomCode === roomCode)
        .users.push({
          nickname: nickname.substr(0, 16),
          colorId,
          x: spot[
            roomList.find((room) => room.roomCode === roomCode).remainSpot[0]
          ].x,
          y: spot[
            roomList.find((room) => room.roomCode === roomCode).remainSpot[0]
          ].y,
          isDead: false,
          angle: 0,
          hp: 2000,
        });

      roomList.find((room) => room.roomCode === roomCode).remainSpot.shift();

      socket.emit('join_successed');

      io.sockets.emit(
        'update_property',
        roomList.find((room) => room.roomCode === roomCode)
      );

      if (
        roomList.find((room) => room.roomCode === roomCode).users.length === 4
      ) {
        io.sockets.emit('ready_to_start');
        const interval = setInterval(() => {
          roomList.find((room) => room.roomCode === roomCode).timeout--;
          io.sockets.emit(
            'update_property',
            roomList.find((room) => room.roomCode === roomCode)
          );

          if (
            roomList.find((room) => room.roomCode === roomCode).timeout === 0
          ) {
            io.sockets.emit('game_start');
            clearInterval(interval);
          }
        }, 1000);
      }
    }
  });

  socket.on('check_room_valid', (roomCode, nickname) => {
    if (nickname === undefined) {
      socket.emit(
        'update_property',
        roomList.find((room) => room.roomCode === roomCode)
      );
    } else if (!roomList.find((room) => room.roomCode === roomCode)) {
      socket.emit('alert', 'Room is not exist. Please try again later.');
      socket.emit('back');
    } else if (
      nickname === '' ||
      nickname.length > 16 ||
      nickname.replace(' ', '') === ''
    ) {
      socket.emit('alert', "Nickname isn't suitable. Please try again.");
      socket.emit('back');
    } else {
      socket.emit(
        'update_property',
        roomList.find((room) => room.roomCode === roomCode)
      );
    }
  });

  socket.on('change_color', (colorId, roomCode, nickname) => {
    roomList
      .find((room) => room.roomCode === roomCode)
      .users.find((user) => user.nickname === nickname).colorId = colorId;

    io.sockets.emit(
      'update_property',
      roomList.find((room) => room.roomCode === roomCode)
    );
  });

  socket.on('change_angle', (angle, roomCode, nickname) => {
    roomList
      .find((room) => room.roomCode === roomCode)
      .users.find((user) => user.nickname === nickname).angle = angle;

    io.sockets.emit(
      'update_property',
      roomList.find((room) => room.roomCode === roomCode)
    );
  });
});
