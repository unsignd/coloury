import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

function Setting() {
  const { roomCode } = useParams();
  const socket = io('http://localhost:80/');

  useEffect(() => {
    socket.emit('check_room_valid', roomCode);

    socket.on('alert', (msg: string) => {
      alert(msg);
    });

    socket.on('back', () => {
      window.location.href = '/';
    });

    socket.on('scan_successed', (nickname: string) => {
      window.location.href = `/${roomCode}/${nickname}`;
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
      <div
        style={{
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '350px',
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
          You're on
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
        <input
          style={{
            width: '270px',
            height: '50px',
            outline: 'none',
            border: 'none',
            borderRadius: '.5rem',
            fontSize: '1.1rem',
            backgroundColor: '#fff',
            padding: '0 10px',
            display: 'block',
            fontWeight: 700,
            float: 'left',
            position: 'relative',
            top: '25vmin',
          }}
          placeholder="Enter your nickname here.."
          maxLength={16}
          className="nickname"
          type="text"
        />
        <div
          style={{
            width: '30px',
            height: '50px',
            outline: 'none',
            border: 'none',
            borderRadius: '.5rem',
            fontSize: '1.1rem',
            backgroundColor: '#ffb800',
            padding: '0 10px',
            display: 'block',
            fontWeight: 700,
            float: 'right',
            cursor: 'pointer',
            position: 'relative',
            top: '25vmin',
          }}
          onClick={(event) => {
            event.preventDefault();
            socket.emit(
              'scan_nickname',
              (document.querySelector('.nickname') as any).value,
              roomCode
            );
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/start.png`}
            alt=""
            style={{
              position: 'relative',
              top: 'calc(50% - 2px)',
              transform: 'translateY(-50%)',
              width: 30,
              display: 'block',
            }}
          />
        </div>
      </div>
      <img
        src={`${process.env.PUBLIC_URL}/assets/letsgooo.png`}
        alt=""
        style={{
          position: 'relative',
          width: '60vmin',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '25vmin',
        }}
      />

      <p
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '5vmin',
          textDecoration: 'underline',
          cursor: 'pointer',
          color: '#abcdff',
        }}
        onClick={() => {
          window.location.href = `/`;
        }}
      >
        Go Back to Main Page
      </p>
    </div>
  );
}

export default Setting;
