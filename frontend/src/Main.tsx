import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:80/');

function Main() {
  useEffect(() => {
    socket.on('alert', (msg: string) => {
      alert(msg);
    });

    socket.on('successed', (code: string) => {
      socket.close();
      window.location.href = `/${code}/setting`;
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
      <img
        src={`${process.env.PUBLIC_URL}/assets/logo.png`}
        alt="coloury"
        style={{
          position: 'relative',
          top: '10vmin',
          width: '35vmin',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <img
        src={`${process.env.PUBLIC_URL}/assets/banner.png`}
        alt="coloury"
        style={{
          position: 'relative',
          width: '70vmin',
          top: '-3vmin',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'block',
        }}
      />
      <div
        style={{
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '4vmin',
          width: '350px',
          height: '50px',
        }}
      >
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
          }}
          className="room-code"
          placeholder="Enter room-code here.."
          type="text"
          maxLength={6}
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
          }}
          onClick={(event) => {
            event.preventDefault();
            socket.emit(
              'join_room',
              (document.querySelector('.room-code') as any).value
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
      <p
        style={{
          position: 'relative',
          textAlign: 'center',
          top: '4.5vmin',
          margin: 0,
          padding: 0,
          color: '#fff',
        }}
      >
        or..
      </p>
      <button
        style={{
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '5vmin',
          width: '350px',
          height: '50px',
          outline: 'none',
          border: 'none',
          borderRadius: '.5rem',
          fontSize: '1.1rem',
          padding: '0 10px',
          display: 'block',
          backgroundColor: '#ffb800',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
        onClick={(event) => {
          event.preventDefault();
          socket.emit('create_room');
        }}
      >
        Create Room
      </button>
    </div>
  );
}

export default Main;
