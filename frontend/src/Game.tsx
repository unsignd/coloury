import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

function Game() {
  interface Room {
    roomCode: string;
    users: Array<{
      nickname: string;
      colorId: number;
      socketId: number;
    }>;
  }

  const { roomCode, nickname } = useParams();
  const [isStart, setIsStart] = useState<boolean>(false);
  const [room, setRoom] = useState<Room>();
  const socket = io('http://localhost:80/');
  const colorList = ['brue', 'reed', 'oringe', 'puple'];

  useEffect(() => {
    socket.emit('check_room_valid', roomCode);
    socket.emit('join', roomCode, nickname?.substr(0, 16));

    socket.on('alert', (msg: string) => {
      alert(msg);
    });

    socket.on('back', () => {
      window.location.href = '/';
    });

    socket.on('update_room_property', (room: Room) => {
      setRoom(room);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#1975ff',
      }}
    >
      {isStart ? (
        <div>Game Started</div>
      ) : (
        <div>
          <div
            style={{
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100vw',
            }}
          >
            <p
              style={{
                margin: 0,
                padding: 0,
                color: '#fff',
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 400,
                position: 'relative',
                top: '10vmin',
              }}
            >
              Waiting for other players on
            </p>
            <p
              style={{
                margin: 0,
                padding: 0,
                color: '#fff',
                textAlign: 'center',
                fontSize: '5rem',
                fontWeight: 800,
                position: 'relative',
                top: '10vmin',
              }}
            >
              {roomCode}
            </p>
            <div
              style={{
                position: 'relative',
                backgroundColor: '#3687ff',
                width: '100vmin',
                height: '40vmin',
                left: '50%',
                top: '15vmin',
                transform: 'translateX(-50%)',
                borderRadius: '.75rem',
              }}
            >
              {room?.users.map((user) => (
                <p key={user.socketId}>{user.nickname}</p>
              ))}
            </div>
          </div>
          <p
            style={{
              margin: 0,
              padding: 0,
              color: '#abcdff',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 400,
              position: 'relative',
              top: '17vmin',
            }}
          >
            {room?.users.length}/4 Players Found.
          </p>
        </div>
      )}
    </div>
  );
}

export default Game;
