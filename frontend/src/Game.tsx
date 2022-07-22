import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:80/');

function Game() {
  interface Room {
    roomCode: string;
    isStart: boolean;
    timeout: number;
    remainSpot: Array<number>;
    users: Array<User>;
    bulletList: Array<Bullet>;
  }

  interface User {
    nickname: string;
    colorId: number;
    x: number;
    y: number;
    isDead: boolean;
    angle: number;
    hp: number;
  }

  interface Bullet {
    x: number;
    y: number;
    from: string;
    to: string;
    damage: number;
    speed: number;
  }

  const { roomCode, nickname } = useParams();
  const [isStart, setStart] = useState<boolean>(false);
  const [isTimeoutStarted, setTimeoutStarted] = useState<boolean>(false);
  const [isJoined, setJoined] = useState<boolean>(false);
  const [userList, setUserList] = useState<Array<User>>([]);
  const [timeout, setTimeout] = useState<number>();
  const [bulletList, setBulletList] = useState<Array<Bullet>>([]);

  const colorList = ['Brue', 'Uwu', 'Oringe', 'Puple'];

  useEffect(() => {
    socket.emit('check_room_valid', roomCode, nickname?.substr(0, 16));

    socket.on('join_successed', () => {
      setJoined(true);
    });

    socket.on('alert', (msg: string) => {
      alert(msg);
    });

    socket.on('back', () => {
      socket.close();
      window.location.replace('/');
    });

    socket.on('ready_to_start', () => {
      setTimeoutStarted(true);
    });

    socket.on('update_property', (room: Room) => {
      setUserList(room.users);
      setTimeout(room.timeout);
      setBulletList(room.bulletList);
    });

    socket.on('game_start', () => {
      if (isJoined) {
        const interval = setInterval(() => {
          const to = nickname;
        }, 1000);
      }
    });

    document.body.addEventListener('mousemove', (event) => {
      if (isStart && isJoined) {
        const avatar = document.querySelector('.avatar');
        const avatarBoundingRect = avatar?.getBoundingClientRect();
        const center = {
          x: avatarBoundingRect?.left! + avatarBoundingRect?.width! / 2,
          y: avatarBoundingRect?.top! + avatarBoundingRect?.height! / 2,
        };

        socket.emit(
          'change_angle',
          Math.atan2(event.clientX - center.x, -(event.clientY - center.y)) *
            (180 / Math.PI),
          roomCode,
          nickname
        );
      }
    });

    socket.on('game_start', () => {
      setStart(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStart]);

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
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vmin',
            height: '80vmin',
            backgroundColor: '#3687ff',
            borderRadius: '2vmin',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '68.5vmin',
              height: '68.5vmin',
              backgroundColor: '#1975ff',
              borderRadius: '1vmin',
            }}
          />
          {userList
            .filter((user) => !user.isDead)
            .map((user) => (
              <div
                key={user.nickname}
                className={
                  user.nickname === nickname && isJoined ? 'avatar' : undefined
                }
                style={{
                  position: 'absolute',
                  top: `${user.y}vmin`,
                  left: `${user.x}vmin`,
                  width: '5vmin',
                  height: '5vmin',
                  borderRadius: '100%',
                }}
              >
                <p
                  style={{
                    position: 'absolute',
                    top: '-5.5vmin',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color:
                      user.nickname === nickname && isJoined
                        ? '#ffb800'
                        : '#fff',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    width: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.nickname}
                  &nbsp;
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: '0.8rem',
                    }}
                  >
                    ({user.hp}HP)
                  </span>
                </p>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/${
                    colorList[user.colorId]
                  }.png`}
                  alt=""
                  style={{
                    width: '5vmin',
                    transform: `rotate(${user.angle}deg)`,
                  }}
                />
              </div>
            ))}
        </div>
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
                width: '100vmin',
                height: '50vmin',
                left: '50%',
                top: '15vmin',
                transform: 'translateX(-50%)',
                borderRadius: '1rem',
              }}
            >
              {userList.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    position: 'relative',
                    top: 'calc(50% - 10vmin)',
                    transform: 'translateY(-50%)',
                    textAlign: 'center',
                    fontSize: '3vmin',
                    color: '#ffb800',
                  }}
                >
                  No one joined yet.
                </p>
              ) : (
                userList.map((user) => (
                  <div
                    key={user.nickname}
                    style={{
                      backgroundColor: '#3687ff',
                      width: '22.5vmin',
                      height: '30vmin',
                      position: 'relative',
                      top: '2vmin',
                      marginLeft: '2vmin',
                      float: 'left',
                      borderRadius: '.5rem',
                      border:
                        user.nickname === nickname?.substr(0, 16) && isJoined
                          ? `.6vmin solid #ffb800`
                          : undefined,
                      boxSizing: 'border-box',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#abcdff',
                        textAlign: 'center',
                        top: '1.5vmin',
                        position: 'relative',
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    >
                      {colorList[user.colorId]}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: '#fff',
                        textAlign: 'center',
                        top: '1.25vmin',
                        position: 'relative',
                        fontSize:
                          user.nickname.length <= 10
                            ? '1.8rem'
                            : `${18 / user.nickname.length}rem`,
                        fontWeight: 800,
                      }}
                    >
                      {user.nickname}
                    </p>
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/${
                        colorList[user.colorId]
                      }.png`}
                      alt={colorList[user.colorId]}
                      style={{
                        width: '10vmin',
                        position: 'relative',
                        top: '5vmin',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    />
                  </div>
                ))
              )}
            </div>
            <div
              style={{
                position: 'relative',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '37vmin',
                height: '8vmin',
                top: '2vmin',
              }}
            >
              <div
                style={{
                  backgroundColor: '#3687ff',
                  borderRadius: '100%',
                  width: '8vmin',
                  height: '8vmin',
                  float: 'left',
                  margin: '0 .5vmin',
                  cursor: 'pointer',
                }}
                onClick={(event) => {
                  event.preventDefault();
                  if (isJoined) {
                    socket.emit(
                      'change_color',
                      0,
                      roomCode,
                      nickname?.substr(0, 16)
                    );
                  } else {
                    socket.emit('join', roomCode, nickname?.substr(0, 16), 0);
                  }
                }}
              >
                <div
                  style={{
                    backgroundColor: '#1975ff',
                    borderRadius: '100%',
                    width: '6vmin',
                    height: '6vmin',
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    marginTop: '0.05vmin',
                    marginLeft: '0.05vmin',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
              <div
                style={{
                  backgroundColor: '#3687ff',
                  borderRadius: '100%',
                  width: '8vmin',
                  height: '8vmin',
                  float: 'left',
                  margin: '0 .5vmin',
                  cursor: 'pointer',
                }}
                onClick={(event) => {
                  event.preventDefault();
                  if (isJoined) {
                    socket.emit(
                      'change_color',
                      1,
                      roomCode,
                      nickname?.substr(0, 16)
                    );
                  } else {
                    socket.emit('join', roomCode, nickname?.substr(0, 16), 1);
                  }
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ff6331',
                    borderRadius: '100%',
                    width: '6vmin',
                    height: '6vmin',
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    marginTop: '0.05vmin',
                    marginLeft: '0.05vmin',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
              <div
                style={{
                  backgroundColor: '#3687ff',
                  borderRadius: '100%',
                  width: '8vmin',
                  height: '8vmin',
                  float: 'left',
                  margin: '0 .5vmin',
                  cursor: 'pointer',
                }}
                onClick={(event) => {
                  event.preventDefault();
                  if (isJoined) {
                    socket.emit(
                      'change_color',
                      2,
                      roomCode,
                      nickname?.substr(0, 16)
                    );
                  } else {
                    socket.emit('join', roomCode, nickname?.substr(0, 16), 2);
                  }
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffb800',
                    borderRadius: '100%',
                    width: '6vmin',
                    height: '6vmin',
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    marginTop: '0.05vmin',
                    marginLeft: '0.05vmin',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
              <div
                style={{
                  backgroundColor: '#3687ff',
                  borderRadius: '100%',
                  width: '8vmin',
                  height: '8vmin',
                  float: 'left',
                  margin: '0 .5vmin',
                  cursor: 'pointer',
                }}
                onClick={(event) => {
                  event.preventDefault();
                  if (isJoined) {
                    socket.emit(
                      'change_color',
                      3,
                      roomCode,
                      nickname?.substr(0, 16)
                    );
                  } else {
                    socket.emit('join', roomCode, nickname?.substr(0, 16), 3);
                  }
                }}
              >
                <div
                  style={{
                    backgroundColor: '#7331ff',
                    borderRadius: '100%',
                    width: '6vmin',
                    height: '6vmin',
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    marginTop: '0.05vmin',
                    marginLeft: '0.05vmin',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/assets/click2join.png`}
              alt=""
              style={{
                position: 'relative',
                top: '7vmin',
                transform: 'translateY(-50%)',
                height: '13vmin',
                display: 'block',
                left: 'calc(50% - 45vmin)',
              }}
            />
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
              top: '-3vmin',
            }}
          >
            {isTimeoutStarted
              ? `${timeout} seconds left to start..`
              : `${userList.length}/4 Players Found..`}
          </p>
        </div>
      )}
    </div>
  );
}

export default Game;
